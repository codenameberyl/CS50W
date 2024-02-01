# Network

## Overview

This Python program is an implementation to [CS50’s Web Programming with Python and JavaScript Project 4 - Network](https://cs50.harvard.edu/web/2020/projects/4/network/).

Welcome to Network! This is a Django-based web application that simulates a social network platform where users can make posts, follow other users, edit posts, like/unlike posts, and view posts from users they follow. This README provides a comprehensive guide on the project structure, functionality, and how to get started.

![Network](https://i.imgur.com/jOG8i0m.png)

## Project Structure

The project has the following key components:

- **network/models.py**: Defines the database models for the application, including User, Post, and Follow.
- **network/views.py**: Contains views for handling different aspects of the application, such as creating posts, editing profiles, following/unfollowing users, and liking/unliking posts.
- **network/urls.py**: Manages URL routing for the application.
- **network/templates**: Contains HTML templates for rendering different pages.
- **network/static**: Holds static files like CSS and JavaScript.
- **network/context_processors.py**: Defines a context processor to provide liked post information to templates.

## Features

1. **New Post**: Users can create new text-based posts by filling in content and, optionally, adding an image.

2. **All Posts**: The "All Posts" link displays all posts from all users, with the most recent posts first. Each post includes the username, content, timestamp, and the number of likes.

3. **Profile Page**: Clicking on a username loads the user's profile page, showing the number of followers, the number of people the user follows, and all the user's posts in reverse chronological order. Users can also follow/unfollow other users from their profile page.

4. **Following Page**: The "Following" link displays posts made by users that the current user follows. This page is only accessible to signed-in users.

5. **Pagination**: Posts are displayed 10 per page, with navigation buttons for the next and previous pages.

6. **Edit Post**: Users can edit their own posts by clicking an "Edit" button. Edits are done using JavaScript to update the content without a full page reload.

7. **Like and Unlike**: Users can like or unlike posts with a single click, and the like count is updated asynchronously without a page reload.

## Getting Started

1. **Download the code**: Clone or download the project code from [https://github.com/codenameberyl/CS50W](https://github.com/codenameberyl/CS50W).

2. **Navigate to the project directory**: Open your terminal and run `cd 'Project 4'/Network`.

3. **Apply migrations**: Run `python manage.py makemigrations network` followed by `python manage.py migrate` to apply migrations to your database.

4. **Run the server**: Execute `python manage.py runserver` to start the Django web server.

5. **Visit the website**: Open your browser and go to [http://127.0.0.1:8000/](http://127.0.0.1:8000/) to access the Network application.

6. **Register and explore**: Click "Register" to create a new account and start exploring the features of the Network.
