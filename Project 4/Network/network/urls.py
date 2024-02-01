
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("following", views.following, name="following"),
    path("profile/<str:username>", views.profile, name="profile"),
    path('edit-profile', views.edit_profile, name='edit-profile'),
    path("follow-toggle/<str:username>", views.follow_toggle, name="follow-toggle"),
    path("like-toggle/<int:post_id>", views.like_toggle, name="like-toggle"),
    path("edit-post/<int:post_id>", views.edit_post, name="edit-post"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('get-updated-image-urls/', views.get_updated_image_urls, name='get_updated_image_urls'),
]
