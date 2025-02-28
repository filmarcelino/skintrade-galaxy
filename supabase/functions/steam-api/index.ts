
// Follow the pattern below for imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get request body
    const requestData = await req.json();
    const { action } = requestData;

    // Configure OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    // Handle different actions
    if (action === 'evaluateTrade') {
      const { yourItems, theirItems } = requestData;
      
      // Enrich items with market data (if needed)
      const enrichedYourItems = await Promise.all(
        yourItems.map(async (item) => {
          try {
            // Get additional market data from Steam Web API
            const marketData = await fetchMarketData(item.name);
            return {
              ...item,
              marketTrend: marketData?.trend || item.marketTrend,
              popularity: marketData?.popularity || item.popularity,
            };
          } catch (error) {
            console.error(`Error enriching item ${item.name}:`, error);
            return item;
          }
        })
      );

      const enrichedTheirItems = await Promise.all(
        theirItems.map(async (item) => {
          try {
            const marketData = await fetchMarketData(item.name);
            return {
              ...item,
              marketTrend: marketData?.trend || item.marketTrend,
              popularity: marketData?.popularity || item.popularity,
            };
          } catch (error) {
            console.error(`Error enriching item ${item.name}:`, error);
            return item;
          }
        })
      );

      // Calculate values
      const yourTotal = enrichedYourItems.reduce((sum, item) => sum + item.value, 0);
      const theirTotal = enrichedTheirItems.reduce((sum, item) => sum + item.value, 0);
      
      try {
        // Use OpenAI to evaluate trade
        const evaluation = await evaluateTradeWithAI(
          enrichedYourItems,
          enrichedTheirItems,
          yourTotal,
          theirTotal,
          openai
        );
        
        return new Response(
          JSON.stringify({ evaluation }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (openaiError) {
        console.error("OpenAI evaluation failed:", openaiError);
        
        // Fallback to simple calculation
        const difference = yourTotal - theirTotal;
        let evaluation;
        
        if (Math.abs(difference) < 5) {
          evaluation = 'Esta troca parece equilibrada em termos de valor.';
        } else if (difference > 0) {
          evaluation = `Você está oferecendo R$${Math.abs(difference).toFixed(2)} a mais. Esta troca não é favorável para você.`;
        } else {
          evaluation = `Você está recebendo R$${Math.abs(difference).toFixed(2)} a mais. Esta troca é favorável para você.`;
        }
        
        return new Response(
          JSON.stringify({ evaluation }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Handle unknown action
    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
    
  } catch (error) {
    console.error("Error in function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Function to fetch market data from Steam Web API
async function fetchMarketData(itemName) {
  try {
    const apiKey = Deno.env.get('STEAM_API_KEY');
    // Using the steamwebapi.com endpoints as shown in the docs
    const response = await fetch(`https://api.steamwebapi.com/market/item-info?key=${apiKey}&name=${encodeURIComponent(itemName)}`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract relevant market data
    // This is a simplified example; adjust according to the actual API response
    const popularity = determinePopularity(data.volume, data.listings);
    const trend = determineTrend(data.price_history);
    
    return {
      trend,
      popularity,
      volume: data.volume,
      listings: data.listings,
    };
  } catch (error) {
    console.error(`Error fetching market data for ${itemName}:`, error);
    // Return default values if API call fails
    return {
      trend: Math.random() > 0.5 ? 'up' : 'down',
      popularity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    };
  }
}

// Helper function to determine item popularity
function determinePopularity(volume, listings) {
  if (!volume || !listings) {
    // Return random popularity level if data is missing
    return ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
  }
  
  // This is a simplified logic; adjust based on actual market trends
  if (volume > 100 && listings > 50) return 'high';
  if (volume > 30 && listings > 10) return 'medium';
  return 'low';
}

// Helper function to determine price trend
function determineTrend(priceHistory) {
  if (!priceHistory || !Array.isArray(priceHistory) || priceHistory.length < 2) {
    // Return random trend if history is missing
    return Math.random() > 0.5 ? 'up' : 'down';
  }
  
  // Compare the most recent prices
  const recent = priceHistory.slice(-5);
  const oldest = recent[0];
  const newest = recent[recent.length - 1];
  
  return newest > oldest ? 'up' : 'down';
}

// Function to evaluate trade using OpenAI
async function evaluateTradeWithAI(yourItems, theirItems, yourTotal, theirTotal, openai) {
  try {
    const prompt = `
Avalie esta troca de skins CS2:

SEUS ITENS (Total: R$${yourTotal.toFixed(2)}):
${yourItems.map(item => `- ${item.name} - R$${item.value.toFixed(2)} - Tendência: ${item.marketTrend}, Popularidade: ${item.popularity}`).join('\n')}

ITENS DELES (Total: R$${theirTotal.toFixed(2)}):
${theirItems.map(item => `- ${item.name} - R$${item.value.toFixed(2)} - Tendência: ${item.marketTrend}, Popularidade: ${item.popularity}`).join('\n')}

Forneça uma análise detalhada em português desta troca, considerando o valor financeiro, tendências de preço e popularidade dos itens. A análise deve ser imparcial e destacar se a troca é favorável, desfavorável ou equilibrada para o usuário. Limite sua resposta a 3-4 frases.
`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error with OpenAI evaluation:", error);
    throw error;
  }
}
