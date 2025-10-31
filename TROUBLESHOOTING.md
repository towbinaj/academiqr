# AcademiQR Database Troubleshooting

## Error: "relation 'collections' does not exist"

This error means the database tables haven't been created yet. Here's how to fix it:

### Option 1: Run Complete Schema (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `basic-schema.sql`
4. Click **Run** to execute all commands at once

### Option 2: Run Step-by-Step (If Option 1 fails)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `step-by-step-schema.sql`
4. Run each step individually (copy one step at a time)

### Option 3: Manual Table Creation
If the above options don't work, create tables manually:

1. **Create collections table:**
```sql
CREATE TABLE collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT DEFAULT 'private',
    passkey TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Create links table:**
```sql
CREATE TABLE links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    visible BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. **Create profiles table:**
```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    bio TEXT,
    social_email TEXT,
    social_instagram TEXT,
    social_twitter TEXT,
    social_linkedin TEXT,
    social_facebook TEXT,
    social_youtube TEXT,
    social_tiktok TEXT,
    social_snapchat TEXT,
    profile_photo_url TEXT,
    background_type TEXT DEFAULT 'solid',
    background_color TEXT DEFAULT '#ffffff',
    gradient_color1 TEXT DEFAULT '#667eea',
    gradient_color2 TEXT DEFAULT '#764ba2',
    text_color TEXT DEFAULT '#1f2937',
    link_color TEXT DEFAULT '#3b82f6',
    button_style TEXT DEFAULT 'solid',
    button_color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. **Create analytics table:**
```sql
CREATE TABLE analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Verify Tables Exist
After creating tables, verify they exist:
1. Go to **Table Editor** in Supabase
2. You should see: `collections`, `links`, `profiles`, `analytics`
3. If tables are missing, check the SQL Editor for error messages

### Test the Application
1. Open `database-checker.html` in your browser
2. Click "Check Database"
3. All checks should show green ✅

### Common Issues

**Permission Denied:**
- Make sure you're logged in as the project owner
- Check that you have admin access to the Supabase project

**Syntax Errors:**
- Copy the SQL exactly as provided
- Don't modify the SQL commands
- Run commands one at a time if needed

**Tables Still Missing:**
- Check the SQL Editor for error messages
- Verify you're in the correct Supabase project
- Try refreshing the Supabase dashboard

### Still Having Issues?
1. Check the browser console for specific error messages
2. Verify your Supabase URL and API key are correct
3. Make sure you have the latest version of the application files



