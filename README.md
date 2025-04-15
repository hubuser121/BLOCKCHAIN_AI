# Blockchain Document Verification System

## Project Description

This system allows administrators to upload and verify documents, ensuring their authenticity and immutability using blockchain technology. Students or other parties can then verify these documents using a unique document ID.

## Features

-   **Admin Login:** Secure login for administrators to manage documents.
-   **Document Upload:** Administrators can upload scanned documents or marksheets in JPEG, JPG, PNG, or PDF format.
-   **AI Verification:** Documents are analyzed using a mock AI model to determine their authenticity.
-   **Blockchain Integration:** Verified documents are added to a mock blockchain, providing a secure and immutable record.
-   **Document Verification:** Students or other parties can verify documents by entering a unique document ID.
-   **Document Display:** Verified documents are displayed along with their blockchain address and verification status.

## Technologies Used

-   HTML: Provides the structure and UI of the application.
-   CSS (via Tailwind CSS): Styles the application for a modern and responsive design.
-   JavaScript: Implements the application logic, including event handling, DOM manipulation, and blockchain integration.

## Modules

-   `app.js`: Main application script that initializes everything.
-   `event-listeners.js`: Sets up all event listeners for the UI.
-   `navigation.js`: Handles page navigation.
-   `dom-utils.js`: Contains utility functions for DOM manipulation.
-   `state.js`: Manages the application's state.
-   `validation.js`: Handles input validation.
-   `classification.js`: Contains the AI classification logic.
-   `blockchain.js`: Manages the mock blockchain operations.
-   `document-storage.js`: Manages the storage and retrieval of documents.

## Setup

1.  Clone the repository.
2.  Open `index.html` in your browser.

## Usage

1.  Log in as an administrator using the credentials:
    -   Username: `TEAM_5`
    -   Password: `PROJECT`
2.  Upload a scanned document or marksheet.
3.  Verify the document.
4.  As a student, go to the verification page and enter the document ID to verify the document.

## Notes

-   This is a simplified implementation that uses a mock AI model and a mock blockchain.
-   A real-world implementation would require integration with a real AI service and a real blockchain network.
