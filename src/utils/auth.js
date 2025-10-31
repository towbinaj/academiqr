// Authentication manager
export class AuthManager {
    constructor() {
        this.user = null;
        this.supabase = null;
    }

    async init() {
        // Initialize Supabase client when we have the environment variables
        // For now, we'll use a mock implementation
        this.user = this.getStoredUser();
    }

    async signUp(email, password, metadata = {}) {
        // Mock implementation - replace with actual Supabase auth
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = {
                    id: 'mock-user-id',
                    email,
                    ...metadata,
                    created_at: new Date().toISOString()
                };
                
                this.user = user;
                this.storeUser(user);
                resolve(user);
            }, 1000);
        });
    }

    async signIn(email, password) {
        // Mock implementation - replace with actual Supabase auth
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = {
                    id: 'mock-user-id',
                    email,
                    displayName: 'Test User',
                    created_at: new Date().toISOString()
                };
                
                this.user = user;
                this.storeUser(user);
                resolve(user);
            }, 1000);
        });
    }

    async signOut() {
        this.user = null;
        this.clearStoredUser();
        window.location.href = '/';
    }

    isAuthenticated() {
        return this.user !== null;
    }

    getCurrentUser() {
        return this.user;
    }

    storeUser(user) {
        localStorage.setItem('biolink_user', JSON.stringify(user));
    }

    getStoredUser() {
        const stored = localStorage.getItem('biolink_user');
        return stored ? JSON.parse(stored) : null;
    }

    clearStoredUser() {
        localStorage.removeItem('biolink_user');
    }
}


