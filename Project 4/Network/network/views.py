from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.decorators.http import require_POST

from .models import User, Post, Follow


def index(request):
    if request.method == "POST" and request.user.is_authenticated:
        content = request.POST.get("content")
        image = request.FILES.get("media")

        if content:
            Post.objects.create(user=request.user, content=content, image=image)
            return redirect("index")

    posts = Post.objects.all().order_by("-timestamp")

    paginator = Paginator(posts, 10)
    page = request.GET.get("page", 1)
    posts_page = paginator.get_page(page)

    following_count = 0
    followers_count = 0

    # Check if the user is authenticated
    if request.user.is_authenticated:
        user = get_object_or_404(User, username=request.user)
        following_count = user.followers.count()
        followers_count = user.following_set_user.count()

    return render(
        request,
        "network/index.html",
        {
            "posts": posts_page,
            "followers_count": followers_count,
            "following_count": following_count,
        },
    )


@login_required(login_url="login")
@require_POST
def edit_post(request, post_id):
    if request.method == "POST":
        post = get_object_or_404(Post, pk=post_id, user=request.user)

        content = request.POST.get("content", "")
        media_file = request.FILES.get("media", None)
        print(f"Content: {content}")
        print(f"Image: {media_file}")

        if content:
            post.content = content
            if media_file:
                post.image = media_file
            post.save()

            # Return JsonResponse with success status
            return JsonResponse(
                {
                    "status": "success",
                    "content": post.content,
                    "image": post.image.url if post.image else None,
                }
            )

    # Return JsonResponse with error status
    return JsonResponse(
        {"status": "error", "message": "Content is required"}, status=400
    )


def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).order_by("-timestamp")
    paginator = Paginator(posts, 10)
    page = request.GET.get("page", 1)
    posts_page = paginator.get_page(page)

    following_count = user.followers.count()
    followers_count = user.following_set_user.count()

    is_following = user.following_set_user.filter(pk=request.user.id).exists()

    return render(
        request,
        "network/profile.html",
        {
            "profile_user": user,
            "posts": posts_page,
            "followers_count": followers_count,
            "following_count": following_count,
            "is_following": is_following,
        },
    )


@login_required
@require_POST
def edit_profile(request):
    user = request.user

    # Get data from the request
    first_name = request.POST.get("first_name", "")
    last_name = request.POST.get("last_name", "")
    about = request.POST.get("about", "")
    profile_image = request.FILES.get("profile_image")

    # Update the user model fields
    user.first_name = first_name
    user.last_name = last_name
    user.about = about

    if profile_image:
        user.profile_image = profile_image

    user.save()

    # Return a JSON response
    return JsonResponse(
        {
            "status": "success",
            "first_name": user.first_name,
            "last_name": user.last_name,
            "about": user.about,
            "profile_image": user.profile_image.url if user.profile_image else None,
        }
    )


@login_required(login_url="login")
def following(request):
    # Retrieve users that the current user follows
    following_users = Follow.objects.filter(follower=request.user).values_list(
        "following", flat=True
    )
    user = User.objects.get(username=request.user)
    following_count = user.followers.count()
    followers_count = user.following_set_user.count()

    # Retrieve posts made by users that the current user follows
    posts = Post.objects.filter(user__in=following_users).order_by("-timestamp")

    # Paginate the posts
    paginator = Paginator(posts, 10)
    page = request.GET.get("page", 1)
    posts_page = paginator.get_page(page)

    return render(
        request,
        "network/following.html",
        {
            "posts": posts_page,
            "followers_count": followers_count,
            "following_count": following_count,
        },
    )


@login_required(login_url="login")
@require_POST
def follow_toggle(request, username):
    user_to_follow = User.objects.get(username=username)

    if request.user != user_to_follow:
        if request.user.followers.filter(pk=user_to_follow.id).exists():
            request.user.followers.remove(user_to_follow)
        else:
            request.user.followers.add(user_to_follow)

    return redirect("profile", username=username)


@login_required(login_url="login")
@require_POST
def like_toggle(request, post_id):
    post = get_object_or_404(Post, pk=post_id)

    if request.user in post.likes.all():
        post.likes.remove(request.user)
        action = "unlike"
    else:
        post.likes.add(request.user)
        action = "like"

    return JsonResponse({"likes": post.likes.count(), "action": action})


def get_updated_image_urls(request):
    # Assuming you have a custom User model
    User = get_user_model()

    # Fetch all user objects
    users = User.objects.all()

    # Create a dictionary to store user IDs and corresponding profile image URLs
    updated_image_urls = {str(user.id): user.profile_image.url for user in users}

    return JsonResponse(updated_image_urls)


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "network/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request, "network/register.html", {"message": "Passwords must match."}
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request, "network/register.html", {"message": "Username already taken."}
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
