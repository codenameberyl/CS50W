# Mail

This Python program is an implementation to [CS50’s Web Programming with Python and JavaScript Project 3 - Mail](https://cs50.harvard.edu/web/2020/projects/3/mail/).

![Mail](https://i.imgur.com/ga7kxNQ.png)

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Project Requirements](#project-requirements)

## Project Overview

Mail is a web application that simulates the functionality of an email client. It allows users to send and receive emails, organize them into mailboxes (inbox, sent, archive), view email details, mark emails as read/unread, and archive/unarchive emails. The project is built using Django for the backend and utilizes HTML, CSS, and JavaScript for the frontend.

## Getting Started

To set up the project, follow these steps:

1. **Download the code:**
   - Clone the repository or download the distribution code from [mail.zip](https://cdn.cs50.net/web/2020/spring/projects/3/mail.zip) and unzip it.

2. **Navigate to the project directory:**
   - Open your terminal and navigate to the `mail` directory using the `cd` command.

3. **Run migrations:**
   - Execute the following commands in the terminal:
     ```bash
     python manage.py makemigrations mail
     python manage.py migrate
     ```

4. **Run the server:**
   - Start the web server by running:
     ```bash
     python manage.py runserver
     ```

5. **Register a new account:**
   - Open the web server in your browser and use the "Register" link to create a new account. Choose any email address and password for testing purposes.

6. **Explore the Email Client:**
   - Once registered and signed in, you will be directed to the Inbox page of the mail client.

## Project Structure

The project is organized into Django models, views, templates, and static files. Here are key files and directories:

- **`mail/models.py`:**
  - Defines the database models, including `User` and `Email`.

- **`mail/views.py`:**
  - Implements the views for rendering pages and handling API requests.

- **`mail/templates/mail/`:**
  - Contains HTML templates for different pages (e.g., inbox, login, register).

- **`mail/static/mail/`:**
  - Holds static files such as CSS styles and JavaScript scripts.

- **`mail/static/mail/inbox.js`:**
  - The main JavaScript file for controlling the frontend functionality.

## API Routes

The application supports the following API routes:

- **GET `/emails/<str:mailbox>`:**
  - Retrieves a list of emails in the specified mailbox.

- **GET `/emails/<int:email_id>`:**
  - Retrieves details of a specific email by its ID.

- **POST `/emails`:**
  - Sends a new email by providing recipient(s), subject, and body.

- **PUT `/emails/<int:email_id>`:**
  - Updates the status of an email (read/unread, archived/unarchived).

## Project Requirements

To complete the implementation, the following requirements was fulfilled:

1. **Send Mail:**
   - Implement JavaScript code to send emails when the user submits the email composition form.

2. **Mailbox:**
   - Load the appropriate mailbox when the user visits Inbox, Sent, or Archive.

3. **View Email:**
   - Display the content of a selected email when clicked, marking it as read.

4. **Archive and Unarchive:**
   - Allow users to archive and unarchive emails in the Inbox and Archive mailboxes.

5. **Reply:**
   - Enable users to reply to an email, pre-filling recipient, subject, and body fields.

## HTML Template

- Gmail Clone: [Gmail Clone](https://github.com/HabibOsaye/gmail-clone)

