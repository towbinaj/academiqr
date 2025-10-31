// Main application entry point
import { createApp } from './app.js';
import { checkConnection } from './utils/supabase.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createApp();
    // Fire and forget connectivity check
    checkConnection().then((ok) => {
        if (!ok) {
            console.warn('Supabase not reachable yet. Ensure SQL schema exists.');
        }
    });
});

// Handle page visibility changes for analytics
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Track page view when user returns to tab
        window.dispatchEvent(new CustomEvent('pageVisible'));
    }
});

// Handle beforeunload for cleanup
window.addEventListener('beforeunload', () => {
    // Save any pending changes
    window.dispatchEvent(new CustomEvent('beforeUnload'));
});
