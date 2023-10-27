from django.urls import path

from .views import IndexView, SearchView, EntryView, NewPageView, EditPageView, RandomPageView


app_name = "encyclopedia"

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("search", SearchView.as_view(), name="search"),
    path("wiki/<str:entry>", EntryView.as_view(), name="entry"),
    path("new", NewPageView.as_view(), name="new"),
    path("wiki/<str:entry>/edit", EditPageView.as_view(), name="edit"),
    path("random", RandomPageView.as_view(), name="random"),
]