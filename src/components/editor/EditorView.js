// Editor view component
export class EditorView {
    constructor(listId = null) {
        this.listId = listId;
        this.isNewList = !listId;
    }

    async render() {
        const container = document.getElementById('main-app');
        container.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <nav class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between h-16">
                            <div class="flex items-center">
                                <button onclick="app.router.navigate('/dashboard')" class="btn btn-ghost">
                                    ← Back to Dashboard
                                </button>
                                <h1 class="ml-4 text-xl font-semibold text-gray-900">
                                    ${this.isNewList ? 'New Link List' : 'Edit Link List'}
                                </h1>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button onclick="this.saveList()" class="btn btn-primary">
                                    Save
                                </button>
                                <button onclick="app.router.navigate('/dashboard')" class="btn btn-ghost">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div class="px-4 py-6 sm:px-0">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <!-- Editor Panel -->
                            <div class="lg:col-span-2">
                                <div class="bg-white rounded-lg shadow">
                                    <div class="px-6 py-4 border-b border-gray-200">
                                        <div class="flex space-x-1">
                                            <button class="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                                                Buttons
                                            </button>
                                            <button class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                                                Grid
                                            </button>
                                            <button class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                                                Appearance
                                            </button>
                                            <button class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                                                Settings
                                            </button>
                                        </div>
                                    </div>
                                    <div class="p-6">
                                        <div class="text-center py-12">
                                            <p class="text-gray-500">Editor interface coming soon...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Preview Panel -->
                            <div class="lg:col-span-1">
                                <div class="bg-white rounded-lg shadow">
                                    <div class="px-6 py-4 border-b border-gray-200">
                                        <h3 class="text-lg font-medium text-gray-900">Preview</h3>
                                    </div>
                                    <div class="p-6">
                                        <div class="text-center py-12">
                                            <p class="text-gray-500">Mobile preview coming soon...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('public-viewer').classList.add('hidden');
    }

    async saveList() {
        // TODO: Implement save functionality
        console.log('Saving list...');
    }
}


