/**
 * SEO Configuration for Multi-Region Targeting
 * Supports: UK, USA, Canada, India, Sri Lanka
 * This file helps optimize content for search engines based on user region
 */

export const SEO_CONFIG = {
  // Regional base URLs and language codes
  regions: {
    us: {
      code: 'US',
      lang: 'en-US',
      baseUrl: 'https://wellwetx.com/us/',
      hreflang: 'en-US',
      name: 'United States',
      timezone: 'America/New_York'
    },
    uk: {
      code: 'GB',
      lang: 'en-GB',
      baseUrl: 'https://wellwetx.com/uk/',
      hreflang: 'en-GB',
      name: 'United Kingdom',
      timezone: 'Europe/London'
    },
    ca: {
      code: 'CA',
      lang: 'en-CA',
      baseUrl: 'https://wellwetx.com/ca/',
      hreflang: 'en-CA',
      name: 'Canada',
      timezone: 'America/Toronto'
    },
    in: {
      code: 'IN',
      lang: 'en-IN',
      baseUrl: 'https://wellwetx.com/in/',
      hreflang: 'en-IN',
      name: 'India',
      timezone: 'Asia/Kolkata'
    },
    lk: {
      code: 'LK',
      lang: 'en-LK',
      baseUrl: 'https://wellwetx.com/lk/',
      hreflang: 'x-default',
      name: 'Sri Lanka',
      timezone: 'Asia/Colombo'
    }
  },

  // SEO Keywords by region
  keywords: {
    us: ['adult videos USA', 'premium content United States', 'streaming US'],
    uk: ['adult videos UK', 'premium content British', 'streaming UK'],
    ca: ['adult videos Canada', 'premium content Canadian', 'streaming Canada'],
    in: ['adult videos India', 'premium content Indian', 'streaming India'],
    lk: ['adult videos Sri Lanka', 'premium content Sri Lanka', 'streaming Sri Lanka']
  },

  // Meta descriptions by region
  descriptions: {
    us: 'Premium adult video platform serving United States users with high-quality streaming content.',
    uk: 'Premium adult video platform serving United Kingdom users with high-quality streaming content.',
    ca: 'Premium adult video platform serving Canadian users with high-quality streaming content.',
    in: 'Premium adult video platform serving Indian users with high-quality streaming content.',
    lk: 'Premium adult video platform serving Sri Lankan users with high-quality streaming content.'
  },

  // Structured data area codes for schema.org
  countryCodes: {
    us: 'US',
    uk: 'GB',
    ca: 'CA',
    in: 'IN',
    lk: 'LK'
  },

  // GeoIP detection headers to check
  geoHeaders: [
    'cf-ipcountry',      // Cloudflare
    'x-forwarded-for',   // Standard proxy header
    'x-client-country'   // Alternative header
  ],

  // Detect user region from browser/IP
  getRegionFromGeo: (geoData) => {
    if (!geoData) return 'default';
    const code = geoData.toLowerCase();
    
    switch (code) {
      case 'us': return 'us';
      case 'gb': return 'uk';
      case 'ca': return 'ca';
      case 'in': return 'in';
      case 'lk': return 'lk';
      default: return 'default';
    }
  },

  // Generate hreflang tags for current page
  generateHreflangs: (currentPath = '/') => {
    const hreflangs = [];
    
    Object.entries(SEO_CONFIG.regions).forEach(([key, region]) => {
      hreflangs.push({
        rel: 'alternate',
        hreflang: region.hreflang,
        href: region.baseUrl + currentPath
      });
    });
    
    // Add x-default fallback
    hreflangs.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://wellwetx.com' + currentPath
    });
    
    return hreflangs;
  },

  // Generate structured data for a region
  generateStructuredData: (page = 'home', region = 'default') => {
    const regionData = SEO_CONFIG.regions[region];
    
    return {
      '@context': 'https://schema.org',
      '@type': page === 'contact' ? 'ContactPage' : 'WebPage',
      'name': `Velvet - Premium Adult Video Platform`,
      'url': regionData ? regionData.baseUrl : 'https://wellwetx.com/',
      'areaServed': regionData ? 
        {
          '@type': 'Country',
          'name': regionData.name
        } : 
        [
          { '@type': 'Country', 'name': 'United States' },
          { '@type': 'Country', 'name': 'United Kingdom' },
          { '@type': 'Country', 'name': 'Canada' },
          { '@type': 'Country', 'name': 'India' },
          { '@type': 'Country', 'name': 'Sri Lanka' }
        ],
      'inLanguage': regionData ? regionData.lang : 'en-US',
      'author': {
        '@type': 'Organization',
        'name': 'Velvet',
        'url': 'https://wellwetx.com'
      }
    };
  },

  // Generate dynamic meta tags for region
  generateMetaTags: (region = 'default') => {
    const regionData = SEO_CONFIG.regions[region];
    
    return {
      description: SEO_CONFIG.descriptions[region] || SEO_CONFIG.descriptions.us,
      keywords: (SEO_CONFIG.keywords[region] || SEO_CONFIG.keywords.us).join(', '),
      amphtml: regionData ? `${regionData.baseUrl}amp/` : null,
      canonical: regionData ? regionData.baseUrl : 'https://wellwetx.com/'
    };
  }
};

// Helper function to inject hreflang tags
export function injectHreflangs(currentPath = '/') {
  const head = document.head;
  const hreflangs = SEO_CONFIG.generateHreflangs(currentPath);
  
  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  
  // Add new hreflang tags
  hreflangs.forEach(link => {
    const linkEl = document.createElement('link');
    linkEl.rel = link.rel;
    linkEl.hreflang = link.hreflang;
    linkEl.href = link.href;
    head.appendChild(linkEl);
  });
}

// Helper function to set og:url based on region
export function updateOpenGraphUrl(region = 'default') {
  const regionData = SEO_CONFIG.regions[region];
  const ogUrl = document.querySelector('meta[property="og:url"]');
  
  if (ogUrl && regionData) {
    ogUrl.setAttribute('content', regionData.baseUrl);
  }
}

// Helper function to detect user region
export function detectUserRegion() {
  // Try to get from localStorage first (user preference)
  const stored = localStorage.getItem('userRegion');
  if (stored && SEO_CONFIG.regions[stored]) {
    return stored;
  }
  
  // Try to get from browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.includes('en-US')) return 'us';
  if (browserLang.includes('en-GB')) return 'uk';
  if (browserLang.includes('en-CA')) return 'ca';
  if (browserLang.includes('en-IN')) return 'in';
  if (browserLang.includes('en-LK')) return 'lk';
  
  // Default to US
  return 'us';
}

// Initialize SEO optimization for detected region
export function initializeRegionalSEO() {
  const region = detectUserRegion();
  injectHreflangs();
  updateOpenGraphUrl(region);
  return region;
}

export default SEO_CONFIG;
