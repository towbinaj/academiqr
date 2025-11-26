
        // Cache bust: v0.5.1 - Public-side security fixes: XSS prevention, passkey auth, URL validation, SRI hashes
        // Supabase configuration
        const SUPABASE_URL = 'https://natzpfyxpuycsuuzbqrd.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NTExODQsImV4cCI6MjA3NjUyNzE4NH0.q06AAoHZrfS3-O7568VpikaOtn6qAlDyDM7VR6sgzeU';
        
        // Initialize Supabase
        let supabaseClient = null;
        let currentUser = null;
        let currentList = null;
        let collections = [];
        let links = [];
        let theme = {
            background: 'linear-gradient(135deg, #1A2F5B 0%, #3B5B8F 100%)',
            textColor: '#ffffff',
            buttonStyle: 'soft'
        };
        
        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            
            // Set up visibility dropdown handlers
            const visibilitySelect = document.getElementById('visibility-select');
            const headerVisibilitySelect = document.getElementById('header-visibility-select');
            const passkeyGroup = document.getElementById('passkey-group');
            const headerPasskeyGroup = document.getElementById('header-passkey-group');
            const headerPasskeyInput = document.getElementById('header-passkey');
            
            // Sync header dropdown with settings dropdown
            function syncVisibilityDropdowns() {
                if (visibilitySelect && headerVisibilitySelect) {
                    headerVisibilitySelect.value = visibilitySelect.value;
                }
            }
            
            // Handle header visibility changes
            if (headerVisibilitySelect) {
                headerVisibilitySelect.addEventListener('change', function() {
                    // Update settings dropdown
                    if (visibilitySelect) {
                        visibilitySelect.value = this.value;
                    }
                    
                    // Show/hide passkey fields
                    if (this.value === 'passkey') {
                        if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'flex';
                        if (passkeyGroup) passkeyGroup.style.display = 'block';
                    } else {
                        if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'none';
                        if (passkeyGroup) passkeyGroup.style.display = 'none';
                    }
                    
                    // Update current list
                    if (currentList) {
                        const passkey = this.value === 'passkey' ? (headerPasskeyInput ? headerPasskeyInput.value : '') : null;
                        currentList.visibility = this.value === 'passkey' ? 'public' : this.value;
                        currentList.passkey = passkey;
                    }
                });
            }
            
            // Handle header passkey input changes
            if (headerPasskeyInput) {
                headerPasskeyInput.addEventListener('input', function() {
                    // Sync with settings passkey field
                    const settingsPasskeyInput = document.getElementById('passkey');
                    if (settingsPasskeyInput) {
                        settingsPasskeyInput.value = this.value;
                    }
                    
                    // Update current list
                    if (currentList) {
                        currentList.passkey = this.value;
                    }
                });
            }
            
            // Handle settings visibility changes
            if (visibilitySelect && passkeyGroup) {
                visibilitySelect.addEventListener('change', function() {
                    if (this.value === 'passkey') {
                        passkeyGroup.style.display = 'block';
                    } else {
                        passkeyGroup.style.display = 'none';
                    }
                    
                    // Sync with header dropdown
                    if (headerVisibilitySelect) {
                        headerVisibilitySelect.value = this.value;
                    }
                });
            }
            
            // Set up crop functionality
            const editImage = document.getElementById('edit-image');
            if (editImage) {
                editImage.addEventListener('click', startCrop);
            }
            
            // Immediately hide dashboard on page load to ensure login is shown first
            const dashboard = document.getElementById('dashboard');
            const login = document.getElementById('login');
            const loading = document.getElementById('loading');
            
            
            if (dashboard) {
                dashboard.classList.add('hidden');
                dashboard.style.setProperty('display', 'none', 'important');
            }
            
            const appLayout = document.querySelector('.app-layout');
            if (appLayout) {
                appLayout.style.setProperty('display', 'none', 'important');
            }
            
            // Failsafe: After 12 seconds, if nothing has shown the login screen, show it
            setTimeout(() => {
                // Don't show login if we already have a user session
                if (currentUser) {
                    return;
                }
                
                const loginElement = document.getElementById('login');
                const loadingElement = document.getElementById('loading');
                const dashboardElement = document.getElementById('dashboard');
                
                if (loginElement && loadingElement) {
                    const loginIsHidden = loginElement.classList.contains('hidden');
                    const loadingIsVisible = !loadingElement.classList.contains('hidden');
                    const dashboardIsHidden = dashboardElement ? dashboardElement.classList.contains('hidden') : true;
                    
                    // Only show login if both dashboard and login are hidden and loading is still visible
                    if (loginIsHidden && loadingIsVisible && dashboardIsHidden) {
                        console.log('Failsafe: Showing login screen after timeout');
                        showLogin();
                    }
                }
            }, 12000);
            
            // Wait a moment for Supabase to load, then initialize
            setTimeout(() => {
                try {
                    console.log('Checking for Supabase library...');
                    console.log('typeof supabase:', typeof supabase);
                    
                    if (typeof supabase !== 'undefined' && supabase) {
                        console.log('Supabase library found, creating client...');
                        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                        console.log('Supabase client created successfully');
                        
                        // Set up auth state change listener for automatic session management
                        setupAuthStateListener();
                        
                        // Initialize asset URLs
                        initializeAssetUrls();
                        initApp();
                        
                        // Don't automatically show dashboard - let the login flow handle visibility
                    } else {
                        console.error('Supabase library not loaded yet, waiting a bit more...');
                        // Try again after another short delay
                        setTimeout(() => {
                            if (typeof supabase !== 'undefined' && supabase) {
                                console.log('Supabase loaded on second attempt');
                                supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                                // Set up auth state change listener for automatic session management
                                setupAuthStateListener();
                                initializeAssetUrls();
                                initApp();
                            } else {
                                console.error('Supabase still not loaded, showing login anyway');
                                showLogin();
                            }
                        }, 500);
                    }
                } catch (error) {
                    console.error('Error during Supabase initialization:', error);
                    showMessage('Database connection failed. Using demo mode.', 'warning');
                    showLogin();
                }
            }, 500);
        });
        
        // Toggle section collapse/expand
        function toggleSection(sectionId) {
            // Try pattern 1: Appearance tab sections (direct id match)
            let content = document.getElementById(sectionId);
            let chevron = null;
            
            if (content) {
                // Appearance tab pattern: chevron is in previous sibling
                chevron = content.previousElementSibling?.querySelector('.section-chevron');
            } else {
                // Try pattern 2: Links tab sections (with -content suffix)
                content = document.getElementById(sectionId + '-content');
                chevron = document.getElementById(sectionId + '-chevron');
            }
            
            if (content && chevron) {
                const isCollapsed = content.classList.contains('collapsed');
                
                if (isCollapsed) {
                    // Expand
                    content.classList.remove('collapsed');
                    chevron.classList.remove('collapsed');
                    if (chevron.style) {
                        chevron.style.transform = 'rotate(0deg)';
                    }
                } else {
                    // Collapse
                    content.classList.add('collapsed');
                    chevron.classList.add('collapsed');
                    if (chevron.style) {
                        chevron.style.transform = 'rotate(-90deg)';
                    }
                }
            }
        }

        // Initialize sections to be expanded by default
        function initializeSections() {
            const sections = ['background-section', 'text-buttons-section', 'border-effects-section'];
            sections.forEach(sectionId => {
                const content = document.getElementById(sectionId);
                if (content) {
                    content.classList.remove('collapsed');
                    const chevron = content.previousElementSibling.querySelector('.section-chevron');
                    if (chevron) {
                        chevron.classList.remove('collapsed');
                    }
                }
            });
        }
        
        // Force refresh preview to apply square images
        function forceRefreshPreview() {
            updatePreview();
            
            // Also force apply styles to existing images
            const previewImages = document.querySelectorAll('#preview-links img');
            previewImages.forEach(img => {
                img.style.setProperty('object-fit', 'cover', 'important');
                img.style.setProperty('width', '100%', 'important');
                img.style.setProperty('height', '100%', 'important');
                img.style.setProperty('border-radius', '4px', 'important');
            });
        }

        // Set up Supabase auth state change listener for automatic session management
        function setupAuthStateListener() {
            if (!supabaseClient) return;
            
            // Listen for auth state changes (sign in, sign out, token refresh, etc.)
            supabaseClient.auth.onAuthStateChange((event, session) => {
                // Handle different auth events
                switch (event) {
                    case 'SIGNED_IN':
                        // User signed in - update currentUser
                        if (session && session.user) {
                            currentUser = session.user;
                            // If we're on login screen, load data and show dashboard
                            const loginElement = document.getElementById('login');
                            if (loginElement && !loginElement.classList.contains('hidden')) {
                                loadUserData().then(() => {
                                    showDashboard();
                                });
                            }
                        }
                        break;
                        
                    case 'SIGNED_OUT':
                        // User signed out - clear user and show login
                        currentUser = null;
                        clearPersistentLogin();
                        showLogin();
                        break;
                        
                    case 'TOKEN_REFRESHED':
                        // Session token was refreshed automatically by Supabase
                        // Update currentUser if session exists
                        if (session && session.user) {
                            currentUser = session.user;
                        }
                        break;
                        
                    case 'USER_UPDATED':
                        // User data was updated - refresh currentUser
                        if (session && session.user) {
                            currentUser = session.user;
                        }
                        break;
                }
            });
        }

        async function initApp() {
            console.log('initApp called');
            
            // Immediately check for saved login and hide login screen if found
            // This improves UX by hiding login screen quickly if user is already logged in
            try {
                const { email: savedEmail, isLoggedIn } = getPersistentLogin();
                if (savedEmail && isLoggedIn === 'true') {
                    // Hide login screen immediately - session check will confirm
                    const loginElement = document.getElementById('login');
                    if (loginElement) {
                        loginElement.classList.add('hidden');
                    }
                }
            } catch (error) {
                // Ignore errors in this check
            }
            
            // Check for OAuth callback
            // Extract tokens from hash and clear immediately to prevent exposure
            const hash = window.location.hash.substring(1);
            let accessToken = null;
            let refreshToken = null;
            
            if (hash) {
                const hashParams = new URLSearchParams(hash);
                accessToken = hashParams.get('access_token');
                refreshToken = hashParams.get('refresh_token');
                
                // Clear hash immediately to prevent token exposure in:
                // - Browser history
                // - Server logs (if URL is logged)
                // - Referrer headers
                // Use replaceState to remove from browser history
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                } else {
                    window.location.hash = '';
                }
            }
            
            // If we have OAuth tokens, handle OAuth login first
            if (accessToken) {
                if (!supabaseClient) {
                    showMessage('Authentication service unavailable. Please try again.', 'error');
                    showLogin();
                    return;
                }
                
                try {
                    // Exchange tokens for session with timeout protection
                    const setSessionPromise = supabaseClient.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('OAuth session setup timeout')), 10000)
                    );
                    
                    const { data, error } = await Promise.race([setSessionPromise, timeoutPromise]);
                    
                    // Clear token variables immediately after use
                    accessToken = null;
                    refreshToken = null;
                    
                    if (error) {
                        showMessage('Authentication failed. Please try again.', 'error');
                        showLogin();
                        return;
                    }
                    
                    currentUser = data.user;
                    await loadUserData();
                    showDashboard();
                    return;
                } catch (error) {
                    // Clear token variables on error
                    accessToken = null;
                    refreshToken = null;
                    showMessage('Authentication failed. Please try again.', 'error');
                    showLogin();
                    return;
                }
            }
            
            // Check if supabaseClient is available
            if (!supabaseClient) {
                console.log('No Supabase client available, showing login');
                showLogin();
                return;
            }
            
            // Check for saved login first (with timeout to prevent hanging)
            try {
                const checkLoginPromise = checkSavedLogin();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Login check timeout')), 12000)
                );
                
                const savedLoginResult = await Promise.race([checkLoginPromise, timeoutPromise]);
                
                if (savedLoginResult) {
                    console.log('Saved login found');
                    // Load user data and show dashboard
                    if (currentUser) {
                        await loadUserData();
                        showDashboard();
                    }
                    return;
                }
            } catch (error) {
                // Login check failed or timed out, continuing to session check
                // Don't log error.message to prevent information disclosure
                // Don't show login yet - continue to session check
            }
            
            try {
                console.log('Checking for existing session...');
                
                // Add timeout to prevent hanging
                const sessionPromise = supabaseClient.auth.getSession();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Session check timeout')), 10000)
                );
                
                const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
                
                if (session) {
                    console.log('Found existing session');
                    currentUser = session.user;
                    await loadUserData();
                    showDashboard();
                    // Ensure login screen is hidden
                    const loginElement = document.getElementById('login');
                    if (loginElement) {
                        loginElement.classList.add('hidden');
                    }
                } else {
                    console.log('No session found, showing login');
                    showLogin();
                }
            } catch (error) {
                console.error('Auth error:', error);
                console.log('Showing login screen');
                showLogin();
            }
        }
        
        async function loadUserData() {
            try {
                
                // Ensure user has a profile record
                await ensureUserProfile();
                
                // Load display name from Supabase profile
                let displayName = currentUser.email.split('@')[0]; // Default fallback
                
                try {
                    const { data, error } = await supabaseClient
                        .from('profiles')
                        .select('display_name')
                        .eq('id', currentUser.id)
                        .single();
                    
                    if (!error && data && data.display_name) {
                        displayName = data.display_name;
                    } else {
                    }
                } catch (error) {
                    console.warn('Could not load display name from Supabase:', error);
                }
                
                const displayNameElement = document.getElementById('profileDisplayName');
                const previewNameElement = document.getElementById('preview-name');
                
                if (displayNameElement) displayNameElement.value = displayName;
                if (previewNameElement) {
                    previewNameElement.textContent = displayName;
                    // Use fixed 1.75rem to match public.html - CSS handles font size
                    previewNameElement.style.setProperty('font-size', '1.75rem');
                }
                
                // Reapply theme to ensure display name color is correct
                if (currentList && currentList.theme) {
                    applyTheme();
                }
                
                // Load all user collections from database
                await loadUserCollections();
                
                // If no collections exist, start with empty state
                // Don't auto-load any collection on refresh - user must manually select
                currentList = null;
                links = [];
                renderCollections();
                renderLinks(); // This will show empty state
                updatePreview(); // This will show empty preview
                
                if (collections.length === 0) {
                    showMessage('Welcome! Create a new collection to get started.', 'success');
                } else {
                    showMessage('Welcome back! Select a collection from the sidebar to begin editing.', 'success');
                }
                
                
            } catch (error) {
                console.error('Error loading user data:', error);
                // Don't log error.stack to prevent information disclosure
                // Create local fallback
                createLocalFallback();
            }
        }

        async function ensureUserProfile() {
            try {
                
                // Check if profile exists
                const { data: existingProfile, error: fetchError } = await supabaseClient
                    .from('profiles')
                    .select('id')
                    .eq('id', currentUser.id)
                    .single();
                
                if (fetchError && fetchError.code === 'PGRST116') {
                    // Profile doesn't exist, create it
                    const handle = 'user' + currentUser.id.substring(0, 8);
                    const { error: insertError } = await supabaseClient
                        .from('profiles')
                        .insert({
                            id: currentUser.id,
                            display_name: currentUser.email.split('@')[0],
                            handle: handle,
                            created_at: new Date().toISOString()
                        });
                    
                    if (insertError) {
                        console.error('Error creating profile:', insertError);
                        throw insertError;
                    }
                } else if (fetchError) {
                    console.error('Error checking profile:', fetchError);
                    throw fetchError;
                } else {
                }
            } catch (error) {
                console.error('Error ensuring user profile:', error);
                throw error;
            }
        }

        async function loadUserCollections() {
            try {
                console.log('Loading user collections from database...');
                const { data, error } = await supabaseClient
                    .from('link_lists')
                    .select('*')
                    .eq('owner_id', currentUser.id)
                    .order('created_at', { ascending: false });
                
                console.log('🔍 Raw collection data from database:', data);
                if (data && data.length > 0) {
                    console.log('🔍 First collection theme:', data[0].theme);
                    console.log('🔍 First collection theme type:', typeof data[0].theme);
                }
                
                if (error) {
                    console.error('Error loading collections:', error);
                    throw error;
                }
                
                // Slugs are stored as plain text, no need to decode
                if (data) {
                    data.forEach(collection => {
                        // Keep slug as-is since it's stored as plain text
                        if (collection.slug) {
                            collection.slug = collection.slug;
                        }
                    });
                }
                collections = data || [];
                console.log('Loaded collections:', collections.length);
                
                // Load links for each collection
                for (let collection of collections) {
                    await loadCollectionLinks(collection);
                }
                
                // Set the first collection as current if we have collections
                if (collections.length > 0) {
                    currentList = collections[0];
                    console.log('Set current list to first collection:', currentList.slug, 'ID:', currentList.id);
                    console.log('Collection has links:', currentList.links ? currentList.links.length : 'undefined');
                }
                
            } catch (error) {
                console.error('Error loading collections:', error);
                collections = [];
            }
        }
        async function loadCollectionLinks(collection) {
            try {
                console.log(`Loading links for collection: ${collection.slug} (ID: ${collection.id})`);
                const { data, error } = await supabaseClient
                    .from('link_items')
                    .select('*')
                    .eq('list_id', collection.id)
                    .order('order_index', { ascending: true });
                
                if (error) {
                    console.error('Error loading links for collection:', collection.slug, error);
                    collection.links = [];
                    return;
                }
                
                collection.links = data || [];
                
                // Sort links by order_index, then by created_at
                if (collection.links && collection.links.length > 0) {
                    collection.links.sort((a, b) => {
                        const posA = a.order_index !== null && a.order_index !== undefined ? a.order_index : Infinity;
                        const posB = b.order_index !== null && b.order_index !== undefined ? b.order_index : Infinity;
                        if (posA !== posB) return posA - posB;
                        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                    });
                }
                
                // Fix: Ensure all loaded links are visible (temporary fix for existing data)
                let hasInvisibleLinks = false;
                collection.links.forEach(link => {
                    if (link.visible === false || link.visible === undefined) {
                        console.log(`Fixing visibility for link: ${link.title} (was: ${link.visible})`);
                        link.visible = true;
                        hasInvisibleLinks = true;
                    }
                });
                
                // Note: Database update for invisible links skipped - visible column doesn't exist
                if (hasInvisibleLinks) {
                    console.log('Fixed invisible links in memory (database update skipped - visible column not available)');
                }
                
                console.log(`Loaded ${collection.links.length} links for collection: ${collection.slug}`);
                console.log('Links data:', data);
                
            } catch (error) {
                console.error('Error loading collection links:', error);
                collection.links = [];
            }
        }
        async function createDefaultCollection() {
            try {
                console.log('Creating default collection...');
                
                // Check if a collection already exists
                const { data: existing, error: checkError } = await supabaseClient
                    .from('link_lists')
                    .select('id, slug, name, visibility, passkey, theme, owner_id, created_at, presentation_data, project_slug')
                    .eq('owner_id', currentUser.id)
                    .eq('slug', 'my-links')
                    .single();
                
                if (existing && !checkError) {
                    console.log('Default collection already exists, loading it...');
                    // Slug is stored as plain text, no need to decode
                    if (existing.slug) {
                        existing.slug = existing.slug;
                    }
                    collections = [existing];
                    existing.links = [];
                    currentList = existing;
                    return existing;
                }
                
                // Create new collection if none exists
                const { data, error } = await supabaseClient
                    .from('link_lists')
                    .insert({
                        owner_id: currentUser.id,
                        slug: 'my-links',
                        visibility: 'public',
                        theme: theme
                    })
                    .select()
                    .single();
                
                if (error) {
                    console.error('Error creating default collection:', error);
                    throw error;
                }
                
                // Slug is stored as plain text, no need to decode
                if (data.slug) {
                    data.slug = data.slug;
                }
                collections = [data];
                data.links = [];
                currentList = data;
                console.log('Default collection created:', data);
                
            } catch (error) {
                console.error('Error creating default collection:', error);
                // Fallback to local collection
                const localCollection = {
                    id: 'local-' + Date.now(),
                    slug: 'my-links',
                    visibility: 'public',
                    theme: theme,
                    owner_id: currentUser.id,
                    links: []
                };
                collections = [localCollection];
            }
        }
        
        function createLocalFallback() {
            console.log('Creating local fallback...');
            const displayName = currentUser.email.split('@')[0];
            const displayNameElement = document.getElementById('profileDisplayName');
            const previewNameElement = document.getElementById('preview-name');
            
            if (displayNameElement) displayNameElement.value = displayName;
            if (previewNameElement) {
                previewNameElement.textContent = displayName;
                // Apply dynamic font size based on text length
                // Use fixed 1.75rem to match public.html - CSS handles font size
                previewNameElement.style.setProperty('font-size', '1.75rem');
            }
            // Note: preview-bio was removed, so we skip it
            
            const localCollection = {
                id: 'local-' + Date.now(),
                slug: 'my-links',
                visibility: 'public',
                theme: theme,
                owner_id: currentUser.id
            };
            
            collections = [localCollection];
            currentList = localCollection;
            links = [];
            
            // Reapply theme to ensure display name color is correct
            if (currentList && currentList.theme) {
                applyTheme();
            }
            
            // Collection name input removed from header - no longer needed
            // document.getElementById('project-slug').value = localCollection.slug;
            
            // Set default visibility to public
            const visibilitySelect = document.getElementById('visibility-select');
            const headerVisibilitySelect = document.getElementById('header-visibility-select');
            
            if (visibilitySelect) visibilitySelect.value = 'public';
            if (headerVisibilitySelect) headerVisibilitySelect.value = 'public';
            const headerPasskeyGroup = document.getElementById('header-passkey-group');
            if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'none';
            
            renderCollections();
            renderLinks();
            updatePreview();
            
            showMessage('App ready! (Local mode - changes will sync when connection improves)', 'success');
        }
        
        async function syncWithDatabase() {
            try {
                console.log('Attempting to sync with database...');
                
                // Try to create profile
                try {
                    await supabaseClient.from('profiles').insert({
                        id: currentUser.id,
                        display_name: currentUser.email.split('@')[0],
                        bio: ''
                    });
                    console.log('Profile synced to database');
                } catch (e) {
                    console.log('Profile sync failed (may already exist)');
                }
                
                // Try to create collection in database
                try {
                    const { data, error } = await supabaseClient
                        .from('link_lists')
                        .insert({
                            owner_id: currentUser.id,
                            slug: currentList.slug,
                            visibility: currentList.visibility,
                            theme: currentList.theme
                        })
                        .select()
                        .single();
                    
                    if (!error && data) {
                        console.log('Collection synced to database:', data);
                        currentList.id = data.id; // Update with real ID
                        collections[0] = currentList;
                    }
                } catch (e) {
                    console.log('Collection sync failed:', e);
                }
                
            } catch (error) {
                console.log('Database sync failed, continuing in local mode:', error);
            }
        }
        
        
        function renderCollections() {
            const container = document.getElementById('collections-list');
            container.innerHTML = '';
            
            collections.forEach(collection => {
                const item = document.createElement('div');
                item.className = 'collection-item';
                if (currentList && currentList.id === collection.id) {
                    item.classList.add('active');
                }
                
                const linkCount = collection.links ? collection.links.length : 0;
                let visibilityIcon = '🌐';
                let visibilityText = 'public';
                
                if (collection.passkey && collection.passkey.trim() !== '') {
                    visibilityIcon = '🔑';
                    visibilityText = 'passkey';
                } else if (collection.visibility === 'private') {
                    visibilityIcon = '🔒';
                    visibilityText = 'private';
                }
                
                const isActive = currentList && currentList.id === collection.id;
                
                // Create collection header
                const header = document.createElement('div');
                header.className = 'collection-header';
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'collection-name';
                
                // Display title and conference separately if available
                const presentationData = collection.presentation_data || {};
                const title = presentationData.title || '';
                const conference = presentationData.conference || '';
                
                if (title || conference) {
                    // Show title and conference separately
                    if (title) {
                        const titleSpan = document.createElement('span');
                        titleSpan.className = 'collection-title';
                        titleSpan.textContent = title;
                        nameDiv.appendChild(titleSpan);
                    }
                    if (conference) {
                        const conferenceSpan = document.createElement('span');
                        conferenceSpan.className = 'collection-conference';
                        conferenceSpan.textContent = conference;
                        nameDiv.appendChild(conferenceSpan);
                    }
                } else {
                    // Fallback to slug if no presentation data
                    nameDiv.textContent = collection.slug || 'Untitled';
                }
                
                header.appendChild(nameDiv);
                
                // Create collection info
                const infoDiv = document.createElement('div');
                infoDiv.className = 'collection-info';
                
                const visibilitySpan = document.createElement('span');
                visibilitySpan.className = 'collection-visibility';
                visibilitySpan.textContent = visibilityIcon + ' ' + visibilityText;
                
                // Create action buttons
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'collection-actions';
                
                const duplicateBtn = document.createElement('button');
                duplicateBtn.className = 'btn-icon';
                duplicateBtn.title = 'Duplicate';
                duplicateBtn.textContent = '📋';
                duplicateBtn.onclick = function(e) { e.stopPropagation(); duplicateCollection(collection.id); };
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn-icon';
                deleteBtn.title = 'Delete';
                deleteBtn.textContent = '🗑️';
                deleteBtn.onclick = function(e) { e.stopPropagation(); deleteCollection(collection.id); };
                
                actionsDiv.appendChild(duplicateBtn);
                actionsDiv.appendChild(deleteBtn);
                
                const linksSpan = document.createElement('span');
                linksSpan.className = 'collection-links';
                linksSpan.textContent = linkCount + ' links';
                
                infoDiv.appendChild(visibilitySpan);
                infoDiv.appendChild(actionsDiv);
                infoDiv.appendChild(linksSpan);
                
                item.appendChild(header);
                item.appendChild(infoDiv);
                
                // Add active status if needed
                if (isActive) {
                    const statusDiv = document.createElement('div');
                    statusDiv.className = 'collection-status';
                    statusDiv.textContent = 'Active';
                    item.appendChild(statusDiv);
                }
                item.onclick = (e) => {
                    // Don't trigger if clicking on action buttons
                    if (!e.target.closest('.collection-actions')) {
                        loadCollection(collection);
                    }
                };
                container.appendChild(item);
            });
        }
        
        async function loadCollection(collection) {
            console.log('Loading collection:', collection);
            currentList = collection;
            
            // Set the links array from the collection
            links = collection.links || [];
            console.log('Loaded', links.length, 'links for collection:', collection.slug);
            
            // Debug: Check visibility of loaded links
            if (links.length > 0) {
                links.forEach((link, index) => {
                    console.log(`Link ${index} visibility:`, { title: link.title, visible: link.visible });
                });
            }
            
            renderCollections();
            
            // Update UI
            // Collection name input removed from header - no longer needed
            // document.getElementById('project-slug').value = collection.slug || '';
            
            // Update visibility dropdowns
            const visibilitySelect = document.getElementById('visibility-select');
            const headerVisibilitySelect = document.getElementById('header-visibility-select');
            
            console.log('Loading collection visibility data:', {
                passkey: collection.passkey,
                visibility: collection.visibility,
                hasPasskey: !!collection.passkey,
                passkeyLength: collection.passkey ? collection.passkey.length : 0
            });
            
            let visibilityValue = 'public';
            const headerPasskeyGroup = document.getElementById('header-passkey-group');
            
            if (collection.passkey && collection.passkey.trim() !== '') {
                visibilityValue = 'passkey';
                if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'flex';
                console.log('Setting visibility to passkey');
            } else if (collection.visibility === 'private') {
                visibilityValue = 'private';
                if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'none';
                console.log('Setting visibility to private');
            } else {
                if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'none';
                console.log('Setting visibility to public');
            }
            
            // Update both dropdowns
            if (visibilitySelect) visibilitySelect.value = visibilityValue;
            if (headerVisibilitySelect) headerVisibilitySelect.value = visibilityValue;
            
            // Update passkey fields
            const passkeyValue = collection.passkey || '';
            const passkeyElement = document.getElementById('passkey');
            const headerPasskeyInput = document.getElementById('header-passkey');
            
            if (passkeyElement) passkeyElement.value = passkeyValue;
            if (headerPasskeyInput) headerPasskeyInput.value = passkeyValue;
            
            // Load presentation data
            if (collection.presentation_data) {
                console.log('Loading presentation data:', collection.presentation_data);
                document.getElementById('info-title').value = collection.presentation_data.title || '';
                document.getElementById('info-conference').value = collection.presentation_data.conference || '';
                document.getElementById('info-location').value = collection.presentation_data.location || '';
                document.getElementById('info-date').value = collection.presentation_data.date || '';
                
                // Load display checkbox states
                const displayTitleCheckbox = document.getElementById('display-title');
                const displayConferenceCheckbox = document.getElementById('display-conference');
                if (displayTitleCheckbox) {
                    displayTitleCheckbox.checked = collection.presentation_data.displayTitle !== false;
                }
                if (displayConferenceCheckbox) {
                    displayConferenceCheckbox.checked = collection.presentation_data.displayConference !== false;
                }
                
                // Update the preview with loaded data
                updateDynamicInfo();
            } else {
                console.log('No presentation data found for collection');
                // Clear the fields
                document.getElementById('info-title').value = '';
                document.getElementById('info-conference').value = '';
                document.getElementById('info-location').value = '';
                document.getElementById('info-date').value = '';
                
                // Set default checkbox states
                const displayTitleCheckbox = document.getElementById('display-title');
                const displayConferenceCheckbox = document.getElementById('display-conference');
                if (displayTitleCheckbox) displayTitleCheckbox.checked = true;
                if (displayConferenceCheckbox) displayConferenceCheckbox.checked = true;
                
                updateDynamicInfo();
            }
            
            // Load theme data
            if (collection.theme) {
                console.log('Loading theme data:', collection.theme);
                console.log('Theme type:', typeof collection.theme);
                console.log('Theme keys:', Object.keys(collection.theme));
                console.log('Theme stringified:', JSON.stringify(collection.theme, null, 2));
                // Apply theme to the preview
                applyThemeToPreview(collection.theme);
                // Update currentTheme to match collection theme
                currentTheme = { ...currentTheme, ...collection.theme };
                // Load theme into UI controls
                loadThemeIntoUI(collection.theme);
                // Also update form from theme to ensure all settings are loaded
                updateFormFromTheme();
            } else {
                console.log('No theme data found in collection');
            }
            
            renderLinks();
            updatePreview();
            
            // Apply theme to the newly created preview elements
            requestAnimationFrame(() => {
                applyTheme();
            });
            
            // Update QR code if on QR code tab
            // If QR code tab is active, refresh it to update URL
            const qrTab = document.getElementById('tab-qrcode');
            if (qrTab && qrTab.classList.contains('active')) {
                initQRCodeTab();
            }
        }
        function renderLinks() {
            console.log('renderLinks called, links array:', links);
            console.log('links length:', links ? links.length : 'links is undefined');
            
            const container = document.getElementById('links-list');
            if (!container) {
                console.log('ERROR: links-list container not found!');
                return;
            }
            
            container.innerHTML = '';
            
            // Clear any existing event listeners
            container.replaceWith(container.cloneNode(true));
            const newContainer = document.getElementById('links-list');
            
            links.forEach((link, index) => {
                const item = document.createElement('div');
                item.className = 'link-item';
                item.dataset.index = index;
                // Create drag column
                const dragColumn = document.createElement('div');
                dragColumn.className = 'link-drag-column';
                const dragHandle = document.createElement('div');
                dragHandle.className = 'drag-handle';
                dragHandle.draggable = true;
                dragHandle.textContent = '⋮⋮';
                dragColumn.appendChild(dragHandle);
                
                // Create image column
                const imageColumn = document.createElement('div');
                imageColumn.className = 'link-image-column';
                
                if (link.image) {
                    const imagePreview = document.createElement('div');
                    imagePreview.className = 'link-image-preview';
                    
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'link-image-container';
                    
                    const img = document.createElement('img');
                    img.src = link.image;
                    // Escape HTML in alt attribute to prevent XSS (though alt is generally safe)
                    img.alt = escapeHtml(link.title || 'Link image');
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.type = 'button';
                    removeBtn.className = 'btn-remove-link-image';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = function() { removeLinkImage(index); };
                    
                    const editBtn = document.createElement('button');
                    editBtn.type = 'button';
                    editBtn.className = 'btn-edit-link-image';
                    editBtn.title = 'Edit Image Position';
                    editBtn.textContent = '✏️';
                    editBtn.onclick = function() { toggleLinkImageEditor(index); };
                    
                    imageContainer.appendChild(img);
                    imagePreview.appendChild(imageContainer);
                    imagePreview.appendChild(removeBtn);
                    imagePreview.appendChild(editBtn);
                    imageColumn.appendChild(imagePreview);
                }
                
                const imageButtons = document.createElement('div');
                imageButtons.className = 'link-image-buttons';
                
                const fileBtn = document.createElement('button');
                fileBtn.type = 'button';
                fileBtn.className = 'btn btn-secondary btn-icon';
                fileBtn.title = 'Choose File';
                fileBtn.onclick = function() { openFileSelectorForLink(index); };
                fileBtn.innerHTML = '<span>📁</span>';
                
                const mediaBtn = document.createElement('button');
                mediaBtn.type = 'button';
                mediaBtn.className = 'btn btn-secondary btn-icon';
                mediaBtn.title = 'Media Library';
                mediaBtn.onclick = function() { openMediaLibraryForLinkEdit(index); };
                mediaBtn.innerHTML = '<span>📷</span>';
                
                imageButtons.appendChild(fileBtn);
                imageButtons.appendChild(mediaBtn);
                imageColumn.appendChild(imageButtons);
                
                // Create text column
                const textColumn = document.createElement('div');
                textColumn.className = 'link-text-column';
                
                const titleContainer = document.createElement('div');
                titleContainer.className = 'link-title-container';
                
                const titleDiv = document.createElement('div');
                titleDiv.className = 'link-title';
                titleDiv.contentEditable = true;
                titleDiv.dataset.field = 'title';
                titleDiv.dataset.index = index;
                // Use innerHTML to preserve HTML formatting (bold, italic, underline)
                // Sanitize HTML to prevent XSS attacks
                titleDiv.innerHTML = sanitizeHTML(link.title || 'Untitled Link');
                
                const rtfToolbar = document.createElement('div');
                rtfToolbar.className = 'link-rtf-toolbar';
                
                const boldBtn = document.createElement('button');
                boldBtn.type = 'button';
                boldBtn.className = 'rtf-btn';
                boldBtn.dataset.command = 'bold';
                boldBtn.title = 'Bold';
                boldBtn.innerHTML = '<strong>B</strong>';
                
                const italicBtn = document.createElement('button');
                italicBtn.type = 'button';
                italicBtn.className = 'rtf-btn';
                italicBtn.dataset.command = 'italic';
                italicBtn.title = 'Italic';
                italicBtn.innerHTML = '<em>I</em>';
                
                const underlineBtn = document.createElement('button');
                underlineBtn.type = 'button';
                underlineBtn.className = 'rtf-btn';
                underlineBtn.dataset.command = 'underline';
                underlineBtn.title = 'Underline';
                underlineBtn.innerHTML = '<u>U</u>';
                
                rtfToolbar.appendChild(boldBtn);
                rtfToolbar.appendChild(italicBtn);
                rtfToolbar.appendChild(underlineBtn);
                
                titleContainer.appendChild(titleDiv);
                titleContainer.appendChild(rtfToolbar);
                
                const urlDiv = document.createElement('div');
                urlDiv.className = 'link-url';
                urlDiv.contentEditable = true;
                urlDiv.dataset.field = 'url';
                urlDiv.dataset.index = index;
                urlDiv.textContent = link.url || 'No URL';
                
                textColumn.appendChild(titleContainer);
                textColumn.appendChild(urlDiv);
                
                // Create actions column
                const actionsColumn = document.createElement('div');
                actionsColumn.className = 'link-actions';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-ghost btn-sm';
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.onclick = function() { deleteLink(index); };
                
                actionsColumn.appendChild(deleteBtn);
                
                // Append all columns to item
                item.appendChild(dragColumn);
                item.appendChild(imageColumn);
                item.appendChild(textColumn);
                item.appendChild(actionsColumn);
                
                
                newContainer.appendChild(item);
                
                // Apply transform to the image if it exists (with delay to ensure DOM is ready)
                if (link.image) {
                    console.log(`DEBUG: Link ${index} has image, scheduling transform application`);
                    setTimeout(() => {
                        console.log(`DEBUG: About to apply transform to link ${index}`);
                        // Double-check that the element exists before applying transform
                        const linkItem = document.querySelector(`[data-index="${index}"]`);
                        if (linkItem) {
                            console.log(`DEBUG: Link item found for index ${index}, applying transform`);
                            applyLinkImgTransform(index);
                        } else {
                            console.log(`DEBUG: Link item not found for index ${index}, retrying...`);
                            // Retry after a longer delay
                            setTimeout(() => {
                                const retryItem = document.querySelector(`[data-index="${index}"]`);
                                if (retryItem) {
                                    console.log(`DEBUG: Retry successful for index ${index}`);
                                    applyLinkImgTransform(index);
                                } else {
                                    console.log(`DEBUG: Retry failed for index ${index}`);
                                }
                            }, 50);
                        }
                    }, 50);
                } else {
                    console.log(`DEBUG: Link ${index} has no image`);
                }
            });
            
            // Add inline editing event listeners
            setupInlineEditing(newContainer);
            
            // Add drag and drop to the container
            setupDragAndDrop(newContainer);
            
            console.log('renderLinks complete, container children count:', newContainer.children.length);
            
            // Debug link images after rendering
            setTimeout(() => {
                debugLinkImages();
            }, 100);
            
            // Show/hide no-links message
            const noLinksMessage = document.getElementById('no-links-message');
            if (noLinksMessage) {
                if (links.length === 0) {
                    noLinksMessage.style.display = 'block';
                } else {
                    noLinksMessage.style.display = 'none';
                }
            }
        }
        
        function setupInlineEditing(container) {
            // Handle inline editing for link titles and URLs
            container.addEventListener('blur', (e) => {
                if (e.target.hasAttribute('contenteditable') && e.target.hasAttribute('data-field')) {
                    const field = e.target.getAttribute('data-field');
                    const index = parseInt(e.target.getAttribute('data-index'));
                    // Sanitize HTML when reading from contenteditable to prevent XSS
                    let newValue = field === 'title' ? sanitizeHTML(e.target.innerHTML) : e.target.textContent.trim();
                    
                    // If it's a URL field, validate and fix the URL
                    if (field === 'url' && newValue) {
                        const originalValue = newValue;
                        const validationResult = validateAndFixUrl(newValue);
                        
                        if (validationResult.isValid) {
                            if (validationResult.correctedUrl !== newValue) {
                                newValue = validationResult.correctedUrl;
                                // Update the display with the corrected URL
                                e.target.textContent = newValue;
                                // Show a brief message that the URL was corrected
                                showMessage(`URL corrected: ${originalValue} → ${newValue}`, 'info');
                            }
                        } else {
                            // Invalid URL - show specific error and revert
                            const errorMessage = getUrlValidationError(originalValue);
                            showMessage(errorMessage, 'error');
                            e.target.textContent = links[index][field]; // Revert to original value
                            return; // Don't update the link
                        }
                    }
                    
                    if (links[index] && links[index][field] !== newValue) {
                        links[index][field] = newValue;
                        updatePreview();
                        
                        // Save link to database immediately
                        if (links[index].id && !links[index].id.startsWith('local-')) {
                            saveLinkToDatabase(links[index]);
                        }
                        
                        showMessage('Link updated!', 'success');
                    }
                    
                    // Remove editing class when blurring
                    const titleContainer = e.target.closest('.link-title-container');
                    if (titleContainer) {
                        titleContainer.classList.remove('editing');
                    }
                }
            }, true);
            
            // Handle Enter key to save inline edits
            container.addEventListener('keydown', (e) => {
                if (e.target.hasAttribute('contenteditable') && e.target.hasAttribute('data-field')) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                    }
                }
            }, true);
            
            // Handle RTF formatting for link titles
            container.addEventListener('click', (e) => {
                console.log('Click event on container:', e.target, 'Class list:', e.target.classList);
                // Check if clicked element is an RTF button or inside one
                const rtfButton = e.target.closest('.rtf-btn');
                if (rtfButton) {
                    console.log('RTF button clicked:', rtfButton);
                    e.preventDefault();
                    e.stopPropagation();
                    const button = rtfButton;
                    const command = button.getAttribute('data-command');
                    const titleContainer = button.closest('.link-title-container');
                    const titleElement = titleContainer.querySelector('.link-title');
                    
                    console.log('Command:', command, 'Title container:', titleContainer, 'Title element:', titleElement);
                    
                    if (titleElement) {
                        // Focus the title element and ensure it's ready
                        titleElement.focus();
                        console.log('Focused title element');
                        
                        // Small delay to ensure focus is set
                        setTimeout(() => {
                            // Execute the formatting command
                            let result = false;
                            try {
                                result = document.execCommand(command, false, null);
                                console.log('ExecCommand result:', result);
                            } catch (e) {
                                console.log('ExecCommand failed, trying modern approach:', e);
                                // Fallback for modern browsers
                                if (command === 'bold') {
                                    document.execCommand('bold', false, null);
                                } else if (command === 'italic') {
                                    document.execCommand('italic', false, null);
                                } else if (command === 'underline') {
                                    document.execCommand('underline', false, null);
                                }
                                result = true;
                            }
                            
                            // Update the link data
                            const index = parseInt(titleElement.getAttribute('data-index'));
                            if (links[index]) {
                                // Sanitize HTML when storing to prevent XSS
                                links[index].title = sanitizeHTML(titleElement.innerHTML);
                                console.log('Updated link title:', links[index].title);
                                updatePreview();
                            }
                            
                            // Update button states
                            setTimeout(() => {
                                updateLinkRTFButtonStates(titleContainer);
                            }, 50);
                        }, 10);
                    } else {
                        console.log('Title element not found');
                    }
                }
            });
            
            // Update RTF button states when clicking in link titles
            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('link-title')) {
                    const titleContainer = e.target.closest('.link-title-container');
                    titleContainer.classList.add('editing');
                    setTimeout(() => {
                        updateLinkRTFButtonStates(titleContainer);
                    }, 10);
                }
            });

            // Keep RTF toolbar visible when clicking on it
            container.addEventListener('click', (e) => {
                if (e.target.closest('.link-rtf-toolbar')) {
                    e.stopPropagation();
                }
            });
            
            // Update RTF button states on selection change
            container.addEventListener('selectionchange', () => {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('link-title')) {
                    const titleContainer = activeElement.closest('.link-title-container');
                    if (titleContainer) {
                        updateLinkRTFButtonStates(titleContainer);
                    }
                }
            });
        }
        function setupDragAndDrop(container) {
            let draggedIndex = null;
            let dragOverIndex = null;
            
            container.addEventListener('dragstart', (e) => {
                // Only allow drag if the drag handle is clicked
                if (!e.target.classList.contains('drag-handle')) return;
                
                const item = e.target.closest('.link-item');
                if (!item) return;
                
                draggedIndex = parseInt(item.dataset.index);
                console.log('Drag started for index:', draggedIndex);
                
                e.dataTransfer.setData('text/plain', draggedIndex);
                e.dataTransfer.effectAllowed = 'move';
                item.classList.add('dragging');
                
                // Add visual feedback to all items
                container.querySelectorAll('.link-item').forEach((el, index) => {
                    if (index !== draggedIndex) {
                        el.style.transition = 'all 0.2s ease';
                    }
                });
            });
            
            container.addEventListener('dragend', (e) => {
                const item = e.target.closest('.link-item');
                if (!item) return;
                
                console.log('Drag ended');
                item.classList.remove('dragging');
                draggedIndex = null;
                dragOverIndex = null;
                
                // Reset all items
                container.querySelectorAll('.link-item').forEach(el => {
                    el.style.backgroundColor = '';
                    el.style.transform = '';
                    el.style.transition = '';
                });
            });
            
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                
                // Find the closest link item or use the container
                let item = e.target.closest('.link-item');
                if (!item) {
                    // If not over a specific item, find the closest one based on position
                    const rect = container.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const items = Array.from(container.querySelectorAll('.link-item'));
                    
                    for (let i = 0; i < items.length; i++) {
                        const itemRect = items[i].getBoundingClientRect();
                        const itemY = itemRect.top - rect.top;
                        const itemHeight = itemRect.height;
                        
                        if (y >= itemY && y <= itemY + itemHeight) {
                            item = items[i];
                            break;
                        } else if (y < itemY) {
                            // If we're above this item, use it as the target
                            item = items[i];
                            break;
                        }
                    }
                    
                    // If we're below all items, use the last one
                    if (!item && items.length > 0) {
                        item = items[items.length - 1];
                    }
                }
                
                if (item && !item.classList.contains('dragging')) {
                    const currentIndex = parseInt(item.dataset.index);
                    if (currentIndex !== dragOverIndex) {
                        // Reset previous highlight
                        container.querySelectorAll('.link-item').forEach(el => {
                            el.style.backgroundColor = '';
                            el.style.transform = '';
                        });
                        
                        // Highlight current item
                        item.style.backgroundColor = '#f0f9ff';
                        item.style.borderColor = '#3b82f6';
                        
                        // Add subtle animation for items that will shift
                        if (draggedIndex !== null) {
                            if (currentIndex < draggedIndex) {
                                item.style.transform = 'translateY(4px)';
                            } else if (currentIndex > draggedIndex) {
                                item.style.transform = 'translateY(-4px)';
                            }
                        }
                        
                        dragOverIndex = currentIndex;
                    }
                }
            });
            
            container.addEventListener('dragenter', (e) => {
                e.preventDefault();
            });
            
            container.addEventListener('dragleave', (e) => {
                // Only clear if we're actually leaving the container
                if (!container.contains(e.relatedTarget)) {
                    container.querySelectorAll('.link-item').forEach(el => {
                        el.style.backgroundColor = '';
                        el.style.transform = '';
                    });
                    dragOverIndex = null;
                }
            });
            
            container.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Drop event triggered');
                
                // Find the target item using the same logic as dragover
                let item = e.target.closest('.link-item');
                if (!item) {
                    const rect = container.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const items = Array.from(container.querySelectorAll('.link-item'));
                    
                    for (let i = 0; i < items.length; i++) {
                        const itemRect = items[i].getBoundingClientRect();
                        const itemY = itemRect.top - rect.top;
                        const itemHeight = itemRect.height;
                        
                        if (y >= itemY && y <= itemY + itemHeight) {
                            item = items[i];
                            break;
                        } else if (y < itemY) {
                            item = items[i];
                            break;
                        }
                    }
                    
                    if (!item && items.length > 0) {
                        item = items[items.length - 1];
                    }
                }
                
                if (!item) return;
                
                const toIndex = parseInt(item.dataset.index);
                
                console.log('Moving from index', draggedIndex, 'to index', toIndex);
                
                if (draggedIndex !== null && draggedIndex !== toIndex && draggedIndex >= 0 && toIndex >= 0) {
                    reorderLinks(draggedIndex, toIndex);
                }
                
                // Reset all items
                container.querySelectorAll('.link-item').forEach(el => {
                    el.style.backgroundColor = '';
                    el.style.transform = '';
                    el.style.borderColor = '';
                });
            });
        }
        
        async function reorderLinks(fromIndex, toIndex) {
            console.log('Reordering links from', fromIndex, 'to', toIndex);
            
            if (fromIndex === toIndex) return;
            
            const link = links.splice(fromIndex, 1)[0];
            links.splice(toIndex, 0, link);
            
            // Update positions in local array
            for (let i = 0; i < links.length; i++) {
                links[i].position = i * 100;
            }
            
            console.log('Links reordered, new order:', links.map(l => l.title));
            
            renderLinks();
            updatePreview();
            
            // Try to sync to database in background (only for real database links)
            try {
                if (!currentList.id.startsWith('local-')) {
                    console.log('Syncing reorder to database...');
                    for (let i = 0; i < links.length; i++) {
                        if (!links[i].id.startsWith('local-')) {
                            await supabaseClient
                                .from('link_items')
                                .update({ position: i * 100 })
                                .eq('id', links[i].id);
                        }
                    }
                    console.log('Reorder synced to database');
                }
            } catch (error) {
                console.log('Reorder sync failed:', error);
            }
        }
        
        async function addLink() {
            console.log('addLink called');
            console.log('currentList:', currentList);
            console.log('collections:', collections);
            console.log('collections length:', collections ? collections.length : 'collections is undefined');
            console.log('links array:', links);
            console.log('links length:', links ? links.length : 'links is undefined');
            
            const titleElement = document.getElementById('new-link-title');
            const title = titleElement ? titleElement.value.trim() : '';
            let url = document.getElementById('new-link-url').value.trim();
            const imageFile = document.getElementById('new-link-image').files[0];
            const selectedImageUrl = window.selectedLinkImageUrl || null;
            
            console.log('Title element:', titleElement);
            console.log('Title value:', titleElement ? titleElement.value : 'undefined');
            console.log('Title trimmed:', title);
            console.log('Title length:', title.length);
            console.log('Title empty check:', !title);
            console.log('URL:', url);
            
            // Hide any previous error messages
            hideAddLinkError();
            
            // Check for missing fields first
            if (!title || title.length === 0 || title.trim().length === 0) {
                console.log('No title provided - showing error message');
                showAddLinkError('Please enter a link title');
                return;
            }
            
            if (!url) {
                console.log('No URL provided');
                showAddLinkError('Please enter a URL');
                return;
            }
            
            // Validate and fix URL
            const originalUrl = url;
            const validationResult = validateAndFixUrl(url);
            
            if (validationResult.isValid) {
                if (validationResult.correctedUrl !== url) {
                    // Update the input field with the corrected URL
                    document.getElementById('new-link-url').value = validationResult.correctedUrl;
                    url = validationResult.correctedUrl;
                    // Show a brief message that the URL was corrected
                    showMessage(`URL corrected: ${originalUrl} → ${url}`, 'info');
                }
            } else {
                // Invalid URL - show specific error and don't proceed
                console.log('URL validation failed for:', url);
                const errorMessage = getUrlValidationError(url);
                console.log('Error message:', errorMessage);
                showAddLinkError(errorMessage);
                return;
            }
            
            if (!currentList) {
                console.log('ERROR: currentList is null');
                console.log('Attempting to create a fallback collection...');
                
                // Try to create a fallback collection
                try {
                    await createDefaultCollection();
                    if (collections.length > 0) {
                        await loadCollection(collections[0]);
                        console.log('Fallback collection created and loaded');
                        // Retry adding the link
                        addLink();
                        return;
                    }
                } catch (fallbackError) {
                    console.error('Failed to create fallback collection:', fallbackError);
                }
                
                showAddLinkError('Please wait while we load your collections, or create a new collection first');
                return;
            }
            
            if (!links) {
                console.log('ERROR: links array is undefined, initializing...');
                links = [];
            }
            
            // Create local link immediately
            const localLink = {
                id: 'local-link-' + Date.now(),
                list_id: currentList.id,
                title: title,
                url: url,
                image: selectedImageUrl || (imageFile ? await convertImageToBase64(imageFile) : null),
                imagePosition: { x: 50, y: 50 },
                imageScale: 100,
                position: links.length * 100,
                visible: true,
                created_at: new Date().toISOString()
            };
            
            console.log('Created local link:', localLink);
            
            // Add to local array
            links.push(localLink);
            console.log('Added to links array, new length:', links.length);
            
            // Update the current collection's links array
            if (currentList) {
                currentList.links = [...links];
            }
            
            // Clear form
            document.getElementById('new-link-title').value = '';
            document.getElementById('new-link-url').value = '';
            clearLinkImage();
            window.selectedLinkImageUrl = null;
            
            // Hide any error messages
            hideAddLinkError();
            
            // Update UI
            renderLinks();
            updatePreview();
            renderCollections(); // Update collection list to show new link count
            showMessage('Link added successfully!', 'success');
            
            // Try to sync to database in background
            try {
                // Only sync to database if we have a real collection ID
                if (!currentList.id.startsWith('local-')) {
                    console.log('Attempting to sync link to database...');
                    console.log('Current list ID:', currentList.id);
                console.log('Link data to sync:', {
                    list_id: currentList.id,
                    title: title,
                    url: url,
                    image: localLink.image ? 'present' : 'none'
                });
                    
                const { data, error } = await supabaseClient
                    .from('link_items')
                    .insert({
                        list_id: currentList.id,
                        title: title,
                        url: url,
                        image: localLink.image || null
                    })
                    .select()
                    .single();
                    
                    if (error) {
                        console.error('Link sync failed:', error);
                        // Don't log error.details or error.hint to prevent information disclosure
                    } else {
                        console.log('Link synced to database successfully:', data);
                        // Update local link with real ID
                        localLink.id = data.id;
                    }
                } else {
                    console.log('Skipping database sync for local collection (ID starts with local-)');
                }
            } catch (error) {
                console.log('Link sync failed, keeping local only:', error);
            }
        }
        
        async function editLink(index) {
            const link = links[index];
            const newTitle = prompt('Edit title:', link.title);
            const newUrl = prompt('Edit URL:', link.url);
            
            if (newTitle === null || newUrl === null) return;
            
            try {
                const { error } = await supabaseClient
                    .from('link_items')
                    .update({
                        title: newTitle,
                        url: newUrl
                    })
                    .eq('id', link.id);
                
                if (error) throw error;
                
                links[index] = { ...link, title: newTitle, url: newUrl };
                renderLinks();
                updatePreview();
                showMessage('Link updated successfully!', 'success');
            } catch (error) {
                console.error('Error updating link:', error);
                showMessage('Failed to update link. Please try again.', 'error');
            }
        }
        
        async function deleteLink(index) {
            console.log('Deleting link at index:', index);
            console.log('Link to delete:', links[index]);
            
            try {
                // Only try to delete from database if the link has a real ID (not a local one)
                if (links[index].id && !links[index].id.startsWith('local-')) {
                    console.log('Deleting from database:', links[index].id);
                    const { error } = await supabaseClient
                        .from('link_items')
                        .delete()
                        .eq('id', links[index].id);
                    
                    if (error) {
                        console.error('Database delete error:', error);
                        throw error;
                    }
                } else {
                    console.log('Deleting local link only');
                }
                
                // Remove from local array
                links.splice(index, 1);
                console.log('Link removed from array, new length:', links.length);
                
                // Update the current collection's links array
                if (currentList) {
                    currentList.links = [...links];
                }
                
                // Update UI
                renderLinks();
                updatePreview();
                renderCollections(); // Update collection list to show new link count
                showMessage('Link deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting link:', error);
                showMessage('Failed to delete link. Please try again.', 'error');
            }
        }
        function updatePreview() {
            console.log('updatePreview called, links array:', links);
            console.log('links length:', links ? links.length : 'links is undefined');
            
            // Ensure all links are visible (fallback fix)
            if (links && links.length > 0) {
                links.forEach((link, index) => {
                    if (link.visible === false || link.visible === undefined) {
                        console.log(`Fixing visibility in updatePreview for link: ${link.title} (was: ${link.visible})`);
                        link.visible = true;
                    }
                });
            }
            
            // Debug: Log each link's image data
            if (links && links.length > 0) {
                links.forEach((link, index) => {
                    if (link.image) {
                        console.log(`Link ${index} image data:`, {
                            title: link.title,
                            hasImage: !!link.image,
                            imagePosition: link.imagePosition,
                            imageScale: link.imageScale
                        });
                    }
                });
            }
            
            const previewLinks = document.getElementById('preview-links');
            if (!previewLinks) {
                console.log('ERROR: preview-links container not found!');
                return;
            }
            
            previewLinks.innerHTML = '';
            
            links.forEach((link, index) => {
                console.log(`Processing link ${index}:`, link);
                if (link.visible === false) {
                    console.log(`Link ${index} is not visible, skipping`);
                    return;
                }
                
                const linkEl = document.createElement('a');
                const buttonStyleSelect = document.getElementById('button-style');
                const buttonStyle = buttonStyleSelect ? buttonStyleSelect.value : 'soft';
                linkEl.className = `preview-link ${buttonStyle}`;
                
                // Use tracking URL if link has an ID (saved to database)
                // Format: https://academiqr.com/api/track/{link-id}
                if (link.id && !link.id.startsWith('local-')) {
                    linkEl.href = `https://academiqr.com/api/track/${link.id}`;
                    console.log(`✅ Analytics tracking enabled for "${link.title}": /api/track/${link.id}`);
                } else {
                    // For unsaved links, use direct URL
                    linkEl.href = link.url;
                    console.log(`⚠️ Direct link (no tracking) for "${link.title}": ${link.url}`);
                }
                linkEl.target = '_blank';
                linkEl.rel = 'noopener noreferrer';
                
                // Set font size immediately on the link element (matching public.html)
                // Start with 1.25rem like public.html, then applyButtonStyles will override to 1.375rem minimum
                linkEl.style.setProperty('font-size', '1.25rem', 'important');
                linkEl.style.fontSize = '1.25rem';
                console.log(`🔍 updatePreview: Set initial font-size to 1.25rem for link "${link.title}"`);
                
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'preview-link-image-wrapper';
                
                const imageDiv = document.createElement('div');
                imageDiv.className = 'preview-link-image';
                
                if (link.image) {
                    const img = document.createElement('img');
                    img.src = link.image;
                    img.alt = 'Link Icon';
                    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                    imageDiv.appendChild(img);
                } else {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-link';
                    icon.style.color = '#6b7280';
                    imageDiv.appendChild(icon);
                }
                
                imageWrapper.appendChild(imageDiv);
                linkEl.appendChild(imageWrapper);
                
                const textContainer = document.createElement('div');
                textContainer.style.cssText = 'flex: 1;';
                
                const textElement = document.createElement('div');
                textElement.className = 'preview-link-text';
                textElement.style.cssText = 'font-weight: 600; font-size: inherit !important;';
                textElement.innerHTML = sanitizeHTML(link.title || '');
                
                textContainer.appendChild(textElement);
                linkEl.appendChild(textContainer);
                
                // Font size is inherited from parent .preview-link, which will be set by applyButtonStyles
                console.log(`Created link element for link ${index}:`, linkEl);
                
                // Note: Individual link formatting (font, bold, italic, underline) is now handled
                // via HTML in the link.title field, so we don't need to apply it here
                
                previewLinks.appendChild(linkEl);
                console.log(`Added link element to preview for link ${index}`);
            });
            
            console.log('updatePreview complete, previewLinks children count:', previewLinks.children.length);
            
            // Images are now styled correctly in the structure above, no need for forced styling
            
            // Theme will be applied by the calling function if needed
        }
        
        function switchTab(tabName) {
            // Auto-load analytics when tab is opened
            if (tabName === 'analytics') {
                // Small delay to ensure tab is visible
                setTimeout(() => {
                    refreshAnalytics();
                }, 100);
            }
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
            
            // Update tab panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`tab-${tabName}`).classList.add('active');
            
            // Initialize theming when appearance tab is shown
            if (tabName === 'appearance') {
                setTimeout(() => {
                    // Set flag to prevent applyTheme() from running during initialization
                    isInitializingTheme = true;
                    
                    // Load theme into UI controls first, before setting up event listeners
                    if (currentList && currentList.theme) {
                        // Update currentTheme FIRST to ensure it has the correct values
                        currentTheme = { ...currentTheme, ...currentList.theme };
                        // Then load theme into UI controls (this will set radio buttons, inputs, etc.)
                        loadThemeIntoUI(currentList.theme);
                    }
                    
                    // Wait a bit longer to ensure UI controls are fully populated
                    setTimeout(() => {
                        // Initialize theming system (if not already initialized)
                        initTheming();
                        
                        // Apply theme directly from currentList.theme to ensure correct values are used
                        // This is critical because getCurrentThemeFromUI() might read from UI controls
                        // that haven't been fully populated yet, or might have default values
                        if (currentList && currentList.theme) {
                            let themeToApply;
                            // Parse theme if it's a string
                            if (typeof currentList.theme === 'string') {
                                try {
                                    themeToApply = JSON.parse(currentList.theme);
                                } catch (e) {
                                    themeToApply = currentList.theme;
                                }
                            } else {
                                themeToApply = { ...currentList.theme };
                            }
                            applyTheme(themeToApply);
                        }
                        
                        // Clear flag after initialization is complete
                        setTimeout(() => {
                            isInitializingTheme = false;
                        }, 100);
                    }, 50);
                }, 100);
            }
            
            // Initialize QR code when QR code tab is shown
            if (tabName === 'qrcode') {
                setTimeout(() => {
                    initQRCodeTab();
                }, 100);
            }
            
            // Initialize profile info when links tab is shown (for presentation info)
            if (tabName === 'links') {
                setTimeout(() => {
                    initProfileInfo();
                    updateDynamicInfo(); // Update preview immediately
                    console.log('Links tab shown, updating dynamic info');
                }, 100);
            }
        }
        
        function applyGradient(gradient) {
            theme.background = gradient;
            document.getElementById('gradient-text').value = gradient;
            updatePreviewTheme();
        }
        
        function updatePreviewTheme() {
            const phoneScreen = document.querySelector('.phone-screen');
            phoneScreen.style.background = theme.background;
            phoneScreen.style.color = theme.textColor;
        }
        
        async function createDefaultList() {
            console.log('Creating default list...');
            try {
                const { data, error } = await supabaseClient
                    .from('link_lists')
                    .insert({
                        owner_id: currentUser.id,
                        slug: 'my-links',
                        visibility: 'public',
                        theme: theme
                    })
                    .select()
                    .single();
                
                if (error) {
                    console.error('Error creating default list:', error);
                    throw error;
                }
                
                console.log('Default list created successfully:', data);
                collections.unshift(data);
                console.log('Loading the new collection...');
                await loadCollection(data);
                console.log('Collection loaded, rendering...');
                renderCollections();
                console.log('Showing success message...');
                showMessage('Welcome! Your first collection has been created.', 'success');
                console.log('Default list creation completed successfully');
            } catch (error) {
                console.error('Error creating default collection:', error);
                showMessage('Failed to create default collection. Please try again.', 'error');
            }
        }
        
        async function createNewList() {
            // Create new collection directly with unique auto-generated name
            const autoName = generateUniqueCollectionName();
            const visibility = 'public';
            const copyTheme = true;
            
            try {
                console.log('Creating new collection directly:', autoName);
                // Capture the current theme from the UI
                const collectionTheme = getCurrentThemeFromUI();
                
                const { data, error } = await supabaseClient
                    .from('link_lists')
                    .insert({
                        owner_id: currentUser.id,
                        slug: autoName,
                        visibility: visibility,
                        theme: collectionTheme
                    })
                    .select()
                    .single();
                
                if (error) {
                    console.error('Error creating new collection:', error);
                    throw error;
                }
                
                // Add to collections array
                collections.unshift(data);
                data.links = [];
                
                // Set as current list and load it
                currentList = data;
                links = [];
                
                // Load the new collection to ensure proper initialization
                await loadCollection(data);
                
                // Update UI
                // Collection name input removed from header - no longer needed
                // document.getElementById('project-slug').value = data.slug;
                
                // Update visibility dropdowns
                const visibilitySelect = document.getElementById('visibility-select');
                const headerVisibilitySelect = document.getElementById('header-visibility-select');
                
                let visibilityValue = 'public';
                const headerPasskeyGroup = document.getElementById('header-passkey-group');
                
                if (data.passkey) {
                    visibilityValue = 'passkey';
                    if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'flex';
                } else if (data.visibility === 'private') {
                    visibilityValue = 'private';
                    if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'none';
                } else {
                    if (headerPasskeyGroup) headerPasskeyGroup.style.display = 'none';
                }
                
                // Update both dropdowns
                if (visibilitySelect) visibilitySelect.value = visibilityValue;
                if (headerVisibilitySelect) headerVisibilitySelect.value = visibilityValue;
                
                // Clear presentation fields for new collection
                document.getElementById('info-title').value = '';
                document.getElementById('info-conference').value = '';
                document.getElementById('info-location').value = '';
                document.getElementById('info-date').value = '';
                
                // Update preview
                updateDynamicInfo();
                renderCollections();
                renderLinks();
                updatePreview();
                
                showMessage(`New collection "${autoName}" created!`, 'success');
                
            } catch (error) {
                console.error('Error creating new collection:', error);
                showMessage('Failed to create new collection. Please try again.', 'error');
            }
        }

        function closeNewCollectionModal() {
            document.getElementById('newCollectionModal').classList.add('hidden');
        }

        async function createNewCollectionFromModal() {
            const name = document.getElementById('new-collection-name').value.trim();
            const visibility = document.getElementById('new-collection-visibility').value;
            const copyTheme = document.getElementById('new-collection-copy-theme').checked;
            
            // Auto-generate name if empty
            let finalName = name || generateCollectionName();
            
            if (!finalName) {
                showMessage('Please enter a collection name', 'error');
                return;
            }
            
            // Validate and sanitize slug
            const slugValidation = validateAndSanitizeSlug(finalName);
            if (!slugValidation.isValid) {
                showMessage(slugValidation.error || 'Invalid collection name. Use only letters, numbers, hyphens, and underscores.', 'error');
                return;
            }
            
            // Use sanitized slug
            finalName = slugValidation.sanitized;
            
            // Update the input field with sanitized value if it was changed
            if (name && slugValidation.sanitized !== name.toLowerCase().trim().replace(/\s+/g, '-')) {
                document.getElementById('new-collection-name').value = slugValidation.sanitized;
            }
            
            try {
                console.log('Creating new collection:', finalName);
                const collectionTheme = copyTheme ? theme : {
                    background: 'linear-gradient(135deg, #1A2F5B 0%, #3B5B8F 100%)',
                    textColor: '#ffffff',
                    buttonStyle: 'soft'
                };
                
                const { data, error } = await supabaseClient
                    .from('link_lists')
                    .insert({
                        owner_id: currentUser.id,
                        slug: finalName,
                        visibility: visibility,
                        theme: collectionTheme
                    })
                    .select()
                    .single();
                
                if (error) {
                    console.error('Error creating new collection:', error);
                    throw error;
                }
                
                console.log('New collection created:', data);
                data.links = [];
                collections.unshift(data);
                await loadCollection(data);
                renderCollections();
                closeNewCollectionModal();
                showMessage('New collection created!', 'success');
            } catch (error) {
                console.error('Error creating collection:', error);
                showMessage('Failed to create collection. Please try again.', 'error');
            }
        }

        async function editCollection(collectionId) {
            const collection = collections.find(c => c.id === collectionId);
            if (!collection) return;
            
            // Use prompt for now, but validate the input
            const newSlugInput = prompt('Enter new name for your link list:', collection.slug);
            if (!newSlugInput || newSlugInput.trim() === collection.slug) return;
            
            // Validate and sanitize slug
            const slugValidation = validateAndSanitizeSlug(newSlugInput);
            if (!slugValidation.isValid) {
                showMessage(slugValidation.error || 'Invalid collection name. Use only letters, numbers, hyphens, and underscores.', 'error');
                return;
            }
            
            const newSlug = slugValidation.sanitized;
            
            // Check if sanitized slug is the same as current
            if (newSlug === collection.slug) {
                showMessage('Collection name unchanged', 'info');
                return;
            }
            
            try {
                const { error } = await supabaseClient
                    .from('link_lists')
                    .update({ slug: newSlug })
                    .eq('id', collectionId);
                
                if (error) {
                    console.error('Error updating collection:', error);
                    throw error;
                }
                
                collection.slug = newSlug;
                renderCollections();
                showMessage('Collection updated!', 'success');
            } catch (error) {
                console.error('Error updating collection:', error);
                showMessage('Failed to update collection. Please try again.', 'error');
            }
        }

        async function duplicateCollection(collectionId) {
            const collection = collections.find(c => c.id === collectionId);
            if (!collection) return;
            
            // Use prompt for now, but validate the input
            const newSlugInput = prompt('Enter name for the duplicate:', collection.slug + '-copy');
            if (!newSlugInput) return;
            
            // Validate and sanitize slug
            const slugValidation = validateAndSanitizeSlug(newSlugInput);
            if (!slugValidation.isValid) {
                showMessage(slugValidation.error || 'Invalid collection name. Use only letters, numbers, hyphens, and underscores.', 'error');
                return;
            }
            
            const newSlug = slugValidation.sanitized;
            
            try {
                // Create new collection
                const { data: newCollection, error: collectionError } = await supabaseClient
                    .from('link_lists')
                    .insert({
                        owner_id: currentUser.id,
                        slug: newSlug,
                        visibility: collection.visibility,
                        theme: collection.theme
                    })
                    .select()
                    .single();
                
                if (collectionError) {
                    console.error('Error creating duplicate collection:', collectionError);
                    throw collectionError;
                }
                
                // Copy links if any exist
                if (collection.links && collection.links.length > 0) {
                    const linkInserts = collection.links.map((link, index) => ({
                        list_id: newCollection.id,
                        title: link.title,
                        url: link.url,
                        image: link.image,
                        position: index,
                        order_index: index
                    }));
                    
                    const { error: linksError } = await supabaseClient
                        .from('link_items')
                        .insert(linkInserts);
                    
                    if (linksError) {
                        console.error('Error copying links:', linksError);
                        // Continue anyway, collection was created
                    }
                }
                
                newCollection.links = collection.links ? [...collection.links] : [];
                collections.unshift(newCollection);
                await loadCollection(newCollection);
                renderCollections();
                showMessage('Collection duplicated successfully!', 'success');
            } catch (error) {
                console.error('Error duplicating collection:', error);
                showMessage('Failed to duplicate collection. Please try again.', 'error');
            }
        }

        async function deleteCollection(collectionId) {
            const collection = collections.find(c => c.id === collectionId);
            if (!collection) return;
            
            if (!confirm(`Are you sure you want to delete "${collection.slug}"? This will also delete all ${collection.links ? collection.links.length : 0} links in this collection. This cannot be undone.`)) {
                return;
            }
            
            try {
                // Delete all links first
                if (collection.links && collection.links.length > 0) {
                    const { error: linksError } = await supabaseClient
                        .from('link_items')
                        .delete()
                        .eq('list_id', collectionId);
                    
                    if (linksError) {
                        console.error('Error deleting links:', linksError);
                        throw linksError;
                    }
                }
                
                // Delete the collection
                const { error: collectionError } = await supabaseClient
                    .from('link_lists')
                    .delete()
                    .eq('id', collectionId);
                
                if (collectionError) {
                    console.error('Error deleting collection:', collectionError);
                    throw collectionError;
                }
                
                // Remove from local collections array
                collections = collections.filter(c => c.id !== collectionId);
                
                // If this was the current collection, switch to another one
                if (currentList && currentList.id === collectionId) {
                    if (collections.length > 0) {
                        await loadCollection(collections[0]);
                    } else {
                        // Create a new default collection if no collections remain
                        await createDefaultCollection();
                        await loadCollection(collections[0]);
                    }
                }
                
                renderCollections();
                showMessage('Collection deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting collection:', error);
                showMessage('Failed to delete collection. Please try again.', 'error');
            }
        }
        // Flag to prevent theme updates during save
        let isSaving = false;
        let isInitializingTheme = false; // Flag to prevent applyTheme() from running during initialization
        
        // Flag to prevent initTheming from being called multiple times
        let themingInitialized = false;
        
        // Function to save a single link to the database
        async function saveLinkToDatabase(link) {
            if (!link || !link.id || link.id.startsWith('local-')) {
                return; // Don't save local/unsaved links
            }
            
            try {
                const { error } = await supabaseClient
                    .from('link_items')
                    .update({
                        title: link.title, // Save HTML as-is
                        url: link.url,
                        image_url: link.image_url || link.image,
                        order_index: link.order_index
                    })
                    .eq('id', link.id);
                
                if (error) {
                    console.error('Error saving link to database:', error);
                } else {
                    console.log('Link saved to database:', link.id, 'Title:', link.title);
                }
            } catch (error) {
                console.error('Exception saving link to database:', error);
            }
        }
        
        async function saveChanges() {
            try {
                isSaving = true; // Set flag to prevent theme updates during save
                console.log('Save changes called');
                console.log('Current list:', currentList);
                console.log('Current user:', currentUser);
                
                if (!currentList) {
                    showMessage('No collection selected to save', 'error');
                    return;
                }

                // Validate required fields
                const titleInput = document.getElementById('info-title');
                const conferenceInput = document.getElementById('info-conference');
                
                if (!titleInput || !titleInput.value.trim()) {
                    showMessage('Title is required to save the collection', 'error');
                    if (titleInput) titleInput.focus();
                    return;
                }
                
                if (!conferenceInput || !conferenceInput.value.trim()) {
                    showMessage('Conference/Event is required to save the collection', 'error');
                    if (conferenceInput) conferenceInput.focus();
                    return;
                }
                
                if (!currentList.id || currentList.id.startsWith('local-')) {
                    console.log('Creating new collection...');
                    
                    // Get visibility settings from header dropdown
                    const headerVisibilitySelect = document.getElementById('header-visibility-select');
                    const headerPasskeyInput = document.getElementById('header-passkey');
                    const visibility = headerVisibilitySelect ? headerVisibilitySelect.value : 'public';
                    const passkey = visibility === 'passkey' ? (headerPasskeyInput ? headerPasskeyInput.value : '') : null;
                    
                    // Create new collection
                    // Get slug from currentList or generate a new one (collection name input removed from header)
                    let rawSlugInput = '';
                    if (currentList && currentList.slug && currentList.slug.trim()) {
                        rawSlugInput = currentList.slug.trim();
                    } else {
                        rawSlugInput = generateCollectionName();
                        // Update currentList with generated name
                        if (currentList) {
                            currentList.slug = rawSlugInput;
                        }
                    }
                    // For new collections, always validate
                    const slugValidation = validateAndSanitizeSlug(rawSlugInput);
                    if (!slugValidation.isValid) {
                        showMessage(slugValidation.error || 'Invalid collection name. Use only letters, numbers, hyphens, and underscores.', 'error');
                        return;
                    }
                    const rawSlug = slugValidation.sanitized;
                    // Update currentList slug if it changed
                    if (rawSlug !== rawSlugInput && currentList) {
                        currentList.slug = rawSlug;
                    }
                    // No need for decodeURIComponent since we've already sanitized the slug
                    const cleanSlug = rawSlug;
                    
                    const { data, error } = await supabaseClient
                        .from('link_lists')
                        .insert({
                            owner_id: currentUser.id,
                            slug: cleanSlug,
                            visibility: visibility === 'passkey' ? 'public' : visibility,
                            passkey: passkey,
                            theme: getCurrentThemeFromUI()
                        })
                        .select()
                        .single();
                    
                    if (error) {
                        // If duplicate key error, try to load existing collection
                        if (error.code === '23505') {
                            console.log('Collection already exists, loading it...');
                            const { data: existing, error: fetchError } = await supabaseClient
                                .from('link_lists')
                                .select('id, slug, name, visibility, passkey, theme, owner_id, created_at, presentation_data, project_slug')
                                .eq('owner_id', currentUser.id)
                                .eq('slug', rawSlug)
                                .single();
                            
                            if (fetchError) throw fetchError;
                            
                            currentList.id = existing.id;
                            // Slug is stored as plain text, no need to decode
                            currentList.slug = existing.slug;
                            currentList.visibility = existing.visibility;
                            currentList.theme = existing.theme;
                            collections[0] = currentList;
                            console.log('Loaded existing collection:', existing);
                        } else {
                            throw error;
                        }
                    } else {
                        // Update current list with new ID
                        currentList.id = data.id;
                        collections[0] = currentList;
                        console.log('New collection created:', data);
                    }
                } else {
                    // Update existing collection
                    console.log('Updating existing collection...');
                    
                    // Get visibility settings from header dropdown
                    const headerVisibilitySelect = document.getElementById('header-visibility-select');
                    const headerPasskeyInput = document.getElementById('header-passkey');
                    const visibility = headerVisibilitySelect ? headerVisibilitySelect.value : 'public';
                    const passkey = visibility === 'passkey' ? (headerPasskeyInput ? headerPasskeyInput.value : '') : null;
                    
                    // For existing collections, use the current slug (collection name input removed from header)
                    // Users can rename collections through the collection list if needed
                    const cleanSlug = currentList.slug || '';
                    
                    const themeToSave = getCurrentThemeFromUI();
                    console.log('🎯 Saving theme to database:', themeToSave);
                    console.log('🎯 Theme type:', typeof themeToSave);
                    console.log('🎯 Theme stringified:', JSON.stringify(themeToSave, null, 2));
                    
                    const { error: listError } = await supabaseClient
                        .from('link_lists')
                        .update({
                            slug: cleanSlug,
                            visibility: visibility === 'passkey' ? 'public' : visibility,
                            passkey: passkey,
                            theme: themeToSave
                        })
                        .eq('id', currentList.id);
                    
                    if (listError) {
                        console.error('❌ Error updating collection:', listError);
                        throw listError;
                    }
                    console.log('✅ Collection updated successfully');
                    
                    // Verify the update by fetching the collection back
                    const { data: verifyData, error: verifyError } = await supabaseClient
                        .from('link_lists')
                        .select('theme')
                        .eq('id', currentList.id)
                        .single();
                    
                    if (verifyError) {
                        console.error('❌ Error verifying update:', verifyError);
                    } else {
                        console.log('🔍 Theme data after save:', verifyData.theme);
                        console.log('🔍 Theme keys after save:', Object.keys(verifyData.theme || {}));
                    }
                    
                    // Update currentList with the new data
                    // Use the slug as-is (stored as plain text)
                    currentList.slug = cleanSlug;
                    currentList.visibility = visibility === 'passkey' ? 'public' : visibility;
                    currentList.passkey = passkey;
                    currentList.theme = themeToSave; // Use the saved theme instead of reloading from UI
                    
                    // Update the collections array
                    const collectionIndex = collections.findIndex(c => c.id === currentList.id);
                    if (collectionIndex !== -1) {
                        collections[collectionIndex] = { ...currentList };
                    }
                }
                
                // Save presentation data to collection
                console.log('Saving presentation data...');
                const presentationData = {
                    title: document.getElementById('info-title')?.value || '',
                    conference: document.getElementById('info-conference')?.value || '',
                    location: document.getElementById('info-location')?.value || '',
                    date: document.getElementById('info-date')?.value || '',
                    displayTitle: document.getElementById('display-title')?.checked ?? true,
                    displayConference: document.getElementById('display-conference')?.checked ?? true
                };
                console.log('Presentation data:', presentationData);
                
                // Update collection with presentation data
                const { error: presentationError } = await supabaseClient
                    .from('link_lists')
                    .update({
                        presentation_data: presentationData
                    })
                    .eq('id', currentList.id);
                
                if (presentationError) {
                    console.warn('Presentation data update failed:', presentationError);
                } else {
                    console.log('Presentation data saved successfully');
                    // Update currentList with presentation data
                    currentList.presentation_data = presentationData;
                }
                
                // Save QR code style data
                const qrCodeData = {
                    size: document.getElementById('qr-size')?.value || '300',
                    pattern: 'square', // Always square pattern
                    color: document.getElementById('qr-color')?.value || '#000000',
                    bgColor: document.getElementById('qr-bg-color')?.value || '#ffffff',
                    padding: document.getElementById('qr-padding')?.value || '24',
                    logo: currentQRLogo || null,
                    borderEnabled: document.getElementById('qr-border-enabled')?.checked || false,
                    borderWidth: document.getElementById('qr-border-width')?.value || '8',
                    borderColor: document.getElementById('qr-border-color')?.value || '#000000',
                    borderStyle: document.getElementById('qr-border-style')?.value || 'solid',
                    borderRadius: document.getElementById('qr-border-radius')?.value || '8'
                };
                
                // Update collection with QR code data
                const { error: qrError } = await supabaseClient
                    .from('link_lists')
                    .update({
                        qr_code_data: qrCodeData
                    })
                    .eq('id', currentList.id);
                
                if (qrError) {
                    console.warn('QR code data update failed:', qrError);
                } else {
                    // Update currentList with QR code data
                    currentList.qr_code_data = qrCodeData;
                }
                
                // Save profile
                console.log('Saving profile...');
                const handle = 'user' + currentUser.id.substring(0, 8);
                console.log('Using handle for save:', handle);
                const displayNameElement = document.getElementById('profileDisplayName');
                const displayName = displayNameElement ? displayNameElement.value : '';
                
                const { error: profileError } = await supabaseClient
                    .from('profiles')
                    .update({
                        display_name: displayName,
                        handle: handle
                    })
                    .eq('id', currentUser.id);
                
                if (profileError) {
                    console.warn('Profile update failed:', profileError);
                    // Don't throw - profile update is optional
                } else {
                    console.log('Profile updated successfully');
                }
                
                // Update the collections array with the new data
                const collectionIndex = collections.findIndex(c => c.id === currentList.id);
                if (collectionIndex !== -1) {
                    collections[collectionIndex] = { ...currentList };
                }
                
                // Update the UI
                renderCollections();
                updatePreview();
                
                // Reapply theme to the newly created preview elements after save
                requestAnimationFrame(() => {
                    applyTheme();
                });
                
                showMessage('Changes saved successfully!', 'success');
            } catch (error) {
                console.error('Error saving changes:', error);
                showMessage('Failed to save changes. Please try again.', 'error');
            } finally {
                isSaving = false; // Reset flag after save completes
            }
        }
        
        // Generate normalized user ID (first 12 hex characters, no hyphens)
        function getNormalizedUserId(userId) {
            if (!userId) return '';
            // Remove hyphens and take first 12 hexadecimal characters
            const withoutHyphens = userId.replace(/-/g, '');
            return withoutHyphens.substring(0, 12).toLowerCase();
        }

        function copyPublicUrl() {
            if (!currentList || !currentList.id) {
                showMessage('No collection selected', 'error');
                return;
            }
            
            // Use collection ID (UUID) instead of slug for guaranteed uniqueness
            const collectionId = currentList.id;
            // Use normalized user ID (first 12 hex chars, no hyphens) for consistent URL format
            const userId = getNormalizedUserId(currentUser.id);
            // Public page URL - displays the link list using public.html with query parameters
            const url = `https://academiqr.com/public.html?user=${userId}&collection=${collectionId}`;
            navigator.clipboard.writeText(url);
            showMessage('Public URL copied to clipboard!', 'success');
        }
        
        // QR Code Functions
        let currentQRCode = null;
        let currentQRLogo = null; // Store the logo image data
        
        function initQRCodeTab() {
            if (!currentList || !currentUser) {
                document.getElementById('qr-url').value = 'Please select a collection first';
                return;
            }
            
            // Setup border enabled toggle (remove old listener first to avoid duplicates)
            const borderEnabled = document.getElementById('qr-border-enabled');
            const borderOptions = document.getElementById('qr-border-options');
            if (borderEnabled && borderOptions) {
                // Clone to remove all event listeners
                const newBorderEnabled = borderEnabled.cloneNode(true);
                borderEnabled.parentNode.replaceChild(newBorderEnabled, borderEnabled);
                
                // Add fresh listener
                newBorderEnabled.addEventListener('change', function() {
                    if (this.checked) {
                        borderOptions.style.display = 'block';
                    } else {
                        borderOptions.style.display = 'none';
                    }
                    generateQRCode();
                });
            }
            
            // Use collection ID (UUID) instead of slug for guaranteed uniqueness
            if (!currentList.id) {
                document.getElementById('qr-url').value = 'Collection ID not available';
                return;
            }
            
            const collectionId = currentList.id;
            // Use normalized user ID (first 12 hex chars, no hyphens) for consistent URL format
            const userId = getNormalizedUserId(currentUser.id);
            const url = `https://academiqr.com/public.html?user=${userId}&collection=${collectionId}`;
            document.getElementById('qr-url').value = url;
            
            // Load saved QR code settings if they exist
            if (currentList.qr_code_data) {
                const qrData = currentList.qr_code_data;
                
                // Update size dropdown
                const sizeSelect = document.getElementById('qr-size');
                if (sizeSelect && qrData.size) {
                    sizeSelect.value = qrData.size;
                }
                
                
                // Pattern is always square (no pattern selector needed)
                
                // Update color inputs
                const colorPicker = document.getElementById('qr-color');
                const colorText = document.getElementById('qr-color-text');
                if (colorPicker && qrData.color) {
                    colorPicker.value = qrData.color;
                    if (colorText) colorText.value = qrData.color;
                }
                
                // Update background color inputs
                const bgColorPicker = document.getElementById('qr-bg-color');
                const bgColorText = document.getElementById('qr-bg-color-text');
                if (bgColorPicker && qrData.bgColor) {
                    bgColorPicker.value = qrData.bgColor;
                    if (bgColorText) bgColorText.value = qrData.bgColor;
                }
                
                // Update padding dropdown
                const paddingSelect = document.getElementById('qr-padding');
                if (paddingSelect && qrData.padding) {
                    paddingSelect.value = qrData.padding;
                }
                
                // Load logo if present
                if (qrData.logo) {
                    currentQRLogo = qrData.logo;
                    const preview = document.getElementById('qr-logo-preview');
                    const img = document.getElementById('qr-logo-img');
                    img.src = currentQRLogo;
                    preview.style.display = 'block';
                } else {
                    currentQRLogo = null;
                    document.getElementById('qr-logo-preview').style.display = 'none';
                }
                
                // Load border settings
                if (qrData.borderEnabled) {
                    document.getElementById('qr-border-enabled').checked = true;
                    document.getElementById('qr-border-options').style.display = 'block';
                    
                    if (qrData.borderWidth) document.getElementById('qr-border-width').value = qrData.borderWidth;
                    if (qrData.borderColor) {
                        document.getElementById('qr-border-color').value = qrData.borderColor;
                        document.getElementById('qr-border-color-text').value = qrData.borderColor;
                    }
                    if (qrData.borderStyle) document.getElementById('qr-border-style').value = qrData.borderStyle;
                    if (qrData.borderRadius) document.getElementById('qr-border-radius').value = qrData.borderRadius;
                } else {
                    document.getElementById('qr-border-enabled').checked = false;
                    document.getElementById('qr-border-options').style.display = 'none';
                }
            } else {
                // Set default values if no saved settings
                document.getElementById('qr-size').value = '300';
                // Pattern is always square (no pattern selector)
                document.getElementById('qr-color').value = '#000000';
                document.getElementById('qr-color-text').value = '#000000';
                document.getElementById('qr-bg-color').value = '#ffffff';
                document.getElementById('qr-bg-color-text').value = '#ffffff';
                document.getElementById('qr-padding').value = '24';
                document.getElementById('qr-border-enabled').checked = false;
                document.getElementById('qr-border-options').style.display = 'none';
                document.getElementById('qr-border-width').value = '8';
                document.getElementById('qr-border-color').value = '#000000';
                document.getElementById('qr-border-color-text').value = '#000000';
                document.getElementById('qr-border-style').value = 'solid';
                document.getElementById('qr-border-radius').value = '8';
                currentQRLogo = null;
                document.getElementById('qr-logo-preview').style.display = 'none';
            }
            
            // Auto-generate QR code when tab is opened
            generateQRCode();
        }
        function generateQRCode() {
            if (!currentList || !currentUser) {
                showMessage('Please select a collection first', 'error');
                return;
            }
            
            // Use collection ID (UUID) instead of slug for guaranteed uniqueness
            if (!currentList.id) {
                showMessage('Collection ID not available', 'error');
                return;
            }
            
            const collectionId = currentList.id;
            // Use normalized user ID (first 12 hex chars, no hyphens) for consistent URL format
            const userId = getNormalizedUserId(currentUser.id);
            const url = `https://academiqr.com/public.html?user=${userId}&collection=${collectionId}`;
            const size = parseInt(document.getElementById('qr-size').value);
            const color = document.getElementById('qr-color').value;
            const bgColor = document.getElementById('qr-bg-color').value;
            const pattern = 'square'; // Always use square pattern
            const shape = 'square'; // Always square
            
            // Sync color text inputs
            document.getElementById('qr-color-text').value = color;
            document.getElementById('qr-bg-color-text').value = bgColor;
            
            // Clear previous QR code completely
            const container = document.getElementById('qr-code-container');
            
            // Clear currentQRCode reference
            currentQRCode = null;
            
            // Remove all existing canvases and images (including composite images)
            const existingCanvases = container.querySelectorAll('canvas');
            const existingImages = container.querySelectorAll('img');
            existingCanvases.forEach(canvas => canvas.remove());
            existingImages.forEach(img => img.remove());
            
            // Clear composite canvas data attributes
            delete container.dataset.compositeCanvas;
            delete container.dataset.originalCanvas;
            
            // Clear container innerHTML to remove any leftover elements
            container.innerHTML = '';
            
            // Remove all pattern classes
            container.classList.remove('qr-square', 'qr-rounded', 'qr-dots', 'qr-extra-rounded');
            
            // Ensure container maintains its styling (square shape)
            // Container padding is set to 0 since composite image includes padding and border
            container.style.background = 'white';
            container.style.padding = '0';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.width = '400px';
            container.style.height = '400px';
            container.style.margin = '0 auto';
            container.style.boxSizing = 'border-box';
            
            // Apply shape (circular clipping)
            if (shape === 'circle') {
                container.style.borderRadius = '50%';
                container.style.overflow = 'hidden';
            } else {
                container.style.overflow = 'visible';
            }
            
            // Apply border settings to container
            // Note: The decorative border is drawn on the composite canvas, not as a CSS border
            // So we always use the default dashed border for the container
            const borderEnabled = document.getElementById('qr-border-enabled').checked;
            if (borderEnabled) {
                // Sync border color text input
                const borderColor = document.getElementById('qr-border-color').value;
                document.getElementById('qr-border-color-text').value = borderColor;
            }
            
            // Always use the default dashed border for the container (decorative border is in the image)
            container.style.border = '2px dashed #e5e7eb';
            // Only apply default border radius if shape is square
            if (shape !== 'circle') {
                container.style.borderRadius = '12px';
            }
            
            // Generate new QR code
            try {
                // Start with outer container size and work inward
                const containerSize = 400; // Fixed container size
                const qrPadding = parseInt(document.getElementById('qr-padding').value) || 0;
                const borderEnabled = document.getElementById('qr-border-enabled').checked;
                const borderWidth = borderEnabled ? parseInt(document.getElementById('qr-border-width').value) : 0;
                
                // Calculate QR code size: container - border - padding
                // Border takes borderWidth on each side = borderWidth * 2 total
                // Padding takes qrPadding on each side = qrPadding * 2 total
                const qrSize = containerSize - (borderWidth * 2) - (qrPadding * 2);
                
                currentQRCode = new QRCode(container, {
                    text: url,
                    width: qrSize,
                    height: qrSize,
                    colorDark: color,
                    colorLight: bgColor,
                    correctLevel: QRCode.CorrectLevel.H
                });
                
                // Create composite image with padding for right-click copy functionality
                // Wait a bit for the canvas to be fully rendered
                setTimeout(() => {
                    const canvas = container.querySelector('canvas');
                    if (!canvas) {
                        console.warn('Canvas not found for composite image creation');
                        return;
                    }
                    
                    // Get padding and border settings (same as calculated above)
                    const containerSize = 400; // Fixed container size
                    const qrPadding = parseInt(document.getElementById('qr-padding').value) || 0;
                    const borderEnabled = document.getElementById('qr-border-enabled').checked;
                    const borderWidth = borderEnabled ? parseInt(document.getElementById('qr-border-width').value) : 0;
                    
                    // Remove any existing composite images first (in case of regeneration)
                    const existingCompositeImgs = container.querySelectorAll('img[data-composite="true"]');
                    existingCompositeImgs.forEach(img => img.remove());
                    
                    // Only create composite if there's padding or border
                    if (qrPadding > 0 || borderEnabled) {
                        // Make sure canvas is visible first (in case it was hidden before)
                        canvas.style.display = '';
                        canvas.style.visibility = '';
                        canvas.style.position = '';
                        canvas.style.opacity = '';
                        canvas.style.pointerEvents = '';
                        
                        // Create composite canvas at exact container size
                        const compositeCanvas = document.createElement('canvas');
                        compositeCanvas.width = containerSize;
                        compositeCanvas.height = containerSize;
                        const ctx = compositeCanvas.getContext('2d');
                        
                        // Fill with background color
                        const bgColor = document.getElementById('qr-bg-color').value;
                        ctx.fillStyle = bgColor;
                        ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);
                        
                        // Calculate positions: border is outermost, then padding, then QR code
                        // Border stroke is centered on the path, so draw at borderWidth/2
                        // QR code position: borderWidth (to be inside border) + qrPadding
                        const qrX = borderWidth + qrPadding;
                        const qrY = borderWidth + qrPadding;
                        
                        // Draw border if enabled (around the padding area)
                        if (borderEnabled) {
                            const borderColor = document.getElementById('qr-border-color').value;
                            const borderStyle = document.getElementById('qr-border-style').value;
                            const borderRadius = parseInt(document.getElementById('qr-border-radius').value);
                            
                            ctx.strokeStyle = borderColor;
                            ctx.lineWidth = borderWidth;
                            
                            if (borderStyle === 'dashed') {
                                ctx.setLineDash([borderWidth * 2, borderWidth]);
                            } else if (borderStyle === 'dotted') {
                                ctx.setLineDash([borderWidth, borderWidth]);
                            } else if (borderStyle === 'double') {
                                ctx.lineWidth = borderWidth / 3;
                                // Border path at borderWidth/2, width includes borderWidth to reach container edge
                                const borderX = borderWidth / 2;
                                const borderY = borderWidth / 2;
                                const borderW = canvas.width + (qrPadding * 2) + borderWidth;
                                const borderH = canvas.height + (qrPadding * 2) + borderWidth;
                                ctx.strokeRect(borderX, borderY, borderW, borderH);
                                ctx.strokeRect(borderX + borderWidth, borderY + borderWidth, borderW - borderWidth * 2, borderH - borderWidth * 2);
                            }
                            
                            if (borderStyle !== 'double') {
                                if (borderRadius > 0) {
                                    ctx.beginPath();
                                    // Border path at borderWidth/2, width includes borderWidth to reach container edge
                                    const x = borderWidth / 2;
                                    const y = borderWidth / 2;
                                    const width = canvas.width + (qrPadding * 2) + borderWidth;
                                    const height = canvas.height + (qrPadding * 2) + borderWidth;
                                    ctx.moveTo(x + borderRadius, y);
                                    ctx.lineTo(x + width - borderRadius, y);
                                    ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
                                    ctx.lineTo(x + width, y + height - borderRadius);
                                    ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
                                    ctx.lineTo(x + borderRadius, y + height);
                                    ctx.arcTo(x, y + height, x, y + borderRadius, borderRadius);
                                    ctx.lineTo(x, y + borderRadius);
                                    ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
                                    ctx.closePath();
                                    ctx.stroke();
                                } else {
                                    // Border path at borderWidth/2, width includes borderWidth to reach container edge
                                    const borderX = borderWidth / 2;
                                    const borderY = borderWidth / 2;
                                    const borderW = canvas.width + (qrPadding * 2) + borderWidth;
                                    const borderH = canvas.height + (qrPadding * 2) + borderWidth;
                                    ctx.strokeRect(borderX, borderY, borderW, borderH);
                                }
                            }
                            
                            ctx.setLineDash([]);
                        }
                        
                        // Draw the QR code canvas at the calculated position (inside padding, inside border)
                        ctx.drawImage(canvas, qrX, qrY);
                        
                        // Create an img element from the composite canvas
                        const compositeImg = document.createElement('img');
                        
                        // Apply logo to composite canvas if it exists
                        if (currentQRLogo) {
                            const logo = new Image();
                            logo.onload = function() {
                                // Calculate logo size (max 20% of QR code size for scannability)
                                const qrCodeSize = canvas.width;
                                const maxLogoSize = qrCodeSize * 0.20;
                                let logoWidth = logo.width;
                                let logoHeight = logo.height;
                                
                                // Scale logo to fit within max size while maintaining aspect ratio
                                if (logoWidth > maxLogoSize || logoHeight > maxLogoSize) {
                                    const scale = Math.min(maxLogoSize / logoWidth, maxLogoSize / logoHeight);
                                    logoWidth = logoWidth * scale;
                                    logoHeight = logoHeight * scale;
                                }
                                
                                // Calculate position (center of QR code, using same coordinates as QR code)
                                const qrXPos = qrX;
                                const qrYPos = qrY;
                                const x = qrXPos + (canvas.width - logoWidth) / 2;
                                const y = qrYPos + (canvas.height - logoHeight) / 2;
                                
                                // Draw white background circle/square for logo (for better visibility)
                                const padding = 8;
                                const centerX = qrXPos + canvas.width / 2;
                                const centerY = qrYPos + canvas.height / 2;
                                ctx.fillStyle = '#ffffff';
                                ctx.beginPath();
                                ctx.arc(centerX, centerY, (Math.max(logoWidth, logoHeight) / 2) + padding, 0, Math.PI * 2);
                                ctx.fill();
                                
                                // Draw logo
                                ctx.drawImage(logo, x, y, logoWidth, logoHeight);
                                
                                // Update the composite image src with the logo
                                compositeImg.src = compositeCanvas.toDataURL('image/png');
                            };
                            logo.onerror = function() {
                                console.error('Failed to load logo for composite image');
                                // Still create the image without logo
                                compositeImg.src = compositeCanvas.toDataURL('image/png');
                            };
                            logo.src = currentQRLogo;
                        }
                        
                        // Set initial src (will be updated if logo is being loaded)
                        compositeImg.src = compositeCanvas.toDataURL('image/png');
                        // Composite canvas is exactly container size (400x400), so set explicit dimensions
                        compositeImg.style.width = containerSize + 'px';
                        compositeImg.style.height = containerSize + 'px';
                        compositeImg.style.display = 'block';
                        compositeImg.style.margin = '0 auto';
                        compositeImg.alt = 'QR Code';
                        compositeImg.title = 'Right-click to copy image';
                        
                        // Hide the original canvas completely and show the composite image
                        canvas.setAttribute('data-hidden', 'true');
                        canvas.style.setProperty('display', 'none', 'important');
                        canvas.style.setProperty('visibility', 'hidden', 'important');
                        canvas.style.setProperty('opacity', '0', 'important');
                        canvas.style.setProperty('pointer-events', 'none', 'important');
                        
                        // Mark this as a composite image
                        compositeImg.setAttribute('data-composite', 'true');
                        container.appendChild(compositeImg);
                        
                        // Container padding is already 0, but ensure it stays that way
                        container.style.padding = '0';
                        
                        // Store the composite canvas in a data attribute for potential future use
                        container._compositeCanvas = compositeCanvas;
                        
                        // Store reference to composite canvas for download function
                        container.dataset.compositeCanvas = 'true';
                        container.dataset.originalCanvas = 'true'; // Mark that original canvas exists but is hidden
                    } else {
                        // No padding/border - ensure canvas is visible and no composite images exist
                        canvas.removeAttribute('data-hidden');
                        canvas.style.removeProperty('display');
                        canvas.style.removeProperty('visibility');
                        canvas.style.removeProperty('position');
                        canvas.style.removeProperty('opacity');
                        canvas.style.removeProperty('pointer-events');
                        
                        // Remove any leftover composite images
                        const existingCompositeImgs = container.querySelectorAll('img[data-composite="true"]');
                        existingCompositeImgs.forEach(img => img.remove());
                    }
                }, 100);
                
                // Circular QR code functionality removed
                if (false) {
                    setTimeout(() => {
                        // Get pattern style
                        const pattern = 'square'; // Always square pattern
                        
                        // Generate QR code using qrcode-generator library
                        const typeNumber = 0; // Auto-detect
                        const errorCorrectionLevel = 'H'; // High error correction
                        const qr = qrcode(typeNumber, errorCorrectionLevel);
                        qr.addData(url);
                        qr.make();
                        
                        const moduleCount = qr.getModuleCount();
                        
                        // 1) Dimensions (use integer module size)
                        const QUIET = 4; // spec-safe
                        const n = moduleCount; // QR matrix size
                        const totalModules = n + 2 * QUIET;
                        const moduleSize = Math.floor(qrSize / totalModules);
                        const qrSide = totalModules * moduleSize; // square incl. quiet zone
                        
                        // 2) Circle big enough to sit OUTSIDE the square+quiet zone
                        //    (circumcircle of the square) + ring gap
                        const ringGap = Math.round(moduleSize * 1.5);
                        const R = Math.ceil(0.5 * Math.SQRT2 * qrSide) + ringGap; // radius
                        const canvasSize = 2 * R; // SVG width/height
                        
                        // 3) SVG
                        const svgNS = 'http://www.w3.org/2000/svg';
                        const svg = document.createElementNS(svgNS, 'svg');
                        svg.setAttribute('viewBox', `0 0 ${canvasSize} ${canvasSize}`);
                        svg.setAttribute('width', canvasSize);
                        svg.setAttribute('height', canvasSize);
                        svg.style.width = canvasSize + 'px';
                        svg.style.height = canvasSize + 'px';
                        
                        const cx = R;
                        const cy = R;
                        
                        // Use user's colors (keep customization)
                        const qrBgColor = bgColor;
                        const qrModuleColor = color;
                        
                        // 4) Background circle + BOLD ring (BEHIND the QR) - Style A
                        const bgCircle = document.createElementNS(svgNS, 'circle');
                        bgCircle.setAttribute('cx', cx);
                        bgCircle.setAttribute('cy', cy);
                        bgCircle.setAttribute('r', R);
                        bgCircle.setAttribute('fill', qrBgColor);
                        svg.appendChild(bgCircle);
                        
                        // Bold outer ring (Flowcode-like)
                        const ringThickness = Math.round(moduleSize * 1.8);
                        const ring = document.createElementNS(svgNS, 'circle');
                        ring.setAttribute('cx', cx);
                        ring.setAttribute('cy', cy);
                        ring.setAttribute('r', R - ringThickness / 2);
                        ring.setAttribute('fill', 'none');
                        ring.setAttribute('stroke', qrModuleColor);
                        ring.setAttribute('stroke-width', ringThickness);
                        svg.appendChild(ring);
                        
                        // 5) Position the QR square (including QUIET zone) in the center
                        const offset = Math.round((canvasSize - qrSide) / 2);
                        const g = document.createElementNS(svgNS, 'g');
                        g.setAttribute('transform', `translate(${offset},${offset})`);
                        svg.appendChild(g);
                        
                        // Helper function to detect finder patterns (7x7 squares in corners)
                        function isInFinder(r, c, n) {
                            const FS = 7;
                            return (r < FS && c < FS) ||                 // TL
                                   (r < FS && c >= n - FS) ||            // TR
                                   (r >= n - FS && c < FS);              // BL
                        }
                        
                        // 6) Render modules. Keep finders SOLID SQUARES.
                        function drawModule(row, col, isDark) {
                            if (!isDark) return;
                            
                            const x = (col + QUIET) * moduleSize;
                            const y = (row + QUIET) * moduleSize;
                            
                            // Finder zones: no dots/rounding
                            if (isInFinder(row, col, moduleCount)) {
                                const rect = document.createElementNS(svgNS, 'rect');
                                rect.setAttribute('x', x);
                                rect.setAttribute('y', y);
                                rect.setAttribute('width', moduleSize);
                                rect.setAttribute('height', moduleSize);
                                rect.setAttribute('fill', qrModuleColor);
                                g.appendChild(rect);
                                return;
                            }
                            
                            // Data modules: ALWAYS dots for Style A (Flowcode-like)
                            // High fill-factor (≈92% of half-size)
                            const cxm = x + moduleSize / 2;
                            const cym = y + moduleSize / 2;
                            const dot = document.createElementNS(svgNS, 'circle');
                            dot.setAttribute('cx', cxm);
                            dot.setAttribute('cy', cym);
                            dot.setAttribute('r', (moduleSize / 2) * 0.92);
                            dot.setAttribute('fill', qrModuleColor);
                            g.appendChild(dot);
                            
                            // Keep other patterns available (but dots are default for circular)
                            if (false && pattern === 'rounded') {
                                const rect = document.createElementNS(svgNS, 'rect');
                                const inset = Math.round(moduleSize * 0.06);
                                rect.setAttribute('x', x + inset);
                                rect.setAttribute('y', y + inset);
                                rect.setAttribute('width', moduleSize - inset * 2);
                                rect.setAttribute('height', moduleSize - inset * 2);
                                rect.setAttribute('rx', Math.round(moduleSize * 0.2));
                                rect.setAttribute('ry', Math.round(moduleSize * 0.2));
                                rect.setAttribute('fill', qrModuleColor);
                                g.appendChild(rect);
                            } else if (pattern === 'extra-rounded') {
                                const rect = document.createElementNS(svgNS, 'rect');
                                const inset = Math.round(moduleSize * 0.06);
                                rect.setAttribute('x', x + inset);
                                rect.setAttribute('y', y + inset);
                                rect.setAttribute('width', moduleSize - inset * 2);
                                rect.setAttribute('height', moduleSize - inset * 2);
                                rect.setAttribute('rx', Math.round(moduleSize * 0.4));
                                rect.setAttribute('ry', Math.round(moduleSize * 0.4));
                                rect.setAttribute('fill', qrModuleColor);
                                g.appendChild(rect);
                            } else {
                                const rect = document.createElementNS(svgNS, 'rect');
                                rect.setAttribute('x', x);
                                rect.setAttribute('y', y);
                                rect.setAttribute('width', moduleSize);
                                rect.setAttribute('height', moduleSize);
                                rect.setAttribute('fill', qrModuleColor);
                                g.appendChild(rect);
                            }
                        }
                        
                        // Draw all QR code modules
                        for (let row = 0; row < n; row++) {
                            for (let col = 0; col < n; col++) {
                                drawModule(row, col, qr.isDark(row, col));
                            }
                        }
                        
                        // ---- STYLE A: CENTER LOGO KNOCK-OUT ----
                        const logoW = qrSide * 0.22;
                        const logoH = logoW * 0.42;
                        const logoKnockout = document.createElementNS(svgNS, 'rect');
                        logoKnockout.setAttribute('x', cx - logoW / 2);
                        logoKnockout.setAttribute('y', cy - logoH / 2);
                        logoKnockout.setAttribute('width', logoW);
                        logoKnockout.setAttribute('height', logoH);
                        logoKnockout.setAttribute('rx', logoH * 0.25);
                        logoKnockout.setAttribute('ry', logoH * 0.25);
                        logoKnockout.setAttribute('fill', qrBgColor);
                        svg.appendChild(logoKnockout);
                        
                        // Logo text/branding
                        const logoText = document.createElementNS(svgNS, 'text');
                        logoText.setAttribute('x', cx);
                        logoText.setAttribute('y', cy + logoH * 0.15);
                        logoText.setAttribute('text-anchor', 'middle');
                        logoText.setAttribute('font-size', Math.round(logoH * 0.45));
                        logoText.setAttribute('font-weight', '700');
                        logoText.setAttribute('fill', qrModuleColor);
                        logoText.setAttribute('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
                        logoText.textContent = 'AcademiQR';
                        svg.appendChild(logoText);
                        
                        // ---- STYLE A: BOTTOM ARC TEXT ----
                        // Create defs if not already created (will be reused for echo layer)
                        let arcDefs = svg.querySelector('defs');
                        if (!arcDefs) {
                            arcDefs = document.createElementNS(svgNS, 'defs');
                            svg.appendChild(arcDefs);
                        }
                        const innerR = Math.ceil(qrSide * Math.SQRT2 / 2) + moduleSize;
                        const pathId = 'arc-' + Math.random().toString(36).slice(2);
                        const arcPath = document.createElementNS(svgNS, 'path');
                        const arcR = innerR * 0.85;
                        arcPath.setAttribute('id', pathId);
                        arcPath.setAttribute('d', `M ${cx},${cy} m -${arcR},0 a ${arcR},${arcR} 0 1,0 ${arcR * 2},0`);
                        arcDefs.appendChild(arcPath);
                        
                        const arcText = document.createElementNS(svgNS, 'text');
                        arcText.setAttribute('fill', qrModuleColor);
                        arcText.setAttribute('font-size', Math.round(moduleSize * 1.2));
                        arcText.setAttribute('font-weight', '500');
                        arcText.setAttribute('letter-spacing', '1');
                        arcText.setAttribute('opacity', '0.7');
                        
                        const textPath = document.createElementNS(svgNS, 'textPath');
                        textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${pathId}`);
                        textPath.setAttribute('startOffset', '50%');
                        textPath.setAttribute('text-anchor', 'middle');
                        
                        // Get current list info for arc text
                        if (currentList && currentList.title) {
                            textPath.textContent = currentList.title.toUpperCase();
                        } else {
                            textPath.textContent = 'SCAN TO CONNECT';
                        }
                        
                        arcText.appendChild(textPath);
                        svg.appendChild(arcText);
                        
                        // ---- DECORATIVE ECHO LAYER ----
                        // Fill the ring with on-brand dots that echo the QR
                        
                        // 1) Geometry of the real QR square (including QUIET)
                        // qrSide already defined above as: totalModules * moduleSize
                        const qrStartX = offset;
                        const qrStartY = offset;
                        const qrEndX = qrStartX + qrSide;
                        const qrEndY = qrStartY + qrSide;
                        
                        // 2) Defs: circle clip + "outside the QR square" mask
                        // Reuse existing defs element
                        const defs = svg.querySelector('defs');
                        
                        // Circle clip (keep décor inside the circle)
                        const clip = document.createElementNS(svgNS, 'clipPath');
                        const clipId = 'clip-' + Math.random().toString(36).slice(2);
                        clip.setAttribute('id', clipId);
                        const cc = document.createElementNS(svgNS, 'circle');
                        cc.setAttribute('cx', cx);
                        cc.setAttribute('cy', cy);
                        cc.setAttribute('r', R);
                        clip.appendChild(cc);
                        defs.appendChild(clip);
                        
                        // Mask: visible OUTSIDE the QR square (+ quiet zone)
                        const mask = document.createElementNS(svgNS, 'mask');
                        const maskId = 'outside-' + Math.random().toString(36).slice(2);
                        mask.setAttribute('id', maskId);
                        
                        // Start visible everywhere
                        const mRect = document.createElementNS(svgNS, 'rect');
                        mRect.setAttribute('x', 0);
                        mRect.setAttribute('y', 0);
                        mRect.setAttribute('width', canvasSize);
                        mRect.setAttribute('height', canvasSize);
                        mRect.setAttribute('fill', 'white');
                        mask.appendChild(mRect);
                        
                        // Punch a "hole" where the real QR (incl. quiet) lives
                        const hole = document.createElementNS(svgNS, 'rect');
                        hole.setAttribute('x', qrStartX);
                        hole.setAttribute('y', qrStartY);
                        hole.setAttribute('width', qrSide);
                        hole.setAttribute('height', qrSide);
                        hole.setAttribute('fill', 'black');
                        mask.appendChild(hole);
                        
                        defs.appendChild(mask);
                        
                        // 3) Avoid finder-looking décor near the real finders
                        function finderRectsPx() {
                            const FS = 7 * moduleSize;
                            const q = QUIET * moduleSize;
                            return [
                                { x: qrStartX + q, y: qrStartY + q, w: FS, h: FS }, // TL
                                { x: qrEndX - q - FS, y: qrStartY + q, w: FS, h: FS }, // TR
                                { x: qrStartX + q, y: qrEndY - q - FS, w: FS, h: FS }  // BL
                            ];
                        }
                        const finderZones = finderRectsPx();
                        
                        // Helper
                        function nearFinder(x, y, pad = moduleSize * 2) {
                            // Skip a padded region around each finder so décor can't form 7x7 blocks
                            return finderZones.some(fr =>
                                x > fr.x - pad && x < fr.x + fr.w + pad &&
                                y > fr.y - pad && y < fr.y + fr.h + pad
                            );
                        }
                        
                        // 4) Décor group (clipped to circle, masked outside the square)
                        const deco = document.createElementNS(svgNS, 'g');
                        deco.setAttribute('clip-path', `url(#${clipId})`);
                        deco.setAttribute('mask', `url(#${maskId})`);
                        svg.appendChild(deco);
                        
                        // 5) Echo pattern: grid-aligned dots that "sample" the nearest edge module
                        //    (reduced contrast + slightly smaller radius)
                        // SAFETY: Only add echo layer if moduleSize is reasonable
                        if (moduleSize > 0 && moduleSize < 100) {
                            const echoColor = qrModuleColor; // Use user's color
                            const echoOpacity = 0.4; // Even dimmer for safety
                            const echoR = (moduleSize / 2) * 0.6; // Smaller than real dots
                            
                            let dotCount = 0;
                            const maxDots = 500; // Safety limit
                            
                            for (let y = 0; y < canvasSize && dotCount < maxDots; y += moduleSize) {
                                for (let x = 0; x < canvasSize && dotCount < maxDots; x += moduleSize) {
                                    // Keep inside circle
                                    const mx = x + moduleSize / 2;
                                    const my = y + moduleSize / 2;
                                    const d = Math.hypot(mx - cx, my - cy);
                                    if (d > R - moduleSize / 2) continue;
                                    
                                    // Must be OUTSIDE the QR square+quiet zone
                                    const outside = (x < qrStartX || x >= qrEndX || y < qrStartY || y >= qrEndY);
                                    if (!outside) continue;
                                    
                                    // Don't echo near finders (avoid accidental finder-like clusters)
                                    if (nearFinder(x, y)) continue;
                                    
                                    // Sample nearest edge cell from the real QR (clamped)
                                    const sampleCol = Math.max(0, Math.min(n - 1,
                                        Math.round((x - (qrStartX + QUIET * moduleSize)) / moduleSize)));
                                    const sampleRow = Math.max(0, Math.min(n - 1,
                                        Math.round((y - (qrStartY + QUIET * moduleSize)) / moduleSize)));
                                    
                                    // Call QR matrix function (with safety check)
                                    try {
                                        const dark = qr.isDark(sampleRow, sampleCol);
                                        if (!dark) continue;
                                        
                                        // Draw echo dot (reduced contrast, smaller)
                                        const dot = document.createElementNS(svgNS, 'circle');
                                        dot.setAttribute('cx', mx);
                                        dot.setAttribute('cy', my);
                                        dot.setAttribute('r', echoR);
                                        dot.setAttribute('fill', echoColor);
                                        dot.setAttribute('opacity', echoOpacity);
                                        deco.appendChild(dot);
                                        dotCount++;
                                    } catch (e) {
                                        console.error('Echo dot error:', e);
                                        break;
                                    }
                                }
                            }
                            console.log('Echo layer: added', dotCount, 'decorative dots');
                        }
                        
                        // Remove the canvas-based QR and insert SVG
                        const oldCanvas = container.querySelector('canvas');
                        if (oldCanvas) {
                            oldCanvas.remove();
                        }
                        const oldImg = container.querySelector('img');
                        if (oldImg) {
                            oldImg.remove();
                        }
                        container.appendChild(svg);
                    }, 150);
                }
                // QR code generated successfully - hide img element and show canvas
                setTimeout(async () => {
                    // QRCode.js creates both canvas and img - hide the img element
                    const img = container.querySelector('img');
                    const canvas = container.querySelector('canvas');
                    
                    if (img) {
                        img.style.display = 'none';
                    }
                    
                    if (canvas) {
                        canvas.style.display = 'block';
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                        
                        // Apply logo overlay if present
                        if (currentQRLogo) {
                            try {
                                await overlayLogoOnQR(canvas, currentQRLogo);
                            } catch (error) {
                                console.error('Failed to apply logo overlay:', error);
                            }
                        }
                    } else {
                        console.error('No canvas element found!');
                    }
                    
                    // Monitor the container for changes
                    const observer = new MutationObserver(() => {
                        // Monitoring for container changes (no logging needed)
                    });
                    
                    observer.observe(container, { childList: true, subtree: true });
                    
                    // Stop observing after 5 seconds
                    setTimeout(() => {
                        observer.disconnect();
                    }, 5000);
                }, 100);
                
                // Show download buttons
                document.getElementById('qr-actions').style.display = 'flex';
                showMessage('QR Code generated successfully!', 'success');
            } catch (error) {
                console.error('QR Code generation error:', error);
                showMessage('Failed to generate QR code. Please try again.', 'error');
            }
        }
        
        function loadThemeIntoUI(theme) {
            
            // Load background settings
            if (theme.backgroundType) {
                const bgTypeRadios = document.querySelectorAll('input[name="bg-type"]');
                bgTypeRadios.forEach(radio => {
                    if (radio.value === theme.backgroundType) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change'));
                    }
                });
            }
            
            if (theme.backgroundColor) {
                const bgColorInput = document.getElementById('bg-color');
                const bgColorTextInput = document.getElementById('bg-color-text');
                if (bgColorInput) {
                    bgColorInput.value = theme.backgroundColor;
                }
                if (bgColorTextInput) {
                    bgColorTextInput.value = theme.backgroundColor;
                }
            }
            
            if (theme.gradientText) {
                const gradientInput = document.getElementById('gradient-text');
                if (gradientInput) {
                    gradientInput.value = theme.gradientText;
                }
            }
            
            // Load text color settings
            // Check for presentationColor first (newer format), then fall back to presentationTextColor
            const presentationColorValue = theme.presentationColor || theme.presentationTextColor;
            if (presentationColorValue) {
                const presentationColorInput = document.getElementById('presentation-color');
                const presentationColorTextInput = document.getElementById('presentation-color-text');
                if (presentationColorInput) {
                    presentationColorInput.value = presentationColorValue;
                }
                if (presentationColorTextInput) {
                    presentationColorTextInput.value = presentationColorValue;
                }
            }
            
            // Load button settings
            if (theme.buttonTextColor) {
                const buttonTextColorInput = document.getElementById('button-text-color');
                const buttonTextColorTextInput = document.getElementById('button-text-color-text');
                if (buttonTextColorInput) {
                    buttonTextColorInput.value = theme.buttonTextColor;
                }
                if (buttonTextColorTextInput) {
                    buttonTextColorTextInput.value = theme.buttonTextColor;
                }
            }
            
            if (theme.buttonBackgroundColor) {
                const buttonBgColorInput = document.getElementById('button-bg-color');
                const buttonBgColorTextInput = document.getElementById('button-bg-color-text');
                if (buttonBgColorInput) {
                    buttonBgColorInput.value = theme.buttonBackgroundColor;
                }
                if (buttonBgColorTextInput) {
                    buttonBgColorTextInput.value = theme.buttonBackgroundColor;
                }
            }
            
            if (theme.buttonStyle) {
                const buttonStyleSelect = document.getElementById('button-style');
                if (buttonStyleSelect) {
                    buttonStyleSelect.value = theme.buttonStyle;
                }
            }
            
            // Load border settings
            if (theme.borderType) {
                const borderTypeRadios = document.querySelectorAll('input[name="border-type"]');
                console.log('🎨 Found border type radios:', borderTypeRadios.length);
                borderTypeRadios.forEach(radio => {
                    if (radio.value === theme.borderType) {
                        radio.checked = true;
                        // Trigger change event to update UI state
                        radio.dispatchEvent(new Event('change'));
                        // Also call updateBorderType to ensure theme is updated
                        updateBorderType();
                        console.log('🎨 Set border type radio:', radio.value);
                    }
                });
            }
            
            if (theme.borderStyle) {
                console.log('🎨 Setting border style to:', theme.borderStyle);
                const borderStyleRadios = document.querySelectorAll('input[name="border-style"]');
                console.log('🎨 Found border style radios:', borderStyleRadios.length);
                borderStyleRadios.forEach(radio => {
                    if (radio.value === theme.borderStyle) {
                        radio.checked = true;
                        // Trigger change event to update UI state
                        radio.dispatchEvent(new Event('change'));
                        // Also call updateBorderStyle to ensure theme is updated
                        updateBorderStyle();
                        console.log('🎨 Set border style radio:', radio.value);
                    }
                });
            }
            
            if (theme.borderColor) {
                console.log('🎨 Setting border color to:', theme.borderColor);
                const borderColorInput = document.getElementById('border-color-picker');
                const borderColorTextInput = document.getElementById('border-color-text');
                if (borderColorInput) {
                    borderColorInput.value = theme.borderColor;
                    console.log('🎨 Set border color input:', borderColorInput.value);
                }
                if (borderColorTextInput) {
                    borderColorTextInput.value = theme.borderColor;
                    console.log('🎨 Set border color text input:', borderColorTextInput.value);
                }
            }
            
            // Load gradient border toggle
            if (theme.gradientBorderEnabled !== undefined) {
                console.log('🎨 Setting gradient border enabled to:', theme.gradientBorderEnabled);
                const gradientBorderToggle = document.getElementById('gradient-border-toggle');
                if (gradientBorderToggle) {
                    gradientBorderToggle.checked = theme.gradientBorderEnabled;
                    // Trigger change event to update UI state
                    gradientBorderToggle.dispatchEvent(new Event('change'));
                    // Also call updateGradientBorder to ensure theme is updated
                    updateGradientBorder();
                    console.log('🎨 Set gradient border toggle:', gradientBorderToggle.checked);
                }
            }
            
            // Load border gradient settings
            if (theme.borderGradientText) {
                console.log('🎨 Setting border gradient text to:', theme.borderGradientText);
                const borderGradientInput = document.getElementById('border-gradient-input');
                if (borderGradientInput) {
                    borderGradientInput.value = theme.borderGradientText;
                    console.log('🎨 Set border gradient input:', borderGradientInput.value);
                }
            }
            
            if (theme.borderGradientAngle) {
                console.log('🎨 Setting border gradient angle to:', theme.borderGradientAngle);
                const borderGradientAngle = document.getElementById('border-gradient-angle');
                const borderGradientAngleText = document.getElementById('border-gradient-angle-text');
                if (borderGradientAngle) {
                    borderGradientAngle.value = theme.borderGradientAngle;
                    console.log('🎨 Set border gradient angle:', borderGradientAngle.value);
                }
                if (borderGradientAngleText) {
                    borderGradientAngleText.value = theme.borderGradientAngle;
                    console.log('🎨 Set border gradient angle text:', borderGradientAngleText.value);
                }
            }
            
            // Load gradient angle
            if (theme.gradientAngle) {
                console.log('🎨 Setting gradient angle to:', theme.gradientAngle);
                const gradientAngle = document.getElementById('gradient-angle');
                const gradientAngleText = document.getElementById('gradient-angle-text');
                if (gradientAngle) {
                    gradientAngle.value = theme.gradientAngle;
                    console.log('🎨 Set gradient angle:', gradientAngle.value);
                }
                if (gradientAngleText) {
                    gradientAngleText.value = theme.gradientAngle;
                    console.log('🎨 Set gradient angle text:', gradientAngleText.value);
                }
            }
            
            // Load image positioning settings
            if (theme.imagePositionX) {
                console.log('🎨 Setting image position X to:', theme.imagePositionX);
                const positionX = document.getElementById('position-x');
                const positionXValue = document.getElementById('position-x-value');
                if (positionX) {
                    positionX.value = theme.imagePositionX;
                    console.log('🎨 Set position X:', positionX.value);
                }
                if (positionXValue) {
                    positionXValue.textContent = theme.imagePositionX;
                    console.log('🎨 Set position X value display:', positionXValue.textContent);
                }
            }
            
            if (theme.imagePositionY) {
                console.log('🎨 Setting image position Y to:', theme.imagePositionY);
                const positionY = document.getElementById('position-y');
                const positionYValue = document.getElementById('position-y-value');
                if (positionY) {
                    positionY.value = theme.imagePositionY;
                    console.log('🎨 Set position Y:', positionY.value);
                }
                if (positionYValue) {
                    positionYValue.textContent = theme.imagePositionY;
                    console.log('🎨 Set position Y value display:', positionYValue.textContent);
                }
            }
            
            if (theme.imageScale) {
                console.log('🎨 Setting image scale to:', theme.imageScale);
                const positionScale = document.getElementById('position-scale');
                const positionScaleValue = document.getElementById('position-scale-value');
                if (positionScale) {
                    positionScale.value = theme.imageScale;
                    console.log('🎨 Set position scale:', positionScale.value);
                }
                if (positionScaleValue) {
                    positionScaleValue.textContent = theme.imageScale;
                    console.log('🎨 Set position scale value display:', positionScaleValue.textContent);
                }
            }
            
            console.log('✅ Theme loaded into UI controls');
        }
        
        function applyThemeToPreview(theme) {
            const preview = document.querySelector('.phone-screen');
            if (!preview) return;
            
            // Apply background settings
            if (theme.backgroundType === 'solid') {
                // Sanitize CSS values to prevent CSS injection
                preview.style.background = sanitizeCSSValue(theme.backgroundColor, 'color') || '#ffffff';
            } else if (theme.backgroundType === 'gradient') {
                preview.style.background = sanitizeCSSValue(theme.gradientText, 'gradient') || 'linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)';
            } else if (theme.backgroundType === 'image') {
                preview.style.background = sanitizeCSSValue(theme.backgroundImage, 'url') || 'url()';
            }
            
            // Apply border effects
            if (theme.borderType) preview.style.borderStyle = theme.borderType;
            if (theme.borderStyle) preview.style.borderStyle = theme.borderStyle;
            if (theme.borderWidth) preview.style.borderWidth = theme.borderWidth;
            if (theme.borderRadius) preview.style.borderRadius = theme.borderRadius;
            if (theme.borderColor) preview.style.borderColor = theme.borderColor;
            
            // Apply profile and presentation text colors
            // Exclude .info-value elements and profile name - they have their own font size settings
            const textElements = preview.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, [class*="text"], [class*="name"], [class*="title"]');
            textElements.forEach(element => {
                // Skip .info-value elements - they have their own font size setting (1.125rem / 18px)
                if (element.classList.contains('info-value')) return;
                // Skip profile name - it has its own font size setting (1.75rem / 28px to match public.html)
                if (element.id === 'preview-name') return;
                // Skip social icons and their children - they keep fixed sizing to match public preview
                if (element.classList.contains('social-icon') || element.closest('.preview-social')) return;
                if (theme.profileTextColor) element.style.color = theme.profileTextColor;
                if (theme.presentationTextColor) element.style.color = theme.presentationTextColor;
                if (theme.textFontSize) element.style.fontSize = theme.textFontSize;
                if (theme.textFontWeight) element.style.fontWeight = theme.textFontWeight;
            });
            
            // Match profile name styling to public preview
            const previewName = document.getElementById('preview-name');
            if (previewName) {
                const nameColor = theme.presentationColor
                    || theme.profileTextColor
                    || theme.textColor
                    || '#1f2937';
                const nameFont = theme.presentationFont || theme.textFont || 'Arial';
                previewName.style.removeProperty('color');
                previewName.style.setProperty('color', nameColor);
                previewName.style.color = nameColor;
                const existingStyle = previewName.getAttribute('style') || '';
                previewName.setAttribute('style', `${existingStyle}; color: ${nameColor}; font-size: 1.75rem;`);
                previewName.style.setProperty('font-family', nameFont);
                previewName.style.setProperty('font-weight', theme.textFontWeight || '600');
            }
            
            // Presentation info styling
            const presentationFields = preview.querySelectorAll('.info-value');
            const previewPresentationColor = theme.presentationColor
                || theme.presentationTextColor
                || theme.textColor
                || '#4b5563';
            presentationFields.forEach(field => {
                field.style.removeProperty('color');
                field.style.setProperty('color', previewPresentationColor);
                field.style.color = previewPresentationColor;
                const existingStyle = field.getAttribute('style') || '';
                field.setAttribute('style', `${existingStyle}; color: ${previewPresentationColor}; font-size: 1.125rem;`);
            });
            
            // Apply footer color (matches profile text color)
            const footerText = preview.querySelector('.preview-footer-text');
            const footerLink = preview.querySelector('.preview-footer-text a');
            const profileColor = theme.presentationColor
                || theme.profileTextColor
                || theme.textColor
                || '#1f2937';
            if (footerText) {
                footerText.style.setProperty('color', profileColor);
                footerText.style.color = profileColor;
                if (footerLink) {
                    footerLink.style.setProperty('color', profileColor);
                    footerLink.style.color = profileColor;
                }
            }

            // Apply button styles only to individual preview link buttons
            const previewLinks = preview.querySelectorAll('.preview-link');
            console.log(`🔍 applyThemeToPreview: Found ${previewLinks.length} buttons, calling applyButtonStyles with theme.buttonFontSize="${theme.buttonFontSize}"`);
            applyButtonStyles(previewLinks, theme);
            
            // Log final computed font-sizes after applyButtonStyles
            previewLinks.forEach((button, index) => {
                const buttonText = button.textContent?.trim() || button.querySelector('.preview-link-text')?.textContent?.trim() || `button ${index}`;
                const textElement = button.querySelector('.preview-link-text');
                const computedTextSize = textElement ? window.getComputedStyle(textElement).fontSize : 'N/A';
                const computedButtonSize = window.getComputedStyle(button).fontSize;
                console.log(`🔍 applyThemeToPreview: Final computed sizes for "${buttonText.substring(0, 30)}..." - text element: ${computedTextSize}, button element: ${computedButtonSize}`);
            });
        }
        function getCurrentThemeFromUI() {
            if (isSaving) {
                console.log('🎨 Skipping theme update during save operation');
                return currentList?.theme || {};
            }
            // Capture all appearance settings from the appearance tab
            const preview = document.querySelector('.phone-screen');
            
            // During initialization, prioritize existing theme over UI controls
            // This ensures we use the theme that was just loaded, not potentially stale UI control values
            if (isInitializingTheme) {
                const existingTheme = currentList?.theme ? { ...currentList.theme } : (currentTheme ? { ...currentTheme } : {});
                if (Object.keys(existingTheme).length > 0) {
                    return existingTheme;
                }
            }
            
            // Start with existing theme from currentList or currentTheme to preserve all properties
            // This ensures we don't lose any theme properties that aren't in the UI controls
            let theme = currentList?.theme ? { ...currentList.theme } : (currentTheme ? { ...currentTheme } : {});
            
            // Default theme structure with all appearance settings (used as fallback for missing values)
            const defaultTheme = {
                // Background settings
                backgroundType: 'solid', // solid, gradient, image
                backgroundColor: '#ffffff',
                gradientText: 'linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)',
                backgroundImage: '',
                
                // Text colors
                profileTextColor: '#000000', // Profile information text color
                presentationTextColor: '#000000', // Presentation information text color
                
                // Button settings
                buttonTextColor: '#000000',
                buttonBackgroundColor: '#3b82f6',
                buttonStyle: 'soft', // soft, solid, outline, etc.
                
                // Border effects
                borderType: 'solid', // solid, dashed, dotted, etc.
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#1f2937',
                borderRadius: '8px',
                
                // Additional styling
                buttonBorderRadius: '8px',
                buttonPadding: '12px 24px',
                buttonFontSize: '16px',
                buttonFontWeight: '500',
                textFontSize: '18px',
                textFontWeight: '600'
            };
            
            // Merge defaults into theme for any missing values
            theme = { ...defaultTheme, ...theme };
            
            // PRIORITIZE UI CONTROLS - Read from UI controls to override any existing values
            
            // Try to capture appearance tab form controls using actual IDs from HTML
            const appearanceControls = [
                // Background controls
                'bg-color', 'bg-color-text', 'gradient-text', 'bg-image-upload',
                // Image positioning controls
                'position-x', 'position-y', 'position-scale',
                // Text color controls
                'presentation-color', 'presentation-color-text',
                // Button controls
                'button-text-color', 'button-text-color-text', 'button-bg-color', 'button-bg-color-text', 'button-style',
                // Border controls
                'border-color-picker', 'border-color-text', 'border-gradient-input', 'border-gradient-angle',
                // Gradient controls
                'gradient-angle', 'gradient-angle-text',
                // Additional controls that might exist
                'button-border-radius', 'button-padding', 'button-font-size', 'button-font-weight',
                'text-font-size', 'text-font-weight', 'border-width', 'border-radius'
            ];
            
            // Handle radio button groups
            // Background type radios
            const bgTypeRadios = document.querySelectorAll('input[name="bg-type"]');
            console.log(`🔍 Found ${bgTypeRadios.length} background type radio buttons`);
            bgTypeRadios.forEach((radio, index) => {
                console.log(`🔍 BG Radio ${index}:`, { value: radio.value, checked: radio.checked, visible: radio.offsetParent !== null });
                if (radio.checked) {
                    theme.backgroundType = radio.value;
                    console.log(`✅ Set background type to: ${radio.value}`);
                }
            });
            
            // Border type radios
            const borderTypeRadios = document.querySelectorAll('input[name="border-type"]');
            console.log(`🔍 Found ${borderTypeRadios.length} border type radio buttons`);
            borderTypeRadios.forEach((radio, index) => {
                console.log(`🔍 Border Type Radio ${index}:`, { value: radio.value, checked: radio.checked, visible: radio.offsetParent !== null });
                if (radio.checked) {
                    theme.borderType = radio.value;
                    console.log(`✅ Set border type to: ${radio.value}`);
                }
            });
            
            // Border style radios
            const borderStyleRadios = document.querySelectorAll('input[name="border-style"]');
            console.log(`🔍 Found ${borderStyleRadios.length} border style radio buttons`);
            borderStyleRadios.forEach((radio, index) => {
                console.log(`🔍 Border Style Radio ${index}:`, { value: radio.value, checked: radio.checked, visible: radio.offsetParent !== null });
                if (radio.checked) {
                    theme.borderStyle = radio.value;
                    console.log(`✅ Set border style to: ${radio.value}`);
                }
            });
            
            // Gradient border toggle
            const gradientBorderToggle = document.getElementById('gradient-border-toggle');
            if (gradientBorderToggle) {
                theme.gradientBorderEnabled = gradientBorderToggle.checked;
                console.log(`✅ Set gradient border enabled to: ${gradientBorderToggle.checked}`);
            }
            
            appearanceControls.forEach(controlId => {
                const element = document.getElementById(controlId);
                console.log(`🔍 Looking for control ${controlId}:`, element ? 'FOUND' : 'NOT FOUND');
                if (element) {
                    const value = element.value || element.textContent || element.getAttribute('data-value');
                    console.log(`🔍 Checking control ${controlId}:`, { element, value, visible: element.offsetParent !== null, display: element.style.display, hidden: element.hidden });
                    // Capture values even from hidden controls - remove the value check to capture all values
                    if (element && element.value !== undefined) {
                        // Map appearance control IDs to theme properties
                        switch (controlId) {
                            case 'bg-color':
                            case 'bg-color-text':
                                theme.backgroundColor = value;
                                break;
                            case 'gradient-text':
                                theme.gradientText = value;
                                break;
                            case 'bg-image-upload':
                                if (element.files && element.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        theme.backgroundImage = `url(${e.target.result})`;
                                    };
                                    reader.readAsDataURL(element.files[0]);
                                }
                                break;
                            case 'presentation-color':
                            case 'presentation-color-text':
                                if (value) {
                                    theme.presentationTextColor = value;
                                    theme.presentationColor = value; // Also set presentationColor
                                    theme.profileTextColor = value; // Use same color for both
                                }
                                break;
                            case 'button-text-color':
                            case 'button-text-color-text':
                                theme.buttonTextColor = value;
                                break;
                            case 'button-bg-color':
                            case 'button-bg-color-text':
                                theme.buttonBackgroundColor = value;
                                break;
                            case 'button-style':
                                theme.buttonStyle = value;
                                break;
                            case 'border-color-picker':
                            case 'border-color-text':
                                if (value) {
                                    theme.borderColor = value;
                                }
                                break;
                            case 'button-border-radius':
                                theme.buttonBorderRadius = value;
                                break;
                            case 'button-padding':
                                theme.buttonPadding = value;
                                break;
                            case 'button-font-size':
                                theme.buttonFontSize = value;
                                break;
                            case 'button-font-weight':
                                theme.buttonFontWeight = value;
                                break;
                            case 'text-font-size':
                                theme.textFontSize = value;
                                break;
                            case 'text-font-weight':
                                theme.textFontWeight = value;
                                break;
                            case 'border-width':
                                theme.borderWidth = value;
                                break;
                            case 'border-radius':
                                theme.borderRadius = value;
                                break;
                            // Image positioning controls
                            case 'position-x':
                                theme.imagePositionX = value;
                                break;
                            case 'position-y':
                                theme.imagePositionY = value;
                                break;
                            case 'position-scale':
                                theme.imageScale = value;
                                break;
                            // Border gradient controls
                            case 'border-gradient-input':
                                theme.borderGradientText = value;
                                break;
                            case 'border-gradient-angle':
                                theme.borderGradientAngle = value;
                                break;
                            // Gradient controls
                            case 'gradient-angle':
                                theme.gradientAngle = value;
                                break;
                            case 'gradient-angle-text':
                                theme.gradientAngle = value;
                                break;
                        }
                    }
                }
            });
            
            // Debug: Log what we captured
            console.log('🎨 Button settings:', {
                buttonTextColor: theme.buttonTextColor,
                buttonBackgroundColor: theme.buttonBackgroundColor,
                buttonStyle: theme.buttonStyle
            });
            console.log('🎨 Border settings:', {
                borderType: theme.borderType,
                borderStyle: theme.borderStyle,
                borderColor: theme.borderColor
            });
            
            console.log('🎨 Final theme object being returned:', theme);
            console.log('🎨 Theme object keys:', Object.keys(theme));
            console.log('🎨 Theme object size:', JSON.stringify(theme).length, 'characters');
            
            return theme;
        }
        
        // Helper function to detect if a position is within a finder pattern
        function isInFinderPattern(x, y, moduleSize, width, height) {
            const moduleX = Math.floor(x / moduleSize);
            const moduleY = Math.floor(y / moduleSize);
            const totalModules = Math.floor(width / moduleSize);
            
            // QR codes have a quiet zone (white border), so we need to account for that
            // The actual QR data starts after the quiet zone
            const quietZone = 4; // Standard quiet zone is 4 modules
            const dataModules = totalModules - (quietZone * 2); // Remove quiet zone from both sides
            
            // Finder patterns are 7x7 squares in the corners of the data area
            const finderSize = 7;
            
            // Debug logging for first few calls
            if (moduleX < 5 && moduleY < 5 && Math.random() < 0.05) {
                console.log(`Checking finder pattern: (${x},${y}) -> module (${moduleX},${moduleY}), totalModules: ${totalModules}, dataModules: ${dataModules}`);
            }
            
            // Top-left finder (quietZone, quietZone to quietZone+6, quietZone+6)
            if (moduleX >= quietZone && moduleX < quietZone + finderSize && 
                moduleY >= quietZone && moduleY < quietZone + finderSize) {
                if (moduleX < quietZone + 3 && moduleY < quietZone + 3) console.log(`Found top-left finder at (${moduleX},${moduleY})`);
                return true;
            }
            
            // Top-right finder (quietZone+dataModules-7, quietZone to quietZone+dataModules-1, quietZone+6)
            if (moduleX >= quietZone + dataModules - finderSize && moduleX < quietZone + dataModules && 
                moduleY >= quietZone && moduleY < quietZone + finderSize) {
                if (moduleX >= quietZone + dataModules - 3 && moduleY < quietZone + 3) console.log(`Found top-right finder at (${moduleX},${moduleY})`);
                return true;
            }
            
            // Bottom-left finder (quietZone, quietZone+dataModules-7 to quietZone+6, quietZone+dataModules-1)
            if (moduleX >= quietZone && moduleX < quietZone + finderSize && 
                moduleY >= quietZone + dataModules - finderSize && moduleY < quietZone + dataModules) {
                if (moduleX < quietZone + 3 && moduleY >= quietZone + dataModules - 3) console.log(`Found bottom-left finder at (${moduleX},${moduleY})`);
                return true;
            }
            
            return false;
        }

        async function applyQRPattern(pattern, container) {
            const canvas = container.querySelector('canvas');
            if (!canvas) {
                console.error('Canvas not found in container');
                return;
            }
            
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            switch(pattern) {
                case 'rounded':
                    container.classList.add('qr-rounded');
                    applyRoundedPattern(ctx, imageData, canvas.width, canvas.height);
                    break;
                case 'dots':
                    container.classList.add('qr-dots');
                    applyDotsPattern(ctx, imageData, canvas.width, canvas.height);
                    break;
                case 'extra-rounded':
                    container.classList.add('qr-extra-rounded');
                    applyExtraRoundedPattern(ctx, imageData, canvas.width, canvas.height);
                    break;
                default:
                    container.classList.add('qr-square');
                    // Keep default square pattern
                    break;
            }
            
            // Apply logo overlay if present
            if (currentQRLogo) {
                try {
                    await overlayLogoOnQR(canvas, currentQRLogo);
                } catch (error) {
                    console.error('Failed to apply logo overlay:', error);
                }
            }
            
            // Force browser to repaint the canvas
            canvas.style.display = 'none';
            canvas.offsetHeight; // Trigger reflow
            canvas.style.display = 'block';
            
            console.log('=== Pattern applied and forced repaint ===');
        }
        
        function applyRoundedPattern(ctx, imageData, width, height) {
            console.log('applyRoundedPattern: Starting redraw');
            const data = imageData.data;
            const moduleSize = Math.floor(width / 35); // QR codes typically have 35 modules at version 1
            console.log('Module size:', moduleSize);
            
            // Get current colors
            const bgColor = document.getElementById('qr-bg-color').value;
            const fgColor = document.getElementById('qr-color').value;
            
            // Fill background
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            let modulesDrawn = 0;
            let finderModules = [];
            
            // First pass: collect all modules and separate finder patterns
            for (let y = 0; y < height; y += moduleSize) {
                for (let x = 0; x < width; x += moduleSize) {
                    const i = (y * width + x) * 4;
                    const r = data[i];
                    
                    // If pixel is dark (QR code module)
                    if (r < 128) {
                        modulesDrawn++;
                        const isInFinder = isInFinderPattern(x, y, moduleSize, width, height);
                        
                        if (isInFinder) {
                            finderModules.push({x, y, moduleSize});
                        } else {
                            // Draw rounded rectangle for data modules - make it larger for better scannability
                            ctx.fillStyle = fgColor;
                            const rectX = x;
                            const rectY = y;
                            const rectW = moduleSize * 0.95; // Increased from 0.9 to 0.95
                            const rectH = moduleSize * 0.95; // Increased from 0.9 to 0.95
                            const radius = moduleSize * 0.2; // Reduced from 0.25 to 0.2 for less rounding
                            
                            // Draw rounded rectangle manually for better compatibility
                            ctx.beginPath();
                            ctx.moveTo(rectX + radius, rectY);
                            ctx.lineTo(rectX + rectW - radius, rectY);
                            ctx.arcTo(rectX + rectW, rectY, rectX + rectW, rectY + radius, radius);
                            ctx.lineTo(rectX + rectW, rectY + rectH - radius);
                            ctx.arcTo(rectX + rectW, rectY + rectH, rectX + rectW - radius, rectY + rectH, radius);
                            ctx.lineTo(rectX + radius, rectY + rectH);
                            ctx.arcTo(rectX, rectY + rectH, rectX, rectY + rectH - radius, radius);
                            ctx.lineTo(rectX, rectY + radius);
                            ctx.arcTo(rectX, rectY, rectX + radius, rectY, radius);
                            ctx.closePath();
                            ctx.fill();
                        }
                    }
                }
            }
            
            // Second pass: draw finder patterns last (on top) as solid squares
            ctx.fillStyle = fgColor;
            for (const module of finderModules) {
                // Draw solid square that fills the entire module space
                ctx.fillRect(module.x, module.y, module.moduleSize, module.moduleSize);
                if (Math.random() < 0.01) {
                    console.log(`Drawing solid finder square at (${module.x},${module.y}) size ${module.moduleSize}x${module.moduleSize}`);
                }
            }
            
            console.log('applyRoundedPattern: Drew', modulesDrawn, 'modules (', finderModules.length, 'finder patterns)');
        }
        
        function applyDotsPattern(ctx, imageData, width, height) {
            console.log('applyDotsPattern: Starting redraw');
            const data = imageData.data;
            const moduleSize = Math.floor(width / 35);
            console.log('Module size:', moduleSize);
            
            // Get current colors
            const bgColor = document.getElementById('qr-bg-color').value;
            const fgColor = document.getElementById('qr-color').value;
            
            // Fill background
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            let modulesDrawn = 0;
            let finderModules = [];
            
            // First pass: collect all modules and separate finder patterns
            for (let y = 0; y < height; y += moduleSize) {
                for (let x = 0; x < width; x += moduleSize) {
                    const i = (y * width + x) * 4;
                    const r = data[i];
                    
                    if (r < 128) {
                        modulesDrawn++;
                        const isInFinder = isInFinderPattern(x, y, moduleSize, width, height);
                        
                        if (isInFinder) {
                            finderModules.push({x, y, moduleSize});
                        } else {
                            // Draw circle for data modules - make it larger for better scannability
                            ctx.fillStyle = fgColor;
                            ctx.beginPath();
                            ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.45, 0, Math.PI * 2); // Increased from 0.4 to 0.45
                            ctx.fill();
                        }
                    }
                }
            }
            
            // Second pass: draw finder patterns last (on top) as solid squares
            ctx.fillStyle = fgColor;
            for (const module of finderModules) {
                // Draw solid square that fills the entire module space
                ctx.fillRect(module.x, module.y, module.moduleSize, module.moduleSize);
            }
            
            console.log('applyDotsPattern: Drew', modulesDrawn, 'circles (', finderModules.length, 'finder patterns)');
        }
        function applyExtraRoundedPattern(ctx, imageData, width, height) {
            console.log('applyExtraRoundedPattern: Starting redraw');
            const data = imageData.data;
            const moduleSize = Math.floor(width / 35);
            console.log('Module size:', moduleSize);
            
            // Get current colors
            const bgColor = document.getElementById('qr-bg-color').value;
            const fgColor = document.getElementById('qr-color').value;
            
            // Fill background
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            let modulesDrawn = 0;
            let finderModules = [];
            
            // First pass: collect all modules and separate finder patterns
            for (let y = 0; y < height; y += moduleSize) {
                for (let x = 0; x < width; x += moduleSize) {
                    const i = (y * width + x) * 4;
                    const r = data[i];
                    
                    if (r < 128) {
                        modulesDrawn++;
                        const isInFinder = isInFinderPattern(x, y, moduleSize, width, height);
                        
                        if (isInFinder) {
                            finderModules.push({x, y, moduleSize});
                        } else {
                            // Draw extra-rounded rectangle for data modules - make it larger for better scannability
                            ctx.fillStyle = fgColor;
                            const rectX = x;
                            const rectY = y;
                            const rectW = moduleSize * 0.9; // Increased from 0.85 to 0.9
                            const rectH = moduleSize * 0.9; // Increased from 0.85 to 0.9
                            const radius = moduleSize * 0.35; // Reduced from 0.4 to 0.35 for less rounding
                            
                            // Draw rounded rectangle manually for better compatibility
                            ctx.beginPath();
                            ctx.moveTo(rectX + radius, rectY);
                            ctx.lineTo(rectX + rectW - radius, rectY);
                            ctx.arcTo(rectX + rectW, rectY, rectX + rectW, rectY + radius, radius);
                            ctx.lineTo(rectX + rectW, rectY + rectH - radius);
                            ctx.arcTo(rectX + rectW, rectY + rectH, rectX + rectW - radius, rectY + rectH, radius);
                            ctx.lineTo(rectX + radius, rectY + rectH);
                            ctx.arcTo(rectX, rectY + rectH, rectX, rectY + rectH - radius, radius);
                            ctx.lineTo(rectX, rectY + radius);
                            ctx.arcTo(rectX, rectY, rectX + radius, rectY, radius);
                            ctx.closePath();
                            ctx.fill();
                        }
                    }
                }
            }
            
            // Second pass: draw finder patterns last (on top) as solid squares
            ctx.fillStyle = fgColor;
            for (const module of finderModules) {
                // Draw solid square that fills the entire module space
                ctx.fillRect(module.x, module.y, module.moduleSize, module.moduleSize);
            }
            
            console.log('applyExtraRoundedPattern: Drew', modulesDrawn, 'modules (', finderModules.length, 'finder patterns)');
        }
        
        function updateQRColorFromText() {
            const colorText = document.getElementById('qr-color-text');
            const colorPicker = document.getElementById('qr-color');
            const color = colorText.value;
            
            if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                colorPicker.value = color;
                generateQRCode();
            }
        }
        
        function updateQRBgColorFromText() {
            const colorText = document.getElementById('qr-bg-color-text');
            const colorPicker = document.getElementById('qr-bg-color');
            const color = colorText.value;
            
            if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                colorPicker.value = color;
                generateQRCode();
            }
        }
        
        function updateQRBorderColorFromText() {
            const colorText = document.getElementById('qr-border-color-text');
            const colorPicker = document.getElementById('qr-border-color');
            const color = colorText.value;
            
            if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                colorPicker.value = color;
                generateQRCode();
            }
        }
        
        function copyQRUrl() {
            const url = document.getElementById('qr-url').value;
            navigator.clipboard.writeText(url);
            showMessage('URL copied to clipboard!', 'success');
        }
        
        function downloadQRCode(format) {
            if (!currentQRCode) {
                showMessage('Please generate a QR code first', 'error');
                return;
            }
            
            const container = document.getElementById('qr-code-container');
            const canvas = container.querySelector('canvas');
            
            if (!canvas) {
                showMessage('QR code not found', 'error');
                return;
            }
            
            if (format === 'png') {
                // Download as PNG
                // Get padding (quiet zone) and border settings
                const qrPadding = parseInt(document.getElementById('qr-padding').value) || 0;
                const borderEnabled = document.getElementById('qr-border-enabled').checked;
                const borderWidth = borderEnabled ? parseInt(document.getElementById('qr-border-width').value) : 0;
                
                // Total padding is just the QR padding (quiet zone) - border is drawn inside/around QR code
                const totalPadding = qrPadding * 2;
                
                // Calculate total canvas size: QR code + padding + border (if enabled, border is drawn around QR code)
                const compositeWidth = canvas.width + totalPadding + (borderEnabled ? borderWidth * 2 : 0);
                const compositeHeight = canvas.height + totalPadding + (borderEnabled ? borderWidth * 2 : 0);
                
                // Always create a temporary canvas that includes padding
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = compositeWidth;
                tempCanvas.height = compositeHeight;
                const ctx = tempCanvas.getContext('2d');
                
                // Get the user's selected background color
                const bgColor = document.getElementById('qr-bg-color').value;
                
                // Fill entire canvas with background color (includes padding area)
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Calculate QR code position
                // Structure: border (outermost) -> padding -> QR code (innermost)
                // QR code is positioned after border and padding
                // The border stroke is centered on the line, so when drawn at (borderWidth/2, borderWidth/2),
                // it extends from 0 to borderWidth on the left, and the padded area is inside the border stroke.
                // Padded area: from borderWidth/2 to borderWidth/2 + canvas.width + qrPadding*2
                // QR code position: borderWidth/2 + qrPadding (to have qrPadding on left)
                const qrX = (borderEnabled ? borderWidth / 2 : 0) + qrPadding;
                const qrY = (borderEnabled ? borderWidth / 2 : 0) + qrPadding;
                
                // Draw border if enabled (around the padding area, border is OUTSIDE the padding)
                if (borderEnabled) {
                    const borderColor = document.getElementById('qr-border-color').value;
                    const borderStyle = document.getElementById('qr-border-style').value;
                    const borderRadius = parseInt(document.getElementById('qr-border-radius').value);
                    
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    
                            // Border is drawn around the padded area
                            // The padded area is: QR code + padding on all sides
                            // Border stroke is centered on the line, so we need to account for that
                            // The padded area starts at (borderWidth, borderWidth) and has size (canvas.width + qrPadding*2, canvas.height + qrPadding*2)
                            // The border should be drawn around this area, so the border line is at the edge of the padded area
                            // Since stroke is centered, borderX = borderWidth - borderWidth/2 = borderWidth/2
                            const paddedAreaWidth = canvas.width + (qrPadding * 2);
                            const paddedAreaHeight = canvas.height + (qrPadding * 2);
                            const borderX = borderWidth / 2;
                            const borderY = borderWidth / 2;
                            const borderW = paddedAreaWidth - borderWidth;
                            const borderH = paddedAreaHeight - borderWidth;
                    
                    // Set line dash for dashed/dotted borders
                    if (borderStyle === 'dashed') {
                        ctx.setLineDash([borderWidth * 2, borderWidth]);
                    } else if (borderStyle === 'dotted') {
                        ctx.setLineDash([borderWidth, borderWidth]);
                    } else if (borderStyle === 'double') {
                        ctx.lineWidth = borderWidth / 3;
                        ctx.strokeRect(borderX, borderY, borderW, borderH);
                        ctx.strokeRect(borderX + borderWidth, borderY + borderWidth, borderW - borderWidth * 2, borderH - borderWidth * 2);
                    }
                    
                    if (borderStyle !== 'double') {
                        if (borderRadius > 0) {
                            ctx.beginPath();
                            ctx.moveTo(borderX + borderRadius, borderY);
                            ctx.lineTo(borderX + borderW - borderRadius, borderY);
                            ctx.arcTo(borderX + borderW, borderY, borderX + borderW, borderY + borderRadius, borderRadius);
                            ctx.lineTo(borderX + borderW, borderY + borderH - borderRadius);
                            ctx.arcTo(borderX + borderW, borderY + borderH, borderX + borderW - borderRadius, borderY + borderH, borderRadius);
                            ctx.lineTo(borderX + borderRadius, borderY + borderH);
                            ctx.arcTo(borderX, borderY + borderH, borderX, borderY + borderH - borderRadius, borderRadius);
                            ctx.lineTo(borderX, borderY + borderRadius);
                            ctx.arcTo(borderX, borderY, borderX + borderRadius, borderY, borderRadius);
                            ctx.closePath();
                            ctx.stroke();
                        } else {
                            ctx.strokeRect(borderX, borderY, borderW, borderH);
                        }
                    }
                    
                    ctx.setLineDash([]);
                }
                
                // Draw the QR code canvas at the calculated position (inside padding, inside border)
                ctx.drawImage(canvas, qrX, qrY);
                
                // Download
                const link = document.createElement('a');
                link.download = (currentList ? currentList.slug : 'qrcode') + '-qrcode.png';
                link.href = tempCanvas.toDataURL('image/png');
                link.click();
                showMessage('QR Code downloaded as PNG', 'success');
            } else if (format === 'jpeg') {
                // Download as JPEG
                // Get padding (quiet zone) and border settings
                const qrPadding = parseInt(document.getElementById('qr-padding').value) || 0;
                const borderEnabled = document.getElementById('qr-border-enabled').checked;
                const borderWidth = borderEnabled ? parseInt(document.getElementById('qr-border-width').value) : 0;
                
                // Calculate total padding: QR padding (quiet zone) + border width on each side
                const totalPadding = qrPadding * 2 + (borderWidth * 2);
                
                // Create a temporary canvas with the QR code's background color (JPEG doesn't support transparency)
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width + totalPadding;
                tempCanvas.height = canvas.height + totalPadding;
                const ctx = tempCanvas.getContext('2d');
                
                // Get the user's selected background color
                const bgColor = document.getElementById('qr-bg-color').value;
                
                // Fill entire canvas with background color (includes padding area)
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Draw border if enabled (on top of padding)
                if (borderEnabled) {
                    const borderColor = document.getElementById('qr-border-color').value;
                    const borderStyle = document.getElementById('qr-border-style').value;
                    const borderRadius = parseInt(document.getElementById('qr-border-radius').value);
                    
                    // Draw border rectangle
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    
                    // Set line dash for dashed/dotted borders
                    if (borderStyle === 'dashed') {
                        ctx.setLineDash([borderWidth * 2, borderWidth]);
                    } else if (borderStyle === 'dotted') {
                        ctx.setLineDash([borderWidth, borderWidth]);
                    } else if (borderStyle === 'double') {
                        // Draw first border
                        ctx.lineWidth = borderWidth / 3;
                        const borderX = qrPadding + borderWidth / 2;
                        const borderY = qrPadding + borderWidth / 2;
                        const borderW = canvas.width + borderWidth;
                        const borderH = canvas.height + borderWidth;
                        ctx.strokeRect(borderX, borderY, borderW, borderH);
                        // Draw second border
                        ctx.strokeRect(borderX + borderWidth, borderY + borderWidth, borderW - borderWidth * 2, borderH - borderWidth * 2);
                    }
                    
                    if (borderStyle !== 'double') {
                        // Draw rounded rectangle for border
                        if (borderRadius > 0) {
                            ctx.beginPath();
                            const x = qrPadding + borderWidth / 2;
                            const y = qrPadding + borderWidth / 2;
                            const width = canvas.width + borderWidth;
                            const height = canvas.height + borderWidth;
                            ctx.moveTo(x + borderRadius, y);
                            ctx.lineTo(x + width - borderRadius, y);
                            ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
                            ctx.lineTo(x + width, y + height - borderRadius);
                            ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
                            ctx.lineTo(x + borderRadius, y + height);
                            ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
                            ctx.lineTo(x, y + borderRadius);
                            ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
                            ctx.closePath();
                            ctx.stroke();
                        } else {
                            const borderX = qrPadding + borderWidth / 2;
                            const borderY = qrPadding + borderWidth / 2;
                            const borderW = canvas.width + borderWidth;
                            const borderH = canvas.height + borderWidth;
                            ctx.strokeRect(borderX, borderY, borderW, borderH);
                        }
                    }
                    
                    ctx.setLineDash([]); // Reset line dash
                }
                
                // Draw the QR code canvas in the center (after padding and border)
                ctx.drawImage(canvas, qrPadding + borderWidth, qrPadding + borderWidth);
                
                // Download as JPEG with quality setting (0.95 = 95% quality)
                const link = document.createElement('a');
                link.download = (currentList ? currentList.slug : 'qrcode') + '-qrcode.jpg';
                link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
                link.click();
                showMessage('QR Code downloaded as JPEG', 'success');
            } else if (format === 'svg') {
                // For SVG, we need to convert canvas to SVG
                // This is a simplified version - for production, use a proper canvas-to-svg library
                showMessage('SVG download coming soon! Use PNG for now.', 'info');
            }
        }
        
        function printQRCode() {
            showMessage('Print function is temporarily disabled for debugging', 'info');
            return;
        }
        
        function handleQRLogoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                currentQRLogo = e.target.result;
                
                // Show preview
                const preview = document.getElementById('qr-logo-preview');
                const img = document.getElementById('qr-logo-img');
                img.src = currentQRLogo;
                preview.style.display = 'block';
                
                // Regenerate QR code with logo
                generateQRCode();
                
                showMessage('Logo uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
        
        function removeQRLogo() {
            currentQRLogo = null;
            document.getElementById('qr-logo-preview').style.display = 'none';
            document.getElementById('qr-logo-img').src = '';
            document.getElementById('qr-logo-upload').value = '';
            
            // Regenerate QR code without logo
            generateQRCode();
            
            showMessage('Logo removed', 'success');
        }
        
        function selectQRLogoFromLibrary() {
            // Set flag to indicate we're selecting for QR logo
            window.selectingImageForQRLogo = true;
            // Open media library modal
            openMediaLibrary();
        }
        
        function selectImageForQRLogo(imageUrl) {
            currentQRLogo = imageUrl;
            
            // Show preview
            const preview = document.getElementById('qr-logo-preview');
            const img = document.getElementById('qr-logo-img');
            img.src = currentQRLogo;
            preview.style.display = 'block';
            
            // Clear the flag
            window.selectingImageForQRLogo = false;
            
            // Close the media library
            closeMediaLibrary();
            
            // Regenerate QR code with logo
            generateQRCode();
            
            showMessage('Logo selected from library!', 'success');
        }
        
        function useDefaultAcademiQRLogo() {
            // Use the AcademiQR logo from online storage or fallback to local
            currentQRLogo = ASSET_URLS.logo || 'AcademiQR_logo.png';
            
            // Show preview
            const preview = document.getElementById('qr-logo-preview');
            const img = document.getElementById('qr-logo-img');
            img.src = currentQRLogo;
            preview.style.display = 'block';
            
            // Regenerate QR code with logo
            generateQRCode();
            
            showMessage('AcademiQR logo applied!', 'success');
        }
        
        function overlayLogoOnQR(canvas, logoSrc) {
            return new Promise((resolve, reject) => {
                if (!logoSrc) {
                    resolve(canvas);
                    return;
                }
                
                const ctx = canvas.getContext('2d');
                const logo = new Image();
                
                logo.onload = function() {
                    // Calculate logo size (max 20% of QR code size for scannability)
                    const maxLogoSize = canvas.width * 0.20;
                    let logoWidth = logo.width;
                    let logoHeight = logo.height;
                    
                    // Scale logo to fit within max size while maintaining aspect ratio
                    if (logoWidth > maxLogoSize || logoHeight > maxLogoSize) {
                        const scale = Math.min(maxLogoSize / logoWidth, maxLogoSize / logoHeight);
                        logoWidth = logoWidth * scale;
                        logoHeight = logoHeight * scale;
                    }
                    
                    // Calculate position (center of QR code)
                    const x = (canvas.width - logoWidth) / 2;
                    const y = (canvas.height - logoHeight) / 2;
                    
                    // Draw white background circle/square for logo (for better visibility)
                    const padding = 8;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, canvas.height / 2, (Math.max(logoWidth, logoHeight) / 2) + padding, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw logo
                    ctx.drawImage(logo, x, y, logoWidth, logoHeight);
                    
                    resolve(canvas);
                };
                
                logo.onerror = function() {
                    console.error('Failed to load logo');
                    reject(new Error('Failed to load logo'));
                };
                
                logo.src = logoSrc;
            });
        }
        
        // Asset URLs (will be populated after upload)
        const ASSET_URLS = {
            logo: null,
            logoDark: null
        };
        
        // Initialize asset URLs from Supabase Storage
        async function initializeAssetUrls() {
            try {
                // Check if assets exist in Supabase Storage
                const { data: logoData, error: logoError } = await supabaseClient.storage
                    .from('assets')
                    .getPublicUrl('AcademiQR_logo.png');
                    
                const { data: logoDarkData, error: logoDarkError } = await supabaseClient.storage
                    .from('assets')
                    .getPublicUrl('AcademiQR_logo_Dark.png');
                
                if (!logoError && logoData?.publicUrl) {
                    ASSET_URLS.logo = logoData.publicUrl;
                }
                
                if (!logoDarkError && logoDarkData?.publicUrl) {
                    ASSET_URLS.logoDark = logoDarkData.publicUrl;
                    
                    // Update the header logo to use the online URL
                    updateHeaderLogo();
                }
                
            } catch (error) {
                console.log('Assets not found in Supabase Storage, using local files');
                // Fallback to local files
                ASSET_URLS.logo = 'AcademiQR_logo.png';
                ASSET_URLS.logoDark = 'AcademiQR_logo_Dark.png';
            }
        }
        // Update header logo to use online URL
        function updateHeaderLogo() {
            // Use the public URL directly - it should work if the bucket is public
            const loginLogo = document.getElementById('login-logo');
            const sidebarLogo = document.getElementById('sidebar-logo');
            
            if (!loginLogo && !sidebarLogo) {
                return;
            }
            
            if (!ASSET_URLS.logoDark) {
                return;
            }
            
            // Set both logos to use the public URL
            // Try without crossorigin first - if CORS is not configured, crossorigin can cause issues
            if (loginLogo) {
                // Don't set crossorigin - let the browser handle it naturally
                loginLogo.src = ASSET_URLS.logoDark;
                loginLogo.onload = function() {
                    this.style.display = 'block';
                    const fallback = document.getElementById('login-logo-fallback');
                    if (fallback) {
                        fallback.style.display = 'none';
                    }
                };
                loginLogo.onerror = function() {
                    // If image fails to load, keep fallback visible
                    this.style.display = 'none';
                    const fallback = document.getElementById('login-logo-fallback');
                    if (fallback) {
                        fallback.style.display = 'block';
                    }
                };
            }
            
            if (sidebarLogo) {
                // Don't set crossorigin - let the browser handle it naturally
                sidebarLogo.src = ASSET_URLS.logoDark;
                
                    // Set up the onload event to resize after image loads
                    sidebarLogo.onload = function() {
                        // Show logo and hide fallback, ensure it's centered
                        this.style.display = 'block';
                        this.style.margin = '0 auto 4px auto';
                        const fallback = document.getElementById('sidebar-logo-fallback');
                        if (fallback) {
                            fallback.style.display = 'none';
                        }
                        
                        // Ensure container is set up for centering
                        const logoContainer = sidebarLogo.parentElement;
                        if (logoContainer) {
                            logoContainer.style.setProperty('display', 'flex', 'important');
                            logoContainer.style.setProperty('justify-content', 'center', 'important');
                            logoContainer.style.setProperty('align-items', 'center', 'important');
                            logoContainer.style.setProperty('flex-direction', 'column', 'important');
                        }
                        
                        // Force parent containers to have proper dimensions
                        const logoSection = sidebarLogo.closest('.logo-section');
                        const sidebarHeader = sidebarLogo.closest('.sidebar-header');
                        const sidebar = sidebarLogo.closest('.sidebar');
                        
                        if (logoContainer) {
                            logoContainer.style.setProperty('width', '280px', 'important');
                            logoContainer.style.setProperty('height', 'auto', 'important');
                            logoContainer.style.setProperty('min-width', '280px', 'important');
                            logoContainer.style.setProperty('min-height', '20px', 'important');
                        }
                        
                        if (logoSection) {
                            logoSection.style.setProperty('display', 'flex', 'important');
                            logoSection.style.setProperty('justify-content', 'center', 'important');
                            logoSection.style.setProperty('align-items', 'center', 'important');
                            logoSection.style.setProperty('width', '280px', 'important');
                            logoSection.style.setProperty('height', 'auto', 'important');
                            logoSection.style.setProperty('min-width', '280px', 'important');
                            logoSection.style.setProperty('min-height', '20px', 'important');
                        }
                        
                        if (sidebarHeader) {
                            sidebarHeader.style.setProperty('display', 'flex', 'important');
                            sidebarHeader.style.setProperty('justify-content', 'center', 'important');
                            sidebarHeader.style.setProperty('align-items', 'center', 'important');
                            sidebarHeader.style.setProperty('width', '280px', 'important');
                            sidebarHeader.style.setProperty('height', 'auto', 'important');
                            sidebarHeader.style.setProperty('min-width', '280px', 'important');
                            sidebarHeader.style.setProperty('min-height', 'auto', 'important');
                        }
                        
                        if (sidebar) {
                            sidebar.style.setProperty('width', '280px', 'important');
                            sidebar.style.setProperty('height', '100vh', 'important');
                            sidebar.style.setProperty('min-width', '280px', 'important');
                        }
                        
                        // Force the logo to be visible and sized, ensure it's centered
                        sidebarLogo.style.setProperty('display', 'block', 'important');
                        sidebarLogo.style.setProperty('visibility', 'visible', 'important');
                        sidebarLogo.style.setProperty('opacity', '1', 'important');
                        sidebarLogo.style.setProperty('height', '100px', 'important');
                        sidebarLogo.style.setProperty('width', 'auto', 'important');
                        sidebarLogo.style.setProperty('max-height', '100px', 'important');
                        sidebarLogo.style.setProperty('min-height', '100px', 'important');
                        sidebarLogo.style.setProperty('margin', '0 auto 4px auto', 'important');
                        
                        sidebarLogo.setAttribute('height', '100');
                        sidebarLogo.removeAttribute('width');
                    };
                
                    sidebarLogo.onerror = function() {
                        // If image fails to load, keep fallback visible
                        this.style.display = 'none';
                        const fallback = document.getElementById('sidebar-logo-fallback');
                        if (fallback) {
                            fallback.style.display = 'block';
                        }
                    };
                }
        }
        
        
        // Upload assets to Supabase Storage
        async function uploadAssetsToSupabase() {
            try {
                console.log('Uploading assets to Supabase Storage...');
                
                // Create assets bucket if it doesn't exist
                const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();
                const assetsBucket = buckets?.find(bucket => bucket.name === 'assets');
                
                if (!assetsBucket) {
                    const { error: createError } = await supabaseClient.storage.createBucket('assets', {
                        public: true,
                        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']
                    });
                    
                    if (createError) {
                        console.error('Error creating assets bucket:', createError);
                        return;
                    }
                    console.log('Assets bucket created');
                }
                
                // Upload logo files
                const logoFiles = [
                    { name: 'AcademiQR_logo.png', file: 'AcademiQR_logo.png' },
                    { name: 'AcademiQR_logo_Dark.png', file: 'AcademiQR_logo_Dark.png' }
                ];
                
                for (const logoFile of logoFiles) {
                    try {
                        // Read the local file
                        const response = await fetch(logoFile.file);
                        const blob = await response.blob();
                        
                        // Upload to Supabase Storage
                        const { data, error } = await supabaseClient.storage
                            .from('assets')
                            .upload(logoFile.name, blob, {
                                cacheControl: '3600',
                                upsert: true
                            });
                        
                        if (error) {
                            console.error(`Error uploading ${logoFile.name}:`, error);
                        }
                    } catch (fileError) {
                        console.error(`Error reading ${logoFile.name}:`, fileError);
                    }
                }
                
                // Refresh asset URLs
                await initializeAssetUrls();
                
            } catch (error) {
                console.error('Error uploading assets:', error);
            }
        }
        
        function showProfile() {
            console.log('showProfile called');
            document.getElementById('profileModal').classList.remove('hidden');
            loadProfileData();
        }

        function closeProfile() {
            document.getElementById('profileModal').classList.add('hidden');
        }
        
        function isValidEmail(email) {
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function isValidUrl(url) {
            // Check if URL starts with http:// or https://
            if (!url.match(/^https?:\/\//i)) {
                return false;
            }
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        }
        
        function autoCorrectUrl(url) {
            // Auto-add https:// if missing
            if (url && !url.match(/^https?:\/\//i)) {
                return 'https://' + url;
            }
            return url;
        }

        async function loadProfileData() {
            // Load current profile data from Supabase
            const displayNameElement = document.getElementById('profileDisplayName');
            const profileDisplayNameElement = document.getElementById('profileDisplayName');
            const profilePhotoImg = document.getElementById('profilePhotoImg');
            const removePhotoBtn = document.getElementById('removePhotoBtn');
            
            // Set up profile photo upload handler
            const profileAvatarInput = document.getElementById('profileAvatar');
            if (profileAvatarInput) {
                // Remove existing listener if any
                profileAvatarInput.removeEventListener('change', handleProfilePhotoUpload);
                profileAvatarInput.addEventListener('change', handleProfilePhotoUpload);
            }
            
            // Load from display name field first
            if (profileDisplayNameElement && displayNameElement) {
                profileDisplayNameElement.value = displayNameElement.value || '';
            }
            
            // Load profile data from Supabase
            if (currentUser && supabaseClient) {
                try {
                    const { data, error } = await supabaseClient
                        .from('profiles')
                        .select('display_name, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, profile_photo, profile_photo_position')
                        .eq('id', currentUser.id)
                        .single();
                    
                    if (error) {
                        console.warn('Error loading profile from Supabase:', error);
                    } else if (data) {
                        console.log('Loaded profile data from Supabase for modal:', data);
                        
                        // Update display name
                        if (profileDisplayNameElement && data.display_name) {
                            profileDisplayNameElement.value = data.display_name;
                        }
                        
                        // Update social links
                        const profileSocialEmail = document.getElementById('profileSocialEmail');
                        const profileSocialInstagram = document.getElementById('profileSocialInstagram');
                        const profileSocialFacebook = document.getElementById('profileSocialFacebook');
                        const profileSocialTwitter = document.getElementById('profileSocialTwitter');
                        const profileSocialLinkedin = document.getElementById('profileSocialLinkedin');
                        const profileSocialYoutube = document.getElementById('profileSocialYoutube');
                        const profileSocialTiktok = document.getElementById('profileSocialTiktok');
                        const profileSocialSnapchat = document.getElementById('profileSocialSnapchat');
                        
                        if (profileSocialEmail) profileSocialEmail.value = data.social_email || '';
                        if (profileSocialInstagram) profileSocialInstagram.value = data.social_instagram || '';
                        if (profileSocialFacebook) profileSocialFacebook.value = data.social_facebook || '';
                        if (profileSocialTwitter) profileSocialTwitter.value = data.social_twitter || '';
                        if (profileSocialLinkedin) profileSocialLinkedin.value = data.social_linkedin || '';
                        if (profileSocialYoutube) profileSocialYoutube.value = data.social_youtube || '';
                        if (profileSocialTiktok) profileSocialTiktok.value = data.social_tiktok || '';
                        if (profileSocialSnapchat) profileSocialSnapchat.value = data.social_snapchat || '';
                        
                        // Update profile photo
                        if (data.profile_photo && profilePhotoImg) {
                            currentProfilePhoto.src = data.profile_photo;
                            
                            // Load position data if it exists
                            if (data.profile_photo_position) {
                                try {
                                    const position = JSON.parse(data.profile_photo_position);
                                    currentProfilePhoto.scale = position.scale || 100;
                                    currentProfilePhoto.x = position.x || 50;
                                    currentProfilePhoto.y = position.y || 50;
                                    console.log('Loaded profile photo position:', position);
                                } catch (e) {
                                    console.warn('Could not parse profile photo position:', e);
                                    currentProfilePhoto.scale = 100;
                                    currentProfilePhoto.x = 50;
                                    currentProfilePhoto.y = 50;
                                }
                            } else {
                                currentProfilePhoto.scale = 100;
                                currentProfilePhoto.x = 50;
                                currentProfilePhoto.y = 50;
                            }
                            
                            profilePhotoImg.src = data.profile_photo;
                            applyProfilePhotoTransform();
                            
                            const profilePhotoContainer = document.getElementById('profilePhotoContainer');
                            const editProfilePhotoBtn = document.getElementById('editProfilePhotoBtn');
                            
                            if (profilePhotoContainer) {
                                profilePhotoContainer.style.display = 'block';
                            }
                            if (removePhotoBtn) {
                                removePhotoBtn.style.display = 'inline-block';
                            }
                            if (editProfilePhotoBtn) {
                                editProfilePhotoBtn.style.display = 'inline-block';
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error loading profile data:', error);
                }
            }
        }

        // Store profile photo data
        let currentProfilePhoto = {
            src: '',
            scale: 100,
            x: 50,
            y: 50
        };

        function handleProfilePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentProfilePhoto.src = e.target.result;
                    currentProfilePhoto.scale = 100;
                    currentProfilePhoto.x = 50;
                    currentProfilePhoto.y = 50;
                    
                    const profilePhotoImg = document.getElementById('profilePhotoImg');
                    const profilePhotoContainer = document.getElementById('profilePhotoContainer');
                    const removePhotoBtn = document.getElementById('removePhotoBtn');
                    const editProfilePhotoBtn = document.getElementById('editProfilePhotoBtn');
                    
                    if (profilePhotoImg) {
                        profilePhotoImg.src = e.target.result;
                        applyProfilePhotoTransform();
                    }
                    
                    if (profilePhotoContainer) {
                        profilePhotoContainer.style.display = 'block';
                    }
                    
                    if (removePhotoBtn) {
                        removePhotoBtn.style.display = 'inline-block';
                    }
                    
                    if (editProfilePhotoBtn) {
                        editProfilePhotoBtn.style.display = 'inline-block';
                    }
                    
                    // Update live preview immediately
                    updateProfilePhotoPreview();
                };
                reader.readAsDataURL(file);
            }
        }
        
        function applyProfilePhotoTransform() {
            const profilePhotoImg = document.getElementById('profilePhotoImg');
            if (!profilePhotoImg || !currentProfilePhoto.src) return;
            
            const scale = currentProfilePhoto.scale / 100;
            const panX = (currentProfilePhoto.x - 50) * -1;
            const panY = (currentProfilePhoto.y - 50) * -1;
            
            profilePhotoImg.style.transform = `translate(${panX}%, ${panY}%) scale(${scale})`;
        }
        
        function updateProfilePhotoPreview() {
            const previewAvatar = document.getElementById('preview-avatar');
            if (!previewAvatar || !currentProfilePhoto.src) return;
            
            const scale = currentProfilePhoto.scale / 100;
            const panX = (currentProfilePhoto.x - 50) * -1;
            const panY = (currentProfilePhoto.y - 50) * -1;
            
            const imgSrc = currentProfilePhoto.src || '';
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = 'Profile';
            img.style.cssText = 'width: 100% !important; height: 100% !important; border-radius: 50% !important; object-fit: cover !important; display: block !important; transform: translate(' + panX + '%, ' + panY + '%) scale(' + scale + ') !important; transform-origin: center center !important;';
            previewAvatar.innerHTML = '';
            previewAvatar.appendChild(img);
        }
        
        function editProfilePhoto() {
            if (!currentProfilePhoto.src) return;
            
            // Open edit modal
            document.getElementById('profilePhotoEditModal').classList.remove('hidden');
            
            // Set up edit preview
            const editImg = document.getElementById('profilePhotoEditImg');
            const scaleInput = document.getElementById('profilePhotoScale');
            const xInput = document.getElementById('profilePhotoX');
            const yInput = document.getElementById('profilePhotoY');
            const scaleValue = document.getElementById('profilePhotoScaleValue');
            
            if (editImg) editImg.src = currentProfilePhoto.src;
            if (scaleInput) scaleInput.value = currentProfilePhoto.scale;
            if (xInput) xInput.value = currentProfilePhoto.x;
            if (yInput) yInput.value = currentProfilePhoto.y;
            if (scaleValue) scaleValue.textContent = currentProfilePhoto.scale + '%';
            
            // Apply current transform
            applyProfilePhotoEditTransform();
            
            // Set up event listeners
            if (scaleInput) {
                scaleInput.oninput = function() {
                    if (scaleValue) scaleValue.textContent = this.value + '%';
                    applyProfilePhotoEditTransform();
                };
            }
            
            if (xInput) {
                xInput.oninput = function() {
                    applyProfilePhotoEditTransform();
                };
            }
            
            if (yInput) {
                yInput.oninput = function() {
                    applyProfilePhotoEditTransform();
                };
            }
        }
        
        function applyProfilePhotoEditTransform() {
            const editImg = document.getElementById('profilePhotoEditImg');
            const scaleInput = document.getElementById('profilePhotoScale');
            const xInput = document.getElementById('profilePhotoX');
            const yInput = document.getElementById('profilePhotoY');
            
            if (!editImg || !scaleInput || !xInput || !yInput) return;
            
            const scale = parseInt(scaleInput.value) / 100;
            const panX = (parseInt(xInput.value) - 50) * -1;
            const panY = (parseInt(yInput.value) - 50) * -1;
            
            editImg.style.transform = `translate(${panX}%, ${panY}%) scale(${scale})`;
        }
        
        function saveProfilePhotoEdit() {
            const scaleInput = document.getElementById('profilePhotoScale');
            const xInput = document.getElementById('profilePhotoX');
            const yInput = document.getElementById('profilePhotoY');
            
            if (scaleInput) currentProfilePhoto.scale = parseInt(scaleInput.value);
            if (xInput) currentProfilePhoto.x = parseInt(xInput.value);
            if (yInput) currentProfilePhoto.y = parseInt(yInput.value);
            
            // Apply to profile modal preview
            applyProfilePhotoTransform();
            
            // Update live preview
            updateProfilePhotoPreview();
            
            // Close modal
            closeProfilePhotoEdit();
            
            showMessage('Profile photo position updated!', 'success');
        }
        
        function closeProfilePhotoEdit() {
            document.getElementById('profilePhotoEditModal').classList.add('hidden');
        }
        function removeProfilePhoto() {
            const profilePhotoImg = document.getElementById('profilePhotoImg');
            const profilePhotoContainer = document.getElementById('profilePhotoContainer');
            const removePhotoBtn = document.getElementById('removePhotoBtn');
            const editProfilePhotoBtn = document.getElementById('editProfilePhotoBtn');
            const profileAvatarInput = document.getElementById('profileAvatar');
            
            // Clear current photo data
            currentProfilePhoto = {
                src: '',
                scale: 100,
                x: 50,
                y: 50
            };
            
            if (profilePhotoImg) {
                profilePhotoImg.src = '';
            }
            
            if (profilePhotoContainer) {
                profilePhotoContainer.style.display = 'none';
            }
            
            if (removePhotoBtn) {
                removePhotoBtn.style.display = 'none';
            }
            
            if (editProfilePhotoBtn) {
                editProfilePhotoBtn.style.display = 'none';
            }
            
            if (profileAvatarInput) {
                profileAvatarInput.value = '';
            }
            
            // Update live preview to show default avatar
            const previewAvatar = document.getElementById('preview-avatar');
            if (previewAvatar) {
                previewAvatar.innerHTML = '👤';
            }
        }

        // Profile photo is now loaded by loadSocialLinksOnInit() from Supabase
        // This function is no longer needed but kept for compatibility
        function loadProfilePhotoOnInit() {
            console.log('Profile photo loading is now handled by loadSocialLinksOnInit()');
        }

        async function loadSocialLinksOnInit() {
            console.log('Loading social links from Supabase...');
            
            if (!currentUser || !supabaseClient) {
                console.log('No user or Supabase client, hiding social icons');
                updateSocialLinks({
                    email: '',
                    instagram: '',
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                    youtube: '',
                    tiktok: '',
                    snapchat: ''
                });
                return;
            }
            
            try {
                const { data, error } = await supabaseClient
                    .from('profiles')
                    .select('social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, profile_photo, profile_photo_position')
                    .eq('id', currentUser.id)
                    .single();
                
                if (error) {
                    console.warn('Error loading profile from Supabase:', error);
                    // Hide all social icons by default
                    updateSocialLinks({
                        email: '',
                        instagram: '',
                        facebook: '',
                        twitter: '',
                        linkedin: '',
                        youtube: '',
                        tiktok: '',
                        snapchat: ''
                    });
                } else if (data) {
                    console.log('Loaded profile data from Supabase:', data);
                    
                    // Update social links
                    updateSocialLinks({
                        email: data.social_email || '',
                        instagram: data.social_instagram || '',
                        facebook: data.social_facebook || '',
                        twitter: data.social_twitter || '',
                        linkedin: data.social_linkedin || '',
                        youtube: data.social_youtube || '',
                        tiktok: data.social_tiktok || '',
                        snapchat: data.social_snapchat || ''
                    });
                    
                    // Update profile photo if exists
                    if (data.profile_photo) {
                        // Load position data if it exists
                        let scale = 100, x = 50, y = 50;
                        if (data.profile_photo_position) {
                            try {
                                const position = JSON.parse(data.profile_photo_position);
                                scale = position.scale || 100;
                                x = position.x || 50;
                                y = position.y || 50;
                                
                                // Update currentProfilePhoto for consistency
                                currentProfilePhoto.src = data.profile_photo;
                                currentProfilePhoto.scale = scale;
                                currentProfilePhoto.x = x;
                                currentProfilePhoto.y = y;
                            } catch (e) {
                                console.warn('Could not parse profile photo position:', e);
                            }
                        }
                        
                        const scaleValue = scale / 100;
                        const panX = (x - 50) * -1;
                        const panY = (y - 50) * -1;
                        
                        const previewAvatar = document.getElementById('preview-avatar');
                        if (previewAvatar) {
                            const imgSrc = data.profile_photo || '';
                            const img = document.createElement('img');
                            img.src = imgSrc;
                            img.alt = 'Profile';
                            img.style.cssText = 'width: 100% !important; height: 100% !important; border-radius: 50% !important; object-fit: cover !important; display: block !important; transform: translate(' + panX + '%, ' + panY + '%) scale(' + scaleValue + ') !important; transform-origin: center center !important;';
                            previewAvatar.innerHTML = '';
                            previewAvatar.appendChild(img);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading social links:', error);
                updateSocialLinks({
                    email: '',
                    instagram: '',
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                    youtube: '',
                    tiktok: '',
                    snapchat: ''
                });
            }
        }

        async function saveProfile() {
            try {
                // Get profile data from modal
                const profileDisplayNameElement = document.getElementById('profileDisplayName');
                const profileSocialEmailElement = document.getElementById('profileSocialEmail');
                const profileSocialInstagramElement = document.getElementById('profileSocialInstagram');
                const profileSocialFacebookElement = document.getElementById('profileSocialFacebook');
                const profileSocialTwitterElement = document.getElementById('profileSocialTwitter');
                const profileSocialLinkedinElement = document.getElementById('profileSocialLinkedin');
                const profileSocialYoutubeElement = document.getElementById('profileSocialYoutube');
                const profileSocialTiktokElement = document.getElementById('profileSocialTiktok');
                const profileSocialSnapchatElement = document.getElementById('profileSocialSnapchat');
                const profilePhotoImg = document.getElementById('profilePhotoImg');
                
                const displayName = profileDisplayNameElement ? profileDisplayNameElement.value.trim() : '';
                const socialEmail = profileSocialEmailElement ? profileSocialEmailElement.value.trim() : '';
                
                // Auto-correct URLs by adding https:// if missing
                let socialInstagram = profileSocialInstagramElement ? autoCorrectUrl(profileSocialInstagramElement.value.trim()) : '';
                let socialFacebook = profileSocialFacebookElement ? autoCorrectUrl(profileSocialFacebookElement.value.trim()) : '';
                let socialTwitter = profileSocialTwitterElement ? autoCorrectUrl(profileSocialTwitterElement.value.trim()) : '';
                let socialLinkedin = profileSocialLinkedinElement ? autoCorrectUrl(profileSocialLinkedinElement.value.trim()) : '';
                let socialYoutube = profileSocialYoutubeElement ? autoCorrectUrl(profileSocialYoutubeElement.value.trim()) : '';
                let socialTiktok = profileSocialTiktokElement ? autoCorrectUrl(profileSocialTiktokElement.value.trim()) : '';
                let socialSnapchat = profileSocialSnapchatElement ? autoCorrectUrl(profileSocialSnapchatElement.value.trim()) : '';
                const profilePhoto = profilePhotoImg && profilePhotoImg.src ? profilePhotoImg.src : '';
                
                console.log('Display name from form:', displayName);
                console.log('Display name element:', profileDisplayNameElement);
                console.log('Display name element value:', profileDisplayNameElement?.value);
                
                // Validate email format
                if (socialEmail && !isValidEmail(socialEmail)) {
                    showMessage('Please enter a valid email address', 'error');
                    if (profileSocialEmailElement) profileSocialEmailElement.focus();
                    return;
                }
                
                // Validate social media URLs
                const urlValidations = [
                    { value: socialInstagram, name: 'Instagram', element: profileSocialInstagramElement, pattern: /instagram\.com|instagr\.am/ },
                    { value: socialFacebook, name: 'Facebook', element: profileSocialFacebookElement, pattern: /facebook\.com|fb\.com|fb\.me/ },
                    { value: socialTwitter, name: 'X (Twitter)', element: profileSocialTwitterElement, pattern: /twitter\.com|x\.com/ },
                    { value: socialLinkedin, name: 'LinkedIn', element: profileSocialLinkedinElement, pattern: /linkedin\.com/ },
                    { value: socialYoutube, name: 'YouTube', element: profileSocialYoutubeElement, pattern: /youtube\.com|youtu\.be/ },
                    { value: socialTiktok, name: 'TikTok', element: profileSocialTiktokElement, pattern: /tiktok\.com/ },
                    { value: socialSnapchat, name: 'Snapchat', element: profileSocialSnapchatElement, pattern: /snapchat\.com/ }
                ];
                
                for (const validation of urlValidations) {
                    if (validation.value) {
                        // Check if it's a valid URL
                        if (!isValidUrl(validation.value)) {
                            showMessage(`${validation.name} URL is invalid. Please include https://`, 'error');
                            if (validation.element) validation.element.focus();
                            return;
                        }
                        // Check if it matches the expected platform
                        if (!validation.pattern.test(validation.value)) {
                            showMessage(`${validation.name} URL should be a ${validation.name} link`, 'error');
                            if (validation.element) validation.element.focus();
                            return;
                        }
                    }
                }
                
                // Auto-generate handle from email for database (user doesn't need to see this)
                const userHandle = currentUser && currentUser.email 
                    ? currentUser.email.split('@')[0] 
                    : 'user';
                
                console.log('=== SAVING PROFILE ===');
                console.log('Handle (auto-generated):', userHandle);
                console.log('Display name:', displayName);
                console.log('Profile photo length:', profilePhoto ? profilePhoto.length : 0);
                console.log('Social links:', {
                    email: socialEmail,
                    instagram: socialInstagram,
                    facebook: socialFacebook,
                    twitter: socialTwitter,
                    linkedin: socialLinkedin,
                    youtube: socialYoutube,
                    tiktok: socialTiktok,
                    snapchat: socialSnapchat
                });
                console.log('Current user:', currentUser);
                console.log('Supabase client:', supabaseClient);
                
                // Update the main form fields
                const displayNameElement = document.getElementById('profileDisplayName');
                
                if (displayNameElement) displayNameElement.value = displayName;
                
                // Update preview name
                const previewNameElement = document.getElementById('preview-name');
                if (previewNameElement) {
                    previewNameElement.textContent = displayName || 'Your Name';
                    // Apply dynamic font size based on text length
                    // Use fixed 1.75rem to match public.html - CSS handles font size
                    previewNameElement.style.setProperty('font-size', '1.75rem');
                }
                
                // Reapply theme to ensure display name color is correct
                if (currentList && currentList.theme) {
                    applyTheme();
                }
                
                // Update profile photo in live preview
                const previewAvatar = document.getElementById('preview-avatar');
                if (previewAvatar) {
                    if (profilePhoto && profilePhoto.length > 0) {
                        const imgSrc = profilePhoto || '';
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.alt = 'Profile';
                        img.style.cssText = 'width: 100% !important; height: 100% !important; border-radius: 50% !important; object-fit: cover !important; display: block !important;';
                        previewAvatar.innerHTML = '';
                        previewAvatar.appendChild(img);
                    } else {
                        previewAvatar.innerHTML = '👤';
                    }
                }
                
                // Save to Supabase if user is logged in
                if (currentUser && supabaseClient) {
                    try {
                        const profileData = {
                            id: currentUser.id,
                            handle: userHandle,
                            display_name: displayName || currentUser.email.split('@')[0],
                            updated_at: new Date().toISOString()
                        };
                        
                        console.log('About to save profile data:', {
                            id: profileData.id,
                            handle: profileData.handle,
                            display_name: profileData.display_name
                        });
                        
                        // Add optional fields (always add them, even if empty, to allow clearing)
                        if (profilePhoto) {
                            console.log('Adding profile photo to save data');
                            profileData.profile_photo = profilePhoto;
                            // Save photo positioning data
                            profileData.profile_photo_position = JSON.stringify({
                                scale: currentProfilePhoto.scale,
                                x: currentProfilePhoto.x,
                                y: currentProfilePhoto.y
                            });
                            console.log('Profile photo position:', profileData.profile_photo_position);
                        }
                        
                        // Always save social links (even if empty) to allow clearing them
                        profileData.social_email = socialEmail || null;
                        profileData.social_instagram = socialInstagram || null;
                        profileData.social_facebook = socialFacebook || null;
                        profileData.social_twitter = socialTwitter || null;
                        profileData.social_linkedin = socialLinkedin || null;
                        profileData.social_youtube = socialYoutube || null;
                        profileData.social_tiktok = socialTiktok || null;
                        profileData.social_snapchat = socialSnapchat || null;
                        
                        console.log('Social links being saved:', {
                            email: socialEmail,
                            instagram: socialInstagram,
                            facebook: socialFacebook,
                            twitter: socialTwitter,
                            linkedin: socialLinkedin,
                            youtube: socialYoutube,
                            tiktok: socialTiktok,
                            snapchat: socialSnapchat
                        });
                        
                        console.log('Final profile data to save:', profileData);
                        
                        const { data, error } = await supabaseClient
                            .from('profiles')
                            .upsert(profileData)
                            .select();
                        
                        if (error) {
                            console.error('❌ Error saving to Supabase:', error);
                            showMessage('Error saving profile. Please try again.', 'error');
                            return;
                        } else {
                            console.log('✅ Profile saved to Supabase successfully!');
                            console.log('Saved data:', data);
                        }
                    } catch (error) {
                        console.error('❌ Supabase save failed:', error);
                        showMessage('Error saving profile. Please try again.', 'error');
                        return;
                    }
                } else {
                    console.error('Cannot save: currentUser or supabaseClient is missing');
                }
                
                // Update social media icons in preview
                updateSocialLinks({
                    email: socialEmail,
                    instagram: socialInstagram,
                    facebook: socialFacebook,
                    twitter: socialTwitter,
                    linkedin: socialLinkedin,
                    youtube: socialYoutube,
                    tiktok: socialTiktok,
                    snapchat: socialSnapchat
                });
                
                showMessage('Profile updated successfully!', 'success');
                closeProfile();
                
                // Update theme to reflect changes
                updatePreview();
                
            } catch (error) {
                console.error('Error saving profile:', error);
                showMessage('Error saving profile. Please try again.', 'error');
            }
        }
        
        function showMediaLibrary() {
            console.log('showMediaLibrary called');
            openMediaLibrary();
        }
        
        async function refreshAnalytics() {
            try {
                // Get current user
                const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
                
                if (userError || !user) {
                    console.error('❌ Error getting user:', userError);
                    showMessage('Please log in to view analytics');
                    return;
                }
                
                console.log('✅ Analytics - Current logged-in user:', {
                    id: user.id,
                    email: user.email
                });
                console.log('📋 User ID to look for in database:', user.id);
                
                // Get the current collection/list ID (required for collection-specific analytics)
                const listId = getCurrentListId();
                
                if (!listId) {
                    console.warn('⚠️ No collection selected - cannot show analytics');
                    showMessage('Please select a collection to view analytics');
                    document.getElementById('total-clicks').textContent = '-';
                    document.getElementById('total-views').textContent = '-';
                    document.getElementById('unique-visitors').textContent = '-';
                    document.getElementById('links-breakdown-list').innerHTML = '<p style="color: #6b7280; text-align: center; padding: 2rem;">Please select a collection to view analytics.</p>';
                    return;
                }
                
                console.log('📊 Analytics for collection ID:', listId);
                
                // Get total clicks (filtered by current collection)
                const clicksQuery = supabaseClient
                    .from('link_clicks')
                    .select('*', { count: 'exact', head: true })
                    .eq('owner_id', user.id)
                    .eq('list_id', listId); // Always filter by collection
                
                const { count: totalClicks, error: clicksError } = await clicksQuery;
                
                if (clicksError) {
                    console.error('❌ Error fetching clicks:', clicksError);
                    showMessage('Error loading analytics. Please try again.', 'error');
                    return;
                }
                
                // Get clicks by link (filtered by current collection)
                const linksQuery = supabaseClient
                    .from('link_clicks')
                    .select(`
                        link_id,
                        link_items:link_id (title, url)
                    `)
                    .eq('owner_id', user.id)
                    .eq('list_id', listId) // Always filter by collection
                    .order('clicked_at', { ascending: false });
                
                const { data: clicksData, error: linksError } = await linksQuery;
                
                if (linksError) {
                    console.error('❌ Error fetching clicks by link:', linksError);
                }
                
                // Get page views (filtered by current collection)
                const viewsQuery = supabaseClient
                    .from('page_views')
                    .select('*', { count: 'exact', head: true })
                    .eq('owner_id', user.id)
                    .eq('list_id', listId); // Always filter by collection
                
                const { count: totalViews, error: viewsError } = await viewsQuery;
                
                // Get all page views to calculate unique sessions (filtered by current collection)
                const { data: allPageViews, error: uniqueError } = await supabaseClient
                    .from('page_views')
                    .select('session_id')
                    .eq('owner_id', user.id)
                    .eq('list_id', listId); // Always filter by collection
                    
                let uniqueVisitors = 0;
                if (allPageViews && !uniqueError) {
                    // Count unique session IDs
                    const uniqueSessions = new Set(allPageViews.map(pv => pv.session_id).filter(id => id));
                    uniqueVisitors = uniqueSessions.size;
                }
                
                // Process clicks by link
                let linksBreakdown = {};
                if (clicksData && clicksData.length > 0) {
                    clicksData.forEach(click => {
                        const linkId = click.link_id;
                        const linkTitle = click.link_items?.title || 'Unknown Link';
                        const linkUrl = click.link_items?.url || '';
                        
                        if (!linksBreakdown[linkId]) {
                            linksBreakdown[linkId] = {
                                title: linkTitle,
                                url: linkUrl,
                                clicks: 0
                            };
                        }
                        linksBreakdown[linkId].clicks++;
                    });
                }
                
                // Sort by clicks (highest first)
                const linksBreakdownArray = Object.values(linksBreakdown).sort((a, b) => b.clicks - a.clicks);
                
                // Render links breakdown
                renderLinksBreakdown(linksBreakdownArray);
                
                // Update UI
                document.getElementById('total-clicks').textContent = totalClicks || 0;
                document.getElementById('total-views').textContent = totalViews || 0;
                document.getElementById('unique-visitors').textContent = uniqueVisitors || 0;
                
                console.log('📊 Analytics data loaded:', {
                    totalClicks: totalClicks || 0,
                    totalViews: totalViews || 0,
                    uniqueVisitors: uniqueVisitors || 0,
                    linksBreakdown: linksBreakdownArray.length
                });
                
                if (totalClicks === 0) {
                    showMessage('No analytics data yet. Start sharing your links!');
                } else {
                    showMessage('Analytics updated!');
                }
                
            } catch (error) {
                console.error('❌ Error loading analytics:', error);
                showMessage('Error loading analytics. Please try again.', 'error');
            }
        }
        
        function getCurrentListId() {
            // Try to get current list ID from the page context
            // This might be stored in a variable or data attribute
            // For now, return null to get all analytics
            return currentList ? currentList.id : null;
        }
        
        function renderLinksBreakdown(linksArray) {
            const container = document.getElementById('links-breakdown-list');
            
            if (!linksArray || linksArray.length === 0) {
                container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 2rem;">No link clicks yet. Start sharing your links!</p>';
                return;
            }
            
            // Find max clicks for percentage calculation
            const maxClicks = Math.max(...linksArray.map(link => link.clicks));
            
            let html = '<div style="display: flex; flex-direction: column; gap: 1rem;">';
            
            linksArray.forEach((link, index) => {
                const percentage = maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0;
                const truncatedUrl = link.url.length > 50 ? link.url.substring(0, 50) + '...' : link.url;
                
                html += `
                    <div style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-weight: 600; color: #111827; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${escapeHtml(link.title)}
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(link.url)}">
                                    ${escapeHtml(truncatedUrl)}
                                </div>
                            </div>
                            <div style="margin-left: 1rem; font-weight: 600; color: #111827; font-size: 1.125rem;">
                                ${link.clicks}
                            </div>
                        </div>
                        <div style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; background: linear-gradient(90deg, #1A2F5B 0%, #3B5B8F 100%); width: ${percentage}%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
        }
        
        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        function togglePreviewTheme() {
            showMessage('Preview theme toggle coming soon!');
        }
        
        function togglePreviewSize() {
            showMessage('Preview size toggle coming soon!');
        }
        
        function showLoading() {
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('login').classList.add('hidden');
            document.getElementById('dashboard').classList.add('hidden');
        }
        
        function showLogin() {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('login').classList.remove('hidden');
            
            // Check if account is locked out and show persistent message
            const lockoutStatus = isAccountLockedOut();
            if (lockoutStatus.locked) {
                showLockoutMessage();
            } else {
                clearLockoutMessage();
            }
            
            // Force dashboard to be hidden
            const dashboard = document.getElementById('dashboard');
            dashboard.classList.add('hidden');
            dashboard.style.setProperty('display', 'none', 'important');
            dashboard.style.setProperty('visibility', 'hidden', 'important');
            
            // Hide all dashboard components
            const appLayout = document.querySelector('.app-layout');
            if (appLayout) {
                appLayout.style.setProperty('display', 'none', 'important');
                appLayout.style.setProperty('visibility', 'hidden', 'important');
            }
        }
        
        function showDashboard() {
            console.log('showDashboard called');
            
            const loading = document.getElementById('loading');
            const login = document.getElementById('login');
            const dashboard = document.getElementById('dashboard');
            
            if (loading) loading.classList.add('hidden');
            if (login) login.classList.add('hidden');
            
            if (dashboard) {
                dashboard.classList.remove('hidden');
                // Remove inline styles that might be hiding it
                dashboard.style.removeProperty('display');
                dashboard.style.removeProperty('visibility');
                dashboard.style.removeProperty('opacity');
                console.log('Dashboard shown');
            }
            
            // Also show the app-layout if it exists
            const appLayout = document.querySelector('.app-layout');
            if (appLayout) {
                appLayout.style.removeProperty('display');
                appLayout.style.removeProperty('visibility');
                appLayout.style.removeProperty('opacity');
                console.log('App layout shown');
            }
            
            // Initialize collapsible sections
            initializeCollapsibleSections();
            
            // Load profile photo from localStorage
            loadProfilePhotoOnInit();
            
            // Load social media links from localStorage
            loadSocialLinksOnInit();
            
            // Initialize profile info for the default links tab
            setTimeout(() => {
                try {
                    initProfileInfo();
                    // Also initialize theming to fix dark preview issue
                    initTheming();
                    // Initialize link image handlers
                    setupLinkImageHandlers();
                    // Apply the default theme to fix dark preview
                    applyTheme();
                    // Test presentation inputs
                    testPresentationInputs();
                    // Update dynamic info after everything is loaded
                    updateDynamicInfo();
                } catch (error) {
                    console.error('Error during dashboard initialization:', error);
                    showMessage('Error initializing dashboard. Please refresh the page.', 'error');
                }
                
                // Only force apply default theme if no collection is loaded
                setTimeout(() => {
                    if (!currentList || !currentList.theme) {
                        console.log('Force applying default theme after delay...');
                        applyTheme();
                        
                        // Also force set the phone-screen background directly
                        const phoneScreen = document.querySelector('.phone-screen');
                        if (phoneScreen) {
                            console.log('Force setting phone-screen background to white...');
                            phoneScreen.style.setProperty('background', '#ffffff', 'important');
                            phoneScreen.style.setProperty('background-color', '#ffffff', 'important');
                            phoneScreen.style.setProperty('background-image', 'none', 'important');
                            console.log('Phone-screen background after force set:', window.getComputedStyle(phoneScreen).background);
                        }
                    } else {
                        console.log('Collection with saved theme loaded, skipping default theme application');
                    }
                }, 500);
            }, 100);
        }
        
        function showMessage(message, type = 'error') {
            console.log('showMessage called:', message, type);
            const messageDiv = document.getElementById('message');
            if (messageDiv) {
                console.log('Message div found, displaying message');
                // Escape HTML in message to prevent XSS
                const escapedMessage = escapeHtml(message);
                messageDiv.innerHTML = `<div class="${type}">${escapedMessage}</div>`;
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
            } else {
                console.log('Message div not found!');
            }
        }
        function showAddLinkError(message) {
            console.log('showAddLinkError called:', message);
            const errorDiv = document.getElementById('add-link-error');
            console.log('Error div element:', errorDiv);
            if (errorDiv) {
                console.log('Add link error div found, displaying message');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                errorDiv.classList.add('show');
                console.log('Error div classes after adding show:', errorDiv.classList.toString());
                console.log('Error div style display:', errorDiv.style.display);
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    errorDiv.classList.remove('show');
                    errorDiv.style.display = 'none';
                }, 5000);
            } else {
                console.log('Add link error div not found!');
            }
        }

        function hideAddLinkError() {
            const errorDiv = document.getElementById('add-link-error');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        }

        function clearLinkImage() {
            const fileInput = document.getElementById('new-link-image');
            const preview = document.getElementById('new-link-image-preview');
            const previewImg = document.getElementById('new-link-image-preview-img');
            
            fileInput.value = '';
            preview.style.display = 'none';
            previewImg.src = '';
            window.selectedLinkImageUrl = null;
        }

        function setupLinkImageHandlers() {
            const fileInput = document.getElementById('new-link-image');
            const preview = document.getElementById('new-link-image-preview');
            const previewImg = document.getElementById('new-link-image-preview-img');
            
            if (fileInput) {
                fileInput.addEventListener('change', async function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        try {
                            // Convert file to base64
                            const base64 = await convertImageToBase64(file);
                            
                            // Add to media library
                            const mediaItem = {
                                id: 'media_' + Date.now(),
                                name: file.name,
                                url: base64,
                                size: file.size,
                                type: file.type,
                                uploadedAt: new Date().toISOString()
                            };
                            
                            // Add to media files array
                            mediaFiles.push(mediaItem);
                            
                            // Save to localStorage
                            try {
                                localStorage.setItem('academiq-media', JSON.stringify(mediaFiles));
                                console.log('Image added to media library:', mediaItem.name);
                            } catch (storageError) {
                                console.warn('Could not save to localStorage:', storageError);
                            }
                            
                            // Update preview
                            previewImg.src = base64;
                            preview.style.display = 'block';
                            
                            // Store for addLink function
                            window.selectedLinkImageUrl = base64;
                            
                        } catch (error) {
                            console.error('Error processing image:', error);
                            showMessage('Error processing image. Please try again.', 'error');
                        }
                    }
                });
            }
        }

        function convertImageToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        }

        function openMediaLibraryForLink() {
            console.log('Opening media library for link image selection');
            // Set a flag to indicate we're selecting for a link
            window.selectingImageForLink = true;
            openMediaLibrary();
        }

        function selectImageForLink(imageUrl) {
            console.log('Selecting image for link:', imageUrl);
            
            // Set the image in the preview
            const preview = document.getElementById('new-link-image-preview');
            const previewImg = document.getElementById('new-link-image-preview-img');
            
            if (preview && previewImg) {
                previewImg.src = imageUrl;
                preview.style.display = 'block';
            }
            
            // Store the image URL for the addLink function
            window.selectedLinkImageUrl = imageUrl;
            
            // Close the media library
            closeMediaLibrary();
            
            // Clear the flag
            window.selectingImageForLink = false;
        }

        function openMediaLibraryForLinkEdit(linkIndex) {
            console.log('Opening media library for link edit:', linkIndex);
            // Set flags to indicate we're editing an existing link
            window.selectingImageForLink = true;
            window.editingLinkIndex = linkIndex;
            openMediaLibrary();
        }

        function selectImageForLinkEdit(imageUrl) {
            const linkIndex = window.editingLinkIndex;
            console.log('Selecting image for link edit:', imageUrl, 'link index:', linkIndex);
            
            if (linkIndex !== undefined && links[linkIndex]) {
                // Update the link's image
                links[linkIndex].image = imageUrl;
                
                // Update the UI immediately
                renderLinks();
                updatePreview();
                
                // Show success message
                showMessage('Link image updated!', 'success');
            }
            
            // Close the media library
            closeMediaLibrary();
            
            // Clear the flags
            window.selectingImageForLink = false;
            window.editingLinkIndex = undefined;
        }

        function removeLinkImage(linkIndex) {
            console.log('Removing image from link:', linkIndex);
            
            if (links[linkIndex]) {
                // Remove the image from the link
                links[linkIndex].image = null;
                links[linkIndex].imagePosition = null;
                links[linkIndex].imageScale = null;
                
                // Update the UI immediately
                renderLinks();
                updatePreview();
                
                // Show success message
                showMessage('Link image removed!', 'success');
            }
        }

        function toggleLinkImageEditor(linkIndex) {
            // Remove any existing editor
            const existingEditor = document.getElementById('link-image-editor-modal');
            if (existingEditor) {
                existingEditor.remove();
            }
            
            const existingBackdrop = document.getElementById('link-image-editor-backdrop');
            if (existingBackdrop) {
                existingBackdrop.remove();
            }
            
            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.id = 'link-image-editor-backdrop';
            backdrop.className = 'link-image-editor-backdrop';
            backdrop.onclick = closeLinkImageEditor;
            
            // Create modal
            const editor = document.createElement('div');
            editor.id = 'link-image-editor-modal';
            editor.className = 'link-image-editor';
            
            const link = links[linkIndex];
            const imagePosition = link.imagePosition || { x: 50, y: 50 };
            const imageScale = link.imageScale || 100;
            
            console.log(`Opening modal for link ${linkIndex}:`, {
                imagePosition: imagePosition,
                imageScale: imageScale,
                linkData: link
            });
            
            // Calculate current transform for modal preview
            const scale = imageScale / 100;
            const panX = ((imagePosition.x - 50) / 50) * 30;
            const panY = ((imagePosition.y - 50) / 50) * 30;
            const currentTransform = `translate(${panX}%, ${panY}%) scale(${scale})`;
            
            console.log(`Modal preview transform:`, {
                scale: scale,
                panX: panX,
                panY: panY,
                transform: currentTransform
            });
            
            // Create the modal content using DOM methods
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'image-position-controls';
            
            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;';
            
            const h3 = document.createElement('h3');
            h3.textContent = 'Edit Image Position';
            h3.style.cssText = 'margin: 0; font-size: 16px; color: #374151;';
            
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.onclick = closeLinkImageEditor;
            closeBtn.textContent = '×';
            closeBtn.style.cssText = 'background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280;';
            
            headerDiv.appendChild(h3);
            headerDiv.appendChild(closeBtn);
            
            // Image Preview
            const previewDiv = document.createElement('div');
            previewDiv.style.cssText = 'margin-bottom: 20px; text-align: center;';
            
            const previewLabel = document.createElement('div');
            previewLabel.textContent = 'Preview';
            previewLabel.style.cssText = 'font-size: 12px; color: #6b7280; margin-bottom: 8px;';
            
            const previewContainer = document.createElement('div');
            previewContainer.id = 'modal-image-preview-' + linkIndex;
            previewContainer.style.cssText = 'width: 120px; height: 120px; border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin: 0 auto; background: #f9fafb; display: flex; align-items: center; justify-content: center; position: relative;';
            
            const previewImg = document.createElement('img');
            previewImg.id = 'modal-preview-img-' + linkIndex;
            previewImg.src = link.image || '';
            previewImg.alt = 'Preview';
            previewImg.style.cssText = 'width: 100%; height: 100%; object-fit: contain; transform-origin: center center; max-width: 100%; max-height: 100%; transform: ' + currentTransform + ';';
            
            previewContainer.appendChild(previewImg);
            previewDiv.appendChild(previewLabel);
            previewDiv.appendChild(previewContainer);
            
            controlsDiv.appendChild(headerDiv);
            controlsDiv.appendChild(previewDiv);
                    
            
            // Create position sliders
            const slidersDiv = document.createElement('div');
            slidersDiv.className = 'position-sliders';
            
            // Horizontal position slider
            const xGroup = document.createElement('div');
            xGroup.className = 'slider-group';
            const xLabel = document.createElement('label');
            xLabel.innerHTML = 'Horizontal Position: <span id="link-x-value-' + linkIndex + '">' + imagePosition.x + '</span>%';
            const xSlider = document.createElement('input');
            xSlider.type = 'range';
            xSlider.id = 'link-x-slider-' + linkIndex;
            xSlider.min = '0';
            xSlider.max = '100';
            xSlider.value = imagePosition.x;
            xSlider.oninput = function() { updateLinkImagePosition(linkIndex, 'x', this.value); };
            xGroup.appendChild(xLabel);
            xGroup.appendChild(xSlider);
            
            // Vertical position slider
            const yGroup = document.createElement('div');
            yGroup.className = 'slider-group';
            const yLabel = document.createElement('label');
            yLabel.innerHTML = 'Vertical Position: <span id="link-y-value-' + linkIndex + '">' + imagePosition.y + '</span>%';
            const ySlider = document.createElement('input');
            ySlider.type = 'range';
            ySlider.id = 'link-y-slider-' + linkIndex;
            ySlider.min = '0';
            ySlider.max = '100';
            ySlider.value = imagePosition.y;
            ySlider.oninput = function() { updateLinkImagePosition(linkIndex, 'y', this.value); };
            yGroup.appendChild(yLabel);
            yGroup.appendChild(ySlider);
            
            // Scale slider
            const scaleGroup = document.createElement('div');
            scaleGroup.className = 'slider-group';
            const scaleLabel = document.createElement('label');
            scaleLabel.innerHTML = 'Image Scale: <span id="link-scale-value-' + linkIndex + '">' + imageScale + '</span>%';
            const scaleSlider = document.createElement('input');
            scaleSlider.type = 'range';
            scaleSlider.id = 'link-scale-slider-' + linkIndex;
            scaleSlider.min = '50';
            scaleSlider.max = '200';
            scaleSlider.value = imageScale;
            scaleSlider.oninput = function() { updateLinkImageScale(linkIndex, this.value); };
            scaleGroup.appendChild(scaleLabel);
            scaleGroup.appendChild(scaleSlider);
            
            slidersDiv.appendChild(xGroup);
            slidersDiv.appendChild(yGroup);
            slidersDiv.appendChild(scaleGroup);
            
            // Position presets
            const positionPresets = document.createElement('div');
            positionPresets.className = 'position-presets';
            const positionLabel = document.createElement('div');
            positionLabel.textContent = 'Position';
            positionLabel.style.cssText = 'margin-bottom: 8px; font-size: 12px; color: #6b7280; font-weight: 600;';
            
            const centerBtn = document.createElement('button');
            centerBtn.type = 'button';
            centerBtn.textContent = 'Center';
            centerBtn.onclick = function() { setLinkImagePosition(linkIndex, 50, 50); };
            
            const topBtn = document.createElement('button');
            topBtn.type = 'button';
            topBtn.textContent = 'Top';
            topBtn.onclick = function() { setLinkImagePosition(linkIndex, 50, 0); };
            
            const bottomBtn = document.createElement('button');
            bottomBtn.type = 'button';
            bottomBtn.textContent = 'Bottom';
            bottomBtn.onclick = function() { setLinkImagePosition(linkIndex, 50, 100); };
            
            const leftBtn = document.createElement('button');
            leftBtn.type = 'button';
            leftBtn.textContent = 'Left';
            leftBtn.onclick = function() { setLinkImagePosition(linkIndex, 0, 50); };
            
            const rightBtn = document.createElement('button');
            rightBtn.type = 'button';
            rightBtn.textContent = 'Right';
            rightBtn.onclick = function() { setLinkImagePosition(linkIndex, 100, 50); };
            
            positionPresets.appendChild(positionLabel);
            positionPresets.appendChild(centerBtn);
            positionPresets.appendChild(topBtn);
            positionPresets.appendChild(bottomBtn);
            positionPresets.appendChild(leftBtn);
            positionPresets.appendChild(rightBtn);
            
            // Scale presets
            const scalePresets = document.createElement('div');
            scalePresets.className = 'position-presets';
            const scaleLabel2 = document.createElement('div');
            scaleLabel2.textContent = 'Scale';
            scaleLabel2.style.cssText = 'margin-bottom: 8px; font-size: 12px; color: #6b7280; font-weight: 600;';
            
            const scale75Btn = document.createElement('button');
            scale75Btn.type = 'button';
            scale75Btn.textContent = '75%';
            scale75Btn.onclick = function() { setLinkImageScale(linkIndex, 75); };
            
            const scale100Btn = document.createElement('button');
            scale100Btn.type = 'button';
            scale100Btn.textContent = '100%';
            scale100Btn.onclick = function() { setLinkImageScale(linkIndex, 100); };
            
            const scale125Btn = document.createElement('button');
            scale125Btn.type = 'button';
            scale125Btn.textContent = '125%';
            scale125Btn.onclick = function() { setLinkImageScale(linkIndex, 125); };
            
            const scale150Btn = document.createElement('button');
            scale150Btn.type = 'button';
            scale150Btn.textContent = '150%';
            scale150Btn.onclick = function() { setLinkImageScale(linkIndex, 150); };
            
            const scale200Btn = document.createElement('button');
            scale200Btn.type = 'button';
            scale200Btn.textContent = '200%';
            scale200Btn.onclick = function() { setLinkImageScale(linkIndex, 200); };
            
            scalePresets.appendChild(scaleLabel2);
            scalePresets.appendChild(scale75Btn);
            scalePresets.appendChild(scale100Btn);
            scalePresets.appendChild(scale125Btn);
            scalePresets.appendChild(scale150Btn);
            scalePresets.appendChild(scale200Btn);
            
            // Done button
            const doneDiv = document.createElement('div');
            doneDiv.style.cssText = 'margin-top: 16px; text-align: right;';
            const doneBtn = document.createElement('button');
            doneBtn.type = 'button';
            doneBtn.textContent = 'Done';
            doneBtn.onclick = closeLinkImageEditor;
            doneBtn.style.cssText = 'background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;';
            doneDiv.appendChild(doneBtn);
            
            controlsDiv.appendChild(slidersDiv);
            controlsDiv.appendChild(positionPresets);
            controlsDiv.appendChild(scalePresets);
            controlsDiv.appendChild(doneDiv);
            
            editor.appendChild(controlsDiv);
            
            document.body.appendChild(backdrop);
            document.body.appendChild(editor);
        }

        function closeLinkImageEditor() {
            const editor = document.getElementById('link-image-editor-modal');
            const backdrop = document.getElementById('link-image-editor-backdrop');
            
            if (editor) editor.remove();
            if (backdrop) backdrop.remove();
        }

        function applyLinkImgTransform(linkIndex) {
            console.log(`DEBUG: Looking for img for link ${linkIndex}`);
            
            // First, let's see what link items exist
            const allLinkItems = document.querySelectorAll('.link-item');
            console.log(`DEBUG: Found ${allLinkItems.length} link items total`);
            allLinkItems.forEach((item, idx) => {
                console.log(`DEBUG: Link item ${idx}:`, item.dataset.index, item);
            });
            
            // Try multiple selectors to find the img element
            let img = document.querySelector(`#link-${linkIndex} .link-image-container img`);
            console.log(`DEBUG: Selector #link-${linkIndex} .link-image-container img found:`, img);
            
            if (!img) {
                img = document.querySelector(`[data-index="${linkIndex}"] .link-image-container img`);
                console.log(`DEBUG: Selector [data-index="${linkIndex}"] .link-image-container img found:`, img);
            }
            if (!img) {
                img = document.querySelector(`[data-index="${linkIndex}"] .link-image-preview img`);
                console.log(`DEBUG: Selector [data-index="${linkIndex}"] .link-image-preview img found:`, img);
            }
            if (!img) {
                console.log(`DEBUG: No img found for link ${linkIndex}. Available elements:`, document.querySelectorAll(`[data-index="${linkIndex}"] *`));
                return;
            }

            const scale = (links[linkIndex].imageScale || 100) / 100;   // 0.5–2.0
            const x = links[linkIndex].imagePosition?.x ?? 50;          // 0–100
            const y = links[linkIndex].imagePosition?.y ?? 50;

            // Map x/y (0–100) to pan values
            // With object-fit: contain, we can pan more aggressively since the image isn't cropped
            const panX = ((x - 50) / 50) * 30;  // -30 .. +30 (increased from 20)
            const panY = ((y - 50) / 50) * 30;

            const transform = `translate(${panX}%, ${panY}%) scale(${scale})`;
            console.log(`DEBUG: Applying transform to link ${linkIndex}:`, {
                scale: scale,
                x: x,
                y: y,
                panX: panX,
                panY: panY,
                transform: transform
            });

            img.style.transform = transform;
        }

        // Test function - call from browser console: testImageTransform(0, 50)
        function testImageTransform(linkIndex, scale) {
            console.log(`TEST: Setting link ${linkIndex} scale to ${scale}%`);
            if (links[linkIndex]) {
                links[linkIndex].imageScale = scale;
                links[linkIndex].imagePosition = { x: 50, y: 50 };
                applyLinkImgTransform(linkIndex);
            } else {
                console.log(`TEST: No link found at index ${linkIndex}`);
            }
        }
        function debugLinkImages() {
            console.log('=== DEBUGGING LINK IMAGES ===');
            console.log('Total links:', links.length);
            links.forEach((link, index) => {
                console.log(`Link ${index}:`, {
                    title: link.title,
                    hasImage: !!link.image,
                    imageScale: link.imageScale,
                    imagePosition: link.imagePosition
                });
            });
            
            console.log('=== DOM ELEMENTS ===');
            const allLinkItems = document.querySelectorAll('.link-item');
            console.log('Total link items in DOM:', allLinkItems.length);
            allLinkItems.forEach((item, idx) => {
                console.log(`DOM item ${idx}:`, {
                    datasetIndex: item.dataset.index,
                    hasImageContainer: !!item.querySelector('.link-image-container'),
                    hasImage: !!item.querySelector('img')
                });
            });
            
            console.log('=== TESTING SELECTORS ===');
            links.forEach((link, index) => {
                if (link.image) {
                    const selector1 = `#link-${index} .link-image-container img`;
                    const selector2 = `[data-index="${index}"] .link-image-container img`;
                    const selector3 = `[data-index="${index}"] .link-image-preview img`;
                    
                    console.log(`Link ${index} selectors:`, {
                        selector1: document.querySelector(selector1),
                        selector2: document.querySelector(selector2),
                        selector3: document.querySelector(selector3)
                    });
                }
            });
        }
        
        function testPreviewUpdate() {
            console.log('=== TESTING PREVIEW UPDATE ===');
            console.log('Current links data:', links);
            console.log('Calling updatePreview()...');
            updatePreview();
            console.log('Preview update complete');
        }

        function updateLinkImagePosition(linkIndex, axis, value) {
            if (linkIndex >= 0 && linkIndex < links.length) {
                if (!links[linkIndex].imagePosition) {
                    links[linkIndex].imagePosition = { x: 50, y: 50 };
                }
                
                links[linkIndex].imagePosition[axis] = parseInt(value);
                
                // Initialize imageScale if it doesn't exist
                if (!links[linkIndex].imageScale) {
                    links[linkIndex].imageScale = 100;
                }
                
                // Update the value display
                document.getElementById(`link-${axis}-value-${linkIndex}`).textContent = value;
                
                // Update the image position in the link list
                applyLinkImgTransform(linkIndex);
                
                // Debug: Log the updated link data
                console.log(`Updated link ${linkIndex} image position:`, {
                    title: links[linkIndex].title,
                    imagePosition: links[linkIndex].imagePosition,
                    imageScale: links[linkIndex].imageScale
                });
                
                // Update the phone mockup preview
                updatePreview();
                
                // Update the modal preview
                const modalImg = document.getElementById(`modal-preview-img-${linkIndex}`);
                if (modalImg) {
                    const scale = (links[linkIndex].imageScale || 100) / 100;
                    const x = links[linkIndex].imagePosition.x;
                    const y = links[linkIndex].imagePosition.y;
                    
                    // Use transform approach like the main image
                    const panX = ((x - 50) / 50) * 30;
                    const panY = ((y - 50) / 50) * 30;
                    const transform = `translate(${panX}%, ${panY}%) scale(${scale})`;
                    
                    modalImg.style.transform = transform;
                    modalImg.style.width = '100%';
                    modalImg.style.height = '100%';
                    modalImg.style.objectFit = 'contain';
                    modalImg.style.position = 'static';
                    modalImg.style.left = 'auto';
                    modalImg.style.top = 'auto';
                }
                
                // Update preview
                updatePreview();
            }
        }

        function setLinkImagePosition(linkIndex, x, y) {
            if (linkIndex >= 0 && linkIndex < links.length) {
                links[linkIndex].imagePosition = { x, y };
                
                // Initialize imageScale if it doesn't exist
                if (!links[linkIndex].imageScale) {
                    links[linkIndex].imageScale = 100;
                }
                
                // Update sliders
                document.getElementById(`link-x-slider-${linkIndex}`).value = x;
                document.getElementById(`link-y-slider-${linkIndex}`).value = y;
                
                // Update value displays
                document.getElementById(`link-x-value-${linkIndex}`).textContent = x;
                document.getElementById(`link-y-value-${linkIndex}`).textContent = y;
                
                // Update the image position in the link list
                applyLinkImgTransform(linkIndex);
                
                // Update the phone mockup preview
                updatePreview();
                
                // Update the modal preview
                const modalImg = document.getElementById(`modal-preview-img-${linkIndex}`);
                if (modalImg) {
                    const scale = (links[linkIndex].imageScale || 100) / 100;
                    
                    // Use transform approach like the main image
                    const panX = ((x - 50) / 50) * 30;
                    const panY = ((y - 50) / 50) * 30;
                    const transform = `translate(${panX}%, ${panY}%) scale(${scale})`;
                    
                    modalImg.style.transform = transform;
                    modalImg.style.width = '100%';
                    modalImg.style.height = '100%';
                    modalImg.style.objectFit = 'contain';
                    modalImg.style.position = 'static';
                    modalImg.style.left = 'auto';
                    modalImg.style.top = 'auto';
                }
                
                // Update preview
                updatePreview();
            }
        }

        function updateLinkImageScale(linkIndex, value) {
            console.log(`DEBUG: updateLinkImageScale called for link ${linkIndex} with value ${value}`);
            if (linkIndex >= 0 && linkIndex < links.length) {
                links[linkIndex].imageScale = parseInt(value);
                
                // Initialize imagePosition if it doesn't exist
                if (!links[linkIndex].imagePosition) {
                    links[linkIndex].imagePosition = { x: 50, y: 50 };
                }
                
                // Update the value display
                document.getElementById(`link-scale-value-${linkIndex}`).textContent = value;
                
                // Update the image scale in the link list
                applyLinkImgTransform(linkIndex);
                
                // Debug: Log the updated link data
                console.log(`Updated link ${linkIndex} image scale:`, {
                    title: links[linkIndex].title,
                    imagePosition: links[linkIndex].imagePosition,
                    imageScale: links[linkIndex].imageScale
                });
                
                // Update the phone mockup preview
                updatePreview();
                
                // Update the modal preview
                const modalImg = document.getElementById(`modal-preview-img-${linkIndex}`);
                if (modalImg) {
                    const x = links[linkIndex].imagePosition?.x || 50;
                    const y = links[linkIndex].imagePosition?.y || 50;
                    const scale = value / 100;
                    
                    // Use transform approach like the main image
                    const panX = ((x - 50) / 50) * 30;
                    const panY = ((y - 50) / 50) * 30;
                    const transform = `translate(${panX}%, ${panY}%) scale(${scale})`;
                    
                    modalImg.style.transform = transform;
                    modalImg.style.width = '100%';
                    modalImg.style.height = '100%';
                    modalImg.style.objectFit = 'contain';
                    modalImg.style.position = 'static';
                    modalImg.style.left = 'auto';
                    modalImg.style.top = 'auto';
                }
                
                // Update preview
                updatePreview();
            }
        }

        function setLinkImageScale(linkIndex, scale) {
            if (linkIndex >= 0 && linkIndex < links.length) {
                links[linkIndex].imageScale = scale;
                
                // Initialize imagePosition if it doesn't exist
                if (!links[linkIndex].imagePosition) {
                    links[linkIndex].imagePosition = { x: 50, y: 50 };
                }
                
                // Update slider
                document.getElementById(`link-scale-slider-${linkIndex}`).value = scale;
                
                // Update value display
                document.getElementById(`link-scale-value-${linkIndex}`).textContent = scale;
                
                // Update the image scale in the link list
                applyLinkImgTransform(linkIndex);
                
                // Update the phone mockup preview
                updatePreview();
                
                // Update the modal preview
                const modalImg = document.getElementById(`modal-preview-img-${linkIndex}`);
                if (modalImg) {
                    const x = links[linkIndex].imagePosition?.x || 50;
                    const y = links[linkIndex].imagePosition?.y || 50;
                    const scaleValue = scale / 100;
                    
                    // Use transform approach like the main image
                    const panX = ((x - 50) / 50) * 30;
                    const panY = ((y - 50) / 50) * 30;
                    const transform = `translate(${panX}%, ${panY}%) scale(${scaleValue})`;
                    
                    modalImg.style.transform = transform;
                    modalImg.style.width = '100%';
                    modalImg.style.height = '100%';
                    modalImg.style.objectFit = 'contain';
                    modalImg.style.position = 'static';
                    modalImg.style.left = 'auto';
                    modalImg.style.top = 'auto';
                }
                
                // Update preview
                updatePreview();
            }
        }

        function openFileSelectorForLink(linkIndex) {
            console.log('Opening file selector for link:', linkIndex);
            
            // Create a temporary file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', async function(e) {
                const file = e.target.files[0];
                if (file) {
                    try {
                        // Convert file to base64
                        const base64 = await convertImageToBase64(file);
                        
                        // Add to media library
                        const mediaItem = {
                            id: 'media_' + Date.now(),
                            name: file.name,
                            url: base64,
                            size: file.size,
                            type: file.type,
                            uploadedAt: new Date().toISOString()
                        };
                        
                        // Add to media files array
                        mediaFiles.push(mediaItem);
                        
                        // Save to localStorage
                        try {
                            localStorage.setItem('academiq-media', JSON.stringify(mediaFiles));
                            console.log('Image added to media library:', mediaItem.name);
                        } catch (storageError) {
                            console.warn('Could not save to localStorage:', storageError);
                        }
                        
                        // Update the link's image
                        if (links[linkIndex]) {
                            links[linkIndex].image = base64;
                            
                            // Update the UI immediately
                            renderLinks();
                            updatePreview();
                            
                            // Show success message
                            showMessage('Image added to media library and link updated!', 'success');
                        }
                    } catch (error) {
                        console.error('Error converting image:', error);
                        showMessage('Error processing image. Please try again.', 'error');
                    }
                }
                
                // Clean up
                document.body.removeChild(fileInput);
            });
            
            // Add to DOM and trigger click
            document.body.appendChild(fileInput);
            fileInput.click();
        }


        function initializeCollapsibleSections() {
            // All sections start expanded by default
            const sections = ['presentation-info', 'collection'];
            sections.forEach(sectionId => {
                const content = document.getElementById(sectionId + '-content');
                const chevron = document.getElementById(sectionId + '-chevron');
                
                if (content && chevron) {
                    content.classList.remove('collapsed');
                    chevron.classList.remove('collapsed');
                    chevron.style.transform = 'rotate(0deg)';
                }
            });
        }
        
        // Track whether we're in sign-up mode
        let isSignUpMode = false;

        // Rate limiting for authentication attempts
        const RATE_LIMIT_CONFIG = {
            maxAttempts: 5,           // Maximum failed attempts before lockout
            lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
            windowDuration: 60 * 60 * 1000   // 1 hour window for tracking attempts
        };

        // Get rate limit data from localStorage
        function getRateLimitData() {
            try {
                const data = localStorage.getItem('academiq_rate_limit');
                return data ? JSON.parse(data) : { attempts: [], lockoutUntil: null };
            } catch (error) {
                return { attempts: [], lockoutUntil: null };
            }
        }

        // Save rate limit data to localStorage
        function saveRateLimitData(data) {
            try {
                localStorage.setItem('academiq_rate_limit', JSON.stringify(data));
            } catch (error) {
                // Silently fail if localStorage is unavailable
            }
        }

        // Check if account is currently locked out (client-side check)
        function isAccountLockedOut() {
            const rateLimitData = getRateLimitData();
            if (rateLimitData.lockoutUntil) {
                const now = Date.now();
                if (now < rateLimitData.lockoutUntil) {
                    return {
                        locked: true,
                        remainingTime: rateLimitData.lockoutUntil - now
                    };
                } else {
                    // Lockout expired, clear it
                    rateLimitData.lockoutUntil = null;
                    saveRateLimitData(rateLimitData);
                }
            }
            return { locked: false, remainingTime: 0 };
        }

        // Check server-side rate limit
        async function checkServerRateLimit(email, attemptType = 'login') {
            try {
                const response = await fetch(`${SUPABASE_URL}/functions/v1/rate-limit-check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        email: email,
                        attemptType: attemptType,
                        recordAttempt: false
                    })
                });

                if (!response.ok) {
                    // If rate limit check fails, allow the request (fail open)
                    console.warn('Rate limit check failed, allowing request');
                    return { allowed: true, isLocked: false };
                }

                const data = await response.json();
                return data;
            } catch (error) {
                // On error, allow the request (fail open) but log the error
                console.warn('Rate limit check error:', error);
                return { allowed: true, isLocked: false };
            }
        }

        // Record server-side authentication attempt
        async function recordServerAttempt(email, attemptType = 'login', success = false) {
            try {
                await fetch(`${SUPABASE_URL}/functions/v1/rate-limit-check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        email: email,
                        attemptType: attemptType,
                        recordAttempt: true,
                        success: success
                    })
                });
            } catch (error) {
                // Silently fail - don't block the user if recording fails
                console.warn('Failed to record server-side attempt:', error);
            }
        }

        // Record a failed authentication attempt
        function recordFailedAttempt(email) {
            const rateLimitData = getRateLimitData();
            const now = Date.now();
            
            // Clean up old attempts outside the window
            rateLimitData.attempts = rateLimitData.attempts.filter(
                attempt => (now - attempt.timestamp) < RATE_LIMIT_CONFIG.windowDuration
            );
            
            // Add new failed attempt
            rateLimitData.attempts.push({
                email: email.toLowerCase(),
                timestamp: now
            });
            
            // Check if we've exceeded max attempts
            const recentAttempts = rateLimitData.attempts.filter(
                attempt => attempt.email === email.toLowerCase()
            );
            
            if (recentAttempts.length >= RATE_LIMIT_CONFIG.maxAttempts) {
                // Lock out the account
                rateLimitData.lockoutUntil = now + RATE_LIMIT_CONFIG.lockoutDuration;
            }
            
            saveRateLimitData(rateLimitData);
        }

        // Clear rate limit data (call on successful login)
        function clearRateLimitData(email) {
            const rateLimitData = getRateLimitData();
            // Remove attempts for this email
            rateLimitData.attempts = rateLimitData.attempts.filter(
                attempt => attempt.email !== email.toLowerCase()
            );
            // Clear lockout if it exists
            rateLimitData.lockoutUntil = null;
            saveRateLimitData(rateLimitData);
        }

        // Format remaining time for display
        function formatRemainingTime(ms) {
            const minutes = Math.floor(ms / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // Persistent lockout message with live countdown
        let lockoutIntervalId = null;

        function showLockoutMessage() {
            const messageDiv = document.getElementById('message');
            if (!messageDiv) return;

            // Clear any existing interval
            if (lockoutIntervalId) {
                clearInterval(lockoutIntervalId);
                lockoutIntervalId = null;
            }

            function updateLockoutMessage() {
                const lockoutStatus = isAccountLockedOut();
                if (lockoutStatus.locked) {
                    const remainingTime = formatRemainingTime(lockoutStatus.remainingTime);
                    messageDiv.innerHTML = `<div class="error" style="background-color: #fee2e2; border: 1px solid #ef4444; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                        <strong>Account Locked</strong><br>
                        Too many failed login attempts. Please try again in <strong>${remainingTime}</strong>.
                    </div>`;
                } else {
                    // Lockout expired, clear message and interval
                    messageDiv.innerHTML = '';
                    if (lockoutIntervalId) {
                        clearInterval(lockoutIntervalId);
                        lockoutIntervalId = null;
                    }
                }
            }

            // Update immediately
            updateLockoutMessage();

            // Update every second
            lockoutIntervalId = setInterval(updateLockoutMessage, 1000);
        }

        function clearLockoutMessage() {
            if (lockoutIntervalId) {
                clearInterval(lockoutIntervalId);
                lockoutIntervalId = null;
            }
            const messageDiv = document.getElementById('message');
            if (messageDiv) {
                messageDiv.innerHTML = '';
            }
        }

        // Show privacy information modal
        function showPrivacyInfo(event) {
            event.preventDefault();
            const privacyInfo = `
                <div style="max-width: 600px; padding: 20px;">
                    <h2 style="margin-top: 0; color: #1f2937;">"Remember Me" Privacy Information</h2>
                    
                    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                        This information specifically relates to the "Remember me" feature. Your account data, images, and other application data are stored securely on our servers and are separate from this browser-based login feature.
                    </p>
                    
                    <h3 style="color: #374151; margin-top: 20px;">What Login Data is Stored in Your Browser?</h3>
                    <p style="color: #4b5563; line-height: 1.6;">
                        When you check "Remember me", only the following login-related data is stored locally in your browser:
                    </p>
                    <ul style="color: #4b5563; line-height: 1.8; margin-left: 20px;">
                        <li><strong>Email address:</strong> Used to pre-fill the login form</li>
                        <li><strong>Login status:</strong> A flag indicating you were previously logged in</li>
                        <li><strong>Login timestamp:</strong> Used to automatically expire the stored data after 14 days</li>
                    </ul>
                    
                    <p style="color: #6b7280; font-size: 0.875rem; margin-top: 10px; font-style: italic;">
                        Note: Your account information, images, collections, and other application data are stored on our secure servers, not in your browser.
                    </p>
                    
                    <h3 style="color: #374151; margin-top: 20px;">Where is This Login Data Stored?</h3>
                    <p style="color: #4b5563; line-height: 1.6;">
                        The "Remember me" login data is stored locally in your browser's localStorage. This means:
                    </p>
                    <ul style="color: #4b5563; line-height: 1.8; margin-left: 20px;">
                        <li>This login data never leaves your device</li>
                        <li>This login data is not transmitted to our servers</li>
                        <li>This login data is not shared with third parties</li>
                        <li>This login data is specific to your browser and device</li>
                    </ul>
                    
                    <h3 style="color: #374151; margin-top: 20px;">How Long is This Login Data Stored?</h3>
                    <p style="color: #4b5563; line-height: 1.6;">
                        The stored login data automatically expires after <strong>14 days</strong> of inactivity. This balance provides convenience while maintaining security.
                    </p>
                    
                    <h3 style="color: #374151; margin-top: 20px;">Your Rights (GDPR)</h3>
                    <p style="color: #4b5563; line-height: 1.6;">
                        Under GDPR, you have the right to:
                    </p>
                    <ul style="color: #4b5563; line-height: 1.8; margin-left: 20px;">
                        <li><strong>Access:</strong> View what login data is stored in your browser (check browser's localStorage)</li>
                        <li><strong>Delete:</strong> Clear stored login data by signing out or unchecking "Remember me"</li>
                        <li><strong>Control:</strong> Choose whether to use "Remember me" functionality</li>
                    </ul>
                    
                    <h3 style="color: #374151; margin-top: 20px;">How to Clear Your Browser Login Data</h3>
                    <p style="color: #4b5563; line-height: 1.6;">
                        You can clear the stored login data at any time by:
                    </p>
                    <ul style="color: #4b5563; line-height: 1.8; margin-left: 20px;">
                        <li>Signing out of your account</li>
                        <li>Unchecking "Remember me" before logging in</li>
                        <li>Clearing your browser's localStorage (browser settings)</li>
                    </ul>
                    
                </div>
            `;
            
            // Create modal if it doesn't exist
            let modal = document.getElementById('privacyInfoModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'privacyInfoModal';
                modal.className = 'modal';
                modal.style.cssText = 'display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);';
                modal.innerHTML = `
                    <div style="background-color: white; margin: 5% auto; padding: 0; border-radius: 8px; max-width: 700px; max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="position: relative;">
                            <span onclick="closePrivacyInfo()" style="position: absolute; right: 15px; top: 15px; color: #9ca3af; font-size: 28px; font-weight: bold; cursor: pointer; z-index: 1;">&times;</span>
                            <div id="privacyInfoContent"></div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            document.getElementById('privacyInfoContent').innerHTML = privacyInfo;
            modal.style.display = 'block';
            
            // Close on outside click
            modal.onclick = function(event) {
                if (event.target === modal) {
                    closePrivacyInfo();
                }
            };
        }

        function closePrivacyInfo() {
            const modal = document.getElementById('privacyInfoModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        function toggleSignUpMode(event) {
            event.preventDefault();
            isSignUpMode = !isSignUpMode;
            const loginBtn = document.getElementById('loginBtn');
            const toggleLink = document.getElementById('toggleSignUp');
            const toggleText = document.getElementById('toggleSignUpText');
            const passwordRequirements = document.getElementById('passwordRequirements');
            const passwordInput = document.getElementById('password');
            
            if (isSignUpMode) {
                loginBtn.innerHTML = 'Sign Up';
                toggleText.textContent = 'Already have an account? ';
                toggleLink.textContent = 'Sign In';
                // Show password requirements for sign-up
                if (passwordRequirements) {
                    passwordRequirements.style.display = 'block';
                }
                // Add real-time validation on password input
                if (passwordInput) {
                    passwordInput.addEventListener('input', validatePasswordStrength);
                }
            } else {
                loginBtn.innerHTML = 'Sign In';
                toggleText.textContent = 'Don\'t have an account? ';
                toggleLink.textContent = 'Sign Up';
                // Hide password requirements for sign-in
                if (passwordRequirements) {
                    passwordRequirements.style.display = 'none';
                }
                // Remove real-time validation
                if (passwordInput) {
                    passwordInput.removeEventListener('input', validatePasswordStrength);
                }
            }
        }

        // Password validation function
        function validatePassword(password) {
            const errors = [];
            
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (!/[a-z]/.test(password)) {
                errors.push('Password must contain at least one lowercase letter');
            }
            if (!/[0-9]/.test(password)) {
                errors.push('Password must contain at least one number');
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                errors.push('Password must contain at least one special character (!@#$%^&*)');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }

        // Real-time password strength validation (visual feedback)
        function validatePasswordStrength() {
            const password = document.getElementById('password').value;
            const requirements = {
                length: document.getElementById('req-length'),
                uppercase: document.getElementById('req-uppercase'),
                lowercase: document.getElementById('req-lowercase'),
                number: document.getElementById('req-number'),
                special: document.getElementById('req-special')
            };
            
            if (!requirements.length) return; // Requirements not visible
            
            // Check each requirement
            if (password.length >= 8) {
                requirements.length.style.color = '#10b981';
            } else {
                requirements.length.style.color = '#ef4444';
            }
            
            if (/[A-Z]/.test(password)) {
                requirements.uppercase.style.color = '#10b981';
            } else {
                requirements.uppercase.style.color = '#ef4444';
            }
            
            if (/[a-z]/.test(password)) {
                requirements.lowercase.style.color = '#10b981';
            } else {
                requirements.lowercase.style.color = '#ef4444';
            }
            
            if (/[0-9]/.test(password)) {
                requirements.number.style.color = '#10b981';
            } else {
                requirements.number.style.color = '#ef4444';
            }
            
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                requirements.special.style.color = '#10b981';
            } else {
                requirements.special.style.color = '#ef4444';
            }
        }

        async function handleEmailLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            
            // Basic validation
            if (!email || !password) {
                showMessage('Please enter both email and password.', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Check for rate limiting lockout (only for sign-in, not sign-up)
            if (!isSignUpMode) {
                // Check client-side rate limit first (fast check)
                const lockoutStatus = isAccountLockedOut();
                if (lockoutStatus.locked) {
                    showLockoutMessage();
                    return;
                }
                
                // Check server-side rate limit (more secure, can't be bypassed)
                const serverRateLimit = await checkServerRateLimit(email, 'login');
                if (!serverRateLimit.allowed || serverRateLimit.isLocked) {
                    // Server-side lockout detected
                    const remainingTime = serverRateLimit.remainingTime || 0;
                    const minutes = Math.ceil(remainingTime / 60);
                    showMessage(`Too many failed attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`, 'error');
                    showLockoutMessage();
                    return;
                }
                
                // Clear any existing lockout message if not locked
                clearLockoutMessage();
            }
            
            // Disable button and show loading
            loginBtn.disabled = true;
            const originalButtonText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<div class="loading" style="margin: 0 auto;"></div>';
            
            try {
                if (supabaseClient) {
                    if (isSignUpMode) {
                        // Handle sign-up
                        await handleEmailSignUp(email, password);
                    } else {
                        // Handle sign-in only - no auto sign-up to prevent account enumeration
                        const signInPromise = supabaseClient.auth.signInWithPassword({ email, password });
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Sign in timeout')), 10000)
                        );
                        
                        const { data, error } = await Promise.race([signInPromise, timeoutPromise]);
                        
                        if (error) {
                            // Record failed attempt for rate limiting (both client and server)
                            recordFailedAttempt(email);
                            await recordServerAttempt(email, 'login', false);
                            
                            // Check if we just hit the lockout threshold (client-side)
                            const lockoutStatus = isAccountLockedOut();
                            if (lockoutStatus.locked) {
                                // Show persistent lockout message with countdown
                                showLockoutMessage();
                            } else {
                                // Generic error message to prevent account enumeration
                                showMessage('Invalid email or password. Please try again.', 'error');
                            }
                        } else {
                            // Successful login - clear rate limit data and lockout message
                            clearRateLimitData(email);
                            await recordServerAttempt(email, 'login', true); // Record successful attempt
                            clearLockoutMessage();
                            
                            showMessage('Successfully signed in!', 'success');
                            currentUser = data.user;
                            
                            // Save login to localStorage if "Remember me" is checked
                            const rememberMe = document.getElementById('rememberMe').checked;
                            if (rememberMe) {
                                setPersistentLogin(email, true);
                            }
                            
                            setTimeout(() => {
                                showDashboard();
                                loadUserData(); // Load in background
                            }, 1000);
                        }
                    }
                } else {
                    // Fallback to demo mode if Supabase not available
                    if (email && password) {
                        currentUser = { email: email };
                        showMessage('Successfully signed in! (Demo mode)', 'success');
                        setTimeout(() => {
                            showDashboard();
                            loadUserData(); // Load in background
                        }, 1000);
                    } else {
                        showMessage('Please enter both email and password.', 'error');
                    }
                }
            } catch (error) {
                // Record failed attempt for rate limiting (only for sign-in)
                if (!isSignUpMode) {
                    recordFailedAttempt(email);
                    await recordServerAttempt(email, 'login', false);
                }
                
                // Generic error message
                if (isSignUpMode) {
                    showMessage('Unable to create account. Please try again.', 'error');
                } else {
                    const lockoutStatus = isAccountLockedOut();
                    if (lockoutStatus.locked) {
                        // Show persistent lockout message with countdown
                        showLockoutMessage();
                    } else {
                        showMessage('Invalid email or password. Please try again.', 'error');
                    }
                }
            } finally {
                loginBtn.disabled = false;
                loginBtn.innerHTML = originalButtonText;
            }
        }

        async function handleEmailSignUp(email, password) {
            // Validate email format before attempting sign-up
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Validate password strength before attempting sign-up
            const validation = validatePassword(password);
            if (!validation.isValid) {
                // Show specific password requirements that failed
                const errorMessage = 'Password does not meet requirements:\n' + validation.errors.join('\n');
                showMessage(errorMessage, 'error');
                return;
            }
            
            // Check server-side rate limit for sign-up
            const serverRateLimit = await checkServerRateLimit(email, 'signup');
            if (!serverRateLimit.allowed || serverRateLimit.isLocked) {
                const remainingTime = serverRateLimit.remainingTime || 0;
                const minutes = Math.ceil(remainingTime / 60);
                showMessage(`Too many sign-up attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`, 'error');
                return;
            }
            
            const signUpPromise = supabaseClient.auth.signUp({ email, password });
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Sign up timeout')), 10000)
            );
            
            const { data, error } = await Promise.race([signUpPromise, timeoutPromise]);
            
            if (error) {
                // Record failed sign-up attempt
                await recordServerAttempt(email, 'signup', false);
                
                // Check if error is related to password policy (Supabase may have additional requirements)
                if (error.message && error.message.toLowerCase().includes('password')) {
                    showMessage('Password does not meet security requirements. Please ensure it meets all criteria.', 'error');
                } else {
                    // Generic error message to prevent information disclosure
                    showMessage('Unable to create account. Please try again.', 'error');
                }
            } else {
                // Successful sign-up - clear any rate limit data and lockout message for this email
                clearRateLimitData(email);
                await recordServerAttempt(email, 'signup', true); // Record successful sign-up
                clearLockoutMessage();
                
                showMessage('Account created! Check your email for confirmation if required.', 'success');
                currentUser = data.user;
                
                // Save login to localStorage if "Remember me" is checked
                const rememberMe = document.getElementById('rememberMe').checked;
                if (rememberMe) {
                    setPersistentLogin(email, true);
                }
                
                setTimeout(async () => {
                    await loadUserData();
                    showDashboard();
                }, 1000);
            }
        }
        
        async function signOut() {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            currentUser = null;
            
            // Clear persistent login
            clearPersistentLogin();
            
            showMessage('Signed out successfully.', 'success');
            setTimeout(() => {
                showLogin();
            }, 1000);
        }
        
        // OAuth Handlers
        async function handleGoogleLogin() {
            if (!supabaseClient) {
                showMessage('Authentication not available. Please try again later.', 'error');
                return;
            }
            
            try {
                // Use current origin for OAuth redirect so it redirects back to your site
                const redirectUrl = window.location.origin;
                
                const { data, error } = await supabaseClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: redirectUrl
                    }
                });
                
                if (error) {
                    // Generic error message to prevent information disclosure
                    showMessage('Google login failed. Please try again.', 'error');
                    return;
                }
                
                // The redirect will handle the rest
            } catch (error) {
                // Generic error message to prevent information disclosure
                showMessage('Google login failed. Please try again.', 'error');
            }
        }
        // Media Library Functions
        let mediaFiles = [];
        let currentEditingFile = null;
        let cropSelection = null;
        let isCropping = false;
        let originalImageState = null; // Store original image for undo
        let hasChanges = false; // Track if there are changes to revert

        function openMediaLibrary() {
            console.log('openMediaLibrary called');
            document.getElementById('mediaModal').classList.remove('hidden');
            loadMediaFiles();
            checkBackupAvailability();
        }

        function checkBackupAvailability() {
            try {
                const backupData = localStorage.getItem('academiq-media-backup');
                const restoreButton = document.querySelector('button[onclick="restoreMediaFromBackup()"]');
                
                if (backupData && restoreButton) {
                    const backup = JSON.parse(backupData);
                    restoreButton.textContent = `🔄 Restore (${backup.count})`;
                    restoreButton.title = `Restore ${backup.count} files from backup (${new Date(backup.timestamp).toLocaleString()})`;
                    restoreButton.style.backgroundColor = '#fef3c7';
                    restoreButton.style.borderColor = '#f59e0b';
                } else if (restoreButton) {
                    restoreButton.textContent = '🔄 Restore';
                    restoreButton.title = 'No backup available';
                    restoreButton.style.backgroundColor = '';
                    restoreButton.style.borderColor = '';
                }
            } catch (error) {
                console.warn('Error checking backup availability:', error);
            }
        }

        function closeMediaLibrary() {
            document.getElementById('mediaModal').classList.add('hidden');
        }

        function loadMediaFiles() {
            console.log('Loading media files...');
            
            // Try to load from localStorage first
            try {
                const stored = localStorage.getItem('academiq-media');
                if (stored) {
                    const parsedFiles = JSON.parse(stored);
                    if (Array.isArray(parsedFiles)) {
                        mediaFiles = parsedFiles;
                        console.log('Successfully loaded media files:', mediaFiles.length);
                    } else {
                        console.warn('Invalid media files format, starting fresh');
                        mediaFiles = [];
                    }
                } else {
                    console.log('No stored media files found, starting fresh');
                    mediaFiles = [];
                }
            } catch (error) {
                console.error('Error loading media files:', error);
                console.log('Keeping existing mediaFiles array to prevent data loss');
                // Don't clear the array - keep existing data if any
                if (!Array.isArray(mediaFiles)) {
                    mediaFiles = [];
                }
                // Only clear localStorage if it's definitely corrupted
                try {
                    localStorage.getItem('academiq-media');
                } catch (e) {
                    console.log('localStorage is corrupted, clearing it');
                    localStorage.removeItem('academiq-media');
                    localStorage.removeItem('academiq-media-metadata');
                }
            }
            
            renderMediaGrid();
        }

        function clearOldMediaData() {
            // Clear any old media data that might be taking up space
            localStorage.removeItem('academiq-media-metadata');
            console.log('Cleared old media metadata');
        }

        function clearAllMedia() {
            if (confirm('Are you sure you want to clear all media files? This cannot be undone.')) {
                // Create backup before clearing
                const backup = {
                    timestamp: new Date().toISOString(),
                    mediaFiles: [...mediaFiles],
                    count: mediaFiles.length
                };
                
                try {
                    localStorage.setItem('academiq-media-backup', JSON.stringify(backup));
                    console.log('Backup created before clearing media files');
                } catch (error) {
                    console.warn('Could not create backup:', error);
                }
                
                mediaFiles = [];
                localStorage.removeItem('academiq-media');
                localStorage.removeItem('academiq-media-metadata');
                renderMediaGrid();
                showMessage('All media files cleared', 'success');
            }
        }

        function restoreMediaFromBackup() {
            try {
                console.log('Attempting to restore from backup...');
                const backupData = localStorage.getItem('academiq-media-backup');
                console.log('Backup data found:', !!backupData);
                
                if (backupData) {
                    const backup = JSON.parse(backupData);
                    console.log('Backup parsed:', backup);
                    console.log('Backup mediaFiles:', backup.mediaFiles);
                    console.log('Backup count:', backup.count);
                    
                    if (backup.mediaFiles && Array.isArray(backup.mediaFiles)) {
                        mediaFiles = [...backup.mediaFiles];
                        saveMediaFiles();
                        renderMediaGrid();
                        showMessage(`Restored ${backup.count} media files from backup`, 'success');
                        return true;
                    } else {
                        showMessage('Backup data is corrupted', 'error');
                        return false;
                    }
                }
                
                // Check if there are any media files in the main storage
                const mainData = localStorage.getItem('academiq-media');
                if (mainData) {
                    try {
                        const mainMedia = JSON.parse(mainData);
                        if (Array.isArray(mainMedia) && mainMedia.length > 0) {
                            mediaFiles = mainMedia;
                            renderMediaGrid();
                            showMessage(`Found ${mainMedia.length} media files in storage`, 'success');
                            return true;
                        }
                    } catch (e) {
                        console.error('Error parsing main media data:', e);
                    }
                }
                
                showMessage('No backup found', 'warning');
                return false;
            } catch (error) {
                console.error('Error restoring from backup:', error);
                showMessage('Error restoring from backup', 'error');
                return false;
            }
        }

        function saveMediaFiles() {
            console.log('Saving media files:', mediaFiles.length, 'files');
            try {
                const dataToSave = JSON.stringify(mediaFiles);
                console.log('Data size:', dataToSave.length, 'characters');
                localStorage.setItem('academiq-media', dataToSave);
                console.log('Successfully saved media files to localStorage');
            } catch (error) {
                console.error('Error saving media files:', error);
                console.log('Error details:', {
                    name: error.name,
                    // Don't log error.message to prevent information disclosure
                    mediaFilesCount: mediaFiles.length
                });
                
                if (error.name === 'QuotaExceededError') {
                    console.log('Quota exceeded, compressing images...');
                    compressAllImages();
                } else {
                    showMessage('Error saving media files. Please try again.', 'error');
                }
            }
        }

        function compressAllImages() {
            const compressionPromises = mediaFiles.map((file, index) => {
                if (file.url && file.url.startsWith('data:image/')) {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            
                            // Calculate new dimensions (max 600px)
                            const maxSize = 600;
                            let { width, height } = img;
                            
                            if (width > height) {
                                if (width > maxSize) {
                                    height = (height * maxSize) / width;
                                    width = maxSize;
                                }
                            } else {
                                if (height > maxSize) {
                                    width = (width * maxSize) / height;
                                    height = maxSize;
                                }
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            // Compress with quality 0.7
                            const compressedUrl = canvas.toDataURL(file.type, 0.7);
                            
                            resolve({
                                ...file,
                                url: compressedUrl,
                                size: Math.round(compressedUrl.length * 0.75) // Approximate compressed size
                            });
                        };
                        img.src = file.url;
                    });
                }
                return Promise.resolve(file);
            });
            
            Promise.all(compressionPromises).then(compressedFiles => {
                mediaFiles = compressedFiles;
                console.log('Images compressed, trying to save again...');
                
                try {
                    localStorage.setItem('academiq-media', JSON.stringify(mediaFiles));
                    showMessage('Images compressed to save space. All files saved!', 'success');
                    renderMediaGrid();
                } catch (e) {
                    console.log('Still too large after compression, creating backup before removing files...');
                    
                    // Create backup before removing files
                    const backup = {
                        timestamp: new Date().toISOString(),
                        mediaFiles: [...mediaFiles],
                        count: mediaFiles.length
                    };
                    
                    try {
                        localStorage.setItem('academiq-media-backup', JSON.stringify(backup));
                        console.log('Backup created before removing files');
                    } catch (backupError) {
                        console.warn('Could not create backup:', backupError);
                    }
                    
                    // Remove oldest files if still too large
                    if (mediaFiles.length > 10) {
                        const removedCount = mediaFiles.length - 10;
                        mediaFiles = mediaFiles.slice(-10);
                        try {
                            localStorage.setItem('academiq-media', JSON.stringify(mediaFiles));
                            showMessage(`Removed ${removedCount} oldest files to make space. 10 most recent files saved. Backup available for restore.`, 'warning');
                            renderMediaGrid();
                        } catch (e2) {
                            showMessage('Storage full. Please delete some files manually or restore from backup.', 'error');
                        }
                    } else {
                        showMessage('Storage full. Please delete some files manually or restore from backup.', 'error');
                    }
                }
            });
        }

        function renderMediaGrid() {
            const grid = document.getElementById('mediaGrid');
            grid.innerHTML = '';

            mediaFiles.forEach(file => {
                const item = document.createElement('div');
                item.style.position = 'relative';
                
                // Check if we're selecting for a link, background, or QR logo
                const isSelectingForLink = window.selectingImageForLink;
                const isEditingLink = window.editingLinkIndex !== undefined;
                const isSelectingForBackground = window.selectingImageForBackground;
                const isSelectingForQRLogo = window.selectingImageForQRLogo;
                
                let buttons = '';
                if (isSelectingForQRLogo) {
                    // Show "Select for QR Logo" button
                    buttons = `
                        <button class="select-qr-logo-btn" onclick="selectImageForQRLogo('${file.url}')" style="position: absolute; bottom: 4px; left: 4px; right: 4px; height: 24px; border-radius: 4px; border: none; background: #10b981; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500;">Select for QR Logo</button>
                    `;
                } else if (isSelectingForBackground) {
                    // Show "Use as Background" button
                    buttons = `
                        <button class="select-background-btn" onclick="useAsBackground('${file.url}')" style="position: absolute; bottom: 4px; left: 4px; right: 4px; height: 24px; border-radius: 4px; border: none; background: #8b5cf6; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500;">Use as Background</button>
                    `;
                } else if (isSelectingForLink) {
                    // Show appropriate button based on whether we're creating or editing
                    const buttonText = isEditingLink ? 'Update Link Image' : 'Select for Link';
                    const onClickFunction = isEditingLink ? 'selectImageForLinkEdit' : 'selectImageForLink';
                    
                    buttons = `
                        <button class="select-link-btn" onclick="${onClickFunction}('${file.url}')" style="position: absolute; bottom: 4px; left: 4px; right: 4px; height: 24px; border-radius: 4px; border: none; background: #3b82f6; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500;">${buttonText}</button>
                    `;
                } else {
                    // Show normal buttons when not selecting for anything
                    buttons = `
                        <button class="edit-btn" onclick="editImage('${file.id}')" style="position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; border-radius: 50%; border: none; background: #3b82f6; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">✏️</button>
                        <button class="delete-btn" onclick="deleteImage('${file.id}')" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; border: none; background: #ef4444; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">✕</button>
                    `;
                }
                
                const img = document.createElement('img');
                img.src = file.url || '';
                img.alt = file.name || 'File';
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                
                item.appendChild(img);
                item.insertAdjacentHTML('beforeend', buttons);
                grid.appendChild(item);
            });
            
            updateStorageInfo();
        }

        function updateStorageInfo() {
            const storageInfo = document.getElementById('storageInfo');
            if (storageInfo) {
                const totalSize = mediaFiles.reduce((sum, file) => sum + (file.size || 0), 0);
                const sizeInMB = (totalSize / (1024 * 1024)).toFixed(1);
                const fileCount = mediaFiles.length;
                
                storageInfo.textContent = `${fileCount} files (${sizeInMB}MB)`;
                
                // Color code based on usage
                if (totalSize > 20 * 1024 * 1024) { // > 20MB
                    storageInfo.style.color = '#dc2626'; // red
                } else if (totalSize > 10 * 1024 * 1024) { // > 10MB
                    storageInfo.style.color = '#d97706'; // orange
                } else {
                    storageInfo.style.color = '#6b7280'; // gray
                }
            }
        }

        function uploadImages() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*';
            input.onchange = handleFileUpload;
            input.click();
        }

        function handleFileUpload(event) {
            const files = Array.from(event.target.files);
            console.log('Files selected for upload:', files.length);
            
            files.forEach((file, index) => {
                console.log(`Processing file ${index + 1}:`, file.name, file.size, file.type);
                
                if (file.type.startsWith('image/')) {
                    // Check file size (limit to 5MB to allow more files)
                    if (file.size > 5 * 1024 * 1024) {
                        showMessage(`File "${file.name}" too large. Please choose images smaller than 5MB.`, 'error');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        console.log('File read successfully:', file.name);
                        
                        const newFile = {
                            id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                            name: file.name,
                            url: e.target.result,
                            type: file.type,
                            size: file.size,
                            uploadedAt: new Date().toISOString()
                        };
                        mediaFiles.push(newFile);
                        console.log('Total files after upload:', mediaFiles.length);
                        
                        // Try to save, but don't fail if quota exceeded
                        try {
                            saveMediaFiles();
                        } catch (error) {
                            console.warn('Could not save file to localStorage:', error);
                            showMessage('File uploaded but not saved to storage due to space limits.', 'warning');
                        }
                        
                        renderMediaGrid();
                    };
                    
                    reader.onerror = (e) => {
                        console.error('Error reading file:', file.name, e);
                        showMessage(`Error reading file "${file.name}"`, 'error');
                    };
                    
                    reader.readAsDataURL(file);
                } else {
                    console.log('Skipping non-image file:', file.name, file.type);
                    showMessage(`Skipping "${file.name}" - only image files are supported.`, 'warning');
                }
            });
        }

        function deleteImage(fileId) {
            const fileToDelete = mediaFiles.find(file => file.id === fileId);
            console.log('Deleting image:', fileToDelete ? fileToDelete.name : 'unknown', 'ID:', fileId);
            console.log('Media files before deletion:', mediaFiles.length);
            
            mediaFiles = mediaFiles.filter(file => file.id !== fileId);
            console.log('Media files after deletion:', mediaFiles.length);
            
            saveMediaFiles();
            renderMediaGrid();
            showMessage('Image deleted', 'success');
        }

        function editImage(fileId) {
            const file = mediaFiles.find(f => f.id === fileId);
            if (!file) return;

            currentEditingFile = file;
            // Store the original image state for undo functionality
            originalImageState = {
                url: file.url,
                transform: ''
            };
            hasChanges = false; // Reset changes flag
            
            document.getElementById('edit-image').src = file.url;
            document.getElementById('edit-image').style.transform = '';
            document.getElementById('imageEditorModal').classList.remove('hidden');
            
            updateRevertButton();
        }

        function closeImageEditor() {
            document.getElementById('imageEditorModal').classList.add('hidden');
            currentEditingFile = null;
            originalImageState = null;
            hasChanges = false;
            cancelCrop();
        }

        function updateRevertButton() {
            const revertBtn = document.querySelector('button[onclick="revertImage()"]');
            if (revertBtn) {
                if (hasChanges) {
                    revertBtn.style.display = 'inline-block';
                    revertBtn.disabled = false;
                } else {
                    revertBtn.style.display = 'none';
                    revertBtn.disabled = true;
                }
            }
        }

        function rotateImage() {
            const img = document.getElementById('edit-image');
            const currentRotation = img.style.transform || '';
            const rotation = currentRotation.includes('rotate') ? 
                parseInt(currentRotation.match(/rotate\((\d+)deg\)/)?.[1] || '0') + 90 : 90;
            img.style.transform = `rotate(${rotation}deg)`;
            
            hasChanges = true;
            updateRevertButton();
        }
        function revertImage() {
            if (!originalImageState || !currentEditingFile) {
                showMessage('No changes to revert', 'warning');
                return;
            }

            console.log('Reverting image to original state');
            
            // Revert the image display
            const img = document.getElementById('edit-image');
            img.src = originalImageState.url;
            img.style.transform = originalImageState.transform;
            
            // Revert the file data
            currentEditingFile.url = originalImageState.url;
            
            // Update the file in our array
            const fileIndex = mediaFiles.findIndex(f => f.id === currentEditingFile.id);
            if (fileIndex !== -1) {
                mediaFiles[fileIndex] = currentEditingFile;
                saveMediaFiles();
            }
            
            // Cancel any active crop
            cancelCrop();
            
            // Reset changes flag
            hasChanges = false;
            updateRevertButton();
            
            showMessage('Image reverted to original state', 'success');
        }
        function startCrop() {
            if (isCropping) return;
            
            console.log('Starting crop mode');
            isCropping = true;
            const overlay = document.getElementById('crop-overlay');
            overlay.classList.remove('hidden');
            
            // Remove any existing event listeners
            overlay.removeEventListener('mousedown', handleCropStart);
            overlay.removeEventListener('mousemove', handleCropMove);
            overlay.removeEventListener('mouseup', handleCropEnd);
            
            // Add new event listeners
            overlay.addEventListener('mousedown', handleCropStart);
            overlay.addEventListener('mousemove', handleCropMove);
            overlay.addEventListener('mouseup', handleCropEnd);
        }

        function handleCropStart(e) {
            e.preventDefault();
            console.log('Crop start');
            
            const overlay = document.getElementById('crop-overlay');
            const rect = overlay.getBoundingClientRect();
            
            cropSelection = {
                startX: e.clientX - rect.left,
                startY: e.clientY - rect.top,
                endX: e.clientX - rect.left,
                endY: e.clientY - rect.top,
                isDragging: true
            };
            
            updateCropSelection();
        }

        function handleCropMove(e) {
            if (!cropSelection || !cropSelection.isDragging) return;
            
            e.preventDefault();
            
            const overlay = document.getElementById('crop-overlay');
            const rect = overlay.getBoundingClientRect();
            
            cropSelection.endX = e.clientX - rect.left;
            cropSelection.endY = e.clientY - rect.top;
            
            updateCropSelection();
        }

        function handleCropEnd(e) {
            if (!cropSelection || !cropSelection.isDragging) return;
            
            e.preventDefault();
            console.log('Crop end');
            
            const overlay = document.getElementById('crop-overlay');
            const rect = overlay.getBoundingClientRect();
            
            cropSelection.endX = e.clientX - rect.left;
            cropSelection.endY = e.clientY - rect.top;
            cropSelection.isDragging = false;
            
            // Ensure minimum size
            const minSize = 20;
            const width = Math.abs(cropSelection.endX - cropSelection.startX);
            const height = Math.abs(cropSelection.endY - cropSelection.startY);
            
            if (width < minSize || height < minSize) {
                console.log('Selection too small, canceling crop');
                cancelCrop();
                return;
            }
            
            updateCropSelection();
            console.log('Crop selection complete');
        }

        function updateCropSelection() {
            if (!cropSelection) return;
            
            const overlay = document.getElementById('crop-overlay');
            const existing = overlay.querySelector('.crop-selection');
            if (existing) existing.remove();
            
            const left = Math.min(cropSelection.startX, cropSelection.endX);
            const top = Math.min(cropSelection.startY, cropSelection.endY);
            const width = Math.abs(cropSelection.endX - cropSelection.startX);
            const height = Math.abs(cropSelection.endY - cropSelection.startY);
            
            const selection = document.createElement('div');
            selection.className = 'crop-selection';
            selection.style.left = left + 'px';
            selection.style.top = top + 'px';
            selection.style.width = width + 'px';
            selection.style.height = height + 'px';
            
            overlay.appendChild(selection);
        }

        function applyCrop() {
            if (!cropSelection || !currentEditingFile) {
                showMessage('No crop selection to apply', 'error');
                return;
            }
            
            console.log('Applying crop...');
            
            const img = document.getElementById('edit-image');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Get image dimensions
            const imgRect = img.getBoundingClientRect();
            const overlayRect = document.getElementById('crop-overlay').getBoundingClientRect();
            
            // Calculate crop coordinates relative to image
            const scaleX = img.naturalWidth / imgRect.width;
            const scaleY = img.naturalHeight / imgRect.height;
            
            const cropX = (cropSelection.startX - (overlayRect.left - imgRect.left)) * scaleX;
            const cropY = (cropSelection.startY - (overlayRect.top - imgRect.top)) * scaleY;
            const cropWidth = Math.abs(cropSelection.endX - cropSelection.startX) * scaleX;
            const cropHeight = Math.abs(cropSelection.endY - cropSelection.startY) * scaleY;
            
            console.log('Crop coordinates:', { cropX, cropY, cropWidth, cropHeight });
            
            // Set canvas size to crop size
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            
            // Draw cropped image
            ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
            
            // Convert to data URL and update file
            const dataUrl = canvas.toDataURL(currentEditingFile.type);
            currentEditingFile.url = dataUrl;
            
            // Update the file in our array
            const fileIndex = mediaFiles.findIndex(f => f.id === currentEditingFile.id);
            if (fileIndex !== -1) {
                mediaFiles[fileIndex] = currentEditingFile;
                saveMediaFiles();
            }
            
            // Update the image display
            img.src = dataUrl;
            
            // Mark as having changes
            hasChanges = true;
            updateRevertButton();
            
            // Close crop mode
            cancelCrop();
            
            showMessage('Image cropped successfully!', 'success');
        }

        function cancelCrop() {
            isCropping = false;
            cropSelection = null;
            const overlay = document.getElementById('crop-overlay');
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
            
            // Remove event listeners
            overlay.removeEventListener('mousedown', handleCropStart);
            overlay.removeEventListener('mousemove', handleCropMove);
            overlay.removeEventListener('mouseup', handleCropEnd);
        }


        // Persistence utility functions (using localStorage for better reliability)
        function setPersistentLogin(email, isLoggedIn) {
            try {
                localStorage.setItem('academiq_email', email);
                localStorage.setItem('academiq_logged_in', isLoggedIn ? 'true' : 'false');
                localStorage.setItem('academiq_login_time', Date.now().toString());
                // Login saved to localStorage
            } catch (error) {
                console.error('Failed to save login to localStorage:', error);
            }
        }

        function getPersistentLogin() {
            try {
                const email = localStorage.getItem('academiq_email');
                const isLoggedIn = localStorage.getItem('academiq_logged_in');
                const loginTime = localStorage.getItem('academiq_login_time');
                
                // Checking localStorage login
                
                // Check if login is not too old (14 days - security best practice)
                if (loginTime) {
                    const daysSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60 * 24);
                    if (daysSinceLogin > 14) {
                        // Login expired (older than 14 days)
                        clearPersistentLogin();
                        return { email: null, isLoggedIn: null };
                    }
                }
                
                return { email, isLoggedIn };
            } catch (error) {
                console.error('Failed to get login from localStorage:', error);
                return { email: null, isLoggedIn: null };
            }
        }

        function clearPersistentLogin() {
            try {
                localStorage.removeItem('academiq_email');
                localStorage.removeItem('academiq_logged_in');
                localStorage.removeItem('academiq_login_time');
                // Login cleared from localStorage
            } catch (error) {
                console.error('Failed to clear login from localStorage:', error);
            }
        }

        async function checkSavedLogin() {
            try {
                const { email: savedEmail, isLoggedIn } = getPersistentLogin();
                
                if (savedEmail && isLoggedIn === 'true') {
                    // Found saved login
                    
                    // Pre-fill email if login element exists
                    const emailInput = document.getElementById('email');
                    if (emailInput) {
                        emailInput.value = savedEmail;
                    }
                    
                    showMessage('Welcome back! Auto-logging in...', 'success');
                    
                    // Try to get the existing session with timeout
                    if (!supabaseClient) {
                        console.log('No Supabase client available');
                        showLogin();
                        return true;
                    }
                    
                    try {
                        console.log('Checking Supabase session...');
                        
                        const sessionPromise = supabaseClient.auth.getSession();
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Session check timeout')), 10000)
                        );
                        
                        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
                        console.log('Session check result:', { session: !!session, error });
                        
                        if (session && session.user && session.user.email === savedEmail) {
                            console.log('Found existing session, logging in automatically');
                            currentUser = session.user;
                            // Hide login screen immediately
                            const loginElement = document.getElementById('login');
                            if (loginElement) {
                                loginElement.classList.add('hidden');
                            }
                            // Return true immediately - main flow will handle loading data
                            return true;
                        } else {
                            console.log('No valid session found, showing login form');
                            showLogin();
                            return true;
                        }
                    } catch (error) {
                        // Session check failed
                        // Don't log error.message to prevent information disclosure
                        // Don't show login here - let the main flow handle it
                        // The session might still be valid, just slow to respond
                        return false;
                    }
                } else {
                    console.log('No saved login found');
                }
            } catch (error) {
                console.error('Error in checkSavedLogin:', error);
            }
            return false;
        }

        // Theming System
        let currentTheme = {
            backgroundType: 'solid',
            backgroundColor: '#ffffff',
            gradientText: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            // Page description (name/title) formatting
            descriptionText: 'alexander.towbin',
            descriptionColor: '#000000',
            descriptionFont: 'Arial',
            descriptionBold: false,
            descriptionItalic: false,
            descriptionUnderline: false,
            // Bio text formatting
            bioText: 'Welcome to my page!',
            bioColor: '#000000',
            bioFont: 'Arial',
            bioBold: false,
            bioItalic: false,
            bioUnderline: false,
            // Presentation text formatting
            presentationColor: '#000000',
            presentationFont: 'Arial',
            presentationBold: false,
            presentationItalic: false,
            presentationUnderline: false,
            // Legacy properties for backward compatibility
            textColor: '#000000',
            textFont: 'Arial',
            textBold: false,
            textItalic: false,
            textUnderline: false,
            buttonStyle: 'soft',
            buttonTextColor: '#000000',
            buttonTextFont: 'Arial',
            buttonTextBold: false,
            buttonTextItalic: false,
            buttonTextUnderline: false,
            buttonBgColor: '#3b82f6',
            backgroundImage: null,
            gradientBorder: true,
            // Border customization
            borderType: 'solid', // 'solid', 'gradient'
            borderStyle: 'fill', // 'fill', 'thin'
            borderColor: '#1f2937',
            borderGradientText: 'linear-gradient(45deg, #8b5cf6, #06b6d4)'
        };

        // Helper function to update both global theme and current collection theme
        function updateThemeProperty(property, value) {
            // Update global currentTheme for UI consistency
            currentTheme[property] = value;
            
            // Update current collection's theme if it exists
            if (currentList) {
                if (!currentList.theme) currentList.theme = {};
                currentList.theme[property] = value;
            }
        }
        function initTheming() {
            if (themingInitialized) {
                console.log('Theming system already initialized, skipping...');
                return;
            }
            
            try {
                console.log('Initializing theming system...');
                themingInitialized = true;
                
                // Set up event listener for display name input to update preview in real-time
                const profileDisplayNameInput = document.getElementById('profileDisplayName');
                if (profileDisplayNameInput) {
                    profileDisplayNameInput.addEventListener('input', function() {
                        const previewNameElement = document.getElementById('preview-name');
                        if (previewNameElement) {
                            previewNameElement.textContent = this.value || 'Your Name';
                            // Apply dynamic font size based on text length
                            // Use fixed 1.75rem to match public.html - CSS handles font size
                            previewNameElement.style.setProperty('font-size', '1.75rem');
                        }
                    });
                }
                
                // Set up event listeners for theming controls
                const bgTypeRadios = document.querySelectorAll('input[name="bg-type"]');
            bgTypeRadios.forEach(radio => {
                radio.addEventListener('change', updateBackgroundType);
            });

            const bgColorPicker = document.getElementById('bg-color');
            const bgColorText = document.getElementById('bg-color-text');
            if (bgColorPicker) {
                bgColorPicker.addEventListener('change', updateBackgroundColor);
                bgColorPicker.addEventListener('input', updateBackgroundColor); // Real-time updates
            }
            if (bgColorText) {
                bgColorText.addEventListener('input', updateBackgroundColorFromText);
            }

            const gradientText = document.getElementById('gradient-text');
            if (gradientText) {
                gradientText.addEventListener('input', updateGradient);
                // Don't call updateGradient() here - it will override the saved theme
                // The theme will be loaded by loadThemeIntoUI() which is called before initTheming()
            }

            const textColorPicker = document.getElementById('text-color');
            if (textColorPicker) {
                textColorPicker.addEventListener('change', updateTextColor);
                textColorPicker.addEventListener('input', updateTextColor); // Real-time updates
            }

            const buttonStyleSelect = document.getElementById('button-style');
            if (buttonStyleSelect) {
                buttonStyleSelect.addEventListener('change', updateButtonStyle);
            }

            const buttonTextColorPicker = document.getElementById('button-text-color');
            const buttonTextColorText = document.getElementById('button-text-color-text');
            if (buttonTextColorPicker) {
                buttonTextColorPicker.addEventListener('change', updateButtonTextColor);
                buttonTextColorPicker.addEventListener('input', updateButtonTextColor); // Real-time updates
            }
            if (buttonTextColorText) {
                buttonTextColorText.addEventListener('input', updateButtonTextColorFromText);
            }

            const buttonBgColorPicker = document.getElementById('button-bg-color');
            const buttonBgColorText = document.getElementById('button-bg-color-text');
            if (buttonBgColorPicker) {
                buttonBgColorPicker.addEventListener('change', updateButtonBgColor);
                buttonBgColorPicker.addEventListener('input', updateButtonBgColor); // Real-time updates
            }
            if (buttonBgColorText) {
                buttonBgColorText.addEventListener('input', updateButtonBgColorFromText);
            }

            // Text formatting controls
            const textFont = document.getElementById('text-font');
            if (textFont) {
                textFont.addEventListener('change', updateTextFont);
            }

            const textBold = document.getElementById('text-bold');
            const textItalic = document.getElementById('text-italic');
            const textUnderline = document.getElementById('text-underline');
            if (textBold) textBold.addEventListener('change', updateTextStyle);
            if (textItalic) textItalic.addEventListener('change', updateTextStyle);
            if (textUnderline) textUnderline.addEventListener('change', updateTextStyle);

            const bioText = document.getElementById('bio-text');
            if (bioText) {
                bioText.addEventListener('input', updateBioText);
            } else {
                console.log('Bio text element not found, skipping bio text setup');
            }

            // Button text formatting controls
            const buttonTextFont = document.getElementById('button-text-font');
            if (buttonTextFont) {
                buttonTextFont.addEventListener('change', updateButtonTextFont);
            }

            // RTF Editor functionality
            setupRTFEditor('description-text', 'description');
            // Note: bio-text was removed, so we skip it
            // setupRTFEditor('bio-text', 'bio');
            setupRTFEditor('button-text', 'button');
            
            
            // Presentation text formatting controls
            const presentationColor = document.getElementById('presentation-color');
            const presentationColorText = document.getElementById('presentation-color-text');
            if (presentationColor) {
                presentationColor.addEventListener('change', updatePresentationColor);
                presentationColor.addEventListener('input', updatePresentationColor);
            }
            if (presentationColorText) {
                presentationColorText.addEventListener('input', updatePresentationColorFromText);
            }
            
            // Initialize bio character counter (if bio text exists)
            updateBioCharCounter();

            const bgImageUpload = document.getElementById('bg-image-upload');
            if (bgImageUpload) {
                bgImageUpload.addEventListener('change', handleBackgroundImageUpload);
            }
            
            // Image source buttons
            const uploadImageBtn = document.getElementById('upload-image-btn');
            console.log('Upload image button found:', uploadImageBtn);
            if (uploadImageBtn) {
                uploadImageBtn.addEventListener('click', () => {
                    console.log('Upload image button clicked!');
                    const fileInput = document.getElementById('bg-image-upload');
                    console.log('File input found:', fileInput);
                    if (fileInput) {
                        fileInput.click();
                    } else {
                        console.error('bg-image-upload input not found!');
                    }
                });
                console.log('Upload image button event listener added');
            } else {
                console.error('upload-image-btn not found!');
            }
            
            const selectFromLibraryBtn = document.getElementById('select-from-library-btn');
            console.log('Select from library button found:', selectFromLibraryBtn);
            if (selectFromLibraryBtn) {
                selectFromLibraryBtn.addEventListener('click', () => {
                    console.log('Select from library button clicked!');
                    selectImageFromLibrary();
                });
                console.log('Select from library button event listener added');
            } else {
                console.error('select-from-library-btn not found!');
            }
            
            // Image positioning sliders
            const positionX = document.getElementById('position-x');
            const positionY = document.getElementById('position-y');
            const positionScale = document.getElementById('position-scale');
            
            if (positionX) {
                positionX.addEventListener('input', updateImagePosition);
            }
            if (positionY) {
                positionY.addEventListener('input', updateImagePosition);
            }
            if (positionScale) {
                positionScale.addEventListener('input', updateImagePosition);
            }

            const gradientBorderToggle = document.getElementById('gradient-border-toggle');
            if (gradientBorderToggle) {
                gradientBorderToggle.addEventListener('change', updateGradientBorder);
            }

            // Border style radios
            const borderStyleRadios = document.querySelectorAll('input[name="border-style"]');
            borderStyleRadios.forEach(radio => {
                radio.addEventListener('change', updateBorderStyle);
            });

            // Border type radios
            const borderTypeRadios = document.querySelectorAll('input[name="border-type"]');
            borderTypeRadios.forEach(radio => {
                radio.addEventListener('change', updateBorderType);
            });

            // Border color controls
            const borderColorPicker = document.getElementById('border-color-picker');
            const borderColorText = document.getElementById('border-color-text');
            if (borderColorPicker) {
                borderColorPicker.addEventListener('change', updateBorderColor);
                borderColorPicker.addEventListener('input', updateBorderColor);
            }
            if (borderColorText) {
                borderColorText.addEventListener('input', updateBorderColorFromText);
            }

            // Border gradient controls
            const borderGradientInput = document.getElementById('border-gradient-input');
            if (borderGradientInput) {
                borderGradientInput.addEventListener('input', updateBorderGradient);
            }

            // Border gradient presets
            const borderGradientPresets = document.querySelectorAll('.border-gradient-preset');
            borderGradientPresets.forEach(preset => {
                preset.addEventListener('click', () => {
                    const gradient = preset.getAttribute('data-gradient');
                    parseAndApplyBorderGradient(gradient);
                });
            });

            // Setup gradient presets
            setupGradientPresets();
            
            // Setup gradient drag and drop (with delay to ensure containers exist)
            setTimeout(() => {
                setupGradientDragAndDrop();
            }, 100);
            
            // Setup favorites functionality
            setupFavorites();
            
            // Initialize enhanced gradient editor
            initGradientEditor();
            
            // Setup gradient drag and drop after editor is initialized
            setupGradientDragAndDrop();
            
            // Setup color presets after theming system is initialized
            setTimeout(() => {
                // Ensure button background color group is visible for setup
                const buttonBgGroup = document.getElementById('button-bg-color-group');
                if (buttonBgGroup) {
                    buttonBgGroup.style.display = 'block';
                }
                setupColorPresets();
                // Hide button background color group if button style is not solid
                const buttonStyleSelect = document.getElementById('button-style');
                const buttonStyle = buttonStyleSelect ? buttonStyleSelect.value : 'soft';
                if (buttonBgGroup && buttonStyle !== 'solid') {
                    buttonBgGroup.style.display = 'none';
                }
                // Initialize collapsible sections
                initializeSections();
            }, 500);
            
            // Test drag and drop after a delay
            setTimeout(() => {
                testDragAndDrop();
            }, 1000);
            
            // Initialize image positioning values
            updateImagePosition();
            
            // Apply initial theme - during initialization, use the theme directly from currentList
            // This prevents the theme from reverting when the appearance tab is clicked
            // We use currentList.theme directly instead of getCurrentThemeFromUI() to avoid
            // reading from UI controls that might not be fully populated yet
            let themeToApply;
            if (isInitializingTheme && currentList && currentList.theme) {
                // During initialization, use the theme directly from currentList
                // Parse it if it's a string
                if (typeof currentList.theme === 'string') {
                    try {
                        themeToApply = JSON.parse(currentList.theme);
                    } catch (e) {
                        themeToApply = currentList.theme;
                    }
                } else {
                    themeToApply = { ...currentList.theme };
                }
            } else {
                // After initialization, read from UI controls
                themeToApply = getCurrentThemeFromUI();
            }
            applyTheme(themeToApply);
            } catch (error) {
                console.error('Error in initTheming:', error);
                showMessage('Error initializing theming system. Please refresh the page.', 'error');
            }
        }

        function updateBackgroundType() {
            const selectedType = document.querySelector('input[name="bg-type"]:checked').value;
            
            // Update global currentTheme for UI consistency
            currentTheme.backgroundType = selectedType;
            
            // Update current collection's theme if it exists
            if (currentList) {
                if (!currentList.theme) currentList.theme = {};
                currentList.theme.backgroundType = selectedType;
            }
            
            console.log('Background type changed to:', selectedType);
            
            // Show/hide relevant options
            document.getElementById('solid-color-options').style.display = selectedType === 'solid' ? 'block' : 'none';
            document.getElementById('gradient-options').style.display = selectedType === 'gradient' ? 'block' : 'none';
            document.getElementById('image-options').style.display = selectedType === 'image' ? 'block' : 'none';
            
            applyTheme();
            updatePreview(); // Update preview with new background
        }

        function updateBackgroundColor() {
            const color = document.getElementById('bg-color').value;
            updateThemeProperty('backgroundColor', color);
            document.getElementById('bg-color-text').value = color;
            console.log('Background color changed to:', color);
            applyTheme();
        }

        function updateBackgroundColorFromText() {
            const color = document.getElementById('bg-color-text').value;
            if (isValidColor(color)) {
                updateThemeProperty('backgroundColor', color);
                document.getElementById('bg-color').value = color;
                applyTheme();
            }
        }

        function updateGradient() {
            const gradient = document.getElementById('gradient-text').value;
            updateThemeProperty('gradientText', gradient);
            console.log('Gradient changed to:', gradient);
            applyTheme();
            updatePreview(); // Update preview with new gradient
        }

        function updateTextColor() {
            const color = document.getElementById('text-color').value;
            updateThemeProperty('textColor', color);
            console.log('=== UPDATE TEXT COLOR ===');
            console.log('updateTextColor called with color:', color);
            console.log('currentTheme.textColor set to:', currentTheme.textColor);
            applyTheme();
            updateActiveColorPresets();
            console.log('=== END UPDATE TEXT COLOR ===');
        }

        function updateButtonStyle() {
            const style = document.getElementById('button-style').value;
            updateThemeProperty('buttonStyle', style);
            
            // Show/hide button background color picker for solid style
            const buttonBgGroup = document.getElementById('button-bg-color-group');
            if (buttonBgGroup) {
                buttonBgGroup.style.display = style === 'solid' ? 'block' : 'none';
            }
            
            applyTheme();
            updatePreview(); // Update preview with new button styles
        }

        function updateButtonTextColor() {
            const colorPicker = document.getElementById('button-text-color');
            const colorText = document.getElementById('button-text-color-text');
            const color = colorPicker.value;
            
            updateThemeProperty("buttonTextColor", color);
            if (colorText) {
                colorText.value = color;
            }
            
            console.log('=== UPDATE BUTTON TEXT COLOR ===');
            console.log('updateButtonTextColor called with color:', color);
            console.log('currentTheme.buttonTextColor set to:', currentTheme.buttonTextColor);
            applyTheme();
            updateActiveColorPresets();
            console.log('=== END UPDATE BUTTON TEXT COLOR ===');
        }
        
        function updateButtonTextColorFromText() {
            const colorText = document.getElementById('button-text-color-text');
            const colorPicker = document.getElementById('button-text-color');
            const color = colorText.value;
            
            // Validate hex color format
            if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                updateThemeProperty("buttonTextColor", color);
                if (colorPicker) {
                    colorPicker.value = color;
                }
                applyTheme();
                updateActiveColorPresets();
            }
        }

        function updateButtonBgColor() {
            const colorPicker = document.getElementById('button-bg-color');
            const colorText = document.getElementById('button-bg-color-text');
            const color = colorPicker.value;
            
            updateThemeProperty('buttonBgColor', color);
            if (colorText) {
                colorText.value = color;
            }
            
            console.log('=== UPDATE BUTTON BACKGROUND COLOR ===');
            console.log('updateButtonBgColor called with color:', color);
            console.log('currentTheme.buttonBgColor set to:', currentTheme.buttonBgColor);
            applyTheme();
            updateActiveColorPresets();
            console.log('=== END UPDATE BUTTON BACKGROUND COLOR ===');
        }
        
        function updateButtonBgColorFromText() {
            const colorText = document.getElementById('button-bg-color-text');
            const colorPicker = document.getElementById('button-bg-color');
            const color = colorText.value;
            
            // Validate hex color format
            if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                updateThemeProperty('buttonBgColor', color);
                if (colorPicker) {
                    colorPicker.value = color;
                }
                applyTheme();
                updateActiveColorPresets();
            }
        }

        function updateTextFont() {
            const font = document.getElementById('text-font').value;
            updateThemeProperty('textFont', font);
            applyTheme();
        }

        function updateTextStyle() {
            updateThemeProperty('textBold', document.getElementById('text-bold').checked);
            updateThemeProperty('textItalic', document.getElementById('text-italic').checked);
            updateThemeProperty('textUnderline', document.getElementById('text-underline').checked);
            applyTheme();
        }

        function updateBioText() {
            const bioTextElement = document.getElementById('bio-text');
            if (!bioTextElement) {
                console.log('Bio text element not found, skipping update');
                return;
            }
            const bioText = bioTextElement.value;
            updateThemeProperty('bioText', bioText);
            applyTheme();
        }

        function updateButtonTextFont() {
            const font = document.getElementById('button-text-font').value;
            updateThemeProperty('buttonTextFont', font);
            applyTheme();
        }

        function updateButtonTextStyle() {
            updateThemeProperty('buttonTextBold', document.getElementById('button-text-bold').checked);
            updateThemeProperty('buttonTextItalic', document.getElementById('button-text-italic').checked);
            updateThemeProperty('buttonTextUnderline', document.getElementById('button-text-underline').checked);
            applyTheme();
        }

        function updatePresentationColor() {
            const colorPicker = document.getElementById('presentation-color');
            const colorText = document.getElementById('presentation-color-text');
            const color = colorPicker.value;
            
            updateThemeProperty('presentationColor', color);
            if (colorText) {
                colorText.value = color;
            }
            applyTheme();
            updateActiveColorPresets();
        }
        
        function updatePresentationColorFromText() {
            const colorText = document.getElementById('presentation-color-text');
            const colorPicker = document.getElementById('presentation-color');
            const color = colorText.value;
            
            // Validate hex color format
            if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                updateThemeProperty('presentationColor', color);
                if (colorPicker) {
                    colorPicker.value = color;
                }
                applyTheme();
                updateActiveColorPresets();
            }
        }

        function updatePresentationFont() {
            const font = document.getElementById('presentation-font').value;
            updateThemeProperty('presentationFont', font);
            applyTheme();
        }

        function updatePresentationStyle(event) {
            // Toggle the active state of the clicked button
            event.target.classList.toggle('active');
            
            const boldBtn = document.querySelector('#presentation-color').closest('.rtf-editor').querySelector('[data-command="bold"]');
            const italicBtn = document.querySelector('#presentation-color').closest('.rtf-editor').querySelector('[data-command="italic"]');
            const underlineBtn = document.querySelector('#presentation-color').closest('.rtf-editor').querySelector('[data-command="underline"]');
            
            updateThemeProperty('presentationBold', boldBtn.classList.contains('active'));
            updateThemeProperty('presentationItalic', italicBtn.classList.contains('active'));
            updateThemeProperty('presentationUnderline', underlineBtn.classList.contains('active'));
            applyTheme();
        }
        function setupRTFEditor(editorId, type) {
            const editor = document.getElementById(editorId);
            if (!editor) return;

            const toolbar = editor.parentElement.querySelector('.rtf-toolbar');
            if (!toolbar) return;

            // Handle color picker
            const colorPicker = toolbar.querySelector('.rtf-color-picker');
            if (colorPicker) {
                colorPicker.addEventListener('change', (e) => {
                    document.execCommand('foreColor', false, e.target.value);
                    updateRTFContent(editorId, type);
                });
            }

            // Handle font selection
            const fontSelect = toolbar.querySelector('select');
            if (fontSelect) {
                fontSelect.addEventListener('change', (e) => {
                    document.execCommand('fontName', false, e.target.value);
                    updateRTFContent(editorId, type);
                });
            }

            // Handle formatting buttons
            const buttons = toolbar.querySelectorAll('.rtf-btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const command = button.getAttribute('data-command');
                    
                    // Focus the editor first
                    editor.focus();
                    
                    // Execute command
                    document.execCommand(command, false, null);
                    
                    // Update button state after a short delay
                    setTimeout(() => {
                        updateRTFButtonStates(toolbar);
                        updateRTFContent(editorId, type);
                    }, 10);
                });
            });

            // Handle content changes
            editor.addEventListener('input', () => {
                updateRTFContent(editorId, type);
                
                // Handle character limit for bio text
                if (editorId === 'bio-text') {
                    updateBioCharCounter();
                }
            });

            // Update button states based on selection and clicks
            editor.addEventListener('selectionchange', () => {
                updateRTFButtonStates(toolbar);
            });
            
            editor.addEventListener('click', () => {
                setTimeout(() => updateRTFButtonStates(toolbar), 10);
            });
            
            editor.addEventListener('keyup', () => {
                setTimeout(() => updateRTFButtonStates(toolbar), 10);
            });
            
            // Handle paste events for bio text character limit
            if (editorId === 'bio-text') {
                editor.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const text = (e.clipboardData || window.clipboardData).getData('text');
                    const currentText = editor.textContent;
                    const newText = currentText + text;
                    
                    if (newText.length <= 200) {
                        document.execCommand('insertText', false, text);
                    } else {
                        const remainingChars = 200 - currentText.length;
                        if (remainingChars > 0) {
                            document.execCommand('insertText', false, text.substring(0, remainingChars));
                        }
                    }
                });
                
                editor.addEventListener('keydown', (e) => {
                    const currentText = editor.textContent;
                    if (currentText.length >= 200 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
                        e.preventDefault();
                    }
                });
            }
        }

        function updateRTFContent(editorId, type) {
            const editor = document.getElementById(editorId);
            if (!editor) return;

            // Sanitize HTML when reading from contenteditable to prevent XSS
            const content = sanitizeHTML(editor.innerHTML);
            const colorPicker = editor.parentElement.querySelector('.rtf-color-picker');
            const fontSelect = editor.parentElement.querySelector('select');
            
            if (type === 'description') {
                updateThemeProperty('descriptionText', content);
                if (colorPicker) updateThemeProperty('descriptionColor', colorPicker.value);
                if (fontSelect) updateThemeProperty('descriptionFont', fontSelect.value);
                applyTheme();
            } else if (type === 'bio') {
                updateThemeProperty('bioText', content);
                if (colorPicker) updateThemeProperty('bioColor', colorPicker.value);
                if (fontSelect) updateThemeProperty('bioFont', fontSelect.value);
                applyTheme();
            } else if (type === 'button') {
                // For button text, we'll apply the formatting globally
                if (fontSelect) {
                    updateThemeProperty('buttonTextFont', fontSelect.value);
                }
                applyTheme();
            } else if (type === 'link') {
                // For link text, this will be applied to new links
                // Individual link formatting is handled separately
            }
        }

        function updateBioCharCounter() {
            const editor = document.getElementById('bio-text');
            const counter = document.getElementById('bio-char-count');
            
            if (!editor || !counter) {
                console.log('Bio text editor or counter not found, skipping character count update');
                return;
            }
            
            const counterContainer = counter.parentElement;
            
            const textLength = editor.textContent.length;
            counter.textContent = textLength;
            
            // Update counter styling based on character count
            counterContainer.classList.remove('warning', 'error');
            if (textLength > 150) {
                counterContainer.classList.add('warning');
            }
            if (textLength >= 200) {
                counterContainer.classList.add('error');
            }
        }

        function initProfileInfo() {
            console.log('Initializing profile info...');
            
            // Profile photo upload
            const profilePhotoInput = document.getElementById('profile-photo');
            if (profilePhotoInput) {
                profilePhotoInput.addEventListener('change', handleProfilePhotoUpload);
                console.log('Profile photo input listener added');
            }

            // Social media URLs
            const socialInputs = ['social-instagram', 'social-facebook', 'social-twitter', 'social-linkedin'];
            socialInputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.addEventListener('input', updateSocialLinks);
                    console.log(`Social input listener added for ${inputId}`);
                } else {
                    console.log(`Social input not found: ${inputId}`);
                }
            });

            // Dynamic info fields
            const infoInputs = ['info-title', 'info-conference', 'info-location', 'info-date'];
            infoInputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) {
                    // Check if input is visible
                    const computedStyle = window.getComputedStyle(input);
                    console.log(`Input ${inputId} found:`, {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity,
                        width: computedStyle.width,
                        height: computedStyle.height
                    });
                    
                    // Force visibility
                    input.style.display = 'block';
                    input.style.visibility = 'visible';
                    input.style.opacity = '1';
                    
                    // Remove any existing listeners to prevent duplicates
                    input.removeEventListener('input', updateDynamicInfo);
                    input.addEventListener('input', updateDynamicInfo);
                    
                    // Add click and focus listeners to ensure input works
                    input.addEventListener('click', () => console.log(`Clicked ${inputId}`));
                    input.addEventListener('focus', () => console.log(`Focused ${inputId}`));
                    input.addEventListener('keydown', (e) => console.log(`Key pressed in ${inputId}:`, e.key));
                    
                    // Special handling for date input to ensure typing works
                    if (inputId === 'info-date') {
                        input.addEventListener('keydown', (e) => {
                            // Allow typing, backspace, delete, arrow keys, tab, etc.
                            const allowedKeys = [
                                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                                'Tab', 'Enter', 'Escape', 'Home', 'End'
                            ];
                            const isNumber = e.key >= '0' && e.key <= '9';
                            const isSlash = e.key === '/';
                            const isDash = e.key === '-';
                            const isAllowedKey = allowedKeys.includes(e.key);
                            
                            if (!isNumber && !isSlash && !isDash && !isAllowedKey) {
                                e.preventDefault();
                            }
                        });
                        
                        // Add paste event listener for date input
                        input.addEventListener('paste', (e) => {
                            setTimeout(() => {
                                updateDynamicInfo();
                            }, 10);
                        });
                    }
                    
                    console.log(`Info input listener added for ${inputId}`);
                } else {
                    console.log(`Info input not found: ${inputId}`);
                }
            });

            // Display checkboxes
            const displayCheckboxes = ['display-title', 'display-conference'];
            displayCheckboxes.forEach(checkboxId => {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.addEventListener('change', updateDynamicInfo);
                    console.log(`Display checkbox listener added for ${checkboxId}`);
                } else {
                    console.log(`Display checkbox not found: ${checkboxId}`);
                }
            });
        }


        function updateSocialLinks(socialData = null) {
            // If no data provided, try to get from profile modal fields
            if (!socialData) {
                socialData = {
                    email: document.getElementById('profileSocialEmail')?.value || '',
                    instagram: document.getElementById('profileSocialInstagram')?.value || 
                               document.getElementById('social-instagram')?.value || '',
                    facebook: document.getElementById('profileSocialFacebook')?.value || 
                              document.getElementById('social-facebook')?.value || '',
                    twitter: document.getElementById('profileSocialTwitter')?.value || 
                             document.getElementById('social-twitter')?.value || '',
                    linkedin: document.getElementById('profileSocialLinkedin')?.value || 
                              document.getElementById('social-linkedin')?.value || '',
                    youtube: document.getElementById('profileSocialYoutube')?.value || '',
                    tiktok: document.getElementById('profileSocialTiktok')?.value || '',
                    snapchat: document.getElementById('profileSocialSnapchat')?.value || ''
                };
            }

            console.log('Updating social links:', socialData);

            // Update preview social links
            const socialIcons = document.querySelectorAll('.social-icon');
            socialIcons.forEach(icon => {
                const platform = icon.classList[1]; // email, instagram, facebook, twitter, linkedin, youtube, tiktok, snapchat
                const url = socialData[platform];
                console.log(`Icon ${platform}: URL = ${url}`);
                if (url && url.trim() !== '') {
                    // For email, use mailto: link
                    if (platform === 'email') {
                        icon.href = `mailto:${url}`;
                    } else {
                        icon.href = url;
                    }
                    icon.style.display = 'flex';
                } else {
                    icon.style.display = 'none';
                }
            });
        }

        function generateCollectionName() {
            const title = document.getElementById('info-title')?.value || '';
            const conference = document.getElementById('info-conference')?.value || '';
            
            if (title && conference) {
                return `${title} - ${conference}`;
            } else if (title) {
                return title;
            } else if (conference) {
                return conference;
            } else {
                return 'My Links';
            }
        }

        function generateUniqueCollectionName() {
            // Generate a unique name for new collections
            const baseName = 'New Collection';
            let counter = 1;
            let uniqueName = baseName;
            
            // Check if this name already exists
            while (collections.some(c => c.slug === uniqueName)) {
                counter++;
                uniqueName = `${baseName} ${counter}`;
            }
            
            return uniqueName;
        }

        function updateCollectionName() {
            const newName = generateCollectionName();
            // Collection name input removed from header - update currentList instead
            if (currentList) {
                currentList.slug = newName;
                console.log('Auto-updated collection name to:', newName);
            }
        }

        function updateDynamicInfo() {
            console.log('=== updateDynamicInfo called ===');
            
            const infoData = {
                title: document.getElementById('info-title')?.value || '',
                conference: document.getElementById('info-conference')?.value || '',
                location: document.getElementById('info-location')?.value || '',
                date: document.getElementById('info-date')?.value || ''
            };

            console.log('Input values:', infoData);

            // Auto-update collection name
            updateCollectionName();

            // Format date for display
            let formattedDate = '';
            if (infoData.date) {
                const date = new Date(infoData.date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                formattedDate = date.toLocaleDateString('en-US', options);
                console.log('Formatted date:', formattedDate);
            }

            // Check display checkbox states
            const displayTitle = document.getElementById('display-title')?.checked ?? true;
            const displayConference = document.getElementById('display-conference')?.checked ?? true;

            // Update each field individually
            // Title - these are the PREVIEW elements, not the input elements
            const titleField = document.getElementById('preview-info-title'); // This is the preview container
            const titleValue = document.getElementById('preview-title'); // This is the text content
            if (titleField && titleValue) {
                if (infoData.title && displayTitle) {
                    titleValue.textContent = infoData.title;
                    titleField.style.display = 'block';
                    titleField.style.visibility = 'visible';
                    console.log('✅ Updated title preview:', infoData.title);
                    console.log('Title field display:', titleField.style.display);
                    console.log('Title field visibility:', titleField.style.visibility);
                } else {
                    titleField.style.display = 'none';
                    console.log('❌ Hiding title (no value or display disabled)');
                }
            } else {
                console.log('❌ Title preview elements not found:', { titleField: !!titleField, titleValue: !!titleValue });
            }

            // Conference
            const conferenceField = document.getElementById('preview-info-conference'); // This is the preview container
            const conferenceValue = document.getElementById('preview-conference'); // This is the text content
            if (conferenceField && conferenceValue) {
                if (infoData.conference && displayConference) {
                    conferenceValue.textContent = infoData.conference;
                    conferenceField.style.display = 'block';
                    conferenceField.style.visibility = 'visible';
                    console.log('✅ Updated conference preview:', infoData.conference);
                } else {
                    conferenceField.style.display = 'none';
                    console.log('❌ Hiding conference (no value or display disabled)');
                }
            } else {
                console.log('❌ Conference preview elements not found:', { conferenceField: !!conferenceField, conferenceValue: !!conferenceValue });
            }

            // Location
            const locationField = document.getElementById('preview-info-location'); // This is the preview container
            const locationValue = document.getElementById('preview-location'); // This is the text content
            if (locationField && locationValue) {
                if (infoData.location) {
                    locationValue.textContent = infoData.location;
                    locationField.style.display = 'block';
                    locationField.style.visibility = 'visible';
                    console.log('✅ Updated location preview:', infoData.location);
                } else {
                    locationField.style.display = 'none';
                    console.log('❌ Hiding location (no value)');
                }
            } else {
                console.log('❌ Location preview elements not found:', { locationField: !!locationField, locationValue: !!locationValue });
            }

            // Date
            const dateField = document.getElementById('preview-info-date'); // This is the preview container
            const dateValue = document.getElementById('preview-date'); // This is the text content
            if (dateField && dateValue) {
                if (infoData.date) {
                    dateValue.textContent = formattedDate;
                    dateField.style.display = 'block';
                    dateField.style.visibility = 'visible';
                    console.log('✅ Updated date preview:', formattedDate);
                } else {
                    dateField.style.display = 'none';
                    console.log('❌ Hiding date (no value)');
                }
            } else {
                console.log('❌ Date preview elements not found:', { dateField: !!dateField, dateValue: !!dateValue });
            }
            
            // Check if any fields are visible, and adjust spacing dynamically
            const dynamicInfoContainer = document.getElementById('preview-dynamic-info');
            if (dynamicInfoContainer) {
                const fields = [
                    document.getElementById('preview-info-title'),
                    document.getElementById('preview-info-conference'),
                    document.getElementById('preview-info-location'),
                    document.getElementById('preview-info-date')
                ];
                
                // Count visible fields
                const visibleFieldsCount = fields.filter(field => {
                    return field && field.style.display === 'block';
                }).length;
                
                if (visibleFieldsCount === 0) {
                    // No fields visible - hide container completely
                    dynamicInfoContainer.style.display = 'none';
                    dynamicInfoContainer.style.marginBottom = '0';
                } else {
                    // Show container and adjust margin based on number of visible fields
                    dynamicInfoContainer.style.display = 'block';
                    
                    // Dynamic spacing: more fields = more space, fewer fields = less space
                    // 1 field: 8px, 2 fields: 12px, 3+ fields: 16px
                    let marginBottom;
                    if (visibleFieldsCount === 1) {
                        marginBottom = '8px';
                    } else if (visibleFieldsCount === 2) {
                        marginBottom = '12px';
                    } else {
                        marginBottom = '16px';
                    }
                    dynamicInfoContainer.style.marginBottom = marginBottom;
                }
            }
            
            console.log('=== updateDynamicInfo complete ===');
        }

        function testPresentationInputs() {
            console.log('Testing presentation inputs...');
            const inputIds = ['info-title', 'info-conference', 'info-location', 'info-date'];
            
            inputIds.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    console.log(`✅ Input ${id} found:`, {
                        tagName: input.tagName,
                        type: input.type,
                        visible: input.offsetWidth > 0 && input.offsetHeight > 0,
                        display: window.getComputedStyle(input).display,
                        position: input.getBoundingClientRect(),
                        value: input.value
                    });
                } else {
                    console.log(`❌ Input ${id} NOT FOUND`);
                }
            });
            
            // Also test preview elements
            const previewIds = ['preview-title', 'preview-conference', 'preview-location', 'preview-date'];
            previewIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    console.log(`✅ Preview ${id} found:`, {
                        textContent: element.textContent,
                        display: window.getComputedStyle(element).display
                    });
                } else {
                    console.log(`❌ Preview ${id} NOT FOUND`);
                }
            });
        }
        // Sanitize HTML to prevent XSS attacks
        // Only allows safe formatting tags: <strong>, <em>, <u>, <b>, <i>
        // All other HTML tags and attributes are stripped
        function sanitizeHTML(html) {
            if (!html || typeof html !== 'string') {
                return '';
            }
            
            // Use DOMParser to safely parse HTML
            // This prevents script execution during parsing
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // List of allowed HTML tags for formatting
                const allowedTags = ['strong', 'em', 'u', 'b', 'i'];
                
                // Recursively process nodes, keeping only allowed tags
                function processNode(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // Text nodes are safe - return as-is (textContent automatically escapes HTML)
                        return node.textContent;
                    }
                    
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();
                        
                        if (allowedTags.includes(tagName)) {
                            // Keep this allowed tag, process children recursively
                            const children = Array.from(node.childNodes)
                                .map(processNode)
                                .join('');
                            // Return tag without attributes (strip all attributes for security)
                            return `<${tagName}>${children}</${tagName}>`;
                        } else {
                            // Strip this disallowed tag, but keep its children
                            return Array.from(node.childNodes)
                                .map(processNode)
                                .join('');
                        }
                    }
                    
                    // Ignore other node types (comments, etc.)
                    return '';
                }
                
                // Process all nodes in the document body
                const bodyContent = Array.from(doc.body.childNodes)
                    .map(processNode)
                    .join('');
                
                // Return sanitized content, or plain text if parsing resulted in empty content
                return bodyContent || html.replace(/<[^>]+>/g, '');
            } catch (e) {
                // If parsing fails for any reason, strip all HTML tags as fallback
                // This ensures we never return potentially dangerous HTML
                return html.replace(/<[^>]+>/g, '');
            }
        }

        // Validate and sanitize collection slug
        // Slugs should contain only alphanumeric characters, hyphens, underscores, and spaces
        // Spaces will be converted to hyphens, and invalid characters will be removed
        function validateAndSanitizeSlug(slug) {
            if (!slug || typeof slug !== 'string') {
                return { isValid: false, sanitized: '', error: 'Slug cannot be empty' };
            }
            
            // Trim whitespace
            slug = slug.trim();
            
            // Check length
            if (slug.length === 0) {
                return { isValid: false, sanitized: '', error: 'Slug cannot be empty' };
            }
            
            if (slug.length > 50) {
                return { isValid: false, sanitized: '', error: 'Slug must be 50 characters or less' };
            }
            
            // Convert to lowercase
            slug = slug.toLowerCase();
            
            // Replace spaces with hyphens
            slug = slug.replace(/\s+/g, '-');
            
            // Remove invalid characters (keep only alphanumeric, hyphens, underscores)
            const sanitized = slug.replace(/[^a-z0-9_-]/g, '');
            
            // Remove consecutive hyphens/underscores
            const cleaned = sanitized.replace(/[-_]{2,}/g, '-');
            
            // Remove leading/trailing hyphens and underscores
            const final = cleaned.replace(/^[-_]+|[-_]+$/g, '');
            
            if (final.length === 0) {
                return { isValid: false, sanitized: '', error: 'Slug contains only invalid characters' };
            }
            
            // Check if it starts with a number (optional - you may want to allow this)
            // For now, we'll allow it
            
            return { 
                isValid: true, 
                sanitized: final,
                error: null
            };
        }

        function validateAndFixUrl(url) {
            console.log('validateAndFixUrl called with:', url);
            if (!url || typeof url !== 'string') {
                console.log('URL is empty or not string');
                return { isValid: false, correctedUrl: url };
            }
            
            // Remove any leading/trailing whitespace
            url = url.trim();
            
            // Check for obviously invalid patterns
            if (url.length < 3) {
                return { isValid: false, correctedUrl: url };
            }
            
            // Check for common typos in www
            if (url.startsWith('ww.') || url.startsWith('www.') || url.startsWith('wwww.')) {
                url = 'www.' + url.substring(url.indexOf('.') + 1);
            }
            
            // Check for malformed protocols
            if (url.includes('@https://') || url.includes('@http://')) {
                url = url.replace('@', '');
            }
            
            // Check for single words (like "ESPN") before adding protocol
            if (!url.includes('.') && !url.startsWith('www.') && !url.match(/^https?:\/\//)) {
                // This looks like a single word, not a valid URL
                return { isValid: false, correctedUrl: url };
            }
            
            // Check if URL already has a protocol
            if (!url.match(/^https?:\/\//)) {
                // If it starts with www., add https://
                if (url.startsWith('www.')) {
                    url = 'https://' + url;
                } else {
                    // Otherwise, add https://
                    url = 'https://' + url;
                }
            }
            
            // Basic URL format validation
            try {
                const urlObj = new URL(url);
                
                // Check if it's a valid web protocol
                if (!['http:', 'https:'].includes(urlObj.protocol)) {
                    return { isValid: false, correctedUrl: url };
                }
                
                // Check if hostname looks valid (has at least one dot or is localhost)
                const hostname = urlObj.hostname;
                if (!hostname.includes('.') && hostname !== 'localhost') {
                    return { isValid: false, correctedUrl: url };
                }
                
                // Check for obviously invalid hostnames
                if (hostname.length < 3 || hostname.includes('..') || hostname.startsWith('.') || hostname.endsWith('.')) {
                    return { isValid: false, correctedUrl: url };
                }
                
                // Check for common invalid patterns
                if (hostname.match(/^[0-9]+$/) || hostname.match(/^[^a-zA-Z0-9.-]+$/)) {
                    return { isValid: false, correctedUrl: url };
                }
                
                console.log('URL validation successful:', url);
                return { isValid: true, correctedUrl: url };
                
            } catch (e) {
                // URL constructor failed - invalid URL
                console.log('URL validation failed with error:', e.message);
                return { isValid: false, correctedUrl: url };
            }
        }

        function getUrlValidationError(url) {
            if (!url || typeof url !== 'string') {
                return 'Please enter a URL.';
            }
            
            const trimmedUrl = url.trim();
            
            if (trimmedUrl.length < 3) {
                return 'URL is too short. Please enter a valid web address.';
            }
            
            // Check for single words (like "ESPN", "google", etc.)
            if (trimmedUrl.match(/^[a-zA-Z]+$/) && trimmedUrl.length > 2) {
                return `"${trimmedUrl}" looks like a website name. Please enter a complete URL like "${trimmedUrl.toLowerCase()}.com" or "www.${trimmedUrl.toLowerCase()}.com"`;
            }
            
            // Check for common single words
            if (trimmedUrl === 'ESPN' || trimmedUrl === 'espn') {
                return 'Please enter a complete URL like "espn.com" or "www.espn.com"';
            }
            
            if (trimmedUrl.includes(' ')) {
                return 'URLs cannot contain spaces. Please remove spaces from your URL.';
            }
            
            if (trimmedUrl.includes('@')) {
                return 'URLs cannot contain @ symbols. Please remove the @ from your URL.';
            }
            
            if (trimmedUrl.includes('@https://') || trimmedUrl.includes('@http://')) {
                return 'Invalid URL format. Please remove the @ symbol and try again.';
            }
            
            if (trimmedUrl.includes('ww.') || trimmedUrl.includes('wwww.')) {
                return 'Please check your spelling. Did you mean "www."?';
            }
            
            if (trimmedUrl.includes('dfgdfg') || trimmedUrl.includes('asdf') || trimmedUrl.match(/^[a-z]{5,}$/)) {
                return 'This doesn\'t look like a real website. Please enter a valid URL.';
            }
            
            // Try to provide helpful suggestions
            try {
                const urlObj = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : 'https://' + trimmedUrl);
                const hostname = urlObj.hostname;
                
                if (!hostname.includes('.') && hostname !== 'localhost') {
                    return `"${hostname}" needs a domain extension. Try "${hostname}.com" or "www.${hostname}.com"`;
                }
                
                if (hostname.includes('..')) {
                    return 'URL contains double dots (..). Please check your URL format.';
                }
                
                if (hostname.startsWith('.') || hostname.endsWith('.')) {
                    return 'URL cannot start or end with a dot. Please check your URL format.';
                }
                
            } catch (e) {
                return `"${trimmedUrl}" is not a valid URL. Please enter a complete web address like "example.com"`;
            }
            
            return `"${trimmedUrl}" is not a valid URL. Please enter a complete web address.`;
        }

        function updateLinkRTFButtonStates(titleContainer) {
            console.log('updateLinkRTFButtonStates called with:', titleContainer);
            const toolbar = titleContainer.querySelector('.link-rtf-toolbar');
            const titleElement = titleContainer.querySelector('.link-title');
            
            console.log('Toolbar found:', toolbar, 'Title element found:', titleElement);
            
            if (!toolbar || !titleElement) {
                console.log('Missing toolbar or title element, returning');
                return;
            }
            
            const buttons = toolbar.querySelectorAll('.rtf-btn');
            console.log('Found buttons:', buttons.length);
            
            // Get the current selection
            const selection = window.getSelection();
            let hasSelection = false;
            let selectedText = '';
            
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                selectedText = range.toString();
                hasSelection = selectedText.length > 0;
            }
            
            buttons.forEach(button => {
                const command = button.getAttribute('data-command');
                let isActive = false;
                
                if (hasSelection) {
                    // If there's a selection, check if the selected text has the formatting
                    try {
                        isActive = document.queryCommandState(command);
                    } catch (e) {
                        // Fallback: check if the selection is within formatted elements
                        const range = selection.getRangeAt(0);
                        const container = range.commonAncestorContainer;
                        
                        if (command === 'bold') {
                            isActive = container.nodeType === Node.ELEMENT_NODE && 
                                      (container.tagName === 'STRONG' || container.tagName === 'B' || 
                                       container.closest('strong, b') !== null);
                        } else if (command === 'italic') {
                            isActive = container.nodeType === Node.ELEMENT_NODE && 
                                      (container.tagName === 'EM' || container.tagName === 'I' || 
                                       container.closest('em, i') !== null);
                        } else if (command === 'underline') {
                            isActive = container.nodeType === Node.ELEMENT_NODE && 
                                      (container.tagName === 'U' || container.closest('u') !== null);
                        }
                    }
                } else {
                    // If no selection, check if the entire content has the formatting
                    const content = titleElement.innerHTML;
                    if (command === 'bold') {
                        isActive = content.includes('<strong>') || content.includes('<b>');
                    } else if (command === 'italic') {
                        isActive = content.includes('<em>') || content.includes('<i>');
                    } else if (command === 'underline') {
                        isActive = content.includes('<u>');
                    }
                }
                
                console.log(`Button ${command} isActive: ${isActive}`);
                button.classList.toggle('active', isActive);
            });
        }



        function updateRTFButtonStates(toolbar) {
            const buttons = toolbar.querySelectorAll('.rtf-btn');
            buttons.forEach(button => {
                const command = button.getAttribute('data-command');
                let isActive = false;
                
                try {
                    // Check if the command is currently active in the selection
                    isActive = document.queryCommandState(command);
                } catch (e) {
                    // If queryCommandState fails, check if the selection contains the formatting
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const container = range.commonAncestorContainer;
                        
                        if (command === 'bold') {
                            isActive = container.nodeType === Node.ELEMENT_NODE && 
                                      (container.tagName === 'STRONG' || container.tagName === 'B' || 
                                       container.closest('strong, b') !== null);
                        } else if (command === 'italic') {
                            isActive = container.nodeType === Node.ELEMENT_NODE && 
                                      (container.tagName === 'EM' || container.tagName === 'I' || 
                                       container.closest('em, i') !== null);
                        } else if (command === 'underline') {
                            isActive = container.nodeType === Node.ELEMENT_NODE && 
                                      (container.tagName === 'U' || container.closest('u') !== null);
                        }
                    }
                }
                
                button.classList.toggle('active', isActive);
            });
        }

        function updateGradientBorder() {
            const enabled = document.getElementById('gradient-border-toggle').checked;
            updateThemeProperty('gradientBorderEnabled', enabled);
            console.log('Gradient border toggled:', enabled);
            
            // Show/hide border customization options
            const borderCustomization = document.getElementById('border-customization');
            if (borderCustomization) {
                borderCustomization.style.display = enabled ? 'block' : 'none';
            }
            
            applyTheme();
            updatePreview(); // Update preview with new border setting
        }

        function updateBorderStyle() {
            const borderStyle = document.querySelector('input[name="border-style"]:checked').value;
            updateThemeProperty('borderStyle', borderStyle);
            console.log('Border style changed to:', borderStyle);
            applyTheme();
        }

        function updateBorderType() {
            const borderType = document.querySelector('input[name="border-type"]:checked').value;
            updateThemeProperty('borderType', borderType);
            console.log('Border type changed to:', borderType);
            
            // Show/hide appropriate options
            const colorOptions = document.getElementById('border-color-options');
            const gradientOptions = document.getElementById('border-gradient-options');
            
            if (borderType === 'solid') {
                colorOptions.style.display = 'block';
                gradientOptions.style.display = 'none';
                
                // Initialize borderColor from color picker if not already set in theme
                if (!currentTheme.borderColor || currentTheme.borderColor === '#1f2937') {
                    const borderColorPicker = document.getElementById('border-color-picker');
                    if (borderColorPicker && borderColorPicker.value) {
                        updateThemeProperty('borderColor', borderColorPicker.value);
                    }
                }
            } else {
                colorOptions.style.display = 'none';
                gradientOptions.style.display = 'block';
            }
            
            applyTheme();
        }

        function updateBorderColor() {
            const colorPicker = document.getElementById('border-color-picker');
            const colorText = document.getElementById('border-color-text');
            
            updateThemeProperty('borderColor', colorPicker.value);
            colorText.value = colorPicker.value;
            
            // Also update border type and style from UI to ensure they're current
            const borderTypeRadio = document.querySelector('input[name="border-type"]:checked');
            const borderStyleRadio = document.querySelector('input[name="border-style"]:checked');
            if (borderTypeRadio) {
                updateThemeProperty('borderType', borderTypeRadio.value);
            }
            if (borderStyleRadio) {
                updateThemeProperty('borderStyle', borderStyleRadio.value);
            }
            
            console.log('Border color updated:', currentTheme.borderColor);
            console.log('Border type:', currentTheme.borderType);
            console.log('Border style:', currentTheme.borderStyle);
            applyTheme();
        }

        function updateBorderColorFromText() {
            const colorText = document.getElementById('border-color-text');
            const colorPicker = document.getElementById('border-color-picker');
            
            const color = colorText.value;
            if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                updateThemeProperty('borderColor', color);
                colorPicker.value = color;
                
                // Also update border type and style from UI to ensure they're current
                const borderTypeRadio = document.querySelector('input[name="border-type"]:checked');
                const borderStyleRadio = document.querySelector('input[name="border-style"]:checked');
                if (borderTypeRadio) {
                    updateThemeProperty('borderType', borderTypeRadio.value);
                }
                if (borderStyleRadio) {
                    updateThemeProperty('borderStyle', borderStyleRadio.value);
                }
                
                console.log('Border color updated from text:', color);
                console.log('Border type:', currentTheme.borderType);
                console.log('Border style:', currentTheme.borderStyle);
                applyTheme();
            }
        }

        function updateBorderGradient() {
            const gradientInput = document.getElementById('border-gradient-input');
            updateThemeProperty('borderGradientText', gradientInput.value);
            console.log('Border gradient updated:', themeToApply.borderGradientText);
            
            // Apply border gradient directly to phone mockup if gradient border is enabled
            if (themeToApply.gradientBorderEnabled && themeToApply.borderType === 'gradient') {
                const phoneMockup = document.querySelector('.phone-mockup');
                if (phoneMockup) {
                    phoneMockup.style.setProperty('background', themeToApply.borderGradientText, 'important');
                }
            }
        }

        function selectBorderGradientPreset(gradientText) {
            updateThemeProperty('borderGradientText', gradientText);
            document.getElementById('border-gradient-input').value = gradientText;
            console.log('Border gradient preset selected:', gradientText);
            
            // Apply border gradient directly to phone mockup if gradient border is enabled
            if (themeToApply.gradientBorderEnabled && themeToApply.borderType === 'gradient') {
                const phoneMockup = document.querySelector('.phone-mockup');
                if (phoneMockup) {
                    phoneMockup.style.setProperty('background', gradientText, 'important');
                }
            }
        }

        function applyGradient(gradientText) {
            document.getElementById('gradient-text').value = gradientText;
            updateThemeProperty('gradientText', gradientText);
            applyTheme();
        }

        // Enhanced Gradient Editor Functions
        let gradientStops = [
            { color: '#ff6b6b', position: 0 },
            { color: '#4ecdc4', position: 100 }
        ];

        let borderGradientStops = [
            { color: '#8b5cf6', position: 0 },
            { color: '#06b6d4', position: 100 }
        ];

        function initGradientEditor() {
            // Initialize main gradient editor
            renderGradientStops('gradient-stops', gradientStops);
            updateGradientFromStops();
            
            // Initialize border gradient editor
            renderGradientStops('border-gradient-stops', borderGradientStops);
            updateBorderGradientFromStops();
            
            // Set up event listeners
            setupGradientEventListeners();
        }

        function setupGradientEventListeners() {
            // Main gradient angle controls
            const angleSlider = document.getElementById('gradient-angle');
            const angleText = document.getElementById('gradient-angle-text');
            
            if (angleSlider && angleText) {
                angleSlider.addEventListener('input', () => {
                    angleText.value = angleSlider.value;
                    updateGradientFromStops();
                });
                
                angleText.addEventListener('input', () => {
                    angleSlider.value = angleText.value;
                    updateGradientFromStops();
                });
            }

            // Border gradient angle controls
            const borderAngleSlider = document.getElementById('border-gradient-angle');
            const borderAngleText = document.getElementById('border-gradient-angle-text');
            
            if (borderAngleSlider && borderAngleText) {
                borderAngleSlider.addEventListener('input', () => {
                    borderAngleText.value = borderAngleSlider.value;
                    updateBorderGradientFromStops();
                });
                
                borderAngleText.addEventListener('input', () => {
                    borderAngleSlider.value = borderAngleText.value;
                    updateBorderGradientFromStops();
                });
            }

            // Add stop buttons - remove existing listeners first to prevent duplicates
            const addStopBtn = document.getElementById('add-stop');
            const borderAddStopBtn = document.getElementById('border-add-stop');
            
            if (addStopBtn) {
                addStopBtn.removeEventListener('click', addStopBtn.clickHandler);
                addStopBtn.clickHandler = () => addGradientStop('main');
                addStopBtn.addEventListener('click', addStopBtn.clickHandler);
            }
            
            if (borderAddStopBtn) {
                borderAddStopBtn.removeEventListener('click', borderAddStopBtn.clickHandler);
                borderAddStopBtn.clickHandler = () => addGradientStop('border');
                borderAddStopBtn.addEventListener('click', borderAddStopBtn.clickHandler);
            }

            // Copy buttons
            const copyBtn = document.getElementById('gradient-copy-btn');
            const borderCopyBtn = document.getElementById('border-gradient-copy-btn');
            
            if (copyBtn) {
                copyBtn.addEventListener('click', () => copyGradient('main'));
            }
            
            if (borderCopyBtn) {
                borderCopyBtn.addEventListener('click', () => copyGradient('border'));
            }
            
            // Make CSS output fields editable and parse when changed
            const gradientTextInput = document.getElementById('gradient-text');
            const borderGradientInput = document.getElementById('border-gradient-input');
            
            if (gradientTextInput) {
                gradientTextInput.addEventListener('input', () => {
                    // Parse the manually entered gradient text
                    const gradientText = gradientTextInput.value;
                    if (gradientText && gradientText.includes('linear-gradient')) {
                        parseAndApplyGradient(gradientText);
                    }
                    // Auto-resize the input
                    autoResizeTextInput(gradientTextInput);
                });
            }
            
            if (borderGradientInput) {
                borderGradientInput.addEventListener('input', () => {
                    // Parse the manually entered border gradient text
                    const gradientText = borderGradientInput.value;
                    if (gradientText && gradientText.includes('linear-gradient')) {
                        parseAndApplyBorderGradient(gradientText);
                    }
                    // Auto-resize the input
                    autoResizeTextInput(borderGradientInput);
                });
            }
        }
        function renderGradientStops(containerId, stops) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            
            // Event listeners are handled globally via delegation
            
            stops.forEach((stop, index) => {
                const stopElement = document.createElement('div');
                stopElement.className = 'gradient-stop';
                stopElement.draggable = true;
                stopElement.dataset.index = index;
                // Create drag handle
                const dragHandle = document.createElement('div');
                dragHandle.className = 'drag-handle';
                dragHandle.style.cssText = 'cursor: grab; padding: 8px; color: #666; font-size: 14px; min-width: 32px; min-height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px;';
                dragHandle.textContent = '⋮⋮';
                
                // Create color picker group (matching standard color pickers)
                const colorGroup = document.createElement('div');
                colorGroup.className = 'color-options';
                
                // Create color picker input
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.className = 'color-picker';
                colorInput.value = stop.color;
                colorInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    colorTextInput.value = value;
                    updateStopColor(containerId, index, value);
                });
                
                // Create color text input
                const colorTextInput = document.createElement('input');
                colorTextInput.type = 'text';
                colorTextInput.className = 'color-input';
                colorTextInput.value = stop.color;
                colorTextInput.maxLength = 7;
                colorTextInput.placeholder = '#000000';
                colorTextInput.addEventListener('change', () => {
                    const normalized = normalizeHexColor(colorTextInput.value);
                    if (normalized) {
                        colorTextInput.value = normalized;
                        colorInput.value = normalized;
                        updateStopColor(containerId, index, normalized);
                    } else {
                        // Fallback to current saved color if input is invalid
                        const fallbackColor = (containerId === 'gradient-stops' ? gradientStops[index].color : borderGradientStops[index].color) || '#000000';
                        colorTextInput.value = fallbackColor;
                    }
                });
                
                colorGroup.appendChild(colorInput);
                colorGroup.appendChild(colorTextInput);
                
                // Create position label
                const positionLabel = document.createElement('label');
                positionLabel.textContent = 'Stop Position';
                positionLabel.className = 'gradient-stop-position-label';
                positionLabel.setAttribute('for', `stop-position-${containerId}-${index}`);
                
                // Create position input
                const positionInput = document.createElement('input');
                positionInput.type = 'number';
                positionInput.id = `stop-position-${containerId}-${index}`;
                positionInput.className = 'gradient-stop-position';
                positionInput.value = stop.position || 0;
                positionInput.min = '0';
                positionInput.max = '100';
                positionInput.onchange = function() { updateStopPosition(containerId, index, this.value); };
                
                // Create percent span
                const percentSpan = document.createElement('span');
                percentSpan.textContent = '%';
                
                stopElement.appendChild(dragHandle);
                stopElement.appendChild(colorGroup);
                stopElement.appendChild(positionLabel);
                stopElement.appendChild(positionInput);
                stopElement.appendChild(percentSpan);
                
                // Add remove button if more than 2 stops
                if (stops.length > 2) {
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'gradient-stop-remove';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = function() { removeGradientStop(containerId, index); };
                    stopElement.appendChild(removeBtn);
                }
                
                // Add mouse-based drag and drop
                stopElement.addEventListener('mousedown', (e) => {
                    if (e.target.closest('.drag-handle')) {
                        startMouseDrag(e, stopElement, index, containerId);
                    }
                });
                
                container.appendChild(stopElement);
            });
        }

        function openColorPicker(containerId, index) {
            // Find the clicked color swatch element
            const colorSwatch = event.target;
            const currentColor = containerId === 'gradient-stops' ? gradientStops[index].color : borderGradientStops[index].color;
            
            // Create a color picker container with integrated accept button
            const pickerContainer = document.createElement('div');
            pickerContainer.style.position = 'absolute';
            pickerContainer.style.zIndex = '1000';
            pickerContainer.style.background = 'white';
            pickerContainer.style.border = '2px solid #e2e8f0';
            pickerContainer.style.borderRadius = '8px';
            pickerContainer.style.padding = '12px';
            pickerContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            pickerContainer.style.display = 'flex';
            pickerContainer.style.flexDirection = 'column';
            pickerContainer.style.gap = '10px';
            pickerContainer.style.alignItems = 'center';
            pickerContainer.style.minWidth = '200px';
            pickerContainer.style.maxHeight = '300px';
            
            // Create color input
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = currentColor;
            colorInput.style.width = '80px';
            colorInput.style.height = '80px';
            colorInput.style.border = '2px solid #e2e8f0';
            colorInput.style.borderRadius = '8px';
            colorInput.style.cursor = 'pointer';
            
            // Position the native color picker to the right when opened
            colorInput.addEventListener('click', (e) => {
                // The native color picker will open, and we want it positioned to the right
                setTimeout(() => {
                    // This is a workaround to try to influence native picker position
                    // The native picker position is largely controlled by the browser
                    const inputRect = colorInput.getBoundingClientRect();
                    colorInput.style.position = 'fixed';
                    colorInput.style.left = (inputRect.right + 20) + 'px';
                    colorInput.style.top = inputRect.top + 'px';
                }, 10);
            });
            
            // Create Accept button integrated into the picker
            const acceptBtn = document.createElement('button');
            acceptBtn.textContent = 'Accept';
            acceptBtn.style.padding = '8px 20px';
            acceptBtn.style.background = '#10b981';
            acceptBtn.style.color = 'white';
            acceptBtn.style.border = 'none';
            acceptBtn.style.borderRadius = '6px';
            acceptBtn.style.cursor = 'pointer';
            acceptBtn.style.fontSize = '14px';
            acceptBtn.style.fontWeight = '500';
            acceptBtn.style.width = '100%';
            acceptBtn.style.marginTop = '5px';
            
            // Assemble the picker
            pickerContainer.appendChild(colorInput);
            pickerContainer.appendChild(acceptBtn);
            
            // Position the custom color picker to the left of the color swatch
            const rect = colorSwatch.getBoundingClientRect();
            pickerContainer.style.left = (rect.left - 220) + 'px';
            pickerContainer.style.top = (rect.top - 10) + 'px';
            
            // Replace the color swatch temporarily
            colorSwatch.style.display = 'none';
            colorSwatch.parentNode.appendChild(pickerContainer);
            
            // Focus the color input
            colorInput.focus();
            
            // Handle Accept button
            acceptBtn.addEventListener('click', () => {
                updateStopColor(containerId, index, colorInput.value);
                colorSwatch.style.display = 'block';
                pickerContainer.remove();
            });
            
            // Handle click outside to close (cancel)
            const handleClickOutside = (e) => {
                if (!pickerContainer.contains(e.target) && e.target !== colorSwatch) {
                    colorSwatch.style.display = 'block';
                    pickerContainer.remove();
                    document.removeEventListener('click', handleClickOutside);
                }
            };
            setTimeout(() => document.addEventListener('click', handleClickOutside), 100);
        }

        function normalizeHexColor(color) {
            if (!color) return null;
            // Remove any whitespace
            color = color.trim();
            // Add # if missing
            if (!color.startsWith('#')) {
                color = '#' + color;
            }
            // Convert to uppercase
            color = color.toUpperCase();
            // Validate hex format (3 or 6 hex digits after #)
            if (/^#[0-9A-F]{3}$/.test(color)) {
                // Expand shorthand (e.g., #FFF -> #FFFFFF)
                return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
            } else if (/^#[0-9A-F]{6}$/.test(color)) {
                return color;
            }
            return null;
        }

        function updateStopColor(containerId, index, color) {
            if (containerId === 'gradient-stops') {
                gradientStops[index].color = color;
                // Update the color picker and text input without re-rendering
                const stopElement = document.querySelector(`#gradient-stops .gradient-stop[data-index="${index}"]`);
                if (stopElement) {
                    const colorPicker = stopElement.querySelector('.color-picker');
                    const colorInput = stopElement.querySelector('.color-input');
                    if (colorPicker) colorPicker.value = color;
                    if (colorInput) colorInput.value = color;
                }
                updateGradientFromStops();
            } else {
                borderGradientStops[index].color = color;
                // Update the color picker and text input without re-rendering
                const stopElement = document.querySelector(`#border-gradient-stops .gradient-stop[data-index="${index}"]`);
                if (stopElement) {
                    const colorPicker = stopElement.querySelector('.color-picker');
                    const colorInput = stopElement.querySelector('.color-input');
                    if (colorPicker) colorPicker.value = color;
                    if (colorInput) colorInput.value = color;
                }
                updateBorderGradientFromStops();
            }
        }

        // Mouse-based drag and drop for gradient stops
        let draggedElement = null;
        let draggedIndex = null;
        let draggedContainerId = null;
        let isDragging = false;

        function handleStopDragStart(e) {
            e.preventDefault();
            draggedStopIndex = parseInt(e.target.dataset.index);
            draggedContainerId = e.target.closest('.gradient-stops-container').id;
            e.target.classList.add('dragging');
            
            console.log('Drag start:', { draggedStopIndex, draggedContainerId });
            
            // Enhanced visual feedback
            e.target.style.opacity = '0.6';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.zIndex = '1000';
        }

        function handleStopDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Find the gradient stop we're hovering over
            const gradientStop = e.target.closest('.gradient-stop');
            if (gradientStop) {
                // Add visual feedback for drop target
                gradientStop.style.border = '2px dashed #3b82f6';
                gradientStop.style.backgroundColor = '#eff6ff';
            }
        }

        function handleStopDragLeave(e) {
            // Clean up visual feedback
            const gradientStop = e.target.closest('.gradient-stop');
            if (gradientStop) {
                gradientStop.style.border = '';
                gradientStop.style.backgroundColor = '';
            }
        }

        function handleStopDrop(e) {
            e.preventDefault();
            
            // Clean up visual feedback
            const gradientStop = e.target.closest('.gradient-stop');
            if (gradientStop) {
                gradientStop.style.border = '';
                gradientStop.style.backgroundColor = '';
            }
            
            if (!gradientStop) {
                console.log('No gradient stop found for drop');
                return;
            }
            
            const dropIndex = parseInt(gradientStop.dataset.index);
            const dropContainerId = gradientStop.closest('.gradient-stops-container').id;
            
            console.log('Drop:', { dropIndex, dropContainerId, draggedStopIndex, draggedContainerId });
            
            if (draggedStopIndex !== null && draggedContainerId === dropContainerId && draggedStopIndex !== dropIndex) {
                console.log('Reordering stops...');
                // Reorder the stops
                if (draggedContainerId === 'gradient-stops') {
                    const draggedStop = gradientStops.splice(draggedStopIndex, 1)[0];
                    gradientStops.splice(dropIndex, 0, draggedStop);
                    renderGradientStops('gradient-stops', gradientStops);
                    updateGradientFromStops();
                } else if (draggedContainerId === 'border-gradient-stops') {
                    const draggedStop = borderGradientStops.splice(draggedStopIndex, 1)[0];
                    borderGradientStops.splice(dropIndex, 0, draggedStop);
                    renderGradientStops('border-gradient-stops', borderGradientStops);
                    updateBorderGradientFromStops();
                }
                console.log('Reorder complete');
            } else {
                console.log('Drop conditions not met');
            }
        }

        function startMouseDrag(e, element, index, containerId) {
            e.preventDefault();
            isDragging = true;
            draggedElement = element;
            draggedIndex = index;
            draggedContainerId = containerId;
            
            console.log('Mouse drag start:', { draggedIndex, draggedContainerId });
            
            // Visual feedback
            element.style.opacity = '0.6';
            element.style.transform = 'scale(1.1)';
            element.style.zIndex = '1000';
            element.style.position = 'relative';
            
            // Add global mouse event listeners
            document.addEventListener('mousemove', handleMouseDrag);
            document.addEventListener('mouseup', handleMouseDrop);
        }
        
        function handleMouseDrag(e) {
            if (!isDragging || !draggedElement) return;
            
            e.preventDefault();
            
            // Find the element under the mouse
            const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
            const gradientStop = elementUnderMouse?.closest('.gradient-stop');
            
            if (gradientStop && gradientStop !== draggedElement) {
                // Add visual feedback to drop target
                gradientStop.style.border = '2px dashed #3b82f6';
                gradientStop.style.backgroundColor = '#eff6ff';
            }
        }
        
        function handleMouseDrop(e) {
            if (!isDragging || !draggedElement) return;
            
            e.preventDefault();
            isDragging = false;
            
            // Find the element under the mouse
            const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
            const gradientStop = elementUnderMouse?.closest('.gradient-stop');
            
            if (gradientStop && gradientStop !== draggedElement) {
                const dropIndex = parseInt(gradientStop.dataset.index);
                const dropContainerId = gradientStop.closest('.gradient-stops-container').id;
                
                console.log('Mouse drop:', { dropIndex, dropContainerId, draggedIndex, draggedContainerId });
                
                if (draggedContainerId === dropContainerId && draggedIndex !== dropIndex) {
                    console.log('Reordering stops...');
                    // Reorder the stops
                    if (draggedContainerId === 'gradient-stops') {
                        const draggedStop = gradientStops.splice(draggedIndex, 1)[0];
                        gradientStops.splice(dropIndex, 0, draggedStop);
                        renderGradientStops('gradient-stops', gradientStops);
                        updateGradientFromStops();
                    } else if (draggedContainerId === 'border-gradient-stops') {
                        const draggedStop = borderGradientStops.splice(draggedIndex, 1)[0];
                        borderGradientStops.splice(dropIndex, 0, draggedStop);
                        renderGradientStops('border-gradient-stops', borderGradientStops);
                        updateBorderGradientFromStops();
                    }
                    console.log('Reorder complete');
                }
            }
            
            // Clean up
            draggedElement.style.opacity = '';
            draggedElement.style.transform = '';
            draggedElement.style.zIndex = '';
            draggedElement.style.position = '';
            
            // Clean up visual feedback on all gradient stops
            document.querySelectorAll('.gradient-stop').forEach(stop => {
                stop.style.border = '';
                stop.style.backgroundColor = '';
            });
            
            draggedElement = null;
            draggedIndex = null;
            draggedContainerId = null;
            
            // Remove global event listeners
            document.removeEventListener('mousemove', handleMouseDrag);
            document.removeEventListener('mouseup', handleMouseDrop);
        }

        function updateStopPosition(containerId, index, position) {
            if (containerId === 'gradient-stops') {
                gradientStops[index].position = parseInt(position);
                updateGradientFromStops();
            } else {
                borderGradientStops[index].position = parseInt(position);
                updateBorderGradientFromStops();
            }
        }

        function addGradientStop(type) {
            const stops = type === 'main' ? gradientStops : borderGradientStops;
            const containerId = type === 'main' ? 'gradient-stops' : 'border-gradient-stops';
            
            // Add new stop in the middle
            const newPosition = 50;
            const newColor = '#3b82f6';
            
            stops.push({ color: newColor, position: newPosition });
            stops.sort((a, b) => a.position - b.position);
            
            renderGradientStops(containerId, stops);
            
            if (type === 'main') {
                updateGradientFromStops();
            } else {
                updateBorderGradientFromStops();
            }
        }

        function removeGradientStop(containerId, index) {
            if (containerId === 'gradient-stops') {
                gradientStops.splice(index, 1);
                renderGradientStops('gradient-stops', gradientStops);
                updateGradientFromStops();
            } else {
                borderGradientStops.splice(index, 1);
                renderGradientStops('border-gradient-stops', borderGradientStops);
                updateBorderGradientFromStops();
            }
        }

        function updateGradientFromStops() {
            const angle = document.getElementById('gradient-angle')?.value || 45;
            const stops = gradientStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
            const gradientText = `linear-gradient(${angle}deg, ${stops})`;
            
            updateThemeProperty('gradientText', gradientText);
            
            // Update the CSS output field
            const gradientTextInput = document.getElementById('gradient-text');
            if (gradientTextInput) {
                gradientTextInput.value = gradientText;
                autoResizeTextInput(gradientTextInput);
            }
            
            // Update preview
            const preview = document.getElementById('gradient-preview');
            if (preview) {
                preview.style.background = gradientText;
            }
            
            console.log('Updated background gradient text:', gradientText);
            applyTheme();
        }

        function updateBorderGradientFromStops() {
            const angle = document.getElementById('border-gradient-angle')?.value || 45;
            const stops = borderGradientStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
            const gradientText = `linear-gradient(${angle}deg, ${stops})`;
            
            updateThemeProperty('borderGradientText', gradientText);
            
            // Update the CSS output field
            const borderGradientInput = document.getElementById('border-gradient-input');
            if (borderGradientInput) {
                borderGradientInput.value = gradientText;
                autoResizeTextInput(borderGradientInput);
            }
            
            // Update preview
            const preview = document.getElementById('border-gradient-preview');
            if (preview) {
                preview.style.background = gradientText;
            }
            
            // Apply border gradient directly to phone mockup if gradient border is enabled
            const gradientBorderToggle = document.getElementById('gradient-border-toggle');
            const borderTypeRadios = document.querySelectorAll('input[name="border-type"]');
            const isGradientBorderEnabled = gradientBorderToggle ? gradientBorderToggle.checked : false;
            const isGradientBorderType = Array.from(borderTypeRadios).some(radio => radio.checked && radio.value === 'gradient');
            
            if (isGradientBorderEnabled && isGradientBorderType) {
                const phoneMockup = document.querySelector('.phone-mockup');
                if (phoneMockup) {
                    phoneMockup.style.setProperty('background', gradientText, 'important');
                }
            }
            
            console.log('Updated border gradient text:', gradientText);
        }

        function copyGradient(type) {
            const input = type === 'main' ? document.getElementById('gradient-text') : document.getElementById('border-gradient-input');
            const gradientText = input.value;
            
            if (!gradientText) {
                showMessage('No gradient to copy!', 'error');
                return;
            }
            
            // Add visual feedback to the copy button
            const copyBtn = type === 'main' ? document.querySelector('#gradient-copy-btn') : document.querySelector('#border-gradient-copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = '#10b981';
                copyBtn.style.color = 'white';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '';
                    copyBtn.style.color = '';
                }, 1500);
            }
            
            // Use modern Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(gradientText).then(() => {
                    showMessage('Gradient copied to clipboard!', 'success');
                }).catch(() => {
                    // Fallback to old method
                    fallbackCopy(gradientText);
                });
            } else {
                // Fallback for older browsers
                fallbackCopy(gradientText);
            }
        }
        
        function fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showMessage('Gradient copied to clipboard!', 'success');
            } catch (err) {
                showMessage('Failed to copy gradient', 'error');
            }
            
            document.body.removeChild(textArea);
        }
        function autoResizeTextInput(input) {
            // Create a temporary div to measure text width
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.height = 'auto';
            tempDiv.style.width = 'auto';
            tempDiv.style.font = window.getComputedStyle(input).font;
            tempDiv.style.padding = window.getComputedStyle(input).padding;
            tempDiv.style.border = window.getComputedStyle(input).border;
            tempDiv.style.whiteSpace = 'nowrap';
            tempDiv.style.fontSize = '12px';
            tempDiv.textContent = input.value || input.placeholder;
            
            document.body.appendChild(tempDiv);
            
            // Calculate the required width
            const scrollWidth = tempDiv.scrollWidth;
            const minWidth = 300; // minimum width
            const maxWidth = 800; // maximum width
            const newWidth = Math.min(Math.max(scrollWidth + 30, minWidth), maxWidth);
            
            // Apply the new width
            input.style.width = newWidth + 'px';
            input.style.minWidth = newWidth + 'px';
            
            // Clean up
            document.body.removeChild(tempDiv);
        }

        // Add click handlers for gradient presets
        function setupGradientPresets() {
            const presets = document.querySelectorAll('.gradient-preset');
            presets.forEach(preset => {
                preset.addEventListener('click', () => {
                    const gradient = preset.getAttribute('data-gradient') || preset.style.background;
                    parseAndApplyGradient(gradient);
                });
            });
        }

        function parseAndApplyGradient(gradientText) {
            console.log('Parsing gradient:', gradientText);
            
            // Parse the gradient text to extract angle and color stops
            const linearGradientMatch = gradientText.match(/linear-gradient\(([^)]+)\)/);
            if (!linearGradientMatch) {
                console.error('Invalid gradient format');
                return;
            }
            
            const content = linearGradientMatch[1];
            console.log('Gradient content:', content);
            
            // Extract angle (first part before comma)
            const parts = content.split(',');
            let angle = 45; // default
            let colorStops = [];
            
            // Check if first part is an angle
            const firstPart = parts[0].trim();
            const angleMatch = firstPart.match(/(\d+)deg/);
            if (angleMatch) {
                angle = parseInt(angleMatch[1]);
                colorStops = parts.slice(1);
            } else {
                colorStops = parts;
            }
            
            console.log('Angle:', angle, 'Color stops:', colorStops);
            
            // Parse color stops
            const stops = colorStops.map((stop, index) => {
                const trimmed = stop.trim();
                const parts = trimmed.split(/\s+/);
                let color = parts[0];
                let position = Math.round((index / (colorStops.length - 1)) * 100);
                
                // Check if position is specified
                if (parts.length > 1) {
                    const positionMatch = parts[1].match(/(\d+)%/);
                    if (positionMatch) {
                        position = parseInt(positionMatch[1]);
                    }
                }
                
                return { color, position };
            });
            
            console.log('Parsed stops:', stops);
            
            // Update the gradient stops
            gradientStops = stops;
            
            // Update angle controls
            const angleSlider = document.getElementById('gradient-angle');
            const angleText = document.getElementById('gradient-angle-text');
            if (angleSlider) angleSlider.value = angle;
            if (angleText) angleText.value = angle;
            
            // Re-render the gradient editor
            renderGradientStops('gradient-stops', gradientStops);
            updateGradientFromStops();
        }

        function parseAndApplyBorderGradient(gradientText) {
            console.log('Parsing border gradient:', gradientText);
            
            // Parse the gradient text to extract angle and color stops
            const linearGradientMatch = gradientText.match(/linear-gradient\(([^)]+)\)/);
            if (!linearGradientMatch) {
                console.error('Invalid gradient format');
                return;
            }
            
            const content = linearGradientMatch[1];
            console.log('Border gradient content:', content);
            
            // Extract angle (first part before comma)
            const parts = content.split(',');
            let angle = 45; // default
            let colorStops = [];
            
            // Check if first part is an angle
            const firstPart = parts[0].trim();
            const angleMatch = firstPart.match(/(\d+)deg/);
            if (angleMatch) {
                angle = parseInt(angleMatch[1]);
                colorStops = parts.slice(1);
            } else {
                colorStops = parts;
            }
            
            console.log('Border angle:', angle, 'Color stops:', colorStops);
            
            // Parse color stops
            const stops = colorStops.map((stop, index) => {
                const trimmed = stop.trim();
                const parts = trimmed.split(/\s+/);
                let color = parts[0];
                let position = Math.round((index / (colorStops.length - 1)) * 100);
                
                // Check if position is specified
                if (parts.length > 1) {
                    const positionMatch = parts[1].match(/(\d+)%/);
                    if (positionMatch) {
                        position = parseInt(positionMatch[1]);
                    }
                }
                
                return { color, position };
            });
            
            console.log('Parsed border stops:', stops);
            
            // Update the border gradient stops
            borderGradientStops = stops;
            
            // Update angle controls
            const angleSlider = document.getElementById('border-gradient-angle');
            const angleText = document.getElementById('border-gradient-angle-text');
            if (angleSlider) angleSlider.value = angle;
            if (angleText) angleText.value = angle;
            
            // Re-render the border gradient editor
            renderGradientStops('border-gradient-stops', borderGradientStops);
            updateBorderGradientFromStops();
        }

        // User Favorites System
        function saveGradient(type) {
            const gradientText = type === 'main' ? 
                document.getElementById('gradient-text').value : 
                document.getElementById('border-gradient-input').value;
            
            if (!gradientText || !gradientText.includes('linear-gradient')) {
                showMessage('No gradient to save!', 'error');
                return;
            }
            
            const name = prompt('Enter a name for this gradient:');
            if (!name) return;
            
            const savedGradients = getSavedGradients();
            const newGradient = {
                id: Date.now().toString(),
                name: name,
                gradient: gradientText,
                timestamp: new Date().toISOString()
            };
            
            savedGradients.push(newGradient);
            localStorage.setItem('academiq-gradients', JSON.stringify(savedGradients));
            
            showMessage(`Gradient "${name}" saved!`, 'success');
            // Reload both containers so the gradient appears everywhere
            loadSavedGradients('main');
            loadSavedGradients('border');
        }
        
        function loadGradient(type) {
            const savedGradients = getSavedGradients(type);
            if (savedGradients.length === 0) {
                showMessage('No saved gradients found!', 'error');
                return;
            }
            
            const containerId = type === 'main' ? 'saved-gradients' : 'saved-border-gradients';
            const container = document.getElementById(containerId);
            
            if (!container) {
                console.error('Container not found:', containerId);
                return;
            }
            
            // Load the gradients first
            loadSavedGradients(type);
            
            // Toggle visibility
            if (container.style.display === 'none' || container.style.display === '') {
                container.style.display = 'grid';
            } else {
                container.style.display = 'none';
            }
        }
        
        function getSavedGradients(type) {
            // Return all gradients regardless of type - unified storage
            const key = 'academiq-gradients';
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : [];
        }
        
        function loadSavedGradients(type) {
            // Load all gradients into both containers
            const savedGradients = getSavedGradients();
            
            // Load into main container
            const mainContainer = document.getElementById('saved-gradients');
            if (mainContainer) {
                mainContainer.innerHTML = '';
                savedGradients.forEach(gradient => {
                    const item = document.createElement('div');
                    item.className = 'saved-gradient-item';
                    item.style.background = gradient.gradient;
                    item.title = gradient.name;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '×';
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        deleteSavedGradient(gradient.id);
                    };
                    
                    item.appendChild(deleteBtn);
                    item.onclick = () => applySavedGradient('main', gradient.gradient);
                    
                    mainContainer.appendChild(item);
                });
            }
            
            // Load into border container
            const borderContainer = document.getElementById('saved-border-gradients');
            if (borderContainer) {
                borderContainer.innerHTML = '';
                savedGradients.forEach(gradient => {
                    const item = document.createElement('div');
                    item.className = 'saved-gradient-item';
                    item.style.background = gradient.gradient;
                    item.title = gradient.name;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '×';
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        deleteSavedGradient(gradient.id);
                    };
                    
                    item.appendChild(deleteBtn);
                    item.onclick = () => applySavedGradient('border', gradient.gradient);
                    
                    borderContainer.appendChild(item);
                });
            }
        }
        
        function deleteSavedGradient(gradientId) {
            const savedGradients = getSavedGradients();
            const filtered = savedGradients.filter(g => g.id !== gradientId);
            localStorage.setItem('academiq-gradients', JSON.stringify(filtered));
            // Reload both containers
            loadSavedGradients('main');
            loadSavedGradients('border');
            showMessage('Gradient deleted!', 'success');
        }
        
        function applySavedGradient(type, gradientText) {
            if (type === 'main') {
                parseAndApplyGradient(gradientText);
            } else {
                parseAndApplyBorderGradient(gradientText);
            }
        }

        function setupGradientDragAndDrop() {
            // Prevent duplicate event listeners
            if (window.gradientDragSetup) return;
            window.gradientDragSetup = true;
            
            console.log('Setting up gradient drag and drop...');
            
            // Use document-level event delegation with more specific targeting
            document.addEventListener('dragover', (e) => {
                if (e.target.closest('.gradient-stops-container')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('DRAG OVER EVENT FIRED!', e.target);
                    handleStopDragOver(e);
                }
            });
            
            document.addEventListener('dragleave', (e) => {
                if (e.target.closest('.gradient-stops-container')) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStopDragLeave(e);
                }
            });
            
            document.addEventListener('drop', (e) => {
                if (e.target.closest('.gradient-stops-container')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('DROP EVENT FIRED!', e.target);
                    handleStopDrop(e);
                }
            });
            
            console.log('Set up global drag and drop event delegation');
        }

        function testDragAndDrop() {
            console.log('Testing drag and drop setup...');
            const gradientStopsContainer = document.getElementById('gradient-stops');
            const borderGradientStopsContainer = document.getElementById('border-gradient-stops');
            
            console.log('Gradient stops container:', gradientStopsContainer);
            console.log('Border gradient stops container:', borderGradientStopsContainer);
            
            if (gradientStopsContainer) {
                console.log('Gradient stops container children:', gradientStopsContainer.children.length);
                console.log('Gradient stops container has data-drag-setup:', gradientStopsContainer.hasAttribute('data-drag-setup'));
            }
        }
        function setupColorPresets() {
            // Prevent duplicate event listeners
            if (window.colorPresetsSetup) {
                console.log('Color presets already set up, skipping...');
                return;
            }
            window.colorPresetsSetup = true;
            
            console.log('Setting up color presets...');
            
            // Setup background color presets
            const bgColorPresets = document.querySelectorAll('#bg-color-presets .color-preset');
            console.log('Found background color presets:', bgColorPresets.length);
            
            bgColorPresets.forEach((preset, index) => {
                preset.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    console.log('Background color preset clicked:', color);
                    
                    // Update the color input
                    const bgColorInput = document.getElementById('bg-color');
                    const bgColorText = document.getElementById('bg-color-text');
                    if (bgColorInput) {
                        bgColorInput.value = color;
                    }
                    if (bgColorText) {
                        bgColorText.value = color;
                    }
                    
                    // Update the theme
                    updateThemeProperty('backgroundColor', color);
                    applyTheme();
                    
                    // Update active state
                    bgColorPresets.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    console.log('Background color updated to:', color);
                });
            });
            
            // Setup text color presets
            const textColorElement = document.querySelector('#text-color');
            if (!textColorElement) {
                console.log('Text color element not found - skipping text color presets');
            } else {
            const textColorContainer = textColorElement.closest('.option-group');
            if (!textColorContainer) {
                console.error('Text color container not found!');
                return;
            }
            const textColorPresets = textColorContainer.querySelectorAll('.color-preset');
            console.log('Found text color presets:', textColorPresets.length);
            
            textColorPresets.forEach((preset, index) => {
                console.log(`Setting up text color preset ${index}:`, preset);
                preset.addEventListener('click', (e) => {
                    console.log('=== TEXT COLOR PRESET CLICKED ===');
                    console.log('Text color preset clicked:', e.target.dataset.color);
                    const color = e.target.dataset.color;
                    const textColorInput = document.getElementById('text-color');
                    if (textColorInput) {
                        textColorInput.value = color;
                        console.log('Set text color input to:', color);
                        updateTextColor();
                    } else {
                        console.error('Text color input not found!');
                    }
                    
                    // Update active state
                    textColorPresets.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    console.log('Text color updated to:', color);
                    console.log('=== END TEXT COLOR PRESET ===');
                });
            });
            }
            
            // Setup button text color presets
            const buttonTextColorElement = document.querySelector('#button-text-color');
            if (!buttonTextColorElement) {
                console.log('Button text color element not found - skipping button text color presets');
            } else {
            const buttonTextColorContainer = buttonTextColorElement.closest('.option-group');
            if (!buttonTextColorContainer) {
                console.error('Button text color container not found!');
                return;
            }
            const buttonTextColorPresets = buttonTextColorContainer.querySelectorAll('.color-preset');
            console.log('Found button text color presets:', buttonTextColorPresets.length);
            
            buttonTextColorPresets.forEach((preset, index) => {
                console.log(`Setting up button text color preset ${index}:`, preset);
                preset.addEventListener('click', (e) => {
                    console.log('=== BUTTON TEXT COLOR PRESET CLICKED ===');
                    console.log('Button text color preset clicked:', e.target.dataset.color);
                    const color = e.target.dataset.color;
                    const buttonTextColorInput = document.getElementById('button-text-color');
                    const buttonTextColorText = document.getElementById('button-text-color-text');
                    if (buttonTextColorInput) {
                        buttonTextColorInput.value = color;
                        console.log('Set button text color input to:', color);
                    }
                    if (buttonTextColorText) {
                        buttonTextColorText.value = color;
                    }
                    updateButtonTextColor();
                    
                    // Update active state
                    buttonTextColorPresets.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    console.log('=== END BUTTON TEXT COLOR PRESET ===');
                });
            });
            }
            
            // Setup button background color presets
            const buttonBgColorElement = document.querySelector('#button-bg-color');
            if (!buttonBgColorElement) {
                console.log('Button background color element not found - skipping button background color presets');
            } else {
            const buttonBgColorContainer = buttonBgColorElement.closest('.option-group');
            if (!buttonBgColorContainer) {
                console.error('Button background color container not found!');
                return;
            }
            const buttonBgColorPresets = buttonBgColorContainer.querySelectorAll('.color-preset');
            console.log('Found button background color presets:', buttonBgColorPresets.length);
            console.log('Button background color group display:', buttonBgColorContainer.style.display);
            
            buttonBgColorPresets.forEach((preset, index) => {
                console.log(`Setting up button background color preset ${index}:`, preset);
                preset.addEventListener('click', (e) => {
                    console.log('=== BUTTON BACKGROUND COLOR PRESET CLICKED ===');
                    console.log('Button background color preset clicked:', e.target.dataset.color);
                    const color = e.target.dataset.color;
                    const buttonBgColorInput = document.getElementById('button-bg-color');
                    const buttonBgColorText = document.getElementById('button-bg-color-text');
                    if (buttonBgColorInput) {
                        buttonBgColorInput.value = color;
                        console.log('Set button background color input to:', color);
                    }
                    if (buttonBgColorText) {
                        buttonBgColorText.value = color;
                    }
                    updateButtonBgColor();
                    
                    // Update active state
                    buttonBgColorPresets.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    console.log('=== END BUTTON BACKGROUND COLOR PRESET ===');
                });
            });
            }
            
            // Setup presentation color presets
            const presentationColorElement = document.querySelector('#presentation-color');
            if (!presentationColorElement) {
                console.log('Presentation color element not found - skipping presentation color presets');
            } else {
            const presentationColorContainer = presentationColorElement.closest('.option-group');
            if (!presentationColorContainer) {
                console.error('Presentation color container not found!');
            } else {
            const presentationColorPresets = presentationColorContainer.querySelectorAll('.color-preset');
            console.log('Found presentation color presets:', presentationColorPresets.length);
            
            presentationColorPresets.forEach((preset, index) => {
                preset.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    console.log('Presentation color preset clicked:', color);
                    
                    const presentationColorInput = document.getElementById('presentation-color');
                    const presentationColorText = document.getElementById('presentation-color-text');
                    if (presentationColorInput) {
                        presentationColorInput.value = color;
                    }
                    if (presentationColorText) {
                        presentationColorText.value = color;
                    }
                    updatePresentationColor();
                    
                    // Update active state
                    presentationColorPresets.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    console.log('Presentation color updated to:', color);
                });
            });
            }
            }
            
            // Setup border color presets
            const borderColorElement = document.querySelector('#border-color-picker');
            if (!borderColorElement) {
                console.log('Border color element not found - skipping border color presets');
            } else {
            const borderColorContainer = borderColorElement.closest('.option-group');
            if (!borderColorContainer) {
                console.error('Border color container not found!');
            } else {
            const borderColorPresets = borderColorContainer.querySelectorAll('.color-preset');
            console.log('Found border color presets:', borderColorPresets.length);
            
            borderColorPresets.forEach((preset, index) => {
                preset.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    console.log('=== BORDER COLOR PRESET CLICKED ===');
                    console.log('Border color preset clicked:', color);
                    console.log('Current theme before update:', currentTheme);
                    
                    // Update the color inputs
                    const borderColorInput = document.getElementById('border-color-picker');
                    const borderColorText = document.getElementById('border-color-text');
                    if (borderColorInput) {
                        borderColorInput.value = color;
                    }
                    if (borderColorText) {
                        borderColorText.value = color;
                    }
                    
                    // Update the theme
                    updateThemeProperty('borderColor', color);
                    console.log('Updated borderColor to:', currentTheme.borderColor);
                    console.log('Background type:', currentTheme.backgroundType);
                    console.log('Gradient border enabled:', currentTheme.gradientBorderEnabled);
                    applyTheme();
                    
                    // Update active state
                    borderColorPresets.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    console.log('=== END BORDER COLOR PRESET ===');
                });
            });
            }
            }
            
            // Set initial active states
            updateActiveColorPresets();
        }

        function updateActiveColorPresets() {
            console.log('Updating active color presets...');
            
            // Update background color presets
            const bgColorInput = document.getElementById('bg-color');
            if (bgColorInput) {
                const bgColor = bgColorInput.value;
                const bgColorPresets = document.querySelectorAll('#bg-color-presets .color-preset');
                console.log('Updating background color presets, current color:', bgColor, 'presets found:', bgColorPresets.length);
                bgColorPresets.forEach(preset => {
                    preset.classList.toggle('active', preset.dataset.color.toLowerCase() === bgColor.toLowerCase());
                });
            }
            
            // Update text color presets
            const textColorElement = document.getElementById('text-color');
            if (textColorElement) {
                const textColor = textColorElement.value;
                const textColorContainer = textColorElement.closest('.option-group');
                if (textColorContainer) {
                    const textColorPresets = textColorContainer.querySelectorAll('.color-preset');
                    console.log('Updating text color presets, current color:', textColor, 'presets found:', textColorPresets.length);
                    textColorPresets.forEach(preset => {
                        preset.classList.toggle('active', preset.dataset.color === textColor);
                    });
                }
            }
            
            // Update button text color presets
            const buttonTextColorElement = document.getElementById('button-text-color');
            if (buttonTextColorElement) {
                const buttonTextColor = buttonTextColorElement.value;
                const buttonTextColorContainer = buttonTextColorElement.closest('.option-group');
                if (buttonTextColorContainer) {
                    const buttonTextColorPresets = buttonTextColorContainer.querySelectorAll('.color-preset');
                    console.log('Updating button text color presets, current color:', buttonTextColor, 'presets found:', buttonTextColorPresets.length);
                    buttonTextColorPresets.forEach(preset => {
                        preset.classList.toggle('active', preset.dataset.color === buttonTextColor);
                    });
                }
            }
            
            // Update button background color presets
            const buttonBgColorElement = document.getElementById('button-bg-color');
            if (buttonBgColorElement) {
                const buttonBgColor = buttonBgColorElement.value;
                const buttonBgColorContainer = buttonBgColorElement.closest('.option-group');
                if (buttonBgColorContainer) {
                    const buttonBgColorPresets = buttonBgColorContainer.querySelectorAll('.color-preset');
                    console.log('Updating button background color presets, current color:', buttonBgColor, 'presets found:', buttonBgColorPresets.length);
                    buttonBgColorPresets.forEach(preset => {
                        preset.classList.toggle('active', preset.dataset.color === buttonBgColor);
                    });
                }
            }
            
            // Update presentation color presets
            const presentationColorInput = document.getElementById('presentation-color');
            if (presentationColorInput) {
                const presentationColor = presentationColorInput.value;
                const presentationColorContainer = presentationColorInput.closest('.option-group');
                if (presentationColorContainer) {
                    const presentationColorPresets = presentationColorContainer.querySelectorAll('.color-preset');
                    console.log('Updating presentation color presets, current color:', presentationColor, 'presets found:', presentationColorPresets.length);
                    presentationColorPresets.forEach(preset => {
                        preset.classList.toggle('active', preset.dataset.color.toLowerCase() === presentationColor.toLowerCase());
                    });
                }
            }
            
            // Update border color presets
            const borderColorInput = document.getElementById('border-color-picker');
            if (borderColorInput) {
                const borderColor = borderColorInput.value;
                const borderColorContainer = borderColorInput.closest('.option-group');
                if (borderColorContainer) {
                    const borderColorPresets = borderColorContainer.querySelectorAll('.color-preset');
                    console.log('Updating border color presets, current color:', borderColor, 'presets found:', borderColorPresets.length);
                    borderColorPresets.forEach(preset => {
                        preset.classList.toggle('active', preset.dataset.color.toLowerCase() === borderColor.toLowerCase());
                    });
                }
            }
        }

        function migrateGradients() {
            // Migrate old separate gradient storage to unified storage
            const mainKey = 'academiq-main-gradients';
            const borderKey = 'academiq-border-gradients';
            const unifiedKey = 'academiq-gradients';
            
            // Get existing gradients from old storage
            const mainGradients = localStorage.getItem(mainKey) ? JSON.parse(localStorage.getItem(mainKey)) : [];
            const borderGradients = localStorage.getItem(borderKey) ? JSON.parse(localStorage.getItem(borderKey)) : [];
            
            // Get existing unified gradients (if any)
            const existingUnified = localStorage.getItem(unifiedKey) ? JSON.parse(localStorage.getItem(unifiedKey)) : [];
            
            // Merge all gradients, avoiding duplicates by ID
            const allGradients = [...existingUnified];
            const existingIds = new Set(allGradients.map(g => g.id));
            
            [...mainGradients, ...borderGradients].forEach(gradient => {
                if (!existingIds.has(gradient.id)) {
                    allGradients.push(gradient);
                    existingIds.add(gradient.id);
                }
            });
            
            // Save to unified storage
            if (allGradients.length > 0) {
                localStorage.setItem(unifiedKey, JSON.stringify(allGradients));
            }
            
            // Remove old storage keys
            if (mainGradients.length > 0 || borderGradients.length > 0) {
                localStorage.removeItem(mainKey);
                localStorage.removeItem(borderKey);
            }
        }
        
        function setupFavorites() {
            // Prevent duplicate event listeners
            if (window.favoritesSetup) return;
            window.favoritesSetup = true;
            
            // Migrate old gradients to unified storage
            migrateGradients();
            
            // Main gradient favorites
            const saveGradientBtn = document.getElementById('save-gradient-btn');
            
            if (saveGradientBtn) {
                saveGradientBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    saveGradient('main');
                });
            }
            
            // Border gradient favorites
            const saveBorderGradientBtn = document.getElementById('save-border-gradient-btn');
            
            if (saveBorderGradientBtn) {
                saveBorderGradientBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    saveGradient('border');
                });
            }
            
            // Load any existing saved gradients on page load
            loadSavedGradients('main');
            loadSavedGradients('border');
        }
        function applyTheme(theme = null) {
            if (isSaving) {
                return;
            }
            // Skip applyTheme during initialization unless theme is explicitly provided
            // This prevents stale theme data from being applied when loadThemeIntoUI triggers change events
            if (isInitializingTheme && theme === null) {
                return;
            }
            const preview = document.querySelector('.phone-screen');
            if (!preview) {
                console.log('Preview element not found!');
                console.log('Available elements:', document.querySelectorAll('*[class*="phone"]'));
                return;
            }

            // Use provided theme or get fresh theme from UI to ensure all values are current
            // This is especially important for border type and style which come from radio buttons
            const themeToApply = theme || getCurrentThemeFromUI() || (currentList && currentList.theme) || currentTheme;
            
            console.log('Applying theme:', themeToApply);
            console.log('Preview element found:', preview);
            console.log('Preview element classes:', preview.className);
            console.log('Current background type:', themeToApply.backgroundType);

            // Reset all border-related styles before applying new theme
            // This ensures clean state when switching between collections with/without borders
            const phoneMockup = preview.parentElement;
            if (phoneMockup) {
                // Reset phoneMockup border styles to defaults
                phoneMockup.style.setProperty('padding', '0', 'important');
                phoneMockup.style.setProperty('background', 'transparent', 'important');
                phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                phoneMockup.style.setProperty('border', 'none', 'important');
                phoneMockup.style.setProperty('border-image', 'none', 'important');
                phoneMockup.style.setProperty('outline', 'none', 'important');
                // Reset preview border styles to defaults
                preview.style.setProperty('border', 'none', 'important');
                preview.style.setProperty('border-image', 'none', 'important');
                preview.style.setProperty('border-radius', '16px', 'important');
                preview.style.removeProperty('width');
                preview.style.removeProperty('height');
                preview.style.setProperty('min-height', '584px', 'important');
            }

            // Apply background
            if (themeToApply.backgroundType === 'solid') {
                console.log('Applying solid background:', themeToApply.backgroundColor);
                preview.style.setProperty('background', themeToApply.backgroundColor, 'important');
                preview.style.setProperty('background-image', 'none', 'important');
                preview.style.setProperty('background-color', themeToApply.backgroundColor, 'important');
                
                // Handle border for solid backgrounds
                const phoneMockup = preview.parentElement;
                if (phoneMockup) {
                    if (themeToApply.borderStyle === 'thin') {
                        // Thin border style: use inset box-shadow (doesn't affect layout, draws inside)
                        phoneMockup.style.setProperty('border', 'none', 'important');
                        phoneMockup.style.setProperty('border-image', 'none', 'important');
                        phoneMockup.style.setProperty('outline', 'none', 'important');
                        preview.style.setProperty('border', 'none', 'important');
                        preview.style.setProperty('border-image', 'none', 'important');
                        
                        // Check gradientBorderEnabled from theme or checkbox as fallback
                        const gradientBorderEnabled = themeToApply.gradientBorderEnabled !== undefined 
                            ? themeToApply.gradientBorderEnabled 
                            : (document.getElementById('gradient-border-toggle')?.checked || false);
                        
                        if (gradientBorderEnabled) {
                            if (themeToApply.borderType === 'gradient') {
                                // Gradient borders: use padding + gradient background on mockup
                                phoneMockup.style.setProperty('background', themeToApply.borderGradientText, 'important');
                                phoneMockup.style.setProperty('padding', '8px', 'important');
                                phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                            } else if (themeToApply.borderType === 'solid') {
                                // Solid color border - use box-shadow for the border effect
                                phoneMockup.style.setProperty('background', 'transparent', 'important');
                                // Use borderColor from theme - it should be set correctly from UI controls
                                let borderColor = themeToApply.borderColor || '#1f2937';
                                phoneMockup.style.setProperty('box-shadow', `inset 0 0 0 8px ${borderColor}, 0 20px 40px rgba(0, 0, 0, 0.3)`, 'important');
                            }
                        } else {
                            // No border when disabled - remove all border styling
                            phoneMockup.style.setProperty('padding', '0', 'important');
                            // Match phone-mockup background to preview background exactly
                            const previewBg = preview.style.background || themeToApply.backgroundColor || '#ffffff';
                            phoneMockup.style.setProperty('background', previewBg, 'important');
                            preview.style.setProperty('border-radius', '24px', 'important'); // Match phone-mockup border-radius
                            // Ensure preview fills entire phone-mockup with no gap
                            preview.style.setProperty('width', '100%', 'important');
                            preview.style.setProperty('height', '100%', 'important');
                            preview.style.setProperty('min-height', '600px', 'important'); // Match phone-mockup height
                            // Remove any box-shadow that might create a border effect
                            phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                        }
                    } else {
                        // Frame fill style: border fills the phone mockup background
                        phoneMockup.style.setProperty('border', 'none', 'important');
                        phoneMockup.style.setProperty('border-image', 'none', 'important');
                        phoneMockup.style.setProperty('outline', 'none', 'important');
                        phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important'); // Reset to default shadow
                        phoneMockup.style.setProperty('padding', '8px', 'important'); // Reset padding
                        preview.style.setProperty('border', 'none', 'important');
                        preview.style.setProperty('border-image', 'none', 'important');
                        
                        // Check gradientBorderEnabled from theme or checkbox as fallback
                        const gradientBorderEnabledFrame = themeToApply.gradientBorderEnabled !== undefined 
                            ? themeToApply.gradientBorderEnabled 
                            : (document.getElementById('gradient-border-toggle')?.checked || false);
                        
                        if (gradientBorderEnabledFrame) {
                            // Restore padding and border-radius when border is enabled
                            phoneMockup.style.setProperty('padding', '8px', 'important');
                            preview.style.setProperty('border-radius', '16px', 'important'); // Restore phone-screen border-radius
                            preview.style.setProperty('min-height', '584px', 'important'); // Restore original min-height
                            if (themeToApply.borderType === 'gradient') {
                                phoneMockup.style.setProperty('background', themeToApply.borderGradientText, 'important');
                            } else if (themeToApply.borderType === 'solid') {
                                // Solid color border for frame fill style - always use border color
                                // Always read directly from color picker to ensure we get the current value
                                const borderColorPicker = document.getElementById('border-color-picker');
                                let borderColor = '#1f2937'; // Default
                                
                                if (borderColorPicker && borderColorPicker.value) {
                                    borderColor = borderColorPicker.value;
                                } else if (themeToApply.borderColor) {
                                    borderColor = themeToApply.borderColor;
                                }
                                
                                console.log('Applying frame fill solid border color:', borderColor);
                                console.log('Border type from theme:', themeToApply.borderType);
                                console.log('Border style from theme:', themeToApply.borderStyle);
                                console.log('Border color from picker:', borderColorPicker?.value);
                                console.log('Border color from theme:', themeToApply.borderColor);
                                phoneMockup.style.setProperty('background', borderColor, 'important');
                            }
                        } else {
                            // No border when disabled - remove all border styling
                            phoneMockup.style.setProperty('padding', '0', 'important');
                            // Match phone-mockup background to preview background exactly
                            const previewBg = preview.style.background || themeToApply.backgroundColor || '#ffffff';
                            phoneMockup.style.setProperty('background', previewBg, 'important');
                            preview.style.setProperty('border-radius', '24px', 'important'); // Match phone-mockup border-radius
                            // Ensure preview fills entire phone-mockup with no gap
                            preview.style.setProperty('width', '100%', 'important');
                            preview.style.setProperty('height', '100%', 'important');
                            preview.style.setProperty('min-height', '600px', 'important'); // Match phone-mockup height
                            // Remove any box-shadow that might create a border effect
                            phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                        }
                    }
                }
            } else if (themeToApply.backgroundType === 'gradient') {
                // Apply gradient to the phone screen content area
                // Use setProperty with !important to ensure it takes precedence
                preview.style.setProperty('background', themeToApply.gradientText, 'important');
                preview.style.setProperty('background-image', 'none', 'important');
                preview.style.setProperty('background-color', 'transparent', 'important');
                preview.style.setProperty('background-size', 'cover', 'important');
                preview.style.setProperty('background-position', 'center', 'important');
                preview.style.setProperty('background-repeat', 'no-repeat', 'important');
                
                // Apply border to phone mockup if enabled
                const phoneMockup = preview.parentElement;
                if (phoneMockup) {
                    if (themeToApply.borderStyle === 'thin') {
                        // Thin border style: use inset box-shadow (doesn't affect layout, draws inside)
                        phoneMockup.style.setProperty('border', 'none', 'important');
                        phoneMockup.style.setProperty('border-image', 'none', 'important');
                        phoneMockup.style.setProperty('outline', 'none', 'important');
                        preview.style.setProperty('border', 'none', 'important');
                        preview.style.setProperty('border-image', 'none', 'important');
                        
                        // Check gradientBorderEnabled from theme or checkbox as fallback
                        const gradientBorderEnabledGradient = themeToApply.gradientBorderEnabled !== undefined 
                            ? themeToApply.gradientBorderEnabled 
                            : (document.getElementById('gradient-border-toggle')?.checked || false);
                        
                        if (gradientBorderEnabledGradient) {
                            if (themeToApply.borderType === 'gradient') {
                                // Gradient borders: use padding + gradient background on mockup
                                phoneMockup.style.setProperty('background', themeToApply.borderGradientText, 'important');
                                phoneMockup.style.setProperty('padding', '8px', 'important');
                                phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                            } else if (themeToApply.borderType === 'solid') {
                                // Solid color border
                                phoneMockup.style.setProperty('background', 'transparent', 'important');
                                const borderColor = themeToApply.borderColor || '#1f2937';
                                phoneMockup.style.setProperty('box-shadow', `inset 0 0 0 8px ${borderColor}, 0 20px 40px rgba(0, 0, 0, 0.3)`, 'important');
                            }
                        } else {
                            // No border when disabled - remove all border styling
                            phoneMockup.style.setProperty('padding', '0', 'important');
                            // Match phone-mockup background to preview background exactly
                            const previewBg = preview.style.background || themeToApply.backgroundColor || '#ffffff';
                            phoneMockup.style.setProperty('background', previewBg, 'important');
                            preview.style.setProperty('border-radius', '24px', 'important'); // Match phone-mockup border-radius
                            // Ensure preview fills entire phone-mockup with no gap
                            preview.style.setProperty('width', '100%', 'important');
                            preview.style.setProperty('height', '100%', 'important');
                            preview.style.setProperty('min-height', '600px', 'important'); // Match phone-mockup height
                            // Remove any box-shadow that might create a border effect
                            phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                        }
                    } else {
                        // Frame fill style
                        phoneMockup.style.setProperty('border', 'none', 'important');
                        phoneMockup.style.setProperty('border-image', 'none', 'important');
                        phoneMockup.style.setProperty('outline', 'none', 'important');
                        phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                        phoneMockup.style.setProperty('padding', '8px', 'important');
                        preview.style.setProperty('border', 'none', 'important');
                        preview.style.setProperty('border-image', 'none', 'important');
                        
                        // Check gradientBorderEnabled from theme or checkbox as fallback
                        const gradientBorderEnabledFrameGradient = themeToApply.gradientBorderEnabled !== undefined 
                            ? themeToApply.gradientBorderEnabled 
                            : (document.getElementById('gradient-border-toggle')?.checked || false);
                        
                        // For frame fill style, apply border based on border type only if enabled
                        if (gradientBorderEnabledFrameGradient) {
                            // Restore padding and border-radius when border is enabled
                            phoneMockup.style.setProperty('padding', '8px', 'important');
                            preview.style.setProperty('border-radius', '16px', 'important'); // Restore phone-screen border-radius
                            if (themeToApply.borderType === 'gradient') {
                                if (themeToApply.borderGradientText) {
                                    phoneMockup.style.setProperty('background', themeToApply.borderGradientText, 'important');
                                } else {
                                    phoneMockup.style.setProperty('background', '#1f2937', 'important'); // Default
                                }
                            } else if (themeToApply.borderType === 'solid') {
                                // Solid color border for frame fill style - always use border color
                                // Always read directly from color picker to ensure we get the current value
                                const borderColorPicker = document.getElementById('border-color-picker');
                                let borderColor = '#1f2937'; // Default
                                
                                if (borderColorPicker && borderColorPicker.value) {
                                    borderColor = borderColorPicker.value;
                                } else if (themeToApply.borderColor) {
                                    borderColor = themeToApply.borderColor;
                                }
                                
                                console.log('Applying frame fill solid border color:', borderColor);
                                console.log('Border type from theme:', themeToApply.borderType);
                                console.log('Border style from theme:', themeToApply.borderStyle);
                                console.log('Border color from picker:', borderColorPicker?.value);
                                console.log('Border color from theme:', themeToApply.borderColor);
                                phoneMockup.style.setProperty('background', borderColor, 'important');
                            } else {
                                phoneMockup.style.setProperty('background', '#1f2937', 'important'); // Default dark border
                            }
                        } else {
                            // No border when disabled - remove all border styling
                            console.log('Border disabled - removing all border styling');
                            phoneMockup.style.setProperty('padding', '0', 'important');
                            // Match phone-mockup background to preview background exactly
                            const previewBg = preview.style.background || themeToApply.backgroundColor || '#ffffff';
                            phoneMockup.style.setProperty('background', previewBg, 'important');
                            preview.style.setProperty('border-radius', '24px', 'important'); // Match phone-mockup border-radius
                            // Ensure preview fills entire phone-mockup with no gap
                            preview.style.setProperty('width', '100%', 'important');
                            preview.style.setProperty('height', '100%', 'important');
                            preview.style.setProperty('min-height', '600px', 'important'); // Match phone-mockup height
                            // Remove any box-shadow that might create a border effect
                            phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                        }
                    }
                }
                
                // Force re-apply after a small delay to ensure it takes effect
                setTimeout(() => {
                    preview.style.setProperty('background', themeToApply.gradientText, 'important');
                }, 10);
                
                console.log('Element computed background:', window.getComputedStyle(preview).background);
                console.log('Element style background:', preview.style.background);
                console.log('Gradient text length:', themeToApply.gradientText.length);
                console.log('Gradient text type:', typeof themeToApply.gradientText);
            } else if (themeToApply.backgroundType === 'image' && themeToApply.backgroundImage) {
                preview.style.background = 'none';
                preview.style.backgroundImage = `url(${themeToApply.backgroundImage})`;
                
                // Use positioning controls if available
                if (themeToApply.imagePosition) {
                    const { x, y, scale } = themeToApply.imagePosition;
                    
                    // Apply scaling directly, but ensure coverage
                    // Use a size that's guaranteed to cover the container
                    const scaleMultiplier = scale / 100;
                    
                    // Calculate a size that ensures coverage
                    // Use a large enough size that even at 50% scale, it covers the container
                    const baseSize = 200; // Base size in percentage
                    const scaledSize = baseSize * scaleMultiplier;
                    
                    preview.style.backgroundSize = `${scaledSize}%`;
                    preview.style.backgroundPosition = `${x}% ${y}%`;
                } else {
                    preview.style.backgroundSize = 'cover';
                    preview.style.backgroundPosition = 'center';
                }
                
                preview.style.backgroundRepeat = 'no-repeat';
                
                // Handle border for image backgrounds
                const phoneMockup = preview.parentElement;
                if (phoneMockup) {
                    if (themeToApply.borderStyle === 'thin') {
                        // Thin border style: use outline instead of border (doesn't affect layout)
                        phoneMockup.style.setProperty('background', 'transparent', 'important');
                        phoneMockup.style.setProperty('border', 'none', 'important');
                        phoneMockup.style.setProperty('border-image', 'none', 'important');
                        preview.style.setProperty('border', 'none', 'important');
                        preview.style.setProperty('border-image', 'none', 'important');
                        
                        // Check gradientBorderEnabled from theme or checkbox as fallback
                        const gradientBorderEnabledImage = themeToApply.gradientBorderEnabled !== undefined 
                            ? themeToApply.gradientBorderEnabled 
                            : (document.getElementById('gradient-border-toggle')?.checked || false);
                        
                        if (gradientBorderEnabledImage) {
                            // For image backgrounds with thin border style, use solid border color
                            let borderColor = themeToApply.borderColor;
                            // Fallback to color picker if not set in theme
                            if (!borderColor || borderColor === '#1f2937') {
                                const borderColorPicker = document.getElementById('border-color-picker');
                                if (borderColorPicker && borderColorPicker.value) {
                                    borderColor = borderColorPicker.value;
                                } else {
                                    borderColor = '#1f2937'; // Default
                                }
                            }
                            phoneMockup.style.setProperty('box-shadow', `inset 0 0 0 8px ${borderColor}, 0 20px 40px rgba(0, 0, 0, 0.3)`, 'important');
                        } else {
                            // No border when disabled - remove all border styling
                            phoneMockup.style.setProperty('padding', '0', 'important');
                            // Match phone-mockup background to preview background exactly
                            const previewBg = preview.style.background || themeToApply.backgroundColor || '#ffffff';
                            phoneMockup.style.setProperty('background', previewBg, 'important');
                            preview.style.setProperty('border-radius', '24px', 'important'); // Match phone-mockup border-radius
                            // Ensure preview fills entire phone-mockup with no gap
                            preview.style.setProperty('width', '100%', 'important');
                            preview.style.setProperty('height', '100%', 'important');
                            preview.style.setProperty('min-height', '600px', 'important'); // Match phone-mockup height
                            // Remove any box-shadow that might create a border effect
                            phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                        }
                    } else {
                        // Frame fill style
                        phoneMockup.style.setProperty('border', 'none', 'important');
                        phoneMockup.style.setProperty('border-image', 'none', 'important');
                        phoneMockup.style.setProperty('outline', 'none', 'important');
                        phoneMockup.style.setProperty('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.3)', 'important');
                        phoneMockup.style.setProperty('padding', '8px', 'important');
                        preview.style.setProperty('border', 'none', 'important');
                        preview.style.setProperty('border-image', 'none', 'important');
                        
                        // Check gradientBorderEnabled from theme or checkbox as fallback
                        const gradientBorderEnabledImageFrame = themeToApply.gradientBorderEnabled !== undefined 
                            ? themeToApply.gradientBorderEnabled 
                            : (document.getElementById('gradient-border-toggle')?.checked || false);
                        
                        if (gradientBorderEnabledImageFrame) {
                            if (themeToApply.borderType === 'gradient') {
                                phoneMockup.style.setProperty('background', themeToApply.borderGradientText, 'important');
                            } else if (themeToApply.borderType === 'solid') {
                                // Solid color border for frame fill style with image background
                                let borderColor = themeToApply.borderColor;
                                // Fallback to color picker if not set in theme
                                if (!borderColor || borderColor === '#1f2937') {
                                    const borderColorPicker = document.getElementById('border-color-picker');
                                    if (borderColorPicker && borderColorPicker.value) {
                                        borderColor = borderColorPicker.value;
                                    } else {
                                        borderColor = '#1f2937'; // Default
                                    }
                                }
                                phoneMockup.style.setProperty('background', borderColor, 'important');
                            }
                        } else {
                            phoneMockup.style.setProperty('background', '#1f2937', 'important'); // Default dark border
                        }
                    }
                }
            }

            // Apply text color and formatting to specific text elements
            const previewName = document.getElementById('preview-name');
            // Note: preview-bio was removed, so we skip it
            if (previewName) {
                const nameColor = themeToApply.presentationColor
                    || themeToApply.profileTextColor
                    || themeToApply.textColor
                    || '#1f2937';
                const nameFont = themeToApply.presentationFont || themeToApply.descriptionFont || 'Arial';
                previewName.style.removeProperty('color');
                previewName.style.setProperty('color', nameColor);
                previewName.style.color = nameColor;
                const existingStyle = previewName.getAttribute('style') || '';
                previewName.setAttribute('style', `${existingStyle}; color: ${nameColor}; font-size: 1.75rem;`);
                previewName.style.setProperty('font-family', nameFont);
                previewName.style.setProperty('font-weight', themeToApply.descriptionBold ? 'bold' : 'normal');
                previewName.style.setProperty('font-style', themeToApply.descriptionItalic ? 'italic' : 'normal');
                previewName.style.setProperty('text-decoration', themeToApply.descriptionUnderline ? 'underline' : 'none');
                console.log('Applied presentation color to display name:', nameColor, 'font:', nameFont);
            }
            // Note: preview-bio was removed, so we skip bio formatting

            // Apply presentation information formatting
            const presentationFields = preview.querySelectorAll('.info-value');
            const presentationColor = themeToApply.presentationColor
                || themeToApply.presentationTextColor
                || themeToApply.textColor
                || '#4b5563';
            presentationFields.forEach(field => {
                field.style.removeProperty('color');
                field.style.setProperty('color', presentationColor);
                field.style.color = presentationColor;
                const currentStyle = field.getAttribute('style') || '';
                field.setAttribute('style', `${currentStyle}; color: ${presentationColor}; font-size: 1.125rem;`);
                field.style.setProperty('font-family', themeToApply.presentationFont || 'Arial');
                field.style.setProperty('font-weight', '600'); // Bold presentation information
                field.style.setProperty('font-style', themeToApply.presentationItalic ? 'italic' : 'normal');
                field.style.setProperty('text-decoration', themeToApply.presentationUnderline ? 'underline' : 'none');
            });
            console.log('Applied presentation formatting to', presentationFields.length, 'fields');

            // Apply footer color (matches profile text color)
            const footerText = preview.querySelector('.preview-footer-text');
            const footerLink = preview.querySelector('.preview-footer-text a');
            const profileColor = themeToApply.presentationColor
                || themeToApply.profileTextColor
                || themeToApply.textColor
                || '#1f2937';
            if (footerText) {
                footerText.style.setProperty('color', profileColor);
                footerText.style.color = profileColor;
                if (footerLink) {
                    footerLink.style.setProperty('color', profileColor);
                    footerLink.style.color = profileColor;
                }
            }

            const buttons = preview.querySelectorAll('.preview-link');
            console.log(`🔍 applyTheme: Found ${buttons.length} buttons, calling applyButtonStyles with theme.buttonFontSize="${themeToApply.buttonFontSize}"`);
            applyButtonStyles(buttons, themeToApply);
            
            // Log final computed font-sizes after applyButtonStyles
            buttons.forEach((button, index) => {
                const buttonText = button.textContent?.trim() || button.querySelector('.preview-link-text')?.textContent?.trim() || `button ${index}`;
                const textElement = button.querySelector('.preview-link-text');
                const computedTextSize = textElement ? window.getComputedStyle(textElement).fontSize : 'N/A';
                const computedButtonSize = window.getComputedStyle(button).fontSize;
                console.log(`🔍 applyTheme: Final computed sizes for "${buttonText.substring(0, 30)}..." - text element: ${computedTextSize}, button element: ${computedButtonSize}`);
            });
            
            // Show font size debug overlay on mobile (visible on page)
            showFontSizeDebugOverlay();
            
            // Final safeguard: re-apply styles after a short delay in case other code overrides them
            setTimeout(() => {
                const presentationFields = preview.querySelectorAll('.info-value');
                presentationFields.forEach(field => {
                    field.style.setProperty('font-size', '1.125rem');
                    field.style.setProperty('font-weight', '600');
                });
                const latestButtons = preview.querySelectorAll('.preview-link');
                console.log(`🔍 applyTheme setTimeout: Re-applying button styles to ${latestButtons.length} buttons`);
                applyButtonStyles(latestButtons, themeToApply);
                
                // Update debug overlay after setTimeout
                showFontSizeDebugOverlay();
                
                // Log final computed font-sizes after setTimeout
                latestButtons.forEach((button, index) => {
                    const buttonText = button.textContent?.trim() || button.querySelector('.preview-link-text')?.textContent?.trim() || `button ${index}`;
                    const textElement = button.querySelector('.preview-link-text');
                    const computedTextSize = textElement ? window.getComputedStyle(textElement).fontSize : 'N/A';
                    const computedButtonSize = window.getComputedStyle(button).fontSize;
                    console.log(`🔍 applyTheme setTimeout: Final computed sizes for "${buttonText.substring(0, 30)}..." - text element: ${computedTextSize}, button element: ${computedButtonSize}`);
                });
            }, 100);

        }

        // Calculate dynamic font size for display name based on text length
        // Minimum size is 1rem (same as presentation information font size)
        function calculateDisplayNameFontSize(text, maxSize = '1.75rem', minSize = '1.25rem') {
            if (!text || text.trim().length === 0) {
                return maxSize;
            }
            
            const textLength = text.length;
            const maxSizeValue = parseFloat(maxSize); // Extract numeric value
            const maxSizeUnit = maxSize.replace(/[0-9.]/g, ''); // Extract unit (rem, px, etc.)
            const minSizeValue = parseFloat(minSize); // Extract numeric value for minimum
            const minSizeUnit = minSize.replace(/[0-9.]/g, ''); // Extract unit for minimum
            
            // Convert both to pixels for comparison (assuming 1rem = 16px)
            const REM_TO_PX = 16;
            let maxSizePx, minSizePx;
            
            if (maxSizeUnit === 'rem') {
                maxSizePx = maxSizeValue * REM_TO_PX;
            } else if (maxSizeUnit === 'px') {
                maxSizePx = maxSizeValue;
            } else {
                // Default to rem if unknown unit
                maxSizePx = maxSizeValue * REM_TO_PX;
            }
            
            if (minSizeUnit === 'rem') {
                minSizePx = minSizeValue * REM_TO_PX;
            } else if (minSizeUnit === 'px') {
                minSizePx = minSizeValue;
            } else {
                // Default to rem if unknown unit
                minSizePx = minSizeValue * REM_TO_PX;
            }
            
            // Ensure minSize is not larger than maxSize
            if (minSizePx > maxSizePx) {
                minSizePx = maxSizePx;
            }
            
            // Define breakpoints for font size scaling
            // Short names (0-15 chars): use max size
            // Medium names (16-25 chars): scale down gradually
            // Long names (26+ chars): use minimum size (presentation info font size)
            let fontSizePx;
            
            if (textLength <= 15) {
                // Short names: use maximum size
                fontSizePx = maxSizePx;
            } else if (textLength <= 25) {
                // Medium names: scale down proportionally
                // Formula: maxSize - ((textLength - 15) / 10) * (maxSize - minSize)
                const scaleFactor = (textLength - 15) / 10; // 0 to 1 for 16-25 chars
                fontSizePx = maxSizePx - (scaleFactor * (maxSizePx - minSizePx));
            } else {
                // Long names: use minimum size (presentation info font size)
                fontSizePx = minSizePx;
            }
            
            // Ensure fontSize never goes below minimum
            if (fontSizePx < minSizePx) {
                fontSizePx = minSizePx;
            }
            
            // Convert back to the original maxSize unit
            let fontSize, fontSizeUnit = maxSizeUnit;
            if (maxSizeUnit === 'rem') {
                fontSize = fontSizePx / REM_TO_PX;
            } else if (maxSizeUnit === 'px') {
                fontSize = fontSizePx;
            } else {
                // Default to rem
                fontSize = fontSizePx / REM_TO_PX;
                fontSizeUnit = 'rem';
            }
            
            // Round to 2 decimal places and add unit
            return Math.round(fontSize * 100) / 100 + fontSizeUnit;
        }

        // Apply dynamic font size to display name element
        // Accepts optional theme parameter to get max font size
        // Minimum size is 1rem (same as presentation information font size in index.html)
        function applyDynamicDisplayNameSize(nameElement, themeParam) {
            if (!nameElement) return;
            
            try {
                const nameText = nameElement.textContent || '';
                // Use 1.75rem as default max size to match public.html
                // Don't use textFontSize from theme as it's meant for other text elements
                let maxSize = '1.75rem';
                
                // Ensure max size is at least 1.25rem for readability
                const maxSizeValue = parseFloat(maxSize);
                const maxSizeUnit = maxSize.replace(/[0-9.]/g, '') || 'rem';
                const minMaxSize = 1.25; // Minimum max size for readability
                
                // If somehow maxSize is smaller than 1.25rem, use 1.25rem instead
                if (maxSizeValue < minMaxSize) {
                    maxSize = minMaxSize + maxSizeUnit;
                }
                
                // Minimum size is 1.25rem to match public.html
                const minSize = '1.25rem';
                const dynamicSize = calculateDisplayNameFontSize(nameText, maxSize, minSize);
                nameElement.style.setProperty('font-size', dynamicSize, 'important');
            } catch (error) {
                console.error('Error applying dynamic display name size:', error);
                // Fallback to default size if there's an error
                nameElement.style.setProperty('font-size', '1.75rem', 'important');
            }
        }

        function isValidColor(color) {
            const s = new Option().style;
            s.color = color;
            return s.color !== '';
        }

        // Sanitize CSS value to prevent CSS injection
        // Only allows safe CSS values (colors, gradients, URLs)
        function sanitizeCSSValue(value, type = 'color') {
            if (!value || typeof value !== 'string') {
                return '';
            }
            
            // Remove any potentially dangerous characters
            value = value.trim();
            
            if (type === 'color') {
                // For colors, validate hex format or use browser validation
                if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    return value;
                }
                // Use browser validation for named colors
                const s = new Option().style;
                s.color = value;
                if (s.color !== '') {
                    return value;
                }
                return '#000000'; // Default fallback
            } else if (type === 'gradient') {
                // For gradients, only allow linear-gradient with safe syntax
                // Match: linear-gradient(angle, color1, color2, ...)
                const gradientPattern = /^linear-gradient\([^)]+\)$/i;
                if (gradientPattern.test(value)) {
                    // Further sanitize: remove any script-like content
                    if (!/javascript:|expression\(|@import|url\(javascript:/i.test(value)) {
                        return value;
                    }
                }
                return 'linear-gradient(45deg, #3b82f6, #8b5cf6)'; // Default fallback
            } else if (type === 'url') {
                // For URLs, validate they're safe
                if (/^url\(['"]?[^'"]+['"]?\)$/i.test(value)) {
                    // Remove any script-like content
                    if (!/javascript:|data:text\/html/i.test(value)) {
                        return value;
                    }
                }
                return 'url()'; // Default fallback
            }
            
            return '';
        }

        function normalizeButtonFontSize(fontSize) {
            const defaultPx = 22; // 1.375rem
            const defaultRem = `${defaultPx / 16}rem`;
            if (!fontSize) {
                console.log(`🔍 normalizeButtonFontSize: No fontSize provided, returning default: ${defaultRem}`);
                return defaultRem;
            }
            const raw = fontSize.toString().trim().toLowerCase();
            const numeric = parseFloat(raw);
            if (isNaN(numeric)) {
                console.log(`🔍 normalizeButtonFontSize: Invalid numeric value "${fontSize}", returning default: ${defaultRem}`);
                return defaultRem;
            }
            let pxValue = numeric;
            if (raw.includes('rem')) {
                pxValue = numeric * 16;
            } else if (!raw.includes('px')) {
                pxValue = numeric;
            }
            const originalPx = pxValue;
            pxValue = Math.max(pxValue, defaultPx);
            let result;
            if (raw.includes('px')) {
                result = `${pxValue}px`;
            } else {
                result = `${pxValue / 16}rem`;
            }
            console.log(`🔍 normalizeButtonFontSize: Input="${fontSize}" (${originalPx}px) -> Output="${result}" (${pxValue}px, min=${defaultPx}px)`);
            return result;
        }

        function findButtonTextElement(button) {
            if (!button) return null;
            let target = button.querySelector('.preview-link-text');
            if (!target) {
                const content = button.querySelector('.preview-link-content');
                if (content && content.children.length > 1) {
                    target = content.children[1];
                }
            }
            if (!target && button.children.length > 1) {
                const textContainer = button.children[1];
                if (textContainer) {
                    target = textContainer.querySelector('.preview-link-text') || textContainer.children[0] || null;
                }
            }
            return target || null;
        }

        function applyButtonStyles(buttons, theme) {
            if (!buttons || !buttons.length) return;
            console.log(`🔍 applyButtonStyles: Called with ${buttons.length} buttons, theme.buttonFontSize="${theme.buttonFontSize}"`);
            const fontSizeToApply = normalizeButtonFontSize(theme.buttonFontSize);
            const buttonStyle = theme.buttonStyle || 'soft';
            const buttonBackground = theme.buttonBackgroundColor || theme.buttonBgColor;
            buttons.forEach((button, index) => {
                const buttonText = button.textContent?.trim() || button.querySelector('.preview-link-text')?.textContent?.trim() || `button ${index}`;
                console.log(`🔍 applyButtonStyles: Processing button "${buttonText.substring(0, 30)}...", applying fontSize="${fontSizeToApply}"`);
                button.className = `preview-link ${buttonStyle}`;
                const textElement = findButtonTextElement(button);
                if (buttonStyle === 'solid') {
                    const solidBg = buttonBackground || '#4f46e5';
                    button.style.setProperty('background-color', solidBg, 'important');
                    button.style.setProperty('border', 'none', 'important');
                } else if (buttonStyle === 'soft') {
                    button.style.setProperty('background', 'rgba(255, 255, 255, 0.1)', 'important');
                    button.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
                    button.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
                    button.style.setProperty('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.1)', 'important');
                } else if (buttonStyle === 'outline') {
                    const outlineColor = sanitizeCSSValue(theme.buttonTextColor, 'color')
                        || sanitizeCSSValue(buttonBackground, 'color')
                        || '#4f46e5';
                        button.style.setProperty('background-color', 'transparent', 'important');
                        button.style.setProperty('border', `2px solid ${outlineColor}`, 'important');
                }
                if (theme.buttonPadding) {
                    button.style.setProperty('padding', theme.buttonPadding, 'important');
                }
                if (theme.buttonBorderRadius) {
                    const borderRadius = theme.buttonBorderRadius === '50%' ? '12px' : theme.buttonBorderRadius;
                    button.style.setProperty('border-radius', borderRadius, 'important');
                }
                // Don't set font-size on button element - only on text element
                // The button element font-size can be overridden by CSS, so we only set it on the text element
                
                if (textElement) {
                    textElement.style.setProperty('font-size', fontSizeToApply, 'important');
                    textElement.style.fontSize = fontSizeToApply;
                    
                    // Log computed font-size for text element
                    const computedTextSize = window.getComputedStyle(textElement).fontSize;
                    console.log(`🔍 applyButtonStyles: Text element font-size set to "${fontSizeToApply}", computed="${computedTextSize}"`);
                    
                    // Also check button computed size for debugging
                    const computedButtonSize = window.getComputedStyle(button).fontSize;
                    console.log(`🔍 applyButtonStyles: Button element computed font-size="${computedButtonSize}" (text element="${computedTextSize}")`);
                    
                    if (theme.buttonFontWeight) {
                        textElement.style.setProperty('font-weight', theme.buttonFontWeight);
                    }
                    if (theme.buttonTextColor) {
                        textElement.style.setProperty('color', theme.buttonTextColor, 'important');
                    }
                } else {
                    console.log(`🔍 applyButtonStyles: No textElement found for button "${buttonText.substring(0, 30)}..."`);
                }
            });
            console.log(`🔍 applyButtonStyles: Completed processing ${buttons.length} buttons`);
        }

        function handleBackgroundImageUpload(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    updateThemeProperty('backgroundImage', e.target.result);
                    updateThemeProperty('imagePosition', { x: 50, y: 50, scale: 100 }); // Default position
                    showImagePreview(e.target.result);
                    document.getElementById('image-positioning').style.display = 'block';
                    
                    // Switch to image background type if not already
                    const imageRadio = document.querySelector('input[name="bg-type"][value="image"]');
                    if (imageRadio && !imageRadio.checked) {
                        imageRadio.checked = true;
                        updateBackgroundType();
                    }
                    
                    applyTheme();
                };
                reader.readAsDataURL(file);
            }
        }

        function showImagePreview(imageUrl) {
            const preview = document.getElementById('bg-image-preview');
            const previewImg = document.getElementById('bg-image-preview-img');
            previewImg.src = imageUrl;
            preview.style.display = 'block';
        }

        function removeBackgroundImage() {
            updateThemeProperty('backgroundImage', null);
            document.getElementById('bg-image-preview').style.display = 'none';
            document.getElementById('image-positioning').style.display = 'none';
            document.getElementById('bg-image-upload').value = '';
            applyTheme();
        }
        
        // Image positioning functions
        function updateImagePosition() {
            const x = document.getElementById('position-x').value;
            const y = document.getElementById('position-y').value;
            const scale = document.getElementById('position-scale').value;
            
            document.getElementById('position-x-value').textContent = x;
            document.getElementById('position-y-value').textContent = y;
            document.getElementById('position-scale-value').textContent = scale;
            
            const backgroundImage = document.getElementById('bg-image-preview').style.backgroundImage;
            if (backgroundImage && backgroundImage !== 'none') {
                updateThemeProperty('imagePosition', { x: parseInt(x), y: parseInt(y), scale: parseInt(scale) });
                applyTheme();
            }
        }
        
        function selectImageFromLibrary() {
            // Set flag to indicate we're selecting for background
            window.selectingImageForBackground = true;
            // Open media library modal
            openMediaLibrary();
        }
        
        function setBackgroundImageFromLibrary(imageUrl) {
            updateThemeProperty('backgroundImage', imageUrl);
            updateThemeProperty('imagePosition', { x: 50, y: 50, scale: 100 }); // Default position
            showImagePreview(imageUrl);
            document.getElementById('image-positioning').style.display = 'block';
            applyTheme();
        }
        
        function useAsBackground(imageUrl) {
            // Set the background image
            setBackgroundImageFromLibrary(imageUrl);
            
            // Clear the flag
            window.selectingImageForBackground = false;
            
            // Close the media library
            closeMediaLibrary();
            
            // Switch to image background type if not already
            const imageRadio = document.querySelector('input[name="bg-type"][value="image"]');
            if (imageRadio && !imageRadio.checked) {
                imageRadio.checked = true;
                updateBackgroundType();
            }
            
            showMessage('Image set as background! Use the positioning controls to adjust.', 'success');
        }


        function resetTheme() {
            currentTheme = {
                backgroundType: 'solid',
                backgroundColor: '#ffffff',
                gradientText: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                // Page description (name/title) formatting
                descriptionText: 'alexander.towbin',
                descriptionColor: '#000000',
                descriptionFont: 'Arial',
                descriptionBold: false,
                descriptionItalic: false,
                descriptionUnderline: false,
                // Bio text formatting
                bioText: 'Welcome to my page!',
                bioColor: '#000000',
                bioFont: 'Arial',
                bioBold: false,
                bioItalic: false,
                bioUnderline: false,
                // Presentation text formatting
                presentationColor: '#000000',
                presentationFont: 'Arial',
                presentationBold: false,
                presentationItalic: false,
                presentationUnderline: false,
                // Legacy properties for backward compatibility
                textColor: '#000000',
                textFont: 'Arial',
                textBold: false,
                textItalic: false,
                textUnderline: false,
                buttonStyle: 'soft',
                buttonTextColor: '#000000',
                buttonTextFont: 'Arial',
                buttonTextBold: false,
                buttonTextItalic: false,
                buttonTextUnderline: false,
                buttonBgColor: '#3b82f6',
                backgroundImage: null,
                gradientBorder: true,
                borderType: 'solid',
                borderColor: '#1f2937',
                borderGradientText: 'linear-gradient(45deg, #8b5cf6, #06b6d4)'
            };
            
            // Reset form values
            document.querySelector('input[name="bg-type"][value="solid"]').checked = true;
            document.getElementById('bg-color').value = '#ffffff';
            document.getElementById('bg-color-text').value = '#ffffff';
            document.getElementById('gradient-text').value = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
            // Reset description formatting
            document.getElementById('description-color').value = '#000000';
            document.getElementById('description-font').value = 'Arial';
            const descEditor = document.getElementById('description-text');
            if (descEditor) {
                // Sanitize HTML to prevent XSS (allows formatting tags)
                descEditor.innerHTML = sanitizeHTML('alexander.towbin');
            }
            
            // Reset bio formatting
            document.getElementById('bio-color').value = '#000000';
            document.getElementById('bio-font').value = 'Arial';
            const bioEditor = document.getElementById('bio-text');
            if (bioEditor) {
                // Sanitize HTML to prevent XSS (allows formatting tags)
                bioEditor.innerHTML = sanitizeHTML('Welcome to my page!');
            } else {
                console.log('Bio text editor not found, skipping reset');
            }
            // Reset presentation formatting
            document.getElementById('presentation-color').value = '#000000';
            document.getElementById('presentation-font').value = 'Arial';
            document.getElementById('button-style').value = 'soft';
            document.getElementById('button-text-color').value = '#000000';
            document.getElementById('button-text-font').value = 'Arial';
            document.getElementById('button-text-bold').checked = false;
            document.getElementById('button-text-italic').checked = false;
            document.getElementById('button-text-underline').checked = false;
            document.getElementById('button-bg-color').value = '#3b82f6';
            document.getElementById('gradient-border-toggle').checked = true;
            document.getElementById('bg-image-preview').style.display = 'none';
            document.getElementById('bg-image-upload').value = '';
            
            updateBackgroundType();
            applyTheme();
            showMessage('Theme reset to default', 'success');
        }

        // Theme Management Functions
        function saveCurrentTheme() {
            const themeName = document.getElementById('theme-name').value.trim();
            if (!themeName) {
                showMessage('Please enter a theme name', 'error');
                return;
            }

            // Create a deep copy of current theme
            const themeToSave = JSON.parse(JSON.stringify(currentTheme));
            themeToSave.name = themeName;
            themeToSave.savedAt = new Date().toISOString();

            // Get existing themes from localStorage
            let savedThemes = JSON.parse(localStorage.getItem('academiq_saved_themes') || '[]');
            
            // Check if theme name already exists
            const existingIndex = savedThemes.findIndex(theme => theme.name === themeName);
            if (existingIndex !== -1) {
                if (confirm(`Theme "${themeName}" already exists. Do you want to overwrite it?`)) {
                    savedThemes[existingIndex] = themeToSave;
                } else {
                    return;
                }
            } else {
                savedThemes.push(themeToSave);
            }

            // Save to localStorage
            localStorage.setItem('academiq_saved_themes', JSON.stringify(savedThemes));
            
            // Clear the input
            document.getElementById('theme-name').value = '';
            
            // Refresh the saved themes list
            loadSavedThemes();
            
            showMessage(`Theme "${themeName}" saved successfully!`, 'success');
        }
        function loadSavedThemes() {
            const savedThemes = JSON.parse(localStorage.getItem('academiq_saved_themes') || '[]');
            const themesList = document.getElementById('saved-themes-list');
            
            if (savedThemes.length === 0) {
                themesList.innerHTML = '<p style="color: #6b7280; font-style: italic; text-align: center; padding: 20px;">No saved themes yet</p>';
                return;
            }

            themesList.innerHTML = savedThemes.map(theme => {
                const previewColor = getThemePreviewColor(theme);
                // Escape theme.name to prevent XSS in onclick attributes and innerHTML
                const escapedThemeName = escapeHtml(theme.name).replace(/'/g, "\\'");
                const escapedThemeNameDisplay = escapeHtml(theme.name);
                return `
                    <div class="saved-theme-item" onclick="loadTheme('${escapedThemeName}')">
                        <div class="saved-theme-info">
                            <div class="saved-theme-name">${escapedThemeNameDisplay}</div>
                        </div>
                        <div class="saved-theme-actions">
                            <button onclick="event.stopPropagation(); deleteTheme('${escapedThemeName}')" class="btn-icon" title="Delete">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function getThemePreviewColor(theme) {
            if (theme.backgroundType === 'solid') {
                // Sanitize color value to prevent CSS injection
                return sanitizeCSSValue(theme.backgroundColor, 'color') || '#3b82f6';
            } else if (theme.backgroundType === 'gradient') {
                // Extract first color from gradient and sanitize
                const match = theme.gradientText.match(/#[0-9A-Fa-f]{6}/);
                const color = match ? match[0] : '#3b82f6';
                return sanitizeCSSValue(color, 'color') || '#3b82f6';
            } else if (theme.backgroundType === 'image') {
                return 'linear-gradient(45deg, #8b5cf6, #06b6d4)'; // Default gradient for images
            }
            return '#3b82f6';
        }

        function loadTheme(themeName) {
            const savedThemes = JSON.parse(localStorage.getItem('academiq_saved_themes') || '[]');
            const theme = savedThemes.find(t => t.name === themeName);
            
            if (!theme) {
                showMessage('Theme not found', 'error');
                return;
            }

            // Load theme into currentTheme (excluding name and savedAt)
            const { name, savedAt, ...themeData } = theme;
            // Deep merge to ensure all properties are included
            currentTheme = JSON.parse(JSON.stringify(themeData));
            
            // Also update currentList.theme if it exists
            if (currentList) {
                currentList.theme = JSON.parse(JSON.stringify(themeData));
            }

            // Update form values - this will update all form fields
            updateFormFromTheme();
            
            // Trigger change events on key form fields to ensure currentTheme is updated
            const bgColorInput = document.getElementById('bg-color');
            if (bgColorInput && bgColorInput.value) {
                bgColorInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            const bgTypeRadio = document.querySelector(`input[name="bg-type"]:checked`);
            if (bgTypeRadio) {
                bgTypeRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // Apply the theme immediately - use the loaded theme directly
            applyTheme(themeData);
            
            // Update preview
            updatePreview();
            
            showMessage(`Theme "${themeName}" loaded and applied!`, 'success');
        }

        function updateFormFromTheme() {
            // Get theme from currentList or currentTheme
            const themeToApply = (currentList && currentList.theme) || currentTheme || {};
            
            // Update background type
            const bgTypeRadio = document.querySelector(`input[name="bg-type"][value="${themeToApply.backgroundType}"]`);
            if (bgTypeRadio) {
                bgTypeRadio.checked = true;
                updateBackgroundType();
            }

            // Update background color
            if (themeToApply.backgroundColor) {
                document.getElementById('bg-color').value = themeToApply.backgroundColor;
                document.getElementById('bg-color-text').value = themeToApply.backgroundColor;
            }

            // Update gradient
            if (themeToApply.gradientText) {
                document.getElementById('gradient-text').value = themeToApply.gradientText;
            }

            // Update description formatting
            if (themeToApply.descriptionColor) {
                const descColorPicker = document.getElementById('description-color');
                if (descColorPicker) descColorPicker.value = themeToApply.descriptionColor;
            }
            if (themeToApply.descriptionFont) {
                const descFontSelect = document.getElementById('description-font');
                if (descFontSelect) descFontSelect.value = themeToApply.descriptionFont;
            }
            if (themeToApply.descriptionText) {
                const descEditor = document.getElementById('description-text');
                if (descEditor) {
                    // Sanitize HTML to prevent XSS (allows formatting tags)
                    descEditor.innerHTML = sanitizeHTML(themeToApply.descriptionText);
                }
            }
            
            // Update bio formatting
            if (themeToApply.bioColor) {
                const bioColorPicker = document.getElementById('bio-color');
                if (bioColorPicker) bioColorPicker.value = themeToApply.bioColor;
            }
            if (themeToApply.bioFont) {
                const bioFontSelect = document.getElementById('bio-font');
                if (bioFontSelect) bioFontSelect.value = themeToApply.bioFont;
            }
            if (themeToApply.bioText) {
                const bioEditor = document.getElementById('bio-text');
                if (bioEditor) {
                    // Sanitize HTML to prevent XSS (allows formatting tags)
                    bioEditor.innerHTML = sanitizeHTML(themeToApply.bioText);
                } else {
                    console.log('Bio text editor not found, skipping bio text update');
                }
            }

            // Update presentation formatting
            if (themeToApply.presentationColor) {
                const presentationColorPicker = document.getElementById('presentation-color');
                if (presentationColorPicker) presentationColorPicker.value = themeToApply.presentationColor;
            }
            if (themeToApply.presentationFont) {
                const presentationFontSelect = document.getElementById('presentation-font');
                if (presentationFontSelect) presentationFontSelect.value = themeToApply.presentationFont;
            }

            // Update button style
            if (themeToApply.buttonStyle) {
                document.getElementById('button-style').value = themeToApply.buttonStyle;
            }

            // Update button colors and formatting
            if (themeToApply.buttonTextColor) {
                const buttonTextColorPicker = document.getElementById('button-text-color');
                const buttonTextColorText = document.getElementById('button-text-color-text');
                if (buttonTextColorPicker) {
                    buttonTextColorPicker.value = themeToApply.buttonTextColor;
                }
                if (buttonTextColorText) {
                    buttonTextColorText.value = themeToApply.buttonTextColor;
                }
                // Trigger update to ensure currentTheme is updated
                if (buttonTextColorPicker) {
                    buttonTextColorPicker.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            if (themeToApply.buttonTextFont) {
                document.getElementById('button-text-font').value = themeToApply.buttonTextFont;
            }
            if (themeToApply.buttonTextBold !== undefined) {
                document.getElementById('button-text-bold').checked = themeToApply.buttonTextBold;
            }
            if (themeToApply.buttonTextItalic !== undefined) {
                document.getElementById('button-text-italic').checked = themeToApply.buttonTextItalic;
            }
            if (themeToApply.buttonTextUnderline !== undefined) {
                document.getElementById('button-text-underline').checked = themeToApply.buttonTextUnderline;
            }
            if (themeToApply.buttonBgColor) {
                document.getElementById('button-bg-color').value = themeToApply.buttonBgColor;
            }

            // Update gradient border toggle
            if (themeToApply.gradientBorderEnabled !== undefined) {
                document.getElementById('gradient-border-toggle').checked = themeToApply.gradientBorderEnabled;
                updateGradientBorder();
            }

            // Update border type
            if (themeToApply.borderType) {
                const borderTypeRadio = document.querySelector(`input[name="border-type"][value="${themeToApply.borderType}"]`);
                if (borderTypeRadio) {
                    borderTypeRadio.checked = true;
                    updateBorderType();
                }
            }

            // Update border style
            if (themeToApply.borderStyle) {
                const borderStyleRadio = document.querySelector(`input[name="border-style"][value="${themeToApply.borderStyle}"]`);
                if (borderStyleRadio) {
                    borderStyleRadio.checked = true;
                    updateBorderStyle();
                }
            }

            // Update border color
            if (themeToApply.borderColor) {
                const borderColorPicker = document.getElementById('border-color-picker');
                const borderColorText = document.getElementById('border-color-text');
                if (borderColorPicker) {
                    borderColorPicker.value = themeToApply.borderColor;
                }
                if (borderColorText) {
                    borderColorText.value = themeToApply.borderColor;
                }
            }

            // Update border gradient
            if (themeToApply.borderGradientText) {
                document.getElementById('border-gradient-input').value = themeToApply.borderGradientText;
            }

            // Update image positioning if there's a background image
            if (themeToApply.backgroundImage) {
                showImagePreview(themeToApply.backgroundImage);
                if (themeToApply.imagePosition) {
                    document.getElementById('position-x').value = themeToApply.imagePosition.x;
                    document.getElementById('position-y').value = themeToApply.imagePosition.y;
                    document.getElementById('position-scale').value = themeToApply.imagePosition.scale;
                    document.getElementById('position-x-value').textContent = themeToApply.imagePosition.x;
                    document.getElementById('position-y-value').textContent = themeToApply.imagePosition.y;
                    document.getElementById('position-scale-value').textContent = themeToApply.imagePosition.scale;
                }
            }
        }

        function deleteTheme(themeName) {
            if (!confirm(`Are you sure you want to delete the theme "${themeName}"?`)) {
                return;
            }

            const savedThemes = JSON.parse(localStorage.getItem('academiq_saved_themes') || '[]');
            const filteredThemes = savedThemes.filter(theme => theme.name !== themeName);
            
            localStorage.setItem('academiq_saved_themes', JSON.stringify(filteredThemes));
            loadSavedThemes();
            
            showMessage(`Theme "${themeName}" deleted successfully!`, 'success');
        }

        // Visual debug overlay for font sizes (visible on mobile)
        function showFontSizeDebugOverlay() {
            // Check if debug overlay should be shown (via URL parameter or localStorage)
            const urlParams = new URLSearchParams(window.location.search);
            const showDebug = urlParams.get('debug') === 'fonts' || localStorage.getItem('showFontDebug') === 'true';
            
            if (!showDebug) return;
            
            const preview = document.querySelector('.phone-screen');
            if (!preview) return;
            
            // Remove existing overlay if any
            let overlay = document.getElementById('font-size-debug-overlay');
            if (overlay) {
                overlay.remove();
            }
            
            // Create overlay
            overlay = document.createElement('div');
            overlay.id = 'font-size-debug-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.85);
                color: #00ff00;
                padding: 12px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 11px;
                z-index: 99999;
                max-width: 300px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            
            let debugHTML = '<div style="font-weight: bold; margin-bottom: 8px; color: #ffff00;">📱 Font Sizes Debug</div>';
            
            // Check profile name
            const profileName = preview.querySelector('#preview-name, .preview-name-section h4');
            if (profileName) {
                const computed = window.getComputedStyle(profileName).fontSize;
                debugHTML += `<div>Profile Name: <span style="color: #00ffff;">${computed}</span></div>`;
            }
            
            // Check presentation info
            const presentationFields = preview.querySelectorAll('.info-value');
            if (presentationFields.length > 0) {
                const firstField = presentationFields[0];
                const computed = window.getComputedStyle(firstField).fontSize;
                debugHTML += `<div>Presentation: <span style="color: #00ffff;">${computed}</span></div>`;
            }
            
            // Check buttons
            const buttons = preview.querySelectorAll('.preview-link');
            if (buttons.length > 0) {
                const firstButton = buttons[0];
                const textElement = firstButton.querySelector('.preview-link-text');
                if (textElement) {
                    const computedText = window.getComputedStyle(textElement).fontSize;
                    const computedButton = window.getComputedStyle(firstButton).fontSize;
                    debugHTML += `<div>Button Text: <span style="color: #00ffff;">${computedText}</span></div>`;
                    debugHTML += `<div>Button Element: <span style="color: #ff8888;">${computedButton}</span></div>`;
                }
            }
            
            // Add viewport info
            debugHTML += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #444;">`;
            debugHTML += `<div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>`;
            debugHTML += `<div>Device Pixel Ratio: ${window.devicePixelRatio || 1}</div>`;
            debugHTML += `</div>`;
            
            // Add close button
            debugHTML += `<div style="margin-top: 8px; text-align: center;">`;
            debugHTML += `<button onclick="localStorage.setItem('showFontDebug', 'false'); document.getElementById('font-size-debug-overlay').remove();" style="background: #ff4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">Close</button>`;
            debugHTML += `</div>`;
            
            overlay.innerHTML = debugHTML;
            document.body.appendChild(overlay);
        }
        
        // Enable debug overlay with ?debug=fonts in URL or tap 5 times on preview
        let tapCount = 0;
        let lastTapTime = 0;
        document.addEventListener('click', function(e) {
            const preview = document.querySelector('.phone-screen');
            if (preview && preview.contains(e.target)) {
                const now = Date.now();
                if (now - lastTapTime < 500) {
                    tapCount++;
                } else {
                    tapCount = 1;
                }
                lastTapTime = now;
                
                if (tapCount >= 5) {
                    localStorage.setItem('showFontDebug', 'true');
                    showFontSizeDebugOverlay();
                    tapCount = 0;
                }
            }
        });
        
        // Initialize saved themes list when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Load saved themes after a short delay to ensure the DOM is ready
            setTimeout(loadSavedThemes, 1000);
            
            // Check for debug parameter on load
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debug') === 'fonts') {
                localStorage.setItem('showFontDebug', 'true');
                setTimeout(showFontSizeDebugOverlay, 2000);
            }
        });
    