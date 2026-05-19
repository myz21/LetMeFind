function buildPrompt({ query, message, products = [] }) {
  const productLines = products.slice(0, 3).map((product) => {
    return `${product.name} | ${product.priceTry || product.price} | ${product.category} | ${product.description}`;
  });

  return `
Sen LetMeFind için Türkçe konuşan bir alışveriş asistanısın.
Kısa, net, yönlendirici ve somut ol.
Kullanıcı sorgusu: ${query || 'belirtilmedi'}
Kullanıcı mesajı: ${message || 'belirtilmedi'}
Ürünler:
${productLines.join('\n') || 'Ürün yok'}

Yanıtında:
- Gereksiz uzun açıklama yapma.
- En fazla 5 madde veya 1 kısa paragraf kullan.
- Varsa ürünlerden birini öner ve nedenini söyle.
- Eğer Gemini anahtarı yoksa kullanıcıya bunu açıkça söyleme; bunun yerine genel, yararlı bir yönlendirme üret.
`.trim();
}

async function generateGeminiReply(body = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = buildPrompt(body);

  if (!apiKey) {
    return 'Gemini anahtarı tanımlı değil. Şu an ürünleri kıyaslayabilirim, ama gerçek Gemini yanıtı için GEMINI_API_KEY eklenmeli.';
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 256,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('')?.trim() || 'Yanıt üretilemedi.';
}

module.exports = {
  generateGeminiReply,
};
