import { setupEventListeners } from './event-listeners.js';
import { showPage } from './navigation.js';

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    showPage('verify'); // Show the verify page by default
});
