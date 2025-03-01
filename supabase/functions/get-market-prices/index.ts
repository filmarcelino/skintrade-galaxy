
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const steamApiKey = Deno.env.get('STEAM_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { marketName } = await req.json();
    
    if (!marketName) {
      return new Response(
        JSON.stringify({ error: 'No market name provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Use the Steam API to get the market price for the item
    // Note: For a real implementation, this would use the actual Steam API
    // This is a simplified version for demonstration
    const encodedName = encodeURIComponent(marketName);
    const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodedName}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Steam API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If data was successfully fetched
    if (data.success) {
      // Return the lowest price from Steam
      return new Response(
        JSON.stringify({ price: data.lowest_price || data.median_price }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Steam price data not available');
    }
  } catch (error) {
    console.error('Error in get-market-prices function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
