
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função principal para servir as requisições
serve(async (req) => {
  // Tratar solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter a chave da API do steamwebapi.com das variáveis de ambiente
    const steamApiKey = Deno.env.get('STEAM_API_KEY');
    if (!steamApiKey) {
      throw new Error('Chave da API do Steam não encontrada');
    }

    // Obter parâmetros do corpo da requisição
    const requestData = await req.json();
    const { market_hash_name, appid } = requestData;
    
    if (!market_hash_name || !appid) {
      throw new Error('Parâmetros necessários não especificados');
    }

    // Para steamwebapi.com, a URL é diferente da API oficial da Steam
    const steamWebApiUrl = `https://api.steamwebapi.com/market/item-prices/${appid}?key=${steamApiKey}&items=${encodeURIComponent(market_hash_name)}`;
    
    console.log(`Fazendo requisição para: ${steamWebApiUrl}`);
    
    // Fazer a requisição à API do SteamWebAPI
    const response = await fetch(steamWebApiUrl);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Retornar os dados com os cabeçalhos CORS
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erro ao acessar a API:', error);
    
    // Retornar erro com os cabeçalhos CORS
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
