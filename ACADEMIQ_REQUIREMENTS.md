# Academiq - Link-in-Bio Platform Requirements & Instructions

## 🎯 Project Overview
**Academiq** is a modern, professional link-in-bio platform similar to Linktree, designed for creating multiple customizable link lists with advanced theming, analytics, and media management capabilities.

---

## 🏗️ Technical Architecture

### Backend Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **File Storage**: Supabase Storage
- **Hosting**: Vercel
- **Frontend**: Vanilla HTML, CSS, JavaScript (with potential for lightweight framework later)

### Database Schema
```sql
-- Core Tables
- profiles (user information)
- link_lists (user's link collections)
- link_items (individual links within lists)
- analytics_events (click tracking and analytics)

-- Storage Buckets
- media-library (user uploaded images)
- link-images (link-specific images)
```

---

## 👤 User Management & Authentication

### Authentication Methods
- ✅ Email/Password registration and login
- ✅ Google OAuth integration
- ✅ Session management with Supabase
- ✅ Email verification (can be disabled for development)

### User Profiles
- ✅ User profile management
- ✅ Profile photo upload with cropping options
- ✅ Display name and bio customization
- ✅ Rich text editor for bio descriptions (500 character limit)

---

## 🔗 Link Management System

### Link Creation & Editing
- ✅ Add unlimited links to each list
- ✅ Link properties:
  - Title (required)
  - URL (required)
  - Description (optional)
  - Key image (optional, uploaded to cloud storage)
  - Visibility toggle (public/private)
  - Scheduling (start/end date-time with timezone)
- ✅ Links always open in new tab
- ✅ Manual entry only (no bulk import)

### Link Organization
- ✅ Drag-and-drop reordering with visual feedback
- ✅ Drag handle for easy manipulation
- ✅ "Move to top/bottom" options
- ✅ "Sort alphabetically" option
- ✅ Smooth drag animations (no rotation, minimal scaling)

---

## 🎨 Advanced Theming System

### Theme Presets
- ✅ Light theme
- ✅ Dark theme
- ✅ Gradient themes
- ✅ Colorful themes
- ✅ Sunset theme
- ✅ Ocean theme

### Custom Styling Options
- ✅ Background types:
  - Solid color with color picker
  - Gradient with advanced editor
  - Image upload with positioning options
- ✅ Gradient customization:
  - Quick gradient presets
  - Custom gradient text input
  - Dynamic color stops editor
  - Direction controls (angles, directions)
  - Copy gradient CSS functionality
- ✅ Text color with auto-contrast
- ✅ Image background options:
  - Position controls (center, top, bottom, left, right)
  - Size options (cover, contain, stretch)
  - Blur effect toggle

### Layout Options
- ✅ "Buttons" layout (standard link buttons)
- ✅ "Grid" layout (image-only display)
- ✅ Layout toggle in live preview

---

## 📱 Media Library System

### File Management
- ✅ Support for JPG, PNG, GIF, WebP, TIF formats
- ✅ Thumbnail grid view with rows
- ✅ Lightbox effect around images
- ✅ Folder organization system
- ✅ Search functionality
- ✅ Bulk operations support

### Image Editing
- ✅ Crop tool with selection box
- ✅ Rotation controls
- ✅ Filter options
- ✅ Single editor modal at a time
- ✅ 5x thumbnail size in editor
- ✅ Always-visible edit/delete buttons on thumbnails

### File Operations
- ✅ Upload to cloud storage
- ✅ Delete with confirmation
- ✅ Rename functionality
- ✅ Move between folders

---

## 📊 Analytics & Insights

### Tracking Capabilities
- ✅ Click tracking per link
- ✅ Impression tracking
- ✅ Per-link analytics
- ✅ Anonymous data collection
- ✅ No data retention limits
- ✅ Export to CSV functionality
- ✅ Email reports

### Analytics Dashboard
- ✅ Run chart visualization
- ✅ User-defined date boundaries
- ✅ Last week, month, year filters
- ✅ Real-time data refresh on page load

---

## 🔒 Privacy & Security

### List Visibility Levels
- ✅ Public (accessible via URL)
- ✅ Unlisted (requires direct link)
- ✅ Private (owner only)
- ✅ Passkey-protected (password required)

### URL Structure
- ✅ Public URLs: `/u/{username}/{projectname}`
- ✅ Custom slug support
- ✅ Public toggle for each list

### Security Features
- ✅ Row Level Security (RLS) in Supabase
- ✅ Passkey access via modal
- ✅ Session-based passkey memory
- ✅ Secure file uploads

---

## 🎨 User Interface Requirements

### Design System
- ✅ Modern, professional design language
- ✅ Glass morphism effects
- ✅ Gradient backgrounds and buttons
- ✅ Consistent color coding
- ✅ Large, touch-friendly elements
- ✅ Smooth animations and transitions

### Editor Interface
- ✅ Split-panel layout (controls left, preview right)
- ✅ Accordion-style sections
- ✅ Live preview updates
- ✅ Mobile preview toggle
- ✅ Device size simulation

### Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet and desktop optimization
- ✅ Touch-friendly interactions
- ✅ Adaptive layouts

---

## ⚡ User Experience Features

### Editor Functionality
- ✅ Auto-save changes
- ✅ Undo/redo functionality
- ✅ Keyboard shortcuts (Ctrl+S, Ctrl+N, Delete)
- ✅ Rich text editor with formatting tools
- ✅ Character count with visual indicators

### Preview System
- ✅ Live phone preview
- ✅ Theme switching in preview
- ✅ Real-time updates
- ✅ Multiple device size options

### Customization Options
- ✅ Custom favicons per list
- ✅ Dark mode for editor interface
- ✅ Professional theming system
- ✅ No custom CSS injection (UI-only styling)

---

## 🚀 Deployment & Scalability

### Initial Setup
- ✅ Single admin user
- ✅ Scalable architecture for multi-user support
- ✅ Environment variable configuration
- ✅ Supabase project setup

### Future Scalability
- ✅ Multi-user support ready
- ✅ Database optimization
- ✅ CDN integration ready
- ✅ API rate limiting prepared

---

## 📋 Development Instructions

### Setup Process
1. **Environment Setup**
   - Install Node.js LTS
   - Set up Supabase account and project
   - Configure environment variables
   - Install dependencies

2. **Database Setup**
   - Run schema.sql in Supabase
   - Configure RLS policies
   - Set up storage buckets
   - Test authentication

3. **Development Server**
   - Use Vite for development
   - Configure build settings
   - Set up hot reload

### File Structure
```
academiq/
├── academiq.html (main application)
├── package.json
├── vite.config.js
├── .env.local
├── .gitignore
└── schema.sql
```

### Key Features Implementation
- ✅ Drag-and-drop with HTML5 API
- ✅ Rich text editor with execCommand
- ✅ Image editing with Canvas API
- ✅ Gradient parsing and manipulation
- ✅ Color contrast calculation
- ✅ Accordion functionality
- ✅ Theme management system

---

## 🎯 Success Criteria

### Functional Requirements
- ✅ Create and manage multiple link lists
- ✅ Customize appearance with professional theming
- ✅ Upload and manage media files
- ✅ Track analytics and generate reports
- ✅ Secure access control for private lists

### Performance Requirements
- ✅ Fast page load times
- ✅ Smooth drag-and-drop interactions
- ✅ Responsive image handling
- ✅ Efficient database queries

### User Experience Requirements
- ✅ Intuitive, modern interface
- ✅ Professional design aesthetic
- ✅ Mobile-friendly interactions
- ✅ Accessible design patterns

---

## 🔧 Technical Notes

### Known Issues Resolved
- ✅ Node.js PATH configuration
- ✅ Supabase connectivity issues
- ✅ Drag-and-drop event handling
- ✅ Image editor functionality
- ✅ Button visibility in media library
- ✅ Professional theming system

### Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ Canvas API support required
- ✅ CSS Grid and Flexbox support

---

*This document represents the complete requirements and implementation status for the Academiq link-in-bio platform as of the current development phase.*


