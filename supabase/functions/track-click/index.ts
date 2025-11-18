// Supabase Edge Function: track-click
// This function tracks link clicks and redirects to the destination URL
// Deploy this to: supabase/functions/track-click/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const tablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  
  let deviceType = 'desktop';
  if (mobile && !tablet) deviceType = 'mobile';
  if (tablet) deviceType = 'tablet';
  
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  return { deviceType, browser, os };
}

// Helper function to extract UTM parameters
function extractUTMParams(url: URL) {
  return {
    utm_source: url.searchParams.get('utm_source'),
    utm_medium: url.searchParams.get('utm_medium'),
    utm_campaign: url.searchParams.get('utm_campaign'),
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const startTime = Date.now();
    const url = new URL(req.url);
    
    // CSRF Protection: Validate request origin/referer
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const allowedDomains = [
      'https://academiqr.com',
      'https://www.academiqr.com',
      // Allow direct links (no origin/referer) - these are legitimate user clicks
    ];
    
    // Check if request comes from allowed domain
    const isValidOrigin = origin && allowedDomains.some(domain => origin.startsWith(domain));
    const isValidReferer = referer && allowedDomains.some(domain => referer.startsWith(domain));
    
    // Block if origin/referer present but invalid (potential CSRF attack)
    // Allow requests with no origin/referer (direct link clicks from email, etc.)
    if ((origin && !isValidOrigin) || (referer && !isValidReferer)) {
      console.warn('CSRF attempt blocked:', { origin, referer, url: req.url });
      return new Response(
        JSON.stringify({ error: 'Invalid request origin' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract link ID from path: /track-click/link-id-here
    const pathParts = url.pathname.split('/').filter(p => p);
    const linkId = pathParts[pathParts.length - 1];
    
    if (!linkId) {
      return new Response(
        JSON.stringify({ error: 'Link ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase credentials from environment variables
    // In Supabase edge functions, these are automatically available
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 
                       Deno.env.get('SUPABASE_SERVICE_URL') || 
                       '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Log for debugging (remove in production)
    console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
    console.log('Service Key:', supabaseServiceKey ? 'Found' : 'Missing');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      console.error('Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ error: 'Server configuration error', details: 'Missing Supabase credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get link details
    const { data: link, error: linkError } = await supabase
      .from('link_items')
      .select('id, url, list_id, link_lists(owner_id)')
      .eq('id', linkId)
      .single();

    if (linkError || !link) {
      console.error('Link not found:', linkError);
      return new Response(
        JSON.stringify({ error: 'Link not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const destinationUrl = link.url;
    const listId = link.list_id;
    
    // Extract owner_id from the joined link_lists
    // Handle both object and array formats from Supabase join
    let ownerId: string | null = null;
    if (link.link_lists) {
      if (Array.isArray(link.link_lists) && link.link_lists.length > 0) {
        ownerId = link.link_lists[0].owner_id;
      } else if (typeof link.link_lists === 'object' && 'owner_id' in link.link_lists) {
        ownerId = (link.link_lists as any).owner_id;
      }
    }
    
    // Log for debugging
    console.log('Link details:', {
      linkId,
      destinationUrl,
      listId,
      ownerId,
      link_lists: link.link_lists
    });
    
    if (!ownerId) {
      console.error('Could not determine owner_id from link:', link);
      return new Response(
        JSON.stringify({ error: 'Could not determine link owner' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse visitor information
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    const referrer = req.headers.get('referer') || null;
    const ipAddress = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'Unknown';

    // Extract UTM parameters
    const utmParams = extractUTMParams(url);

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Check for recent duplicate click (same link, same IP, within 5 seconds)
    // This prevents accidental double-clicks and reduces database load
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
    const { data: recentClick } = await supabase
      .from('link_clicks')
      .select('id')
      .eq('link_id', linkId)
      .eq('ip_address', ipAddress)
      .gte('created_at', fiveSecondsAgo)
      .limit(1)
      .single();

    // Track the click (fire and forget - don't wait for it)
    // Skip if duplicate detected within 5 seconds
    if (!recentClick) {
      const clickData = {
        link_id: linkId,
        list_id: listId,
        owner_id: ownerId,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
        referrer: referrer,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        response_time: responseTime,
      };
      
      console.log('Inserting click data:', clickData);
      
      supabase
        .from('link_clicks')
        .insert(clickData)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error tracking click:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
          } else {
            console.log('Click tracked successfully:', {
              linkId,
              ownerId,
              listId,
              insertedId: data
            });
          }
        });
    } else {
      console.log('Duplicate click detected (within 5 seconds), skipping tracking:', {
        linkId,
        ipAddress
      });
    }

    // Redirect to destination URL immediately (don't wait for tracking)
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': destinationUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error in track-click function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})

