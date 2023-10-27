from django.contrib.auth.models import AbstractUser
from django.db import models

import uuid


class User(AbstractUser):
    pass


class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Listing(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='listings/', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    watchers = models.ManyToManyField(User, related_name="watchlist", blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Bid(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bidder = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.bidder.username} made a bid on {self.listing.title} for {self.amount}"


class Comment(models.Model):
    text = models.TextField()
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.commenter.username} commented "{self.text}" on {self.listing.title}'