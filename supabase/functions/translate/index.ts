import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { text, texts, targetLanguage } = body;
    
    // Support both single text and batch texts
    const isBatch = Array.isArray(texts) && texts.length > 0;
    const textsToTranslate = isBatch ? texts : (text ? [text] : []);
    
    if (textsToTranslate.length === 0 || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing text/texts or targetLanguage' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const languageName = targetLanguage === 'fr' ? 'French' : 'English';

    // For batch requests, format as numbered list for reliable parsing
    const prompt = isBatch 
      ? textsToTranslate.map((t, i) => `[${i}] ${t}`).join('\n')
      : textsToTranslate[0];

    const systemPrompt = isBatch
      ? `You are a professional translator. Translate each numbered line to ${languageName}. 
Return ONLY a JSON array of translated strings in the same order, nothing else.
Example input:
[0] Hello
[1] World
Example output:
["Bonjour", "Monde"]
If text is already in ${languageName}, return it as-is. Preserve formatting within each text.`
      : `You are a professional translator. Translate the following text to ${languageName}. Only return the translated text, nothing else. Preserve any formatting, line breaks, and special characters. If the text is already in ${languageName}, return it as-is.`;

    console.log(`Translating ${textsToTranslate.length} text(s) to ${languageName}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit hit');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Translation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (isBatch) {
      // Parse JSON array response
      try {
        // Try to extract JSON array from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const translations = jsonMatch ? JSON.parse(jsonMatch[0]) : textsToTranslate;
        
        // Ensure we have the right number of translations
        if (!Array.isArray(translations) || translations.length !== textsToTranslate.length) {
          console.error('Translation count mismatch, returning originals');
          return new Response(
            JSON.stringify({ translations: textsToTranslate }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`Successfully translated ${translations.length} texts`);
        return new Response(
          JSON.stringify({ translations }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('Failed to parse batch translation:', parseError, content);
        return new Response(
          JSON.stringify({ translations: textsToTranslate }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Single text response
      return new Response(
        JSON.stringify({ translatedText: content || text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});