const ui = {
  searchInput: document.getElementById('searchInput'),
  suggestionChips: document.getElementById('suggestionChips'),
  signalStrip: document.getElementById('signalStrip'),
  results: document.getElementById('results'),
  resultsTitle: document.getElementById('resultsTitle'),
  resultsMeta: document.getElementById('resultsMeta'),
  resultsGrid: document.getElementById('resultsGrid'),
  dataBadge: document.getElementById('dataBadge'),
  footerStatus: document.getElementById('footerStatus'),
  sourceDrawer: document.getElementById('sourceDrawer'),
  sourceList: document.getElementById('sourceList'),
  chatShell: document.getElementById('chat'),
  chatLog: document.getElementById('chatLog'),
  chatForm: document.getElementById('chatForm'),
  chatInput: document.getElementById('chatInput'),
};

const state = {
  activeQuery: '60-80 cm arası çalışma masası, siyah, metal ayaklı',
  sourcesVisible: false,
  chatMessages: [],
  results: [],
  exchange: null,
  apiHealthy: false,
};

const suggestions = [
  'küçük salon için koltuk',
  'oyun için değil günlük laptop',
  'uzun pil ömrü kulaklık',
];

const defaultSignals = [
  { label: 'Vizyon', value: 'Kusursuz arama' },
  { label: 'Veri', value: 'Public APIs + TCMB' },
  { label: 'Sohbet', value: 'Gemini hazır' },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderSuggestions() {
  ui.suggestionChips.innerHTML = suggestions
    .map((item) => `<button class="chip" type="button" data-chip="${escapeHtml(item)}">${escapeHtml(item)}</button>`)
    .join('');
}

function renderSignals(signals) {
  ui.signalStrip.innerHTML = signals
    .map(
      (signal) => `
        <article class="signal-card">
          <p class="eyebrow">${escapeHtml(signal.label)}</p>
          <strong>${escapeHtml(signal.value)}</strong>
        </article>
      `,
    )
    .join('');
}

function renderSources(sources = []) {
  ui.sourceList.innerHTML = sources
    .map((source) => `<li>${escapeHtml(source)}</li>`)
    .join('');
}

function renderResults(payload) {
  const items = payload.items || [];
  ui.resultsTitle.textContent = payload.title || `${payload.query || state.activeQuery} için en iyi seçenekler`;
  ui.resultsMeta.textContent = payload.meta || 'Gerçek veriler yükleniyor.';
  ui.resultsGrid.innerHTML = items
    .map(
      (item) => `
        <article class="result-card">
          <div class="result-visual" aria-hidden="true"></div>
          <div class="result-head">
            <div>
              <p class="eyebrow">${escapeHtml(item.source || 'Canlı veri')}</p>
              <h3>${escapeHtml(item.name)}</h3>
            </div>
            <div class="price">${escapeHtml(item.priceTry || item.price || 'Veri yok')}</div>
          </div>
          <div class="result-meta">
            <strong>${escapeHtml(item.ratingLabel || `Puan ${item.rating ?? '-'}`)}</strong>
          </div>
          <ul class="result-list">
            <li>${escapeHtml(item.category || 'Kategori bilgisi yok')}</li>
            <li>${escapeHtml(item.description || 'Açıklama yok')}</li>
            ${item.exchangeNote ? `<li>${escapeHtml(item.exchangeNote)}</li>` : ''}
          </ul>
        </article>
      `,
    )
    .join('');
  ui.results.hidden = false;
}

function renderChat() {
  if (!state.chatMessages.length) {
    ui.chatLog.innerHTML = `
      <li class="chat-bubble chat-bubble--assistant">Sorunu yaz. Ürünleri kıyaslayayım, fiyatları toparlayayım ve gerekirse Gemini ile açıklayayım.</li>
    `;
    return;
  }

  ui.chatLog.innerHTML = state.chatMessages
    .map((message) => `<li class="chat-bubble ${message.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'}">${escapeHtml(message.text)}</li>`)
    .join('');
}

async function fetchHealth() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error('health check failed');
    const payload = await response.json();
    state.apiHealthy = payload.status === 'ok';
    ui.dataBadge.textContent = state.apiHealthy ? 'Canlı veri hazır' : 'Yerel demo';
    ui.footerStatus.textContent = state.apiHealthy ? 'SYSTEM STATUS: LIVE' : 'SYSTEM STATUS: DEMO';
  } catch (error) {
    ui.dataBadge.textContent = 'Yerel demo';
    ui.footerStatus.textContent = 'SYSTEM STATUS: DEMO';
  }
}

async function submitSearch(query) {
  const effectiveQuery = query.trim() || state.activeQuery;
  ui.footerStatus.textContent = 'SYSTEM STATUS: SEARCHING';

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(effectiveQuery)}`);
    if (!response.ok) throw new Error(`search failed: ${response.status}`);

    const payload = await response.json();
    state.activeQuery = effectiveQuery;
    state.results = payload.items || [];
    state.exchange = payload.exchange;

    renderResults(payload);
    renderSources(payload.sources || []);
    ui.dataBadge.textContent = payload.sources?.length ? payload.sources.join(' · ') : 'Canlı veri';
    ui.footerStatus.textContent = 'SYSTEM STATUS: READY';
  } catch (error) {
    console.error(error);
    ui.resultsTitle.textContent = `${effectiveQuery} için sonuçlar`;
    ui.resultsMeta.textContent = 'Veri alınamadı, yerel önizleme gösteriliyor.';
    ui.resultsGrid.innerHTML = `
      <article class="result-card">
        <div class="result-visual" aria-hidden="true"></div>
        <div class="result-head"><div><p class="eyebrow">Demo</p><h3>Veri kaynağına ulaşılamadı</h3></div></div>
        <p class="section-copy">Backend çalışıyor olmalı veya API anahtarları eksik olabilir.</p>
      </article>
    `;
    ui.results.hidden = false;
    ui.footerStatus.textContent = 'SYSTEM STATUS: DEGRADED';
  }
}

function openChat() {
  ui.chatShell.hidden = false;
  ui.chatInput.focus();
  renderChat();
}

function closeChat() {
  ui.chatShell.hidden = true;
}

async function sendChatMessage(text) {
  const content = text.trim();
  if (!content) return;

  state.chatMessages.push({ role: 'user', text: content });
  renderChat();
  ui.chatInput.value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: state.activeQuery,
        message: content,
        products: state.results,
      }),
    });

    if (!response.ok) throw new Error(`chat failed: ${response.status}`);

    const payload = await response.json();
    state.chatMessages.push({ role: 'assistant', text: payload.reply || 'Yanıt üretilemedi.' });
  } catch (error) {
    state.chatMessages.push({ role: 'assistant', text: 'Gemini yanıtı alınamadı. GEMINI_API_KEY tanımlı mı kontrol et.' });
  }

  renderChat();
}

function bindEvents() {
  ui.suggestionChips.addEventListener('click', (event) => {
    const button = event.target.closest('[data-chip]');
    if (!button) return;
    ui.searchInput.value = button.getAttribute('data-chip') || '';
    ui.searchInput.focus();
  });

  document.querySelectorAll('[data-action="focus-search"]').forEach((button) => {
    button.addEventListener('click', () => ui.searchInput.focus());
  });

  document.querySelectorAll('[data-action="submit-search"]').forEach((button) => {
    button.addEventListener('click', () => submitSearch(ui.searchInput.value));
  });

  document.querySelectorAll('[data-action="open-chat"]').forEach((button) => {
    button.addEventListener('click', openChat);
  });

  document.querySelectorAll('[data-action="close-chat"]').forEach((button) => {
    button.addEventListener('click', closeChat);
  });

  document.querySelectorAll('[data-action="toggle-source"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.sourcesVisible = !state.sourcesVisible;
      ui.sourceDrawer.hidden = !state.sourcesVisible;
    });
  });

  ui.chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await sendChatMessage(ui.chatInput.value);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeChat();
  });
}

renderSuggestions();
renderSignals(defaultSignals);
renderChat();
fetchHealth();
bindEvents();
submitSearch(state.activeQuery);
