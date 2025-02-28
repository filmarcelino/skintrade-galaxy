
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

const getApiKey = () => {
  const apiKey = Deno.env.get('STEAM_API_KEY')
  if (!apiKey) {
    throw new Error('Missing STEAM_API_KEY environment variable')
  }
  return apiKey
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse
  
  try {
    const { market_hash_name, appid } = await req.json()
    
    if (!market_hash_name) {
      return new Response(
        JSON.stringify({ error: 'Missing market_hash_name in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Get API key from environment variables
    const apiKey = getApiKey()
    
    // Log request details for debugging
    console.log(`Making request to steamwebapi.com with:`);
    console.log(`- market_hash_name: ${market_hash_name}`);
    console.log(`- appid: ${appid || '730'}`); // Default to CS2 appid
    
    // Based on the documentation image, let's use the item endpoint
    const apiUrl = `https://api.steamwebapi.com/item?key=${apiKey}&market_hash_name=${encodeURIComponent(market_hash_name)}&appid=${appid || '730'}`
    
    console.log(`API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    console.log('Response from steamwebapi.com:', data);
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in steam-api function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

Deno.serve(handler)
