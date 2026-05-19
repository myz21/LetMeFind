# LetMeFind Architecture

## Katmanlar

### 1. Sunum

- [index.html](index.html)
- [styles.css](styles.css)
- [app.js](app.js)

Görev: ilk ekranı sade göstermek, sonucu ilerleyen etkileşimlerle açmak.

### 2. Veri

- Public API kaynağı: DummyJSON ürün araması.
- Türk veri kaynağı: TCMB günlük döviz kur XML'i.

Bu iki kaynak, arama sonuçlarının gerçek veri ile dolmasını sağlar.

### 3. Sohbet

- Gemini, `/api/chat` üzerinden kullanılır.
- Anahtar yoksa güvenli fallback metni döner.

### 4. Backend

- [backend/src/server.js](backend/src/server.js)
- [backend/src/lib/services.js](backend/src/lib/services.js)
- [backend/src/lib/product-sources.js](backend/src/lib/product-sources.js)
- [backend/src/lib/tcmb.js](backend/src/lib/tcmb.js)
- [backend/src/lib/gemini.js](backend/src/lib/gemini.js)

Backend hem statik dosyaları servis eder hem de veri toplama ve sohbet yanıtı üretir.

## Veri Akışı

1. Kullanıcı sorgu girer.
2. Front-end `/api/search` çağırır.
3. Backend DummyJSON'dan ürünleri, TCMB'den dövizi çeker.
4. Kullanıcı isterse `/api/chat` ile Gemini konuşması açılır.

## Neden Bu Yapı

- İlk ekranı ağırlaştırmaz.
- Gerçek API'leri tek view model altında toplar.
- Daha sonra veritabanı, indexleme ve kullanıcı oturumu eklemeye uygundur.
