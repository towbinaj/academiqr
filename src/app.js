// Main application controller
import { AuthManager } from './utils/auth.js';
import { Router } from './utils/router.js';
import { EditorView } from './components/editor/EditorView.js';
import { PublicViewer } from './components/viewer/PublicViewer.js';
import { AnalyticsView } from './components/analytics/AnalyticsView.js';

class App {
    constructor() {
        this.authManager = new AuthManager();
        this.router = new Router();
        this.currentView = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Show loading screen
            this.showLoading();
            
            // Initialize auth
            await this.authManager.init();
            
            // Set up routing
            this.setupRouting();
            
            // Initialize based on current route
            await this.handleRoute();
            
            this.isInitialized = true;
            this.hideLoading();
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }

    setupRouting() {
        // Define routes
        this.router.addRoute('/', () => this.showHomePage());
        this.router.addRoute('/login', () => this.showLoginPage());
        this.router.addRoute('/register', () => this.showRegisterPage());
        this.router.addRoute('/dashboard', () => this.showDashboard());
        this.router.addRoute('/editor/:listId?', (params) => this.showEditor(params.listId));
        this.router.addRoute('/analytics/:listId?', (params) => this.showAnalytics(params.listId));
        this.router.addRoute('/u/:username/:slug', (params) => this.showPublicViewer(params.username, params.slug));
        this.router.addRoute('/u/:username', (params) => this.showPublicViewer(params.username));
        
        // Handle browser navigation
        window.addEventListener('popstate', () => this.handleRoute());
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.router.match(path);
        
        if (route) {
            await route.handler(route.params);
        } else {
            // 404 - redirect to home
            this.router.navigate('/');
        }
    }

    async showHomePage() {
        if (this.authManager.isAuthenticated()) {
            this.router.navigate('/dashboard');
        } else {
            this.showLandingPage();
        }
    }

    showLandingPage() {
        const container = document.getElementById('main-app');
        container.innerHTML = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div class="max-w-4xl mx-auto text-center px-4">
                    <h1 class="text-5xl font-bold text-gray-900 mb-6">
                        Create Beautiful Link Lists
                    </h1>
                    <p class="text-xl text-gray-600 mb-8">
                        Build custom link-in-bio pages with analytics, themes, and more.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="app.router.navigate('/register')" class="btn btn-primary btn-lg">
                            Get Started Free
                        </button>
                        <button onclick="app.router.navigate('/login')" class="btn btn-secondary btn-lg">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.showMainApp();
    }

    showLoginPage() {
        const container = document.getElementById('auth-container');
        container.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>
                    <form class="mt-8 space-y-6" id="login-form">
                        <div class="form-group">
                            <label for="email" class="form-label">Email address</label>
                            <input id="email" name="email" type="email" required class="form-input" placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <input id="password" name="password" type="password" required class="form-input" placeholder="Enter your password">
                        </div>
                        <div>
                            <button type="submit" class="btn btn-primary w-full">
                                Sign in
                            </button>
                        </div>
                        <div class="text-center">
                            <p class="text-sm text-gray-600">
                                Don't have an account? 
                                <button type="button" onclick="app.router.navigate('/register')" class="text-primary-600 hover:text-primary-500">
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        `;
        this.showAuthContainer();
        this.setupLoginForm();
    }

    showRegisterPage() {
        const container = document.getElementById('auth-container');
        container.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                    </div>
                    <form class="mt-8 space-y-6" id="register-form">
                        <div class="form-group">
                            <label for="displayName" class="form-label">Display Name</label>
                            <input id="displayName" name="displayName" type="text" required class="form-input" placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label for="email" class="form-label">Email address</label>
                            <input id="email" name="email" type="email" required class="form-input" placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <input id="password" name="password" type="password" required class="form-input" placeholder="Create a password">
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword" class="form-label">Confirm Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required class="form-input" placeholder="Confirm your password">
                        </div>
                        <div>
                            <button type="submit" class="btn btn-primary w-full">
                                Create Account
                            </button>
                        </div>
                        <div class="text-center">
                            <p class="text-sm text-gray-600">
                                Already have an account? 
                                <button type="button" onclick="app.router.navigate('/login')" class="text-primary-600 hover:text-primary-500">
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        `;
        this.showAuthContainer();
        this.setupRegisterForm();
    }

    async showDashboard() {
        if (!this.authManager.isAuthenticated()) {
            this.router.navigate('/login');
            return;
        }

        const container = document.getElementById('main-app');
        container.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <nav class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between h-16">
                            <div class="flex items-center">
                                <h1 class="text-xl font-semibold text-gray-900">BioLink</h1>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button onclick="app.router.navigate('/editor')" class="btn btn-primary">
                                    + New List
                                </button>
                                <button onclick="app.authManager.signOut()" class="btn btn-ghost">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div class="px-4 py-6 sm:px-0">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">Your Link Lists</h2>
                        <div id="lists-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- Lists will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.showMainApp();
        await this.loadUserLists();
    }

    async showEditor(listId = null) {
        if (!this.authManager.isAuthenticated()) {
            this.router.navigate('/login');
            return;
        }

        this.currentView = new EditorView(listId);
        await this.currentView.render();
    }

    async showAnalytics(listId = null) {
        if (!this.authManager.isAuthenticated()) {
            this.router.navigate('/login');
            return;
        }

        this.currentView = new AnalyticsView(listId);
        await this.currentView.render();
    }

    async showPublicViewer(username, slug = null) {
        this.currentView = new PublicViewer(username, slug);
        await this.currentView.render();
    }

    setupLoginForm() {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');
            
            try {
                await this.authManager.signIn(email, password);
                this.router.navigate('/dashboard');
            } catch (error) {
                this.showError(error.message);
            }
        });
    }

    setupRegisterForm() {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const displayName = formData.get('displayName');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            if (password !== confirmPassword) {
                this.showError('Passwords do not match');
                return;
            }
            
            try {
                await this.authManager.signUp(email, password, { displayName });
                this.router.navigate('/dashboard');
            } catch (error) {
                this.showError(error.message);
            }
        });
    }

    async loadUserLists() {
        // TODO: Load user's lists from Supabase
        const container = document.getElementById('lists-container');
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500">No lists yet. Create your first one!</p>
            </div>
        `;
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('public-viewer').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showAuthContainer() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('public-viewer').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('public-viewer').classList.add('hidden');
    }

    showPublicViewer() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('public-viewer').classList.remove('hidden');
    }

    showError(message) {
        // Simple error display - can be enhanced with a proper notification system
        alert(message);
    }
}

// Create and export app instance
export function createApp() {
    window.app = new App();
    window.app.init();
}


