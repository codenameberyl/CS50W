# Categories context and
# Wacthlist count context for `layout.html`
from .models import Category


def layout_categories(request):
    categories = categories = Category.objects.all()
    return {'categories': categories}


def watchlist_count(request):
    if request.user.is_authenticated:
        watchlist_count = request.user.watchlist.count()
    else:
        watchlist_count = 0
    return {'watchlist_count': watchlist_count}
