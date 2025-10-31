# AcademiQR Analytics Setup Guide

This guide explains how to set up the complete analytics tracking system for AcademiQR.

## Overview

The analytics system tracks:
- **Link Clicks**: Every time someone clicks on a link in your collection
- **Page Views**: Every time someone views your link collection page
- **Visitor Data**: Device type, browser, OS, location, referrer, UTM parameters

## Architecture

```
User clicks link → Tracking URL → Edge Function → Records analytics → Redirects to destination
```

**URL Flow:**
1. Public page: `https://academiqr.com/username/slug`
2. Link click: `https://academiqr.com/api/track/{link-id}`
3. Edge function records the click
4. User is redirected to the actual destination URL

---

## Step 1: Database Setup

### Run the SQL Script

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `create_analytics_tables.sql`
5. Click **Run** (or press Ctrl+Enter)

This creates:
- `link_clicks` table - tracks individual link clicks
- `page_views` table - tracks page views
- Indexes for performance
- Row Level Security policies

### Verify Tables Created

In the Supabase Dashboard:
1. Go to **Table Editor**
2. You should see `link_clicks` and `page_views` tables

---

## Step 2: Deploy Supabase Edge Function

### Prerequisites

Install Supabase CLI:
```bash
npm install -g supabase
```

### Setup

1. **Initialize Supabase in your project** (if not already done):
```bash
supabase init
```

2. **Create the function directory**:
```bash
mkdir -p supabase/functions/track-click
```

3. **Copy the function code**:
Copy the contents of `supabase_edge_function_track_click.ts` to:
```
supabase/functions/track-click/index.ts
```

4. **Deploy the function**:
```bash
supabase functions deploy track-click --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference ID (found in Project Settings).

### Environment Variables

The edge function automatically has access to:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (has admin access)

No additional configuration needed!

### Test the Function

Test with curl:
```bash
curl -i https://YOUR_PROJECT_REF.supabase.co/functions/v1/track-click/YOUR_LINK_ID
```

You should be redirected to the link's destination URL, and a record should appear in the `link_clicks` table.

---

## Step 3: Configure Domain Routing (Production)

For the clean URL structure to work, you need to set up routing:

### Option A: Netlify

Create a `_redirects` file in your public directory:
```
/api/track/*  https://YOUR_PROJECT_REF.supabase.co/functions/v1/track-click/:splat  200
/:username/:slug  /index.html  200
```

### Option B: Vercel

Create a `vercel.json` file:
```json
{
  "rewrites": [
    {
      "source": "/api/track/:path*",
      "destination": "https://YOUR_PROJECT_REF.supabase.co/functions/v1/track-click/:path*"
    },
    {
      "source": "/:username/:slug",
      "destination": "/index.html"
    }
  ]
}
```

### Option C: Cloudflare Pages

Create a `_redirects` file:
```
/api/track/*  https://YOUR_PROJECT_REF.supabase.co/functions/v1/track-click/:splat  200
/:username/:slug  /index.html  200
```

---

## Step 4: Update Your Domain

Update the URLs in your code to use your actual domain:

Replace `https://academiqr.com` with your actual domain throughout the code.

**Files to update:**
- Search for `academiqr.com` in `academiq-minimal.html`
- Replace with your domain (e.g., `yoursite.com`)

---

## How It Works

### Link Click Tracking

1. User visits: `https://academiqr.com/alexander.towbin/conference-links`
2. They see your link list page
3. They click a link which goes to: `https://academiqr.com/api/track/abc-123-def`
4. Request hits the edge function
5. Function records:
   - Link ID
   - Timestamp
   - IP address
   - User agent (browser, OS, device type)
   - Referrer
   - UTM parameters (if present)
6. Function redirects to actual destination URL
7. User arrives at destination (e.g., https://cnn.com)

### Page View Tracking

You can add page view tracking to your public page by calling:
```javascript
fetch('https://academiqr.com/api/page-view', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    list_id: 'your-list-id',
    owner_id: 'owner-user-id'
  })
});
```

---

## Analytics Dashboard

To view your analytics, query the database:

### Total Clicks Per Link
```sql
SELECT 
  li.title,
  COUNT(*) as total_clicks
FROM link_clicks lc
JOIN link_items li ON lc.link_id = li.id
WHERE lc.owner_id = 'your-user-id'
GROUP BY li.title
ORDER BY total_clicks DESC;
```

### Clicks by Device Type
```sql
SELECT 
  device_type,
  COUNT(*) as clicks
FROM link_clicks
WHERE owner_id = 'your-user-id'
GROUP BY device_type;
```

### Recent Clicks
```sql
SELECT 
  li.title,
  lc.clicked_at,
  lc.device_type,
  lc.browser,
  lc.referrer
FROM link_clicks lc
JOIN link_items li ON lc.link_id = li.id
WHERE lc.owner_id = 'your-user-id'
ORDER BY lc.clicked_at DESC
LIMIT 50;
```

---

## Security Notes

1. **Row Level Security (RLS)** is enabled on both tables
2. **Anyone can INSERT** (for tracking)
3. **Only owners can SELECT** (view their own analytics)
4. The edge function uses the **service role key** to bypass RLS for inserts

---

## Performance Considerations

1. **Fire and forget**: Analytics recording doesn't block the redirect
2. **Indexed queries**: All common queries are optimized with indexes
3. **Minimal data collection**: Only essential information is stored

---

## Privacy Compliance

To comply with GDPR/CCPA:

1. **Add privacy policy**: Inform users about data collection
2. **Anonymize IPs**: Consider hashing IP addresses
3. **Data retention**: Set up automatic deletion of old records
4. **Cookie consent**: Add banner if required in your jurisdiction

### Optional: Anonymize IP Addresses

Update the edge function to hash IPs:
```typescript
import { createHash } from 'https://deno.land/std@0.168.0/hash/mod.ts';

const hashedIP = createHash('sha256')
  .update(ipAddress + 'YOUR_SALT')
  .toString();
```

---

## Troubleshooting

### Edge Function Not Working

1. Check logs:
```bash
supabase functions logs track-click --project-ref YOUR_PROJECT_REF
```

2. Verify environment variables are set
3. Check CORS headers if calling from browser

### Analytics Not Recording

1. Check RLS policies are enabled
2. Verify tables exist
3. Check edge function logs for errors

### Redirects Not Working

1. Verify destination URL is valid
2. Check function returns 302 status
3. Test with curl to see raw response

---

## Next Steps

1. Build an analytics dashboard in your app
2. Add charts and visualizations
3. Set up email reports
4. Add geolocation data (using a service like ipapi.co)
5. Track conversion events

---

## Support

For issues or questions:
- Check Supabase logs
- Review database policies
- Test edge function directly
- Check browser console for errors





