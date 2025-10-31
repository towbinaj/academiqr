# AcademiQR v0.3.4

A beautiful, feature-rich link-in-bio builder designed for academics, researchers, and professionals.

![Version](https://img.shields.io/badge/version-0.3.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

AcademiQR helps you create and share beautiful, branded link collections for conferences, presentations, and professional networking. Perfect for academics who want to share multiple resources with their audience.

**Live URL Structure:** `https://academiqr.com/username/collection-name`

---

## ✨ Key Features

### 📊 Analytics Tracking (NEW in v0.3.4)
- **Complete link click tracking** with visitor data
- Device type detection (mobile/tablet/desktop)
- Browser and OS information
- UTM parameter support
- Referrer tracking
- Geographic data (optional)

### 🔗 Link Management
- Unlimited link collections
- Drag-and-drop reordering
- Custom link titles and URLs
- URL validation and auto-correction
- Link images with positioning/scaling
- Individual link styling

### 🎨 Beautiful Theming
- **Backgrounds:** Solid colors, gradients, or custom images
- **Button styles:** Soft, hard, or outline
- **Color presets:** 24 professional colors
- **Border options:** Frame fill or thin border
- **Live preview:** See changes in real-time

### 📱 QR Code Generation
- Multiple pattern styles (square, rounded, dots, extra-rounded)
- Custom colors and backgrounds
- Logo overlay support
- Download as PNG or SVG
- Style persistence

### 👤 Professional Profile
- Profile photo with positioning
- Display name customization
- Social media links (Instagram, Twitter/X, Facebook, LinkedIn, YouTube, TikTok, Snapchat, Email)
- Presentation information (title, conference, location, date)
- Display toggles for privacy

### 🔒 Privacy & Security
- Public, private, or passkey-protected collections
- Supabase authentication
- Row Level Security
- GDPR-ready analytics

### 🖼️ Media Library
- Upload and manage images
- Image compression
- Select images for links, QR logos, or backgrounds
- Organized grid view

---

## 🚀 Quick Start

### Prerequisites
- Supabase account (free tier works)
- Modern web browser
- (Optional) Domain for deployment

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/academiqr.git
cd academiqr
```

### 2. Setup Supabase

**a) Create a Supabase Project:**
1. Go to https://supabase.com
2. Create a new project
3. Note your project URL and anon key

**b) Update Configuration:**
Edit `academiq-minimal.html` and replace:
```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

**c) Run Database Migrations:**

In Supabase SQL Editor, run these scripts in order:
1. `create_analytics_tables_safe.sql` - Creates analytics tables
2. `add_social_columns.sql` - Adds social media fields
3. `add_profile_photo_position.sql` - Adds profile photo positioning
4. `add_qr_code_data.sql` - Adds QR code settings

### 3. Deploy (Optional)

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 4. Setup Analytics (Optional but Recommended)

See `ANALYTICS_SETUP.md` for complete instructions.

**Quick steps:**
1. Deploy Supabase Edge Function
2. Configure domain routing
3. Start tracking clicks!

---

## 📖 Documentation

- **[CHANGELOG.md](CHANGELOG.md)** - Version history and updates
- **[ANALYTICS_SETUP.md](ANALYTICS_SETUP.md)** - Complete analytics setup guide
- **[ANALYTICS_SUMMARY.md](ANALYTICS_SUMMARY.md)** - Quick analytics reference

---

## 🗂️ Project Structure

```
academiqr/
├── academiq-minimal.html          # Main application (single file)
├── create_analytics_tables_safe.sql    # Analytics database schema
├── supabase_edge_function_track_click.ts   # Tracking edge function
├── add_social_columns.sql         # Social media fields migration
├── add_profile_photo_position.sql # Profile photo migration
├── add_qr_code_data.sql          # QR code settings migration
├── ANALYTICS_SETUP.md            # Analytics setup guide
├── ANALYTICS_SUMMARY.md          # Quick reference
├── CHANGELOG.md                  # Version history
└── README_ACADEMIQR.md           # This file
```

---

## 💡 Usage Examples

### Creating a Collection
1. Log in with your email
2. Click "New Collection"
3. Enter presentation info (title, conference)
4. Add links with titles and URLs
5. Customize theme and styling
6. Share your public URL!

### Tracking Analytics
```sql
-- View your most clicked links
SELECT 
  li.title,
  COUNT(*) as clicks
FROM link_clicks lc
JOIN link_items li ON lc.link_id = li.id
WHERE lc.owner_id = auth.uid()
GROUP BY li.title
ORDER BY clicks DESC;
```

### Generating QR Codes
1. Go to QR Code tab
2. Customize style and colors
3. Add your logo (optional)
4. Download PNG or SVG
5. Print for your poster!

---

## 🎨 Customization

### Color Schemes
Choose from 24 preset colors or enter custom hex codes for:
- Background colors
- Button text
- Button background
- Border colors
- Presentation text

### Button Styles
- **Soft:** Rounded corners, subtle appearance
- **Hard:** Sharp corners, bold presence
- **Outline:** Border only, minimal design

### Border Options
- **Frame Fill:** Border fills the entire preview frame
- **Thin Border:** 8px inset border for subtle framing

---

## 🔧 Configuration

### Supabase Tables
- `profiles` - User profiles and settings
- `link_lists` - Collections/link lists
- `link_items` - Individual links
- `link_clicks` - Analytics click tracking
- `page_views` - Analytics page views

### Environment Variables (Edge Function)
```bash
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## 📊 Analytics Features

### What's Tracked
✅ Link clicks with timestamps  
✅ Device type (mobile/tablet/desktop)  
✅ Browser (Chrome, Safari, Firefox, Edge)  
✅ Operating system  
✅ IP address  
✅ Referrer URL  
✅ UTM parameters (source, medium, campaign)  
✅ Response time  

### Privacy Compliance
- Row Level Security enabled
- Users only see their own data
- Optional IP anonymization
- GDPR/CCPA ready

---

## 🛠️ Development

### Running Locally
```bash
# No build process required!
# Just open academiq-minimal.html in your browser

# Or use a local server:
python -m http.server 8000
# Visit http://localhost:8000
```

### Testing Analytics
```bash
# Test edge function with curl
curl -i https://YOUR_PROJECT.supabase.co/functions/v1/track-click/LINK_ID
```

---

## 🚧 Roadmap

### v0.4.0 (Planned)
- [ ] Analytics dashboard in app
- [ ] Charts and visualizations
- [ ] Export data to CSV
- [ ] Email reports
- [ ] Geolocation tracking

### Future
- [ ] Custom domains
- [ ] A/B testing
- [ ] Link scheduling
- [ ] Team collaboration
- [ ] API access
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Keep the single-file architecture
2. Test on multiple browsers
3. Update documentation
4. Follow existing code style
5. Add version notes to CHANGELOG.md

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

### Common Issues

**Links not tracking?**
- Verify edge function is deployed
- Check domain routing configuration
- Ensure database tables exist

**QR codes not generating?**
- Check browser console for errors
- Verify QRCode.js library loaded
- Try different pattern styles

**Images not uploading?**
- Check file size (max 5MB recommended)
- Verify image format (JPG, PNG, GIF, WEBP)
- Clear browser cache

### Getting Help
- Check documentation files
- Review Supabase logs
- Open an issue on GitHub
- Email: support@academiqr.com

---

## 🎓 About

Created for academics, researchers, and professionals who want to share their work beautifully.

**Version:** 0.3.4  
**Last Updated:** October 24, 2025  
**Author:** AcademiQR Team

---

## ⭐ Acknowledgments

- [Supabase](https://supabase.com) - Backend and authentication
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/) - QR code generation
- [Font Awesome](https://fontawesome.com) - Social media icons

---

**Made with ❤️ for the academic community**





