# Search

This Python program is an implementation to [CS50’s Web Programming with Python and JavaScript Project 0 - Search](https://cs50.harvard.edu/web/2020/projects/0/search/). This is a simple front-end web application that replicates the functionality of Google Search, Google Image Search, and Google Advanced Search. It allows users to perform searches using Google's search engine by submitting data through HTML forms.

![Search](https://i.imgur.com/5RCpCmG.png)

## Table of Contents

- [Background](#background)
- [Getting Started](#getting-started)
- [Specification](#specification)
- [Usage](#usage)
- [Hints](#hints)

## Background

The Google Search Front-End project demonstrates how to create HTML forms that send data to an existing web server, specifically Google's search engine. By analyzing the structure of Google's search URL, we can replicate its functionality.

## Getting Started

You can either manually create the HTML files as described in the project instructions or download the distribution code provided.

1. **Manual Setup**:
   - Create three HTML files: `index.html` (for Google Search), `image.html` (for Google Image Search), and `advanced.html` (for Google Advanced Search).
   - Follow the project's [specification](#specification) to create the HTML forms for each search type.

2. **Using Distribution Code**:
   - Download the distribution code from [search.zip](https://cdn.cs50.net/web/2020/spring/projects/0/search.zip) and unzip it.
   - You'll find the necessary HTML files and CSS for the project.

## Specification

### Pages

Your website should consist of three pages:

1. **Google Search Page (`index.html`):**
   - Users can type in a query and click "Google Search" to be taken to Google's search results.
   - Centered search bar with rounded corners.
   - Centered search button beneath the search bar.
   - "I'm Feeling Lucky" button takes users directly to the first Google search result.

2. **Google Image Search Page (`image.html`):**
   - Users can type in a query and click a search button to be taken to Google Image search results.
   - Centered search bar with rounded corners.
   - Centered search button beneath the search bar.

3. **Google Advanced Search Page (`advanced.html`):**
   - Users can provide input for four fields: "all these words," "this exact word or phrase," "any of these words," and "none of these words."
   - The four options should be stacked vertically, with left-aligned text fields.
   - "Advanced Search" button takes users to the search results page for their query.

### Navigation

- All pages should have a link in the upper-right corner to go back to the Google Search Page.
- The Google Search Page should also have links to go to the Google Image Search and Google Advanced Search pages.

### Styling

- The CSS should resemble Google's own aesthetics, including the style of the "Advanced Search" button.
- The "I'm Feeling Lucky" button should be styled to match Google's design.

### Hints

- You can determine the parameter names by experimenting with Google searches and examining the resulting URL.
- Use HTML `<input>` elements with `name` and `value` attributes to create GET parameters.
- You can use a "hidden" input field to include data that users cannot see or modify.

## Usage

1. Clone or download this repository to your local machine.

2. Open the HTML files in a web browser to test the Google Search Front-End.

3. Navigate between the Google Search, Google Image Search, and Google Advanced Search pages using the links in the upper-right corner.

4. Experiment with different search queries and observe the URL parameters in action.

## Hints

- To determine parameter names, experiment with making Google searches and inspect the resulting URL.
- Use the browser's developer tools to view details about requests made to Google.