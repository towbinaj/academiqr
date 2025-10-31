# AcademiQR Database Setup Guide

## Prerequisites
- Supabase account and project
- Access to Supabase SQL Editor

## Step 1: Run Essential Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `essential-schema.sql`
4. Click **Run** to execute the SQL commands

## Step 2: Verify Tables Created
After running the schema, verify these tables exist:
- `profiles` - User profile information
- `analytics` - Click/view tracking data
- `collections` - Link collections (with new columns)
- `links` - Individual links (with new columns)

## Step 3: Test the Application
1. Try creating a new account
2. Create a collection with description and visibility settings
3. Add links with descriptions and images
4. Check if profile data saves correctly

## Expected New Columns

### Collections Table
- `description` (TEXT) - Collection description
- `visibility` (TEXT) - 'public', 'unlisted', or 'private'
- `passkey` (TEXT) - Optional passkey for security
- `updated_at` (TIMESTAMP) - Last update time

### Links Table
- `description` (TEXT) - Link description
- `image_url` (TEXT) - Link image URL
- `visible` (BOOLEAN) - Whether link is visible
- `updated_at` (TIMESTAMP) - Last update time

### Profiles Table
- `display_name` (TEXT) - User's display name
- `bio` (TEXT) - User bio
- `social_*` (TEXT) - Social media links
- `profile_photo_url` (TEXT) - Profile photo URL
- `*_color` (TEXT) - Theme colors
- `background_*` (TEXT) - Background settings

### Analytics Table
- `collection_id` (UUID) - Reference to collection
- `event_type` (TEXT) - 'view' or 'click'
- `link_id` (UUID) - Reference to specific link
- `user_agent` (TEXT) - Browser info
- `ip_address` (TEXT) - User IP
- `referrer` (TEXT) - Where user came from

## Troubleshooting

### If you get permission errors:
1. Make sure you're logged in as the project owner
2. Check that RLS policies are created correctly
3. Verify the `auth.users` table exists

### If tables don't appear:
1. Refresh the Supabase dashboard
2. Check the SQL Editor for error messages
3. Run the commands one by one instead of all at once

### If the app still shows errors:
1. Check browser console for specific error messages
2. Verify the table names match exactly
3. Ensure all required columns exist

## Next Steps
After the database is set up, the application should be fully functional with:
- ✅ Profile management
- ✅ Collection descriptions and visibility
- ✅ Link descriptions and images
- ✅ Analytics tracking
- ✅ Theme customization



