from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.db.models import Max, Count, Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import User, Listing, Bid, Comment, Category
from .forms import ListingForm, BidForm, CommentForm


def index(request):
    # Fetch all active listings
    all_listings = Listing.objects.filter(active=True)

    # Configure the number of listings to display per page
    listings_per_page = 12  # You can adjust this number as needed

    # Create a Paginator object
    paginator = Paginator(all_listings, listings_per_page)

    # Get the current page number from the request's GET parameters
    page_number = request.GET.get('page')

    try:
        # Get the listings for the requested page
        listings = paginator.page(page_number)
    except PageNotAnInteger:
        # If the page parameter is not an integer, display the first page
        listings = paginator.page(1)
    except EmptyPage:
        # If the page is out of range (e.g., 9999), display the last available page
        listings = paginator.page(paginator.num_pages)

    # Annotate each category with the count of related listings
    categories = Category.objects.annotate(listing_count=Count('listing'))
    return render(request, "auctions/index.html", {"listings": listings, "categories": categories})


@login_required(login_url='login')
def create_listing(request):
    if request.method == "POST":
        form = ListingForm(request.POST, request.FILES)  # Include request.FILES to handle file uploads
        if form.is_valid():
            listing = form.save(commit=False)
            listing.owner = request.user
            listing.current_bid = listing.starting_bid

            # Check if an image was uploaded and save it to the 'image' field
            image = form.cleaned_data.get('image')
            if image:
                listing.image = image

            listing.save()
            return redirect("index")
    else:
        form = ListingForm()
    return render(request, "auctions/create-listing.html", {"form": form})


def listing_detail(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    comments = Comment.objects.filter(listing=listing)
    comment_form = CommentForm()
    bid_form = BidForm()
    winner = None  # Initialize the winner variable
    highest_bid = Bid.objects.filter(listing=listing).aggregate(Max('amount'))['amount__max']
    if highest_bid:
        current_bid = highest_bid
        winner = Bid.objects.get(amount=highest_bid, listing=listing).bidder
    else:
        current_bid = listing.starting_bid
    return render(request, "auctions/listing-detail.html", {
        "listing": listing,
        "comments": comments,
        "current_bid": current_bid,
        "comment_form": comment_form,
        "bid_form": bid_form,
        "winner": winner,
    })


@login_required(login_url='login')
def watchlist(request):
    user = request.user
    watchlist = user.watchlist.all()
    print(watchlist)
    return render(request, "auctions/watchlist.html", {"watchlist": watchlist})


@login_required(login_url='login')
def add_watchlist(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    request.user.watchlist.add(listing)
    return redirect(reverse("listing_detail", args=[listing_id]))


@login_required(login_url='login')
def remove_watchlist(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    request.user.watchlist.remove(listing)
    return redirect(reverse("listing_detail", args=[listing_id]))


@login_required(login_url='login')
def place_bid(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    if request.method == "POST":
        form = BidForm(request.POST)
        if form.is_valid():
            bid = form.cleaned_data["amount"]
            if bid > listing.current_bid:
                new_bid = Bid(amount=bid, bidder=request.user, listing=listing)
                new_bid.save()
                listing.current_bid = bid
                listing.save()
                messages.success(request, "Bid placed successfully!")
            else:
                messages.error(request, "Bid must be higher than the current bid.")
        else:
            messages.error(request, "Invalid bid form. Please check the amount.")

    return redirect(reverse("listing_detail", args=[listing_id]))


@login_required(login_url='login')
def close_listing(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    if request.user == listing.owner:
        listing.active = False
        listing.save()
    return redirect(reverse("listing_detail", args=[listing_id]))


@login_required(login_url='login')
def comment(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    form = CommentForm(request.POST)
    if form.is_valid():
        comment_text = form.cleaned_data["text"]
        new_comment = Comment(text=comment_text, commenter=request.user, listing=listing)
        new_comment.save()
    return redirect(reverse("listing_detail", args=[listing_id]))


def categories(request):
    categories = Category.objects.all()
    return render(request, "auctions/categories.html", {"categories": categories})


def category_listings(request, category_id):
    category = get_object_or_404(Category, pk=category_id)

    # Fetch all active listings
    all_listings = Listing.objects.filter(category=category, active=True)

    # Configure the number of listings to display per page
    listings_per_page = 12  # You can adjust this number as needed

    # Create a Paginator object
    paginator = Paginator(all_listings, listings_per_page)

    # Get the current page number from the request's GET parameters
    page_number = request.GET.get('page')

    try:
        # Get the listings for the requested page
        listings = paginator.page(page_number)
    except PageNotAnInteger:
        # If the page parameter is not an integer, display the first page
        listings = paginator.page(1)
    except EmptyPage:
        # If the page is out of range (e.g., 9999), display the last available page
        listings = paginator.page(paginator.num_pages)

    # Annotate each category with the count of related listings
    categories = Category.objects.annotate(listing_count=Count('listing'))
    return render(request, "auctions/category-listings.html", {"category": category, "listings": listings, "categories": categories})


def search_listings(request):
    if request.method == 'POST':
        # Get the search query from the form data
        query = request.POST.get('q',)

        # Store the search query in the session
        request.session['search_query'] = query

    # Get the search query from the session
    query = request.session.get('search_query', '')

    if query:
        # Perform a case-insensitive search on the title and description fields
        listings_results = Listing.objects.filter(
            Q(title__icontains=query) | Q(description__icontains=query),
            active=True
        )
        # Count the number of search results
        search_count = listings_results.count()
    else:
        # If no query is provided, return all active listings
        listings_results = Listing.objects.filter(active=True)
        # Count the number of search results
        search_count = listings_results.count()

    # Configure the number of listings to display per page
    listings_per_page = 12  # You can adjust this number as needed

    # Create a Paginator object
    paginator = Paginator(listings_results, listings_per_page)

    # Get the current page number from the request's GET parameters
    page_number = request.GET.get('page')

    try:
        # Get the listings for the requested page
        listings = paginator.page(page_number)
    except PageNotAnInteger:
        # If the page parameter is not an integer, display the first page
        listings = paginator.page(1)
    except EmptyPage:
        # If the page is out of range (e.g., 9999), display the last available page
        listings = paginator.page(paginator.num_pages)

    categories = Category.objects.annotate(listing_count=Count('listing'))
    return render(request, "auctions/search.html", {"listings": listings, "query": query, "search_count": search_count, "categories": categories})


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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
