
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
    // Obter a chave da API do Steam das variáveis de ambiente
    const steamApiKey = Deno.env.get('STEAM_API_KEY');
    if (!steamApiKey) {
      throw new Error('Chave da API do Steam não encontrada');
    }

    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    
    if (!endpoint) {
      throw new Error('Endpoint não especificado');
    }

    // Remover o parâmetro endpoint para não duplicá-lo na URL da API
    url.searchParams.delete('endpoint');
    
    // Adicionar a chave da API aos parâmetros
    url.searchParams.append('key', steamApiKey);
    
    // Construir a URL da API do Steam
    const steamApiUrl = `https://api.steampowered.com/${endpoint}?${url.searchParams}`;
    
    console.log(`Fazendo requisição para: ${steamApiUrl}`);
    
    // Fazer a requisição à API do Steam
    const response = await fetch(steamApiUrl);
    
    if (!response.ok) {
      throw new Error(`Erro na API do Steam: ${response.statusText}`);
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
    console.error('Erro ao acessar a API do Steam:', error);
    
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
