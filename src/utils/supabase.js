// Supabase client initialization
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env variables are missing. Check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
})

// Export supabase client for use in components
export { supabase };

export async function checkConnection() {
  try {
    const { data, error } = await supabase.from('link_lists').select('id').limit(1)
    if (error) throw error
    return true
  } catch (e) {
    console.warn('Supabase connection check failed:', e.message)
    return false
  }
}

// Analytics functions
export async function getAnalyticsSummary(listId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('link_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { count, error } = await query

    if (error) throw error

    return {
      totalClicks: count || 0
    }
  } catch (e) {
    console.error('Error fetching analytics summary:', e)
    throw e
  }
}

export async function getClicksByLink(listId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('link_clicks')
      .select(`
        link_id,
        link_items:link_id (
          id,
          title,
          url
        )
      `)
      .eq('owner_id', user.id)
      .order('clicked_at', { ascending: false })

    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { data, error } = await query

    if (error) throw error

    // Group by link and count
    const clickCounts = {}
    data.forEach(click => {
      const linkId = click.link_id
      if (!clickCounts[linkId]) {
        clickCounts[linkId] = {
          link_id: linkId,
          title: click.link_items?.title || 'Unknown Link',
          url: click.link_items?.url || '',
          clicks: 0
        }
      }
      clickCounts[linkId].clicks++
    })

    return Object.values(clickCounts).sort((a, b) => b.clicks - a.clicks)
  } catch (e) {
    console.error('Error fetching clicks by link:', e)
    throw e
  }
}

export async function getClicksByDevice(listId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('link_clicks')
      .select('device_type')
      .eq('owner_id', user.id)

    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { data, error } = await query

    if (error) throw error

    // Count by device type
    const deviceCounts = {}
    data.forEach(click => {
      const device = click.device_type || 'Unknown'
      deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })

    return Object.entries(deviceCounts).map(([device, clicks]) => ({
      device,
      clicks
    })).sort((a, b) => b.clicks - a.clicks)
  } catch (e) {
    console.error('Error fetching clicks by device:', e)
    throw e
  }
}

export async function getRecentClicks(listId = null, limit = 50) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('link_clicks')
      .select(`
        id,
        clicked_at,
        device_type,
        browser,
        os,
        referrer,
        link_items:link_id (
          id,
          title,
          url
        )
      `)
      .eq('owner_id', user.id)
      .order('clicked_at', { ascending: false })
      .limit(limit)

    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map(click => ({
      id: click.id,
      clickedAt: click.clicked_at,
      deviceType: click.device_type,
      browser: click.browser,
      os: click.os,
      referrer: click.referrer,
      linkTitle: click.link_items?.title || 'Unknown Link',
      linkUrl: click.link_items?.url || ''
    }))
  } catch (e) {
    console.error('Error fetching recent clicks:', e)
    throw e
  }
}

export async function getPageViews(listId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { count, error } = await query

    if (error) throw error

    return count || 0
  } catch (e) {
    console.error('Error fetching page views:', e)
    throw e
  }
}




