# MEDIFIND

PROMPT FOR APP PLANNING AGENT:

I want to build a medical equipment marketplace app (similar to Amazon but focused entirely on health and medical equipment). Below are the full specifications:

APP NAME / PURPOSE A marketplace app that connects sellers, hospitals, individuals, physiotherapists, and healthcare professionals to find and purchase medical equipment quickly and efficiently.

PAGES & FEATURES

1. Main Page

Displays product cards/components for individual items being sold

Each card shows: product image, product name, price, star ratings, and company/seller info

Filters panel with sorting by: Price, Groups of Devices, Brands

2. AI Chat Box (highlighted as a key feature)

Uses AI to interpret uploaded medical records and recommend relevant products from the app based on the user's active filters

Can interpret instructions and directions for the use of medical equipment

Acts as a smart shopping assistant

3. "Buy Physical" Page

User inputs their address and what they're looking for

Returns recommendations of nearby physical stores and places where they can get the equipment

Must include an embedded map

4. Cart Page

Shows all orders the user has made and received

Tracks delivery progress

Allows users to pay for items directly from the app

5. AI Tool Page (listed in sidebar navigation)

Standalone AI tool separate from the chatbot

NAVIGATION SIDEBAR

Search / Ask Chatbot

Buy Physical

Cart

AI Tool

PRODUCT CATEGORIES 👓 Vision — glasses, contact lenses, lens cleaners 💊 Vitamins — vitamins, supplements, minerals 🏥 Medical — thermometers, blood pressure monitors, pulse oximeters 🩹 Care — first aid kits, bandages, wound care products 🦴 Mobility — wheelchairs, walkers, canes, crutches 💪 Fitness — dumbbells, resistance bands, yoga mats 🏃 Recovery — foam rollers, massage guns, compression sleeves 🤸 Therapy — physiotherapy tools, exercise balls, therapy bands ❤️ Monitoring — glucose monitors, heart rate monitors, smart health devices 😴 Sleep — sleep masks, posture pillows, CPAP accessories 🧘 Wellness — aromatherapy, posture correctors, relaxation products 🍎 Nutrition — protein powders, meal replacements, healthy snacks

Additional categories noted: Eye Care, Supplements, First Aid, Nutrition, Therapy, Recovery, Fitness, Mobility

TARGET USERS

Individual consumers

Hospitals and clinics

Physiotherapists

Sellers and suppliers of medical equipment

General healthcare professionals

CORE GOALS

Reduce time spent searching for medical equipment

Make equipment discovery faster for both buyers and professionals

Provide AI-powered guidance for product selection and equipment usage

Bridge online purchasing with local physical store discovery

DELIVERABLE REQUESTED FROM YOU (the planning agent): Please produce a full app development plan including: recommended tech stack, database schema, page-by-page feature breakdown, AI integration strategy (for the chatbot and medical record interpretation), map integration approach, user roles and permissions, monetization options, and a phased development roadmap.

You can paste this directly into your next conversation. Want me to also build a prototype or mockup of any of the pages?





You said: add other groups of filters that can hlp, maybe a filter for price range, for brands, for deals availale for the equiptment.

add other groups of filters that can hlp, maybe a filter for price range, for brands, for deals availale for the equiptment.

11:59 PM





Claude responded: Here's the updated prompt with the expanded filters section:

Here's the updated prompt with the expanded filters section:

PROMPT FOR APP PLANNING AGENT:

I want to build a medical equipment marketplace app (similar to Amazon but focused entirely on health and medical equipment). Below are the full specifications:

APP NAME / PURPOSE A marketplace app that connects sellers, hospitals, individuals, physiotherapists, and healthcare professionals to find and purchase medical equipment quickly and efficiently.

PAGES & FEATURES

1. Main Page

Displays product cards/components for individual items being sold

Each card shows: product image, product name, price, star ratings, and company/seller info

Full filters panel (see filters section below)

2. AI Chat Box (highlighted as a key feature)

Uses AI to interpret uploaded medical records and recommend relevant products from the app based on the user's active filters

Can interpret instructions and directions for the use of medical equipment

Acts as a smart shopping assistant

3. "Buy Physical" Page

User inputs their address and what they're looking for

Returns recommendations of nearby physical stores and places where they can get the equipment

Must include an embedded map

4. Cart Page

Shows all orders the user has made and received

Tracks delivery progress

Allows users to pay for items directly from the app

5. AI Tool Page (listed in sidebar navigation)

Standalone AI tool separate from the chatbot

NAVIGATION SIDEBAR

Search / Ask Chatbot

Buy Physical

Cart

AI Tool

FILTERS & SORTING SYSTEM

Price Filters

Price range slider (min–max input)

Budget tiers: Under $25 / $25–$50 / $50–$100 / $100–$250 / $250–$500 / $500+

Sort by: Lowest price first, Highest price first

Brand Filters

Searchable brand list (e.g. Omron, Philips, 3M, ResMed, Braun, Fitbit, etc.)

Option to select multiple brands simultaneously

"Top Brands Only" toggle

Category / Device Group Filters

Filter by product category (all 12 categories listed below)

Sub-category filtering within each group

Multi-category selection supported

Deals & Discounts Filters

On Sale / Discounted items toggle

Percentage discount tiers: 10%+ off / 25%+ off / 50%+ off

Clearance items toggle

Bundle deals available toggle

Free shipping available toggle

Limited time offers toggle

Bulk/wholesale pricing available (for hospitals and clinics)

Ratings & Reviews Filters

Minimum star rating: 3★ and above / 4★ and above / 4.5★ and above

Verified purchases only toggle

Most reviewed first sort option

Availability Filters

In stock only toggle

Ships within 24hrs toggle

Available for local pickup toggle

Available in nearby physical stores toggle (links to Buy Physical page)

Seller Filters

Filter by seller type: Individual Seller / Certified Medical Supplier / Hospital Supplier / Brand Official Store

Verified sellers only toggle

Condition Filters

New

Certified Refurbished

Used — Good Condition

PRODUCT CATEGORIES 👓 Vision — glasses, contact lenses, lens cleaners 💊 Vitamins — vitamins, supplements, minerals 🏥 Medical — thermometers, blood pressure monitors, pulse oximeters 🩹 Care — first aid kits, bandages, wound care products 🦴 Mobility — wheelchairs, walkers, canes, crutches 💪 Fitness — dumbbells, resistance bands, yoga mats 🏃 Recovery — foam rollers, massage guns, compression sleeves 🤸 Therapy — physiotherapy tools, exercise balls, therapy bands ❤️ Monitoring — glucose monitors, heart rate monitors, smart health devices 😴 Sleep — sleep masks, posture pillows, CPAP accessories 🧘 Wellness — aromatherapy, posture correctors, relaxation products 🍎 Nutrition — protein powders, meal replacements, healthy snacks

TARGET USERS

Individual consumers

Hospitals and clinics

Physiotherapists

Sellers and suppliers of medical equipment

General healthcare professionals

CORE GOALS

Reduce time spent searching for medical equipment

Make equipment discovery faster for both buyers and professionals

Provide AI-powered guidance for product selection and equipment usage

Bridge online purchasing with local physical store discovery

DELIVERABLE REQUESTED FROM YOU (the planning agent): Please produce a full app development plan including: recommended tech stack, database schema, page-by-page feature breakdown, AI integration strategy (for the chatbot and medical record interpretation), map integration approach, user roles and permissions, monetization options, and a phased development roadmap.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://medifind-shop.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f7af91f4-ffde-4ca9-8719-8e402ce16efc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
