# AcademiQR Setup Guide

## 🚀 Quick Start

### 1. Database Setup
Run these SQL scripts in your Supabase SQL Editor in order:

1. **`add-theme-columns.sql`** - Adds missing theme columns to profiles table
2. **`setup-storage.sql`** - Creates storage bucket for profile photos

### 2. Files Overview
- **`index.html`** - Main application (login, profile management, collections)
- **`public.html`** - Public profile viewing page
- **`profile-debug.html`** - Diagnostic tool for troubleshooting
- **`database-checker.html`** - Database schema verification tool

## ✨ Features Implemented

### ✅ Core Features
- **User Authentication** - Login/Register with Supabase Auth
- **Profile Management** - Display name, social links, profile photo
- **Collection Management** - Create, edit, delete collections
- **Link Management** - Add, edit, delete links with drag & drop reordering
- **QR Code Generation** - Generate QR codes for collections
- **Analytics Tracking** - Click tracking for links
- **Appearance Customization** - Themes, colors, fonts

### ✅ Advanced Features
- **Image Upload** - Profile photos stored in Supabase Storage
- **Collection Deletion** - Properly deletes collections and all associated links
- **Public Viewing** - Share profiles via `public.html?handle=yourhandle`
- **Error Handling** - Comprehensive error messages and validation
- **Responsive Design** - Works on desktop and mobile

## 🔧 How to Use

### For Users
1. **Open `index.html`** in your browser
2. **Register/Login** with your email
3. **Set up your profile** with display name and social links
4. **Create collections** and add links
5. **Share your profile** using the public URL

### For Public Sharing
- **URL Format**: `public.html?handle=yourhandle`
- **Example**: `public.html?handle=alextowbin1234`
- **QR Code** automatically generated for easy sharing

### For Troubleshooting
- **Use `profile-debug.html`** to check database issues
- **Use `database-checker.html`** to verify table schemas
- **Check browser console** for detailed error messages

## 🗄️ Database Schema

### Required Tables
- **`profiles`** - User profile information
- **`collections`** - Link collections
- **`links`** - Individual links
- **`analytics`** - Click tracking data

### Required Storage Buckets
- **`profile-photos`** - User profile images

## 🔐 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Storage Policies** - Secure file upload/download
- **Input Validation** - File type and size validation
- **XSS Protection** - Proper HTML escaping

## 📱 Mobile Support

- **Responsive Design** - Adapts to all screen sizes
- **Touch Gestures** - Drag and drop works on mobile
- **Optimized UI** - Mobile-friendly buttons and layouts

## 🎨 Customization

### Profile Themes
- Background types (solid, gradient, image)
- Color schemes
- Font styles
- Button designs

### Collection Settings
- Public/Private visibility
- Custom descriptions
- Link ordering

## 🚨 Troubleshooting

### Common Issues

1. **Profile not saving**
   - Check if `handle` column exists in profiles table
   - Run `add-theme-columns.sql`

2. **Images not uploading**
   - Check if `profile-photos` storage bucket exists
   - Run `setup-storage.sql`

3. **Collections not loading**
   - Verify RLS policies are set up correctly
   - Check browser console for errors

4. **Public page not working**
   - Ensure collections are marked as public
   - Check handle parameter in URL

### Debug Tools
- **`profile-debug.html`** - Test profile operations
- **`database-checker.html`** - Verify database setup
- **Browser Console** - Check for JavaScript errors

## 🔄 Next Steps

The application is now fully functional! You can:

1. **Deploy to a web server** (GitHub Pages, Netlify, Vercel)
2. **Add custom domain** for your public profiles
3. **Customize the design** further
4. **Add more features** as needed

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Use the debug tools provided
3. Verify your database setup
4. Check that all SQL scripts have been run

---

**AcademiQR** - Your complete link-in-bio solution! 🎉



