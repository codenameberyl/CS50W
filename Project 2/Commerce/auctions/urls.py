from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),

    path("create-listing", views.create_listing, name="create_listing"),
    path("listing/<str:listing_id>", views.listing_detail, name="listing_detail"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("add-watchlist/<str:listing_id>", views.add_watchlist, name="add_watchlist"),
    path("remove-watchlist/<str:listing_id>", views.remove_watchlist, name="remove_watchlist"),
    path("place-bid/<str:listing_id>", views.place_bid, name="place_bid"),
    path("close-listing/<str:listing_id>", views.close_listing, name="close_listing"),
    path("comment/<str:listing_id>", views.comment, name="comment"),
    path("categories", views.categories, name="categories"),
    path("category/<int:category_id>", views.category_listings, name="category_listings"),
    path('search', views.search_listings, name='search_listings'),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
