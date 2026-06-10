# MedMarket — Medical Equipment Marketplace

A marketplace for medical and health equipment with AI-powered shopping assistance, local store discovery, and real payments.

## Pages & Features

### 1. Marketplace (Home)
- Product grid: image, name, price, star rating, seller name/badge, deal badges
- Full filter panel (collapsible sidebar on desktop, drawer on mobile):
  - **Price**: range slider + budget tiers (<$25 → $500+), sort low/high
  - **Brands**: searchable multi-select, "Top Brands Only" toggle
  - **Categories**: all 12 groups (Vision, Vitamins, Medical, Care, Mobility, Fitness, Recovery, Therapy, Monitoring, Sleep, Wellness, Nutrition) with sub-categories, multi-select
  - **Deals**: on sale, discount tiers (10/25/50%+), clearance, bundles, free shipping, limited-time, bulk/wholesale pricing
  - **Ratings**: 3★+/4★+/4.5★+, most-reviewed sort
  - **Availability**: in stock, ships in 24h, local pickup, available in nearby stores
  - **Seller type**: Individual / Certified Medical Supplier / Hospital Supplier / Brand Official Store, verified-only toggle
  - **Condition**: New / Certified Refurbished / Used
- Search bar + active filter chips with one-click clear
- Product detail page: gallery, specs, reviews, seller info, add to cart

### 2. AI Chat Assistant
- Streaming chat (Lovable AI) that acts as a smart shopping assistant
- Upload medical records (PDF/image) — AI interprets them and recommends matching products from the catalog, respecting the user's active filters
- Can explain usage instructions and safety directions for any equipment
- Recommended products render as clickable product cards inside the chat

### 3. Buy Physical
- Address input with autocomplete + "what are you looking for" field
- Embedded Google Map showing nearby pharmacies / medical supply stores
- Store list with distance, address, and category match

### 4. Cart & Orders
- Cart with quantities and totals
- Stripe checkout — real payments in the app
- Order history with delivery progress tracker (placed → confirmed → shipped → delivered)

### 5. AI Tool (standalone, tabbed)
- **Tab A — Medical Record Analyzer**: upload records, get a structured equipment-needs report with linked products
- **Tab B — Equipment Usage Guide**: pick a product or upload a device photo, get AI usage instructions and safety tips

### 6. Seller Dashboard
- Sellers sign in to list/edit products, set deals, view their orders
- Catalog is also pre-seeded with ~60+ realistic products across all 12 categories so the app feels alive on day one

### Navigation
Sidebar: Marketplace / Ask Chatbot / Buy Physical / Cart / AI Tool / Sell (collapsible, icons + labels)

## Backend (Lovable Cloud)
- **Database**: products, categories, brands, sellers, reviews, carts, orders + order items, user roles (separate roles table)
- **Auth**: optional — browse and use AI freely; login required at checkout and for sellers
- **Storage**: product images, uploaded medical records (private bucket)
- **AI**: Lovable AI Gateway (Gemini) for chat, record interpretation (multimodal), and the AI tool — no external API keys needed
- **Maps**: Google Maps connector for the embedded map, geocoding, and nearby place search
- **Payments**: Lovable's built-in Stripe integration (eligibility check runs first; physical-goods catalog means Stripe with tax calculation at checkout)

## Phased Roadmap
1. **Phase 1 (this build)**: design system + sidebar layout, seeded catalog, marketplace with full filters, product pages, cart (local), backend setup
2. **Phase 2**: AI chatbot with record upload + AI Tool page
3. **Phase 3**: Buy Physical with Google Maps connector
4. **Phase 4**: Auth, Stripe checkout, order tracking, seller dashboard

I'll start with Phase 1 on approval and we'll move through phases in order — payments and maps require connecting their integrations along the way.

## Design Direction
Clean clinical-modern look: crisp white surfaces, a calm medical teal/blue accent, soft category color coding, generous whitespace, distinctive typography — trustworthy like a healthcare brand, fast-scanning like a marketplace.