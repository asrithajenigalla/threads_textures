import { Garment } from '../types';

export const GARMENTS: Garment[] = [
  {
    id: 'sari',
    name: 'Royal Kanchipuram Sari',
    origin: 'Tamil Nadu & Varanasi, India',
    category: 'Haute Couture Drape',
    silhouette: 'Six-Yard Architectural Drape with Knife Pleats & Grand Pallu',
    basePrice: 1450,
    imageSrc: '/src/assets/images/atelier_sari_mannequin_1790613780063.jpg',
    maskSrc: '/src/assets/masks/mask_sari.png',
    description: 'Woven on traditional Korvai pit looms with pure mulberry silk warp and pure silver electroplated 24k gold zari weft, featuring majestic temple borders and embroidered silk choli.',
    heritageText: 'Dating back over four centuries to the royal courts of the Chola and Vijayanagara empires, each bespoke drape requires between 180 to 240 artisan hours on timber handlooms.',
    recommendedWeaves: ['kanchipuram_silk', 'banarasi_brocade'],
    detailFocusTitle: 'Pallu Zari & Border Korvai Seam',
    tags: ['Korvai Weave', '24k Zari', 'Pure Mulberry Silk', 'Hand-Pleated']
  },
  {
    id: 'sherwani',
    name: 'Imperial Maharaja Sherwani',
    origin: 'Rajasthan & Awadh, India',
    category: 'Royal Bespoke Coat & Churidar',
    silhouette: 'Structured Long Royal Coat with High Nehru Collar & Silk Dupatta',
    basePrice: 1850,
    imageSrc: '/src/assets/images/atelier_sherwani_mannequin_1790613792328.jpg',
    maskSrc: '/src/assets/masks/mask_sherwani.png',
    description: 'Bespoke royal coat tailored in champagne jacquard silk with three-dimensional gold zardozi and marodi hand-embroidery, complete with tailored churidar and fringed royal silk stole.',
    heritageText: 'Worn in royal darbars of Awadh and Rajputana, this silhouette is shaped with horsehair canvas chest structuring and lined in fine unbleached habotai silk.',
    recommendedWeaves: ['banarasi_brocade', 'raw_chanderi'],
    detailFocusTitle: 'Mandarin Collar & Placket Buttons',
    tags: ['Zardozi Work', 'Handmade Frogs', 'Churidar Set', 'Silk Dupatta']
  },
  {
    id: 'kimono',
    name: 'Ceremonial Silk Kimono',
    origin: 'Kyoto Nishijin, Japan',
    category: 'Traditional Ceremonial Robe',
    silhouette: 'T-Line Wrap Silhouette with Flowing Tamoto Sleeves & Brocade Obi',
    basePrice: 1650,
    imageSrc: '/src/assets/images/atelier_kimono_mannequin_1790613807565.jpg',
    maskSrc: '/src/assets/masks/mask_kimono.png',
    description: 'Woven from heavyweight Kyoto Nishijin silk with silver and gold threaded botanical peonies, structured obi belt, hand-knotted obijime cord, and immaculate geometric lapel lines.',
    heritageText: 'Crafted according to the Tanmono bolt proportioning system, utilizing uncut continuous silk woven on centuries-old drawlooms in Kyoto.',
    recommendedWeaves: ['banarasi_brocade', 'kanchipuram_silk'],
    detailFocusTitle: 'Obi-jime Knot & Tamoto Sleeve Drape',
    tags: ['Nishijin Silk', 'Gold Foil Leaf', 'Brocade Obi', 'Ceremonial Cut']
  },
  {
    id: 'qipao',
    name: 'Imperial Brocade Qipao',
    origin: 'Shanghai & Suzhou, China',
    category: 'Haute Couture Cheongsam',
    silhouette: 'Architecturally Fitted Gown with High Collar & Silk Piped Slits',
    basePrice: 1150,
    imageSrc: '/src/assets/images/atelier_qipao_mannequin_1790613818697.jpg',
    maskSrc: '/src/assets/masks/mask_qipao.png',
    description: 'Figure-skimming silk brocade woven with gilded lotus medallions and celestial clouds, adorned with bespoke handmade silk pankou frog fastenings and bias piping.',
    heritageText: 'Refined in 1920s Shanghai couture houses, marrying ancient Manchu banners with bespoke French bias-cutting techniques and Suzhou silk embroidery.',
    recommendedWeaves: ['banarasi_brocade', 'raw_chanderi'],
    detailFocusTitle: 'Handmade Silk Pankou Frog Buttons',
    tags: ['Suzhou Embroidery', 'Pankou Closures', 'Bias Silk Trim', 'Fitted Cheongsam']
  },
  {
    id: 'kaftan',
    name: 'Sovereign Royal Kaftan',
    origin: 'Marrakech & Istanbul Atelier',
    category: 'Flowing Silk Couturier Gown',
    silhouette: 'Voluminous Floor-Length Drape with Kimono Sleeves & Ornate Yoke',
    basePrice: 980,
    imageSrc: '/src/assets/images/atelier_kaftan_mannequin_1790613830593.jpg',
    maskSrc: '/src/assets/masks/mask_kaftan.png',
    description: 'Fluid floor-sweeping gown in pure raw silk organza featuring hand-embroidered metallic gold zardozi across the neckline and front placket with Moroccan geometric motifs.',
    heritageText: 'Originating in Ottoman and Andalusian imperial wardrobes, tailored to provide airy breathability while displaying breathtaking metallic cord embroidery.',
    recommendedWeaves: ['designer_organza', 'raw_chanderi'],
    detailFocusTitle: 'Gilded Zardozi Neckline & Placket',
    tags: ['Moroccan Sfifa', 'Organza Sheer', 'Cascading Sleeves', '24k Threadwork']
  },
  {
    id: 'batik_shirt',
    name: 'Bespoke Tulis Batik Shirt',
    origin: 'Yogyakarta & Solo, Indonesia',
    category: 'Artisanal Tailored Menswear',
    silhouette: 'Tailored Fit Spread Collar Shirt with Bespoke Parang Alignment',
    basePrice: 480,
    imageSrc: '/src/assets/images/atelier_batik_shirt_mannequin_1790613846256.jpg',
    maskSrc: '/src/assets/masks/mask_batik_shirt.png',
    description: 'Created using genuine Canting hot-wax resist drawing on primissima silk-cotton, aligned with mathematical continuity across the front placket, collar, and pockets.',
    heritageText: 'Each bespoke shirt requires up to 60 days of wax-resist layering, indigo bath dipping, and boiling to release ancestral Parang and Kawung royalty motifs.',
    recommendedWeaves: ['raw_chanderi', 'kanchipuram_silk'],
    detailFocusTitle: 'Pattern-Matched Placket & Mother-of-Pearl Buttons',
    tags: ['Batik Tulis', 'Natural Indigo Dye', 'Canting Hand-Drawn', 'Mother-of-Pearl']
  }
];

export const ARTISAN_INFO = {
  name: 'Ustad Maqbool Ansari',
  title: '4th Generation Master Weaver & Loom Custodian',
  location: 'Varanasi & Kanchipuram Guild Atelier',
  experience: '38 Years of Heritage Handloom Weaving',
  portraitSrc: '/src/assets/images/artisan_master_weaver_1790613858229.jpg',
  specialties: ['24k Korvai Border Interlocking', 'Silver Electroplated Zari Weft', 'Jacquard Loom Drafting', 'Botanical Madder & Indigo Vat Dyeing'],
  bio: 'Direct descendant of the royal weaver guild of Awadh, Ustad Ansari maintains 12 restored mahogany fly-shuttle pit looms. His workshop supplies bespoke textiles for private collectors, global exhibitions, and state ceremonies.'
};
