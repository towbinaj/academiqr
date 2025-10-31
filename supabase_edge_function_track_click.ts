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
    
    // Extract link ID from path: /track-click/link-id-here
    const pathParts = url.pathname.split('/').filter(p => p);
    const linkId = pathParts[pathParts.length - 1];
    
    if (!linkId) {
      return new Response(
        JSON.stringify({ error: 'Link ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const ownerId = link.link_lists.owner_id;

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

    // Track the click (fire and forget - don't wait for it)
    supabase
      .from('link_clicks')
      .insert({
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
      })
      .then(({ error }) => {
        if (error) console.error('Error tracking click:', error);
        else console.log('Click tracked successfully for link:', linkId);
      });

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





