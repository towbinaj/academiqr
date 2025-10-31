// Analytics view component
import { 
    getAnalyticsSummary, 
    getClicksByLink, 
    getClicksByDevice, 
    getRecentClicks, 
    getPageViews,
    supabase
} from '../../utils/supabase.js';

export class AnalyticsView {
    constructor(listId = null) {
        this.listId = listId;
        this.analyticsData = null;
        this.isLoading = false;
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
                                    Analytics
                                </h1>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button onclick="window.analyticsView.refresh()" class="btn btn-primary btn-sm">
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div class="px-4 py-6 sm:px-0">
                        <!-- Loading State -->
                        <div id="analytics-loading" class="text-center py-12">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p class="mt-4 text-gray-600">Loading analytics...</p>
                        </div>

                        <!-- Error State -->
                        <div id="analytics-error" class="hidden bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <p id="analytics-error-message" class="text-sm text-red-800"></p>
                                </div>
                            </div>
                        </div>

                        <!-- Analytics Content -->
                        <div id="analytics-content" class="hidden">
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div class="bg-white rounded-lg shadow p-6">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-600">Total Clicks</p>
                                            <p id="total-clicks" class="text-2xl font-semibold text-gray-900">0</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-white rounded-lg shadow p-6">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                                            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-600">Page Views</p>
                                            <p id="total-views" class="text-2xl font-semibold text-gray-900">0</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-white rounded-lg shadow p-6">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-600">Top Links</p>
                                            <p id="top-links-count" class="text-2xl font-semibold text-gray-900">0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Charts Section -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <!-- Clicks by Link -->
                                <div class="bg-white rounded-lg shadow p-6">
                                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Clicks by Link</h2>
                                    <div id="clicks-by-link" class="space-y-4">
                                        <!-- Will be populated by JavaScript -->
                                    </div>
                                </div>

                                <!-- Clicks by Device -->
                                <div class="bg-white rounded-lg shadow p-6">
                                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Clicks by Device</h2>
                                    <div id="clicks-by-device" class="space-y-4">
                                        <!-- Will be populated by JavaScript -->
                                    </div>
                                </div>
                            </div>

                            <!-- Recent Clicks -->
                            <div class="bg-white rounded-lg shadow p-6">
                                <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Clicks</h2>
                                <div id="recent-clicks" class="overflow-x-auto">
                                    <!-- Will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div id="analytics-empty" class="hidden text-center py-12">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No analytics data yet</h3>
                            <p class="mt-1 text-sm text-gray-500">Start sharing your links to see analytics here!</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('public-viewer').classList.add('hidden');

        // Store reference for refresh button
        window.analyticsView = this;

        // Load analytics data
        await this.loadAnalytics();
    }

    async loadAnalytics() {
        this.isLoading = true;
        this.showLoading();

        try {
            // Log current user for debugging
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) {
                    console.error('❌ Error getting user:', userError);
                } else if (user) {
                    console.log('✅ Analytics - Current logged-in user:', {
                        id: user.id,
                        email: user.email
                    });
                    console.log('📋 User ID to look for in database:', user.id);
                } else {
                    console.warn('⚠️ No user found - you may not be logged in');
                }
            } catch (e) {
                console.error('❌ Exception getting user info:', e);
            }
            
            // Fetch all analytics data in parallel
            const [summary, clicksByLink, clicksByDevice, recentClicks, pageViews] = await Promise.all([
                getAnalyticsSummary(this.listId),
                getClicksByLink(this.listId),
                getClicksByDevice(this.listId),
                getRecentClicks(this.listId, 20),
                getPageViews(this.listId)
            ]);

            this.analyticsData = {
                summary,
                clicksByLink,
                clicksByDevice,
                recentClicks,
                pageViews
            };

            console.log('📊 Analytics data loaded:', {
                summary: summary.totalClicks,
                clicksByLink: clicksByLink.length,
                clicksByDevice: clicksByDevice.length,
                recentClicks: recentClicks.length,
                pageViews: pageViews
            });
            
            this.renderAnalytics();
        } catch (error) {
            console.error('❌ Error loading analytics:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                summary: summary,
                clicksByLink: clicksByLink,
                clicksByDevice: clicksByDevice,
                recentClicks: recentClicks,
                pageViews: pageViews
            });
            this.showError(error.message || 'Failed to load analytics data');
        } finally {
            this.isLoading = false;
        }
    }

    async refresh() {
        await this.loadAnalytics();
    }

    renderAnalytics() {
        const { summary, clicksByLink, clicksByDevice, recentClicks, pageViews } = this.analyticsData;

        // Check if there's any data
        const hasData = summary.totalClicks > 0 || pageViews > 0;

        if (!hasData) {
            this.showEmpty();
            return;
        }

        // Hide loading, show content
        document.getElementById('analytics-loading').classList.add('hidden');
        document.getElementById('analytics-error').classList.add('hidden');
        document.getElementById('analytics-empty').classList.add('hidden');
        document.getElementById('analytics-content').classList.remove('hidden');

        // Update summary cards
        document.getElementById('total-clicks').textContent = summary.totalClicks.toLocaleString();
        document.getElementById('total-views').textContent = pageViews.toLocaleString();
        document.getElementById('top-links-count').textContent = clicksByLink.length;

        // Render clicks by link
        this.renderClicksByLink(clicksByLink);

        // Render clicks by device
        this.renderClicksByDevice(clicksByDevice);

        // Render recent clicks
        this.renderRecentClicks(recentClicks);
    }

    renderClicksByLink(clicksByLink) {
        const container = document.getElementById('clicks-by-link');
        
        if (clicksByLink.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500">No link clicks yet</p>';
            return;
        }

        const maxClicks = Math.max(...clicksByLink.map(item => item.clicks));
        
        container.innerHTML = clicksByLink.slice(0, 10).map(item => {
            const percentage = maxClicks > 0 ? (item.clicks / maxClicks) * 100 : 0;
            return `
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-medium text-gray-900 truncate">${this.escapeHtml(item.title)}</span>
                        <span class="text-sm font-semibold text-gray-700">${item.clicks}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderClicksByDevice(clicksByDevice) {
        const container = document.getElementById('clicks-by-device');
        
        if (clicksByDevice.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500">No device data yet</p>';
            return;
        }

        const total = clicksByDevice.reduce((sum, item) => sum + item.clicks, 0);
        
        container.innerHTML = clicksByDevice.map(item => {
            const percentage = total > 0 ? (item.clicks / total) * 100 : 0;
            const deviceIcon = this.getDeviceIcon(item.device);
            return `
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <div class="flex items-center">
                            <span class="text-lg mr-2">${deviceIcon}</span>
                            <span class="text-sm font-medium text-gray-900 capitalize">${this.escapeHtml(item.device)}</span>
                        </div>
                        <span class="text-sm font-semibold text-gray-700">${item.clicks} (${percentage.toFixed(1)}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderRecentClicks(recentClicks) {
        const container = document.getElementById('recent-clicks');
        
        if (recentClicks.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500">No recent clicks</p>';
            return;
        }

        container.innerHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${recentClicks.map(click => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">${this.escapeHtml(click.linkTitle)}</div>
                                <div class="text-sm text-gray-500 truncate max-w-xs">${this.escapeHtml(click.linkUrl)}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm text-gray-900 capitalize">${this.escapeHtml(click.deviceType || 'Unknown')}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm text-gray-900">${this.escapeHtml(click.browser || 'Unknown')}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${this.formatTime(click.clickedAt)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getDeviceIcon(device) {
        const icons = {
            mobile: '📱',
            tablet: '📱',
            desktop: '💻',
            unknown: '🖥️'
        };
        return icons[device.toLowerCase()] || icons.unknown;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        document.getElementById('analytics-loading').classList.remove('hidden');
        document.getElementById('analytics-content').classList.add('hidden');
        document.getElementById('analytics-error').classList.add('hidden');
        document.getElementById('analytics-empty').classList.add('hidden');
    }

    showError(message) {
        document.getElementById('analytics-loading').classList.add('hidden');
        document.getElementById('analytics-content').classList.add('hidden');
        document.getElementById('analytics-error').classList.remove('hidden');
        document.getElementById('analytics-error-message').textContent = message;
        document.getElementById('analytics-empty').classList.add('hidden');
    }

    showEmpty() {
        document.getElementById('analytics-loading').classList.add('hidden');
        document.getElementById('analytics-content').classList.add('hidden');
        document.getElementById('analytics-error').classList.add('hidden');
        document.getElementById('analytics-empty').classList.remove('hidden');
    }
}
