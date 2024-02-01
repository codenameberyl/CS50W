from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    profile_image = models.ImageField(upload_to='profile_images/', default='default.png')
    about = models.TextField(blank=True, null=True)
    followers = models.ManyToManyField('self', through='Follow', symmetrical=False, related_name='following_set_user')

    def __str__(self):
        return self.username


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True, related_name='liked_posts')
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)

    class Meta:
        verbose_name = "post"
        verbose_name_plural = "posts"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username}: {self.content[:50]}..."


class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_set_follower')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers_set_following')

    def __str__(self):
        return f"{self.follower} follows {self.following}"
