# Commerce

This Python program is an implementation to [CS50’s Web Programming with Python and JavaScript Project 2 - Commerce](https://cs50.harvard.edu/web/2020/projects/2/commerce/). Design an eBay-like e-commerce auction site that allows users to post auction listings, place bids on listings, comment on listings, and add listings to their watchlist.

![Commerce](https://i.imgur.com/NdpLWDS.gif)

## Table of Contents

- [Getting Started](#getting-started)
- [Understanding](#understanding)
- [Specification](#specification)
- [Models](#models)
- [Views](#views)
- [Forms](#forms)
- [Usage](#usage)
- [Django Admin Interface](#django-admin-interface)
- [HTML Template](#html-template)

## Getting Started

1. Download the distribution code from [this link](https://cdn.cs50.net/web/2020/spring/projects/2/commerce.zip) and unzip it.

2. In your terminal, navigate to the `commerce` directory.

3. Run the following commands to set up the initial database and apply migrations:

   ```bash
   python manage.py makemigrations auctions
   python manage.py migrate
   ```

## Understanding

In the distribution code, you'll find a Django project named "commerce" with a single app named "auctions."

1. **`auctions/urls.py`**: This file defines the URL routing for the app. It includes routes for index, login, logout, register, and other views.

2. **`auctions/views.py`**: Contains the view functions that handle various routes in the application. Views for login, logout, register, index, and other functionality are provided.

3. **`auctions/models.py`**: Defines the data models for the application. The provided models include User, Category, Listing, Bid, and Comment.

4. **`auctions/forms.py`**: Contains the forms used for creating listings, placing bids, and adding comments.

5. **`auctions/templates/auctions/`**: This directory contains the HTML templates used to render the different pages of the application. Key templates include `index.html`, `listing-detail.html`, `watchlist.html`, `create-listing.html`, and others.

6. **`auctions/static/auctions/`**: Contains static files such as CSS and images used for styling the application.

## Specification

### Models

Your application should have at least three models in addition to the User model: one for auction listings, one for bids, and one for comments made on auction listings. You can have additional models if needed. Here's an overview of the provided models:

- **User**: Represents each user of the application. You can add additional fields to this model if necessary.

- **Category**: Represents categories for auction listings. Categories can have names and optional images.

- **Listing**: Represents auction listings. Includes fields for title, description, starting bid, current bid, category, image, owner, watchers, and active status.

- **Bid**: Represents bids placed on auction listings. Contains fields for the bid amount, bidder, and listing.

- **Comment**: Represents comments made on auction listings. Includes fields for the comment text, commenter, listing, and timestamp.

### Views

The application includes various views for different routes. Some key views include:

- **index**: Displays all active auction listings. Supports pagination.

- **create_listing**: Allows users to create new listings. Users can provide a title, description, starting bid, image, and category.

- **listing_detail**: Shows details of a specific listing, including current bid, comments, and the ability to add comments and place bids. Owners can close auctions if signed in.

- **watchlist**: Displays the user's watchlist, which includes listings they've added.

- **add_watchlist**: Allows users to add a listing to their watchlist.

- **remove_watchlist**: Allows users to remove a listing from their watchlist.

- **place_bid**: Allows users to place bids on a listing. Validates bid amount.

- **close_listing**: Allows listing owners to close their auctions.

- **comment**: Lets users add comments to listings.

- **categories**: Displays a list of all listing categories.

- **category_listings**: Shows listings within a specific category.

- **search_listings**: Enables users to search for listings by title and description.

### Forms

The application uses forms for various interactions. The provided forms include:

- **ListingForm**: Allows users to create new listings with title, description, starting bid, image, and category.

- **BidForm**: Allows users to place bids on listings.

- **CommentForm**: Allows users to add comments to listings.

## Usage

1. Clone or download this repository to your local machine.

2. Install Django if you haven't already using `pip install django`.

3. Run the Django development server using `python manage.py runserver`.

4. Open a web browser and navigate to `http://localhost:8000/` to start using the Commerce Auction Site.

## Django Admin Interface

- To access the Django admin interface, create a superuser account by running `python manage.py createsuperuser`.

- Use the superuser account to log in to the admin interface at `http://localhost:8000/admin/`. Here, you can view, add, edit, and delete listings, comments, and bids.

## HTML Template

- UntreeStore: [UntreeStore – Free Bootstrap eCommerce Template](https://untree.co/free-templates/untreestore-ecommerce-free-download-bootstrap-template/)