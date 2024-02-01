# context_processors.py
from .models import Post

def liked_posts(request):
    liked_post_ids = []

    if request.user.is_authenticated:
        liked_post_ids = request.user.liked_posts.values_list('id', flat=True)

    return {'liked_posts': liked_post_ids}
