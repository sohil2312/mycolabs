export const productTabs = [
  {
    id: 'website',
    label: 'Websites',
    title: 'Website Building',
    kicker: 'Fast buyer trust',
    summary: 'We build simple, fast websites that explain who you are, what you sell, and how a buyer can contact you.',
    examples: [
      {
        name: 'Starter Website',
        description: 'One clean page with company intro, products, WhatsApp, Google Maps, and inquiry buttons.'
      },
      {
        name: 'Catalogue Website',
        description: 'Product categories, product cards, photos, specs, and quote buttons for manufacturers with multiple items.'
      },
      {
        name: 'Growth Website',
        description: 'A stronger website with SEO pages, analytics, lead paths, and better product discovery.'
      }
    ],
    chips: ['Company story', 'Product sections', 'WhatsApp CTA', 'Google Maps', 'Basic SEO'],
    featured: 'Catalogue Website'
  },
  {
    id: 'catalogue',
    label: 'Catalogues',
    title: 'Catalogue Building',
    kicker: 'Sales-ready product proof',
    summary: 'We organize your products into clear catalogues that are easy to share with buyers on WhatsApp, email, and sales visits.',
    examples: [
      {
        name: 'PDF Sales Catalogue',
        description: 'A polished PDF with product photos, specifications, use cases, and inquiry details.'
      },
      {
        name: 'Category Catalogue',
        description: 'Products divided by category so buyers can find the right item quickly.'
      },
      {
        name: 'WhatsApp Mini Catalogue',
        description: 'A short mobile-friendly catalogue for fast sharing with active buyers.'
      }
    ],
    chips: ['Product categories', 'Specs', 'Photos', 'QR inquiry', 'Buyer sharing'],
    featured: 'Category Catalogue'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    title: 'WhatsApp Bots & Automation',
    kicker: 'Quick replies, fewer missed leads',
    summary: 'We set up simple WhatsApp flows that answer common questions, collect buyer details, and help your team follow up.',
    examples: [
      {
        name: 'WhatsApp Auto Reply Bot',
        description: 'Replies with catalogue links, location, timing, and basic product information when your team is busy.'
      },
      {
        name: 'Lead Follow-up Automation',
        description: 'Keeps new inquiries organized with reminders so serious buyers are not forgotten.'
      },
      {
        name: 'Order/Inquiry Form Flow',
        description: 'Collects product name, quantity, location, and callback request in a simple step-by-step flow.'
      }
    ],
    chips: ['Auto reply', 'Lead capture', 'Follow-up reminders', 'Catalogue links', 'Inquiry forms'],
    featured: 'WhatsApp Auto Reply Bot'
  },
  {
    id: 'growth',
    label: 'Growth',
    title: 'Marketplace & Search Growth',
    kicker: 'Better discovery',
    summary: 'We improve the places buyers already check before calling: IndiaMART, Google Business Profile, and search results.',
    examples: [
      {
        name: 'IndiaMART Improvement',
        description: 'Cleaner product listings, stronger descriptions, better photos, and a smoother inquiry path.'
      },
      {
        name: 'Google Business Profile Improvement',
        description: 'Profile cleanup, product/service updates, photos, posts, and a simple review request path.'
      },
      {
        name: 'SEO Starter Pack',
        description: 'Page titles, descriptions, local keywords, headings, and structure that help your website become search-ready.'
      }
    ],
    chips: ['IndiaMART', 'Google Business Profile', 'SEO', 'Reviews', 'Local search'],
    featured: 'SEO Starter Pack'
  },
  {
    id: 'automation',
    label: 'Tools',
    title: 'Simple Software Tools',
    kicker: 'Daily work made easier',
    summary: 'We build small tools that help you track leads, collect quote details, and request reviews without complex software.',
    examples: [
      {
        name: 'Lead Tracker',
        description: 'A simple dashboard or sheet for buyer name, product, status, next follow-up, and owner.'
      },
      {
        name: 'Quote Request Tool',
        description: 'A clean form that turns buyer needs into organized quote details for your team.'
      },
      {
        name: 'Review Request Tool',
        description: 'A simple WhatsApp-ready flow to ask happy customers for Google reviews.'
      }
    ],
    chips: ['Lead status', 'Quote forms', 'Review flow', 'Team handover', 'Simple dashboards'],
    featured: 'Lead Tracker'
  }
];

export const packageOptions = [
  {
    id: 'website',
    label: 'Website',
    description: 'A fast page or catalogue website for buyer trust.',
    defaultChecked: true
  },
  {
    id: 'catalogue',
    label: 'Catalogue',
    description: 'PDF or category catalogue for product clarity.',
    defaultChecked: true
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Bot',
    description: 'Auto reply, catalogue links, and lead capture.',
    defaultChecked: true
  },
  {
    id: 'indiamart',
    label: 'IndiaMART',
    description: 'Better listings, descriptions, photos, and inquiries.',
    defaultChecked: true
  },
  {
    id: 'gbp',
    label: 'Google Business Profile',
    description: 'Profile cleanup, services, posts, photos, and reviews.',
    defaultChecked: true
  },
  {
    id: 'seo',
    label: 'SEO',
    description: 'Search-ready pages, headings, titles, and keywords.',
    defaultChecked: true
  },
  {
    id: 'automation',
    label: 'Automation Tool',
    description: 'Lead tracker, quote form, or review request flow.',
    defaultChecked: false
  }
];

export const packageResults = [
  {
    id: 'starter',
    name: 'Starter Digital Pack',
    match: (selected) => selected.length <= 2,
    summary: 'Best when you need one clean starting point, usually a website or catalogue with WhatsApp inquiry.'
  },
  {
    id: 'catalogue-growth',
    name: 'Catalogue Growth Pack',
    match: (selected) => selected.includes('catalogue') && selected.includes('website') && selected.length <= 4,
    summary: 'Best when buyers need clear product categories, specs, and a simple inquiry path.'
  },
  {
    id: 'automation-growth',
    name: 'Automation Growth Pack',
    match: (selected) => selected.includes('automation') || selected.includes('whatsapp'),
    summary: 'Best when inquiries come from many places and your team needs better follow-up.'
  },
  {
    id: 'full',
    name: 'Full Digital Presence Pack',
    match: () => true,
    summary: 'Best when you want website, catalogue, WhatsApp, IndiaMART, Google profile, and SEO to work together.'
  }
];

export const processSteps = [
  'Understand your products, buyer type, and current digital presence.',
  'Organize product categories, photos, specifications, and common buyer questions.',
  'Build the selected website, catalogue, WhatsApp flow, profile updates, or simple tool.',
  'Connect inquiry paths so buyers can call, WhatsApp, or send quote details easily.',
  'Review everything with you, hand over the assets, and keep the next growth step clear.'
];

export const growthSignals = [
  {
    title: 'Gujarat-wide reach',
    description: 'The message is built for manufacturers across Gujarat, not only one local market.'
  },
  {
    title: 'Simple product language',
    description: 'Each offer explains what buyers get in plain terms so owners do not ignore it.'
  },
  {
    title: 'Search and marketplace ready',
    description: 'Website, IndiaMART, Google profile, and SEO improvements support each other.'
  },
  {
    title: 'WhatsApp-first follow-up',
    description: 'Most inquiries can start from WhatsApp, then move into a catalogue, quote, or callback.'
  }
];
