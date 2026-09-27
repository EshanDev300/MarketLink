const express = require('express');
const router = express.Router();
const ProductModel = require('../models/Product');
const MarketModel = require('../models/Market');
const UserModel = require('../models/User');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Real Gemini API Assistant Chatbot endpoint with Multilingual & Unique Response Capability
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'auto' } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        reply: "Hello! I'm your MarketLink AI Assistant. How can I help you find farm-fresh produce or market details today?",
        suggestions: ["What produce is fresh today?", "Where are the markets located?", "Give me a PDF of vegetable definitions"]
      });
    }

    const q = message.toLowerCase().trim();
    const products = await ProductModel.find();
    const markets = await MarketModel.find();
    const farmers = await UserModel.find({ role: 'farmer', status: 'active' });

    // Filter potential matched products to send as interactive pills
    const matchedProducts = products.filter(p => 
      q.includes(p.name.toLowerCase().split(' ')[0]) || 
      q.includes(p.category.toLowerCase().split(' ')[0]) ||
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    ).slice(0, 4);

    const isPdfRequest = q.includes('pdf') || q.includes('defining of vegetables') || q.includes('vegetable guide') || q.includes('define vegetable') || q.includes('vegetable definition');

    let reply = '';
    let suggestions = [
      "What produce is fresh today?",
      "Download Vegetable Guide (PDF)",
      "When is the market open?"
    ];

    // Attempt real Gemini 3.8 Flash call
    if (GEMINI_API_KEY) {
      try {
        const productSummary = products.slice(0, 20).map(p => 
          `- ${p.name} ($${p.price.toFixed(2)} / ${p.unit}) by ${p.farmerName} at ${p.marketName} [Category: ${p.category}, Harvest: ${p.harvestDay || 'Daily'}]`
        ).join('\n');

        const marketSummary = markets.map(m => 
          `- ${m.name} (${m.city}): Open ${m.operatingDays.join(', ')} from ${m.timings} at ${m.address}`
        ).join('\n');

        const randomSeed = Math.random().toString(36).substring(2, 7);

        const systemPrompt = `You are MarketLink's AI Market Intelligence Assistant for the 'eGreen Basket' platform (Aptech TechWiz 7).
Seed context token: ${randomSeed} (Use this to ensure every answer is unique, uniquely phrased, creative, and distinct!).

CORE RULES & CAPABILITIES:
1. MULTILINGUAL MASTERY:
   - You MUST reply in the EXACT SAME LANGUAGE in which the user writes (e.g. Spanish, French, German, Urdu, Hindi, Arabic, Chinese, Japanese, Russian, Portuguese, etc.).
   - If the user asks to speak or translate into another language, switch immediately and reply fluently in that requested language.
2. DYNAMIC & UNIQUE ANSWERS:
   - Provide fresh, non-repetitive, appetizing, and highly engaging perspectives on every query. Never use cookie-cutter templates.
   - Include farm-to-table tips, sensory descriptions of seasonal produce, and pairing recommendations.
3. PRE-ORDER ARCHITECTURE:
   - Customers pre-order online to reserve weekly stock with ZERO payment gateway fees.
   - Payment is settled 100% in-person at the farmer's stall upon pickup via cash, card, or mobile phone.
4. VEGETABLE DEFINITION & PDF GENERATION:
   - If the user asks for definitions of vegetables, vegetable guides, or a PDF, provide a clear, delicious definition of key organic vegetables (e.g. Brandywine tomatoes, Romanesco cauliflower, Japanese cucumbers, Chanterelle mushrooms, Sweet peas, etc.) and inform them that they can click the '📄 Download Vegetable Guide (PDF)' button right in the chat to download the official printable PDF document!
5. LIVE MARKET DATA:
Markets:
${marketSummary}
Produce Catalog Sample:
${productSummary}

Format with clean markdown, bullet points, and tasteful emojis. Keep answers within 2-4 structured paragraphs.`;

        const modelsToTry = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemma-4-26b-a4b-it', 'gemini-3.8-flash'];
        
        for (const mName of modelsToTry) {
          if (reply) break;
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${GEMINI_API_KEY}`;
            const payload = {
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `${systemPrompt}\n\nUser Message: ${message}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                maxOutputTokens: 900
              }
            };

            const response = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            if (response.ok) {
              const data = await response.json();
              if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                const textPart = data.candidates[0].content.parts.find(p => p.text);
                if (textPart && textPart.text) {
                  reply = textPart.text;
                  break;
                }
              }
            } else {
              console.warn(`Model ${mName} returned status ${response.status}, trying next model...`);
            }
          } catch (modelErr) {
            console.warn(`Model ${mName} error:`, modelErr.message);
          }
        }
      } catch (geminiErr) {
        console.error('Gemini request failed, falling back to dynamic local engine:', geminiErr.message);
      }
    }

    // Dynamic Fallback if Gemini is offline
    if (!reply) {
      if (isPdfRequest) {
        reply = `📄 **MarketLink Vegetable Encyclopedia & Definition Guide:**\n\nWe have prepared an official, comprehensive **Printable PDF Guide Defining All Farm Vegetables**! It contains botanical classifications, peak harvest times, vitamin profiles, and chef pairings for Heirloom Tomatoes, Romanesco Cauliflower, Sugar Snap Peas, Wild Chanterelles, and more.\n\nClick the **'Download Vegetable Guide (PDF)'** button below to download your copy instantly!`;
      } else if (q.includes('time') || q.includes('timing') || q.includes('hour') || q.includes('open') || q.includes('day')) {
        reply = "Here are the operating days and timings for our partner farmers markets:\n\n";
        markets.forEach(m => {
          reply += `📍 **${m.name}**\n• Days: ${m.operatingDays.join(', ')}\n• Hours: ${m.timings}\n• Location: ${m.address}\n\n`;
        });
      } else if (q.includes('order') || q.includes('preorder') || q.includes('pickup') || q.includes('pay')) {
        reply = "🧺 **How Pre-Ordering Works on MarketLink:**\n\n1. **Browse & Cart**: Reserve fresh seasonal crops from verified regional growers.\n2. **Select Pickup Slot**: Choose your preferred weekend morning pickup window.\n3. **Zero Online Fee**: Pay $0.00 online.\n4. **Pay at Stall**: Inspect your produce and settle payment in-person directly at the stall.";
      } else if (matchedProducts.length > 0) {
        reply = `I discovered **${matchedProducts.length} delicious item(s)** matching your request:\n\n`;
        matchedProducts.forEach(p => {
          reply += `🌱 **${p.name}** - $${p.price.toFixed(2)} / ${p.unit}\n   • Grower: ${p.farmerName} (${p.stallName})\n   • Stock: ${p.stock_quantity} ${p.unit}\n\n`;
        });
        reply += "You can pre-order these directly for pickup on market day!";
      } else {
        reply = `🌱 Welcome to **MarketLink (eGreen Basket)**! I'm your Multilingual AI Market Assistant.\n\nI can assist you in English, Español, Français, Deutsch, हिन्दी, and more with:\n• Finding seasonal organic produce & harvest dates\n• Vegetable definitions and instant PDF Guide generation\n• Market locations, schedules, and pickup windows\n• Farm-to-table recipes & nutritional profiles`;
      }
    }

    if (isPdfRequest) {
      suggestions = [
        "Download Vegetable Guide (PDF)",
        "What vegetables are richest in vitamins?",
        "How do pre-orders work?"
      ];
    } else if (matchedProducts.length > 0) {
      suggestions = [
        `How do I pre-order ${matchedProducts[0].name}?`,
        "Download Vegetable Guide (PDF)",
        "Show all vegetables"
      ];
    }

    res.json({
      reply,
      suggestions,
      matchedProducts,
      model: 'gemini-3.8-flash',
      isPdfRequest
    });

  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ reply: 'Sorry, I encountered an issue retrieving that information. Please try again.' });
  }
});

module.exports = router;
