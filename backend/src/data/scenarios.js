module.exports = [
  {
    query: '60-80 cm arası çalışma masası, siyah, metal ayaklı, küçük salon için uygun',
    mode: 'Canlı API',
    title: 'Seçilen kullanım bağlamı için öne çıkan ürünler',
    chips: ['küçük salon', 'siyah', '60-80 cm', 'metal ayak', 'masa', 'kompakt'],
    signals: [
      { label: 'Kategori', value: 'Masa', progress: 86 },
      { label: 'Ölçü uyumu', value: '60-80 cm', progress: 79 },
      { label: 'Kullanım bağlamı', value: 'Küçük alan', progress: 91 },
    ],
    results: [
      {
        name: 'Mono-X 70 Compact',
        price: '₺3.450',
        score: 'Eşleşme skoru 98',
        summary: [
          '70 cm genişlik, hedef aralıkla tam uyum sağlar.',
          'Mat siyah gövde ve ince metal ayaklar ferah görünüm verir.',
          '45 cm derinlik küçük salon yerleşimi için güvenli profil sunar.',
        ],
      },
      {
        name: 'Slim-Draft 60',
        price: '₺2.100',
        score: 'Eşleşme skoru 95',
        summary: [
          '60 cm genişlik ile en dar ve en esnek seçenek.',
          'Katlanabilir yapı, alanı gün içinde farklı kullanıma açar.',
          'Açık form dili, küçük hacimde ağır görünümü azaltır.',
        ],
      },
      {
        name: 'Vertex Corner 75',
        price: '₺4.890',
        score: 'Eşleşme skoru 92',
        summary: [
          'Köşe formu ölü alanı verimli kullanır.',
          '75 cm kanat uzunluğu, daha geniş çalışma yüzeyi sağlar.',
          'Depolama entegrasyonu, tek noktadan düzen kurar.',
        ],
      },
    ],
    filters: [
      { label: 'Genişlik', value: '60–80 cm', type: 'range', meta: 'Önerilen aralık' },
      { label: 'Renk', value: 'Siyah', type: 'options', meta: 'Diğer tonlar kapalı', options: ['Siyah', 'Diğer'], selected: 0 },
      { label: 'Kategori', value: 'Masa', type: 'pills', meta: 'Niyetle eşleşti', options: ['Masa', 'Konsol', 'Raf'], selected: 0 },
      { label: 'Kullanım', value: 'Küçük alanlar için optimize', type: 'switch', meta: 'Açık' },
    ],
    compare: [
      { name: 'Mono-X 70', price: '₺12.400', note: 'Daha sağlam: Endüstriyel çelik iskelet, uzun ömürlü kullanım.', durability: 78, space: 'Sabit genişlik (140 cm)', value: 'Orta' },
      { name: 'Slim-Draft 60', price: '₺8.200', note: 'Daha kompakt: Katlanabilir mekanizma, ultra küçük alanlar için optimize.', durability: 66, space: 'Katlanabilir (60 cm)', value: 'Yüksek' },
      { name: 'Vertex Corner 75', price: '₺15.900', note: 'Maksimum alan: Köşe formuyla ölü alanları değerlendiren geniş yüzey.', durability: 90, space: 'L-form (160 x 120 cm)', value: 'Premium' },
    ],
    roadmap: [
      { badge: '1. Veri', title: 'Veri adaptörü', text: 'API yanıtını ürün kartlarına uygun view model’e dönüştürür. Mock veri burada kalır.' },
      { badge: '2. Durum', title: 'Durum yöneticisi', text: 'Sorgu, filtre ve sonuç durumlarını tek kaynakta toplar; UI sadece render eder.' },
      { badge: '3. Servis', title: 'Öneri katmanı', text: 'Sıralama, skorlama ve açıklama üretimi için ayrı servis sınırı kurulur.' },
      { badge: '4. Gözlem', title: 'Analitik ve geri bildirim', text: 'Tıklama, seçim ve iptal olayları ölçülür; arama kalitesi zamanla iyileştirilir.' },
    ],
  },
  {
    query: 'dar salon için katlanabilir masa, açık renk, hafif malzeme, çok amaçlı kullanım',
    mode: 'Canlı API',
    title: 'Dar alan odaklı alternatif küme',
    chips: ['dar salon', 'katlanabilir', 'açık renk', 'hafif malzeme', 'çok amaçlı'],
    signals: [
      { label: 'Kategori', value: 'Masa', progress: 84 },
      { label: 'Öncelik', value: 'Alan tasarrufu', progress: 95 },
      { label: 'Esneklik', value: 'Katlanabilir yapı', progress: 88 },
    ],
    results: [
      {
        name: 'Fold-Light 58',
        price: '₺2.980',
        score: 'Eşleşme skoru 99',
        summary: [
          'En küçük hacimde maksimum hareket alanı bırakır.',
          'Açık tonlar, kompakt mekanlarda daha hafif algı yaratır.',
          'Günlük kullanım ile gerektiğinde kapatma senaryosu arasında köprü kurar.',
        ],
      },
      {
        name: 'Airline Compact 64',
        price: '₺3.200',
        score: 'Eşleşme skoru 96',
        summary: [
          'İnce profil ve düşük görsel ağırlık üretir.',
          'Yan yüzeyler çok amaçlı kullanım için optimize edilir.',
          'Yerleşimde keskin köşeler yerine yumuşak geçiş tercih eder.',
        ],
      },
      {
        name: 'Corner Mini 72',
        price: '₺4.150',
        score: 'Eşleşme skoru 93',
        summary: [
          'Köşe planında alanı kaybetmeden masa yüzeyi kazandırır.',
          'Depolama modülü ile dağınıklığı görünmez tutar.',
          'Dar oda senaryosunda odaklanmış çalışma yüzeyi sağlar.',
        ],
      },
    ],
    filters: [
      { label: 'Genişlik', value: '50–70 cm', type: 'range', meta: 'Dar alan modu' },
      { label: 'Renk', value: 'Açık ton', type: 'options', meta: 'Koyu renkler geri planda', options: ['Açık ton', 'Koyu ton'], selected: 0 },
      { label: 'Kategori', value: 'Masa', type: 'pills', meta: 'Ana seçim', options: ['Masa', 'Sandalye', 'Raf'], selected: 0 },
      { label: 'Kullanım', value: 'Çok amaçlı', type: 'switch', meta: 'Açık' },
    ],
    compare: [
      { name: 'Fold-Light 58', price: '₺6.700', note: 'Kompakt katlanır yüzey, günlük kullanımda alanı korur.', durability: 70, space: 'Katlanabilir (58 cm)', value: 'Çok yüksek' },
      { name: 'Airline Compact 64', price: '₺7.300', note: 'İnce gövde, hafif malzeme ve düşük görsel yoğunluk.', durability: 74, space: 'Sabit (64 cm)', value: 'Yüksek' },
      { name: 'Corner Mini 72', price: '₺8.900', note: 'Köşe yerleşimi ile hacim kaybını minimize eder.', durability: 82, space: 'L-form (120 x 90 cm)', value: 'Orta' },
    ],
    roadmap: [
      { badge: '1. Veri', title: 'Kolay değişen katalog', text: 'Aynı bileşenler farklı ürün tipleri için kullanılabilir olmalı.' },
      { badge: '2. Durum', title: 'Arama oturumu', text: 'Kullanıcı sorgusu, filtreler ve karşılaştırma tek oturum nesnesinde tutulmalı.' },
      { badge: '3. Servis', title: 'Skorlama katmanı', text: 'Alan, fiyat, kullanım ve teslimatı ayrı ağırlıklarla değerlendirebilmeliyiz.' },
      { badge: '4. Gözlem', title: 'A/B deneyi altyapısı', text: 'Sıralama mantığı ve metin açıklamaları kontrollü deneylerle iyileştirilmeli.' },
    ],
  },
];