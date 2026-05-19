const TCMB_XML_URL = 'https://www.tcmb.gov.tr/kurlar/today.xml';

async function fetchExchangeRates() {
  try {
    const response = await fetch(TCMB_XML_URL, {
      headers: {
        'User-Agent': 'LetMeFind/1.0',
        Accept: 'application/xml,text/xml,*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`TCMB request failed: ${response.status}`);
    }

    const xml = await response.text();
    const usdTry = extractRate(xml, 'USD');
    const eurTry = extractRate(xml, 'EUR');

    return {
      usdTry: usdTry || 1,
      eurTry: eurTry || 1,
    };
  } catch (error) {
    return {
      usdTry: 1,
      eurTry: 1,
    };
  }
}

function extractRate(xml, code) {
  const currencyBlock = xml.match(new RegExp(`<Currency[^>]*CurrencyCode="${code}"[\\s\\S]*?<\\/Currency>`, 'i'));
  if (!currencyBlock) return null;

  const block = currencyBlock[0];
  const forexBuying = block.match(/<ForexBuying>([^<]+)<\/ForexBuying>/i)?.[1];
  const banknoteSelling = block.match(/<BanknoteSelling>([^<]+)<\/BanknoteSelling>/i)?.[1];
  const chosen = forexBuying || banknoteSelling;
  const rate = Number(String(chosen || '').replace(',', '.'));
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

module.exports = {
  fetchExchangeRates,
};
