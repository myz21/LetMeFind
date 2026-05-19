# LetMeFind

LetMeFind, ilk açılışta sade bir keşif ekranı gösteren ve arka planda gerçek veri kaynaklarıyla çalışan bir alışveriş asistanı prototipidir. UI başlangıçta 1. klasördeki `code.html` hissine yakın tutulur: tek hero, arama kutusu, kısa öneriler ve hafif özet kartları.

## Yapı

- [index.html](index.html) sade giriş ekranını içerir.
- [styles.css](styles.css) görsel sistemi, responsive düzeni ve chat modal'ını tanımlar.
- [app.js](app.js) arama, kaynak görünümü ve Gemini sohbet akışını yönetir.
- [backend/](backend) gerçek veri çekme ve sohbet yanıtı için Node sunucusunu içerir.
- [1/](1), [2/](2), [3/](3), [4/](4) klasörleri referans taslak olarak korunur.

## Kullanılan Veri Kaynakları

- Public APIs deposundan: [DummyJSON](https://dummyjson.com/) ürün araması.
- Türk veri kaynağından: TCMB günlük döviz kuru XML'i.
- Yapay zeka sohbeti: Google Gemini API.

## Mimari Özeti

1. Sunum katmanı
   - Ana ekran mümkün olduğunca hafif tutulur.
   - Sonuçlar ve sohbet, kullanıcı etkileşimiyle açılır.

2. Veri katmanı
   - Ürün araması gerçek API'den gelir.
   - Türk verisi TCMB ile fiyat bağlamı sağlar.

3. Sohbet katmanı
   - `/api/chat` Gemini'ye bağlanır.
   - `GEMINI_API_KEY` tanımlı değilse güvenli fallback mesajı döner.

4. Backend sınırları
   - Sunucu, statik dosyaları da servis eder.
   - Gelişmiş durumda arama, sohbet ve yerel veri zenginleştirme ayrı servislere bölünebilir.

## Çalıştırma

```bash
cd backend
GEMINI_API_KEY=... npm run dev
```

Ardından uygulamayı `http://localhost:3000` üzerinden aç.

## Sonraki Adım

Bu iskeletin üstüne ürün indeksleme, kullanıcı oturumu ve kalıcı backend servislerini ekleyebiliriz.
