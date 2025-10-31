// Public viewer component
export class PublicViewer {
    constructor(username, slug = null) {
        this.username = username;
        this.slug = slug;
    }

    async render() {
        const container = document.getElementById('public-viewer');
        container.innerHTML = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div class="max-w-md mx-auto">
                    <div class="px-4 py-8">
                        <div class="text-center">
                            <div class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h1 class="text-2xl font-bold text-gray-900 mb-2">@${this.username}</h1>
                            <p class="text-gray-600 mb-8">Public viewer coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('public-viewer').classList.remove('hidden');
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }
}


