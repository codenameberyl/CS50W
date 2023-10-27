# Wiki (edited)

This Python program is an implementation to [CS50’s Web Programming with Python and JavaScript Project 1 - Wiki](https://cs50.harvard.edu/web/2020/projects/1/wkik/). This project involves creating an online encyclopedia that allows users to view and create entries on various topics using Markdown for content. Users can also search for entries, edit existing entries, and even discover random entries.

![Wiki](https://i.imgur.com/IHrmGHf.png)

## Table of Contents

- [Background](#background)
- [Getting Started](#getting-started)
- [Understanding](#understanding)
- [Specification](#specification)
- [Usage](#usage)
- [Hints](#hints)

## Background

Wikipedia, a popular online encyclopedia, uses a markup language called Wikitext to store encyclopedia entries. In this project, we will use Markdown, a simpler markup language, to store and display encyclopedia entries.

Markdown is a lightweight, human-friendly markup language for formatting text. GitHub's Markdown guide is a useful resource for understanding Markdown's syntax, including headings, bold text, links, and lists.

Each encyclopedia entry corresponds to a Markdown file. To display an entry, the Markdown content needs to be converted to HTML before rendering in the browser.

## Getting Started

1. Download the distribution code from [this link](https://cdn.cs50.net/web/2020/spring/projects/1/wiki.zip) and unzip it.

## Understanding

In the distribution code, you'll find a Django project named "wiki" with a single app called "encyclopedia."

1. **`encyclopedia/urls.py`**: This file defines the URL configuration for the app. It starts with a default route associated with the `views.index` function.

2. **`encyclopedia/util.py`**: Contains three functions for interacting with encyclopedia entries:
   - `list_entries`: Returns a list of all entry names.
   - `save_entry`: Saves a new encyclopedia entry with a title and Markdown content.
   - `get_entry`: Retrieves an encyclopedia entry by its title, returning its Markdown content if it exists or `None` if not.

3. **`entries/`**: This directory contains pre-created sample entries in Markdown format. You can add more entries here.

4. **`encyclopedia/views.py`**: Currently has a single view, `index`, which returns the `encyclopedia/index.html` template with a list of all encyclopedia entries.

5. **`encyclopedia/templates/encyclopedia/index.html`**: Defines the structure for the index page. It lists all entry names as links.

## Specification

### Entry Page

- Visiting `/wiki/TITLE`, where `TITLE` is the title of an encyclopedia entry, should render a page displaying the content of that entry.
- If the requested entry does not exist, show an error page indicating that the requested page was not found.
- If the entry exists, display the content with the title of the page.

### Index Page

- Update `index.html` to allow users to click on any entry name to go directly to that entry's page.

### Search

- Allow users to enter a query in the search box in the sidebar to search for encyclopedia entries.
- If the query matches the name of an entry, redirect the user to that entry's page.
- If the query does not match an entry name, show a search results page listing entries with the query as a substring.
- Clicking on an entry name in the search results should take the user to that entry's page.

### New Page

- Clicking "Create New Page" in the sidebar should take the user to a page where they can create a new encyclopedia entry.
- Users can enter a title and use a textarea to enter Markdown content.
- Users can click a button to save the new page.
- If an entry with the provided title already exists, display an error message.
- After saving, redirect the user to the new entry's page.

### Edit Page

- On each entry page, allow users to click a link to edit the entry's Markdown content in a textarea.
- Pre-populate the textarea with the existing Markdown content.
- Users can click a button to save their changes.
- After saving, redirect the user back to the entry's page.

### Random Page

- Clicking "Random Page" in the sidebar should take the user to a random encyclopedia entry.

### Markdown to HTML Conversion

- Convert Markdown content to HTML on each entry's page. You can use the `markdown2` package for this purpose (installable via `pip3 install markdown2`).

### Challenge for Experienced Users

- Implement Markdown to HTML conversion without external libraries, supporting headings, bold text, unordered lists, links, and paragraphs. You may find regular expressions in Python helpful.

## Usage

1. Clone or download this repository to your local machine.

2. Install Django if you haven't already using `pip3 install django`.

3. Run the Django development server using `python3 manage.py runserver`.

4. Open a web browser and navigate to `http://localhost:8000/` to start using the Wikipedia-like Online Encyclopedia.

## Hints

- To output HTML from a Django template without escaping, use the `safe` filter (e.g., `{{ variable|safe }}`).