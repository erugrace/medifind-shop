import type { Category, CategoryId, Product, Seller } from "./types";

import catVision from "@/assets/cat-vision.jpg";
import catVitamins from "@/assets/cat-vitamins.jpg";
import catMedical from "@/assets/cat-medical.jpg";
import catCare from "@/assets/cat-care.jpg";
import catMobility from "@/assets/cat-mobility.jpg";
import catFitness from "@/assets/cat-fitness.jpg";
import catRecovery from "@/assets/cat-recovery.jpg";
import catTherapy from "@/assets/cat-therapy.jpg";
import catMonitoring from "@/assets/cat-monitoring.jpg";
import catSleep from "@/assets/cat-sleep.jpg";
import catWellness from "@/assets/cat-wellness.jpg";
import catNutrition from "@/assets/cat-nutrition.jpg";

export const CATEGORY_IMAGES: Record<CategoryId, string> = {
  vision: catVision,
  vitamins: catVitamins,
  medical: catMedical,
  care: catCare,
  mobility: catMobility,
  fitness: catFitness,
  recovery: catRecovery,
  therapy: catTherapy,
  monitoring: catMonitoring,
  sleep: catSleep,
  wellness: catWellness,
  nutrition: catNutrition,
};

export const CATEGORIES: Category[] = [
  { id: "vision", name: "Vision", emoji: "👓", blurb: "Glasses, contacts & lens care", subcategories: ["Glasses", "Contact Lenses", "Lens Care"] },
  { id: "vitamins", name: "Vitamins", emoji: "💊", blurb: "Vitamins, supplements & minerals", subcategories: ["Vitamins", "Supplements", "Minerals"] },
  { id: "medical", name: "Medical", emoji: "🏥", blurb: "Thermometers, BP monitors & more", subcategories: ["Thermometers", "Blood Pressure", "Respiratory", "Diagnostics"] },
  { id: "care", name: "Care", emoji: "🩹", blurb: "First aid & wound care", subcategories: ["First Aid Kits", "Bandages", "Wound Care"] },
  { id: "mobility", name: "Mobility", emoji: "🦴", blurb: "Wheelchairs, walkers & canes", subcategories: ["Wheelchairs", "Walkers", "Canes", "Crutches"] },
  { id: "fitness", name: "Fitness", emoji: "💪", blurb: "Dumbbells, bands & mats", subcategories: ["Weights", "Resistance Bands", "Mats"] },
  { id: "recovery", name: "Recovery", emoji: "🏃", blurb: "Foam rollers & massage guns", subcategories: ["Massage", "Foam Rollers", "Compression"] },
  { id: "therapy", name: "Therapy", emoji: "🤸", blurb: "Physiotherapy tools & bands", subcategories: ["Physio Tools", "Exercise Balls", "Therapy Bands"] },
  { id: "monitoring", name: "Monitoring", emoji: "❤️", blurb: "Glucose, heart rate & smart devices", subcategories: ["Glucose", "Heart Rate", "Smart Devices"] },
  { id: "sleep", name: "Sleep", emoji: "😴", blurb: "Sleep masks, pillows & CPAP", subcategories: ["Sleep Masks", "Pillows", "CPAP Accessories"] },
  { id: "wellness", name: "Wellness", emoji: "🧘", blurb: "Aromatherapy & relaxation", subcategories: ["Aromatherapy", "Posture", "Relaxation"] },
  { id: "nutrition", name: "Nutrition", emoji: "🍎", blurb: "Protein, meal replacements & snacks", subcategories: ["Protein", "Meal Replacements", "Healthy Snacks"] },
];

export const SELLERS: Seller[] = [
  { id: "medisupply", name: "MediSupply Co.", type: "certified", verified: true, rating: 4.8 },
  { id: "omron-official", name: "Omron Official Store", type: "brand", verified: true, rating: 4.9 },
  { id: "carepoint", name: "CarePoint Hospital Supply", type: "hospital", verified: true, rating: 4.7 },
  { id: "wellness-direct", name: "Wellness Direct", type: "individual", verified: false, rating: 4.3 },
  { id: "physiopro", name: "PhysioPro Equipment", type: "certified", verified: true, rating: 4.6 },
  { id: "homehealth", name: "HomeHealth Hub", type: "individual", verified: true, rating: 4.5 },
  { id: "resmed-official", name: "ResMed Official Store", type: "brand", verified: true, rating: 4.8 },
];

export const TOP_BRANDS = ["Omron", "Philips", "3M", "ResMed", "Braun", "Fitbit", "TheraBand", "Theragun", "Withings", "Nature Made"];

let n = 0;
function p(base: Omit<Product, "id" | "inStock" | "shipsIn24h" | "localPickup" | "nearbyStores" | "freeShipping" | "clearance" | "bundle" | "limitedTime" | "bulkPricing" | "condition"> & Partial<Product>): Product {
  n += 1;
  return {
    id: `prod-${n}`,
    condition: "new",
    inStock: true,
    shipsIn24h: false,
    localPickup: false,
    nearbyStores: false,
    freeShipping: false,
    clearance: false,
    bundle: false,
    limitedTime: false,
    bulkPricing: false,
    ...base,
  };
}

export const PRODUCTS: Product[] = [
  // Vision
  p({ name: "Blue-Light Blocking Reading Glasses", brand: "Bausch + Lomb", categoryId: "vision", subcategory: "Glasses", sellerId: "wellness-direct", price: 24.99, originalPrice: 34.99, rating: 4.4, reviewCount: 1820, shipsIn24h: true, freeShipping: true, description: "Lightweight readers with blue-light filtering lenses for screen-heavy days. Anti-scratch coating and spring hinges." }),
  p({ name: "Daily Contact Lenses, 90-Pack", brand: "Acuvue", categoryId: "vision", subcategory: "Contact Lenses", sellerId: "medisupply", price: 64.5, rating: 4.8, reviewCount: 5320, shipsIn24h: true, nearbyStores: true, description: "Daily disposable lenses with UV protection and all-day moisture technology. Prescription required." }),
  p({ name: "Lens Cleaning & Care Kit", brand: "Bausch + Lomb", categoryId: "vision", subcategory: "Lens Care", sellerId: "homehealth", price: 12.99, originalPrice: 17.99, rating: 4.6, reviewCount: 940, freeShipping: true, bundle: true, description: "Complete kit with solution, case, and microfiber cloths for glasses and contact lenses." }),
  p({ name: "Anti-Fog Safety Glasses, 2-Pack", brand: "3M", categoryId: "vision", subcategory: "Glasses", sellerId: "carepoint", price: 19.99, rating: 4.5, reviewCount: 760, bulkPricing: true, localPickup: true, description: "Impact-rated protective eyewear with anti-fog coating, suitable for clinical and lab settings." }),
  p({ name: "Prescription Sports Goggles", brand: "Bausch + Lomb", categoryId: "vision", subcategory: "Glasses", sellerId: "wellness-direct", price: 89.0, originalPrice: 119.0, rating: 4.2, reviewCount: 210, limitedTime: true, description: "Shatter-resistant sports goggles with adjustable strap, ready for prescription inserts." }),
  // Vitamins
  p({ name: "Vitamin D3 5000 IU, 360 Softgels", brand: "Nature Made", categoryId: "vitamins", subcategory: "Vitamins", sellerId: "medisupply", price: 16.99, originalPrice: 22.99, rating: 4.8, reviewCount: 8900, shipsIn24h: true, freeShipping: true, nearbyStores: true, description: "High-potency vitamin D3 to support bone, teeth, muscle and immune health." }),
  p({ name: "Magnesium Glycinate 400 mg", brand: "Nature Made", categoryId: "vitamins", subcategory: "Minerals", sellerId: "homehealth", price: 21.5, rating: 4.7, reviewCount: 4100, freeShipping: true, description: "Gentle, highly absorbable magnesium to support muscle relaxation and sleep quality." }),
  p({ name: "Adult Multivitamin Gummies, 150ct", brand: "Nature Made", categoryId: "vitamins", subcategory: "Vitamins", sellerId: "wellness-direct", price: 14.25, originalPrice: 18.99, rating: 4.6, reviewCount: 6230, shipsIn24h: true, description: "Complete daily multivitamin in a great-tasting gummy with 11 essential nutrients." }),
  p({ name: "Omega-3 Fish Oil 1200 mg", brand: "Nature Made", categoryId: "vitamins", subcategory: "Supplements", sellerId: "medisupply", price: 19.99, rating: 4.7, reviewCount: 5470, bulkPricing: true, description: "Purified fish oil providing EPA and DHA for heart and brain health support." }),
  p({ name: "Zinc Immune Support 50 mg", brand: "Nature Made", categoryId: "vitamins", subcategory: "Minerals", sellerId: "homehealth", price: 9.99, originalPrice: 13.99, rating: 4.5, reviewCount: 2210, clearance: true, freeShipping: true, description: "Daily zinc supplement to support normal immune function and antioxidant defense." }),
  // Medical
  p({ name: "Upper Arm Blood Pressure Monitor", brand: "Omron", categoryId: "medical", subcategory: "Blood Pressure", sellerId: "omron-official", price: 79.99, originalPrice: 99.99, rating: 4.8, reviewCount: 12400, shipsIn24h: true, freeShipping: true, nearbyStores: true, description: "Clinically validated BP monitor with wide-range cuff, irregular heartbeat detection and app sync." }),
  p({ name: "Infrared Forehead Thermometer", brand: "Braun", categoryId: "medical", subcategory: "Thermometers", sellerId: "medisupply", price: 39.99, rating: 4.7, reviewCount: 8800, shipsIn24h: true, nearbyStores: true, description: "No-touch infrared thermometer with instant, color-coded fever readings for all ages." }),
  p({ name: "Fingertip Pulse Oximeter", brand: "Philips", categoryId: "medical", subcategory: "Diagnostics", sellerId: "carepoint", price: 29.5, originalPrice: 44.99, rating: 4.6, reviewCount: 6100, bulkPricing: true, localPickup: true, description: "Fast SpO2 and pulse rate readings with bright OLED display, ideal for home or clinical use." }),
  p({ name: "Portable Compressor Nebulizer", brand: "Philips", categoryId: "medical", subcategory: "Respiratory", sellerId: "carepoint", price: 54.0, rating: 4.5, reviewCount: 1900, bulkPricing: true, description: "Compact nebulizer system for effective aerosol therapy at home, with adult and child masks." }),
  p({ name: "Digital Stethoscope, Refurbished", brand: "3M", categoryId: "medical", subcategory: "Diagnostics", sellerId: "carepoint", price: 189.0, originalPrice: 349.0, rating: 4.7, reviewCount: 430, condition: "refurbished", bulkPricing: true, description: "Certified refurbished amplifying stethoscope with noise reduction — professional grade at a lower price." }),
  // Care
  p({ name: "245-Piece All-Purpose First Aid Kit", brand: "Medline", categoryId: "care", subcategory: "First Aid Kits", sellerId: "medisupply", price: 27.99, originalPrice: 36.99, rating: 4.8, reviewCount: 9100, shipsIn24h: true, freeShipping: true, nearbyStores: true, bundle: true, description: "Comprehensive kit for home, car or clinic: bandages, antiseptics, instruments and emergency guide." }),
  p({ name: "Flexible Fabric Bandages, 100ct", brand: "3M", categoryId: "care", subcategory: "Bandages", sellerId: "homehealth", price: 8.49, rating: 4.7, reviewCount: 3300, shipsIn24h: true, nearbyStores: true, description: "Breathable, flexible bandages that stay on through handwashing and movement." }),
  p({ name: "Hydrocolloid Wound Dressings, 10-Pack", brand: "Medline", categoryId: "care", subcategory: "Wound Care", sellerId: "medisupply", price: 15.99, originalPrice: 21.99, rating: 4.6, reviewCount: 1450, bulkPricing: true, description: "Sterile hydrocolloid dressings that maintain a moist healing environment for faster recovery." }),
  p({ name: "Antiseptic Wipes Bulk Pack, 200ct", brand: "Medline", categoryId: "care", subcategory: "Wound Care", sellerId: "carepoint", price: 18.5, rating: 4.5, reviewCount: 980, bulkPricing: true, localPickup: true, description: "Individually wrapped antiseptic wipes for wound cleansing — hospital-grade bulk supply." }),
  p({ name: "Burn Care Gel Kit", brand: "Medline", categoryId: "care", subcategory: "First Aid Kits", sellerId: "wellness-direct", price: 22.0, originalPrice: 29.99, rating: 4.4, reviewCount: 520, limitedTime: true, bundle: true, description: "Cooling burn gel, dressings and non-adherent pads for minor burn first response." }),
  // Mobility
  p({ name: "Lightweight Folding Wheelchair", brand: "Drive Medical", categoryId: "mobility", subcategory: "Wheelchairs", sellerId: "carepoint", price: 219.0, originalPrice: 299.0, rating: 4.6, reviewCount: 2100, freeShipping: true, bulkPricing: true, nearbyStores: true, description: "19 lb aluminum frame wheelchair with swing-away footrests, folds flat for transport." }),
  p({ name: "Rollator Walker with Seat", brand: "Drive Medical", categoryId: "mobility", subcategory: "Walkers", sellerId: "medisupply", price: 89.99, originalPrice: 129.99, rating: 4.7, reviewCount: 4600, freeShipping: true, nearbyStores: true, description: "Four-wheel rollator with padded seat, backrest, storage pouch and locking hand brakes." }),
  p({ name: "Adjustable Folding Cane with LED", brand: "Drive Medical", categoryId: "mobility", subcategory: "Canes", sellerId: "homehealth", price: 24.99, rating: 4.5, reviewCount: 3100, shipsIn24h: true, localPickup: true, description: "Height-adjustable folding cane with built-in LED light and pivoting quad base." }),
  p({ name: "Forearm Crutches, Pair", brand: "Drive Medical", categoryId: "mobility", subcategory: "Crutches", sellerId: "physiopro", price: 49.5, rating: 4.4, reviewCount: 870, description: "Ergonomic forearm crutches with adjustable cuffs and shock-absorbing tips." }),
  p({ name: "Steerable Knee Scooter, Used", brand: "Drive Medical", categoryId: "mobility", subcategory: "Walkers", sellerId: "wellness-direct", price: 95.0, originalPrice: 189.0, rating: 4.3, reviewCount: 340, condition: "used", clearance: true, localPickup: true, description: "Gently used knee walker with basket — a comfortable crutch alternative for below-knee injuries." }),
  // Fitness
  p({ name: "Adjustable Dumbbell Set, 5–25 lb", brand: "Fitbit", categoryId: "fitness", subcategory: "Weights", sellerId: "physiopro", price: 149.0, originalPrice: 199.0, rating: 4.6, reviewCount: 1700, freeShipping: true, description: "Space-saving adjustable dumbbells with quick-select dial — replaces 10 sets of weights." }),
  p({ name: "Professional Resistance Band Set", brand: "TheraBand", categoryId: "fitness", subcategory: "Resistance Bands", sellerId: "physiopro", price: 32.99, rating: 4.8, reviewCount: 5200, shipsIn24h: true, bundle: true, nearbyStores: true, description: "Three progressive resistance levels — the clinical standard for strength and rehab training." }),
  p({ name: "Premium Non-Slip Yoga Mat", brand: "Manduka", categoryId: "fitness", subcategory: "Mats", sellerId: "wellness-direct", price: 78.0, originalPrice: 98.0, rating: 4.7, reviewCount: 2900, freeShipping: true, description: "6 mm high-density mat with lifetime guarantee, superior grip and joint cushioning." }),
  p({ name: "Cast Iron Kettlebell, 16 kg", brand: "Fitbit", categoryId: "fitness", subcategory: "Weights", sellerId: "homehealth", price: 54.99, rating: 4.5, reviewCount: 1100, localPickup: true, description: "Powder-coated cast iron kettlebell with wide ergonomic handle." }),
  p({ name: "Weighted Speed Jump Rope", brand: "TheraBand", categoryId: "fitness", subcategory: "Resistance Bands", sellerId: "wellness-direct", price: 13.99, originalPrice: 19.99, rating: 4.3, reviewCount: 640, clearance: true, shipsIn24h: true, description: "Adjustable-length jump rope with weighted handles for cardio conditioning." }),
  // Recovery
  p({ name: "Percussion Massage Gun Pro", brand: "Theragun", categoryId: "recovery", subcategory: "Massage", sellerId: "physiopro", price: 299.0, originalPrice: 399.0, rating: 4.8, reviewCount: 6800, freeShipping: true, limitedTime: true, description: "Professional-grade percussive therapy with 5 speeds, OLED screen and 6 attachments." }),
  p({ name: "High-Density Foam Roller, 36\"", brand: "Hyperice", categoryId: "recovery", subcategory: "Foam Rollers", sellerId: "physiopro", price: 26.99, rating: 4.7, reviewCount: 3900, shipsIn24h: true, nearbyStores: true, description: "Firm EVA foam roller for myofascial release, recovery and core stability work." }),
  p({ name: "Compression Knee Sleeves, Pair", brand: "Hyperice", categoryId: "recovery", subcategory: "Compression", sellerId: "homehealth", price: 21.5, originalPrice: 28.99, rating: 4.5, reviewCount: 2400, freeShipping: true, description: "Graduated compression knee sleeves for joint support during sport and recovery." }),
  p({ name: "Reusable Hot/Cold Therapy Pack", brand: "Medline", categoryId: "recovery", subcategory: "Compression", sellerId: "medisupply", price: 12.99, rating: 4.6, reviewCount: 1800, shipsIn24h: true, bulkPricing: true, description: "Microwaveable and freezable gel pack with fabric sleeve for pain and swelling relief." }),
  p({ name: "Mini Massage Gun, Refurbished", brand: "Theragun", categoryId: "recovery", subcategory: "Massage", sellerId: "wellness-direct", price: 119.0, originalPrice: 199.0, rating: 4.4, reviewCount: 510, condition: "refurbished", clearance: true, description: "Certified refurbished ultra-portable massage gun — full power in a pocket size." }),
  // Therapy
  p({ name: "Anti-Burst Exercise Ball, 65 cm", brand: "TheraBand", categoryId: "therapy", subcategory: "Exercise Balls", sellerId: "physiopro", price: 24.99, rating: 4.7, reviewCount: 3600, shipsIn24h: true, nearbyStores: true, description: "Clinic-grade stability ball for physiotherapy, core training and active sitting." }),
  p({ name: "Progressive Therapy Band Kit", brand: "TheraBand", categoryId: "therapy", subcategory: "Therapy Bands", sellerId: "physiopro", price: 18.99, originalPrice: 24.99, rating: 4.8, reviewCount: 4900, bundle: true, bulkPricing: true, description: "Five color-coded resistance bands following the clinical progression standard." }),
  p({ name: "Hand Therapy Putty Set, 4-Pack", brand: "TheraBand", categoryId: "therapy", subcategory: "Physio Tools", sellerId: "medisupply", price: 16.5, rating: 4.6, reviewCount: 1300, shipsIn24h: true, description: "Four graded resistance putties for hand and grip rehabilitation exercises." }),
  p({ name: "Balance & Stability Pad", brand: "TheraBand", categoryId: "therapy", subcategory: "Physio Tools", sellerId: "physiopro", price: 34.0, originalPrice: 44.0, rating: 4.5, reviewCount: 920, description: "Closed-cell foam balance pad for proprioception, ankle rehab and stability training." }),
  p({ name: "Overhead Shoulder Pulley System", brand: "Medline", categoryId: "therapy", subcategory: "Physio Tools", sellerId: "homehealth", price: 13.99, rating: 4.4, reviewCount: 1500, freeShipping: true, description: "Door-mounted pulley for restoring shoulder range of motion after injury or surgery." }),
  // Monitoring
  p({ name: "Continuous Glucose Monitor Starter Kit", brand: "Withings", categoryId: "monitoring", subcategory: "Glucose", sellerId: "medisupply", price: 129.0, rating: 4.6, reviewCount: 2700, shipsIn24h: true, description: "14-day sensor kit with real-time glucose readings streamed to your phone." }),
  p({ name: "Smart Body Composition Scale", brand: "Withings", categoryId: "monitoring", subcategory: "Smart Devices", sellerId: "homehealth", price: 99.95, originalPrice: 129.95, rating: 4.7, reviewCount: 5800, freeShipping: true, description: "Wi-Fi scale tracking weight, body fat, muscle mass and heart rate with app trends." }),
  p({ name: "Fitness & Heart Rate Tracker", brand: "Fitbit", categoryId: "monitoring", subcategory: "Heart Rate", sellerId: "wellness-direct", price: 79.95, originalPrice: 99.95, rating: 4.5, reviewCount: 11200, shipsIn24h: true, freeShipping: true, nearbyStores: true, description: "24/7 heart rate, sleep stages, SpO2 and stress tracking with 7-day battery." }),
  p({ name: "Personal ECG Monitor", brand: "Omron", categoryId: "monitoring", subcategory: "Heart Rate", sellerId: "omron-official", price: 119.0, rating: 4.6, reviewCount: 1900, description: "Take a medical-grade ECG in 30 seconds and share results with your doctor." }),
  p({ name: "Smart Blood Pressure Watch", brand: "Omron", categoryId: "monitoring", subcategory: "Smart Devices", sellerId: "omron-official", price: 379.0, originalPrice: 499.0, rating: 4.4, reviewCount: 860, limitedTime: true, freeShipping: true, description: "Wearable oscillometric blood pressure monitoring in a wristwatch form factor." }),
  // Sleep
  p({ name: "Contoured Blackout Sleep Mask", brand: "Tempur-Pedic", categoryId: "sleep", subcategory: "Sleep Masks", sellerId: "wellness-direct", price: 17.99, originalPrice: 24.99, rating: 4.6, reviewCount: 4300, shipsIn24h: true, freeShipping: true, description: "Zero-pressure contoured mask with full blackout and adjustable strap." }),
  p({ name: "Cervical Memory Foam Pillow", brand: "Tempur-Pedic", categoryId: "sleep", subcategory: "Pillows", sellerId: "homehealth", price: 89.0, rating: 4.7, reviewCount: 6100, freeShipping: true, description: "Ergonomic neck-support pillow that adapts to your sleep position for spinal alignment." }),
  p({ name: "CPAP Mask Cushion Replacement, 3-Pack", brand: "ResMed", categoryId: "sleep", subcategory: "CPAP Accessories", sellerId: "resmed-official", price: 42.0, rating: 4.8, reviewCount: 2300, shipsIn24h: true, bulkPricing: true, description: "Genuine replacement cushions for AirFit series masks — maintain a perfect seal." }),
  p({ name: "CPAP Tubing & Filter Kit", brand: "ResMed", categoryId: "sleep", subcategory: "CPAP Accessories", sellerId: "resmed-official", price: 28.5, originalPrice: 39.0, rating: 4.7, reviewCount: 1700, bundle: true, description: "Heated tubing plus 6 hypoallergenic filters — a complete CPAP refresh bundle." }),
  p({ name: "White Noise Sleep Machine", brand: "Philips", categoryId: "sleep", subcategory: "Sleep Masks", sellerId: "wellness-direct", price: 34.99, originalPrice: 49.99, rating: 4.5, reviewCount: 3200, clearance: true, description: "20 soothing soundscapes with auto-off timer and travel-friendly size." }),
  // Wellness
  p({ name: "Ultrasonic Aromatherapy Diffuser", brand: "Philips", categoryId: "wellness", subcategory: "Aromatherapy", sellerId: "wellness-direct", price: 29.99, originalPrice: 39.99, rating: 4.5, reviewCount: 5100, shipsIn24h: true, freeShipping: true, description: "Whisper-quiet 300 ml diffuser with warm light modes and auto shut-off." }),
  p({ name: "Adjustable Posture Corrector Brace", brand: "Medline", categoryId: "wellness", subcategory: "Posture", sellerId: "homehealth", price: 22.99, rating: 4.3, reviewCount: 2800, shipsIn24h: true, description: "Breathable upper-back brace that gently retrains shoulder alignment." }),
  p({ name: "Acupressure Mat & Pillow Set", brand: "Hyperice", categoryId: "wellness", subcategory: "Relaxation", sellerId: "wellness-direct", price: 27.5, originalPrice: 36.99, rating: 4.6, reviewCount: 3700, bundle: true, description: "Stimulating acupressure set for back and neck tension relief and relaxation." }),
  p({ name: "Weighted Relaxation Blanket, 15 lb", brand: "Tempur-Pedic", categoryId: "wellness", subcategory: "Relaxation", sellerId: "homehealth", price: 69.0, originalPrice: 99.0, rating: 4.7, reviewCount: 4400, freeShipping: true, limitedTime: true, description: "Evenly distributed glass-bead weighting with breathable cotton cover." }),
  p({ name: "Essential Oil Starter Set, 8-Pack", brand: "Philips", categoryId: "wellness", subcategory: "Aromatherapy", sellerId: "wellness-direct", price: 18.99, rating: 4.4, reviewCount: 2100, freeShipping: true, bundle: true, description: "Eight pure essential oils including lavender, eucalyptus and peppermint." }),
  // Nutrition
  p({ name: "Whey Protein Powder, 2 lb Vanilla", brand: "Optimum Nutrition", categoryId: "nutrition", subcategory: "Protein", sellerId: "wellness-direct", price: 36.99, originalPrice: 44.99, rating: 4.8, reviewCount: 15600, shipsIn24h: true, freeShipping: true, nearbyStores: true, description: "24 g protein per serving with 5.5 g BCAAs — the gold standard whey blend." }),
  p({ name: "Meal Replacement Shakes, 12-Pack", brand: "Optimum Nutrition", categoryId: "nutrition", subcategory: "Meal Replacements", sellerId: "medisupply", price: 32.5, rating: 4.6, reviewCount: 3900, bulkPricing: true, description: "Balanced 400-calorie shakes with 20 g protein, 24 vitamins and minerals." }),
  p({ name: "Protein Snack Bars, 24ct Variety", brand: "Optimum Nutrition", categoryId: "nutrition", subcategory: "Healthy Snacks", sellerId: "homehealth", price: 27.99, originalPrice: 34.99, rating: 4.5, reviewCount: 5200, bundle: true, shipsIn24h: true, description: "20 g protein bars in three flavors with low sugar and no artificial colors." }),
  p({ name: "Electrolyte Hydration Mix, 30 Sticks", brand: "Optimum Nutrition", categoryId: "nutrition", subcategory: "Healthy Snacks", sellerId: "wellness-direct", price: 21.0, rating: 4.6, reviewCount: 2700, freeShipping: true, description: "Sugar-free electrolyte powder sticks for rapid rehydration during illness or training." }),
  p({ name: "Collagen Peptides Powder, 16 oz", brand: "Nature Made", categoryId: "nutrition", subcategory: "Protein", sellerId: "medisupply", price: 25.99, originalPrice: 32.99, rating: 4.7, reviewCount: 6800, shipsIn24h: true, description: "Unflavored grass-fed collagen for skin, hair, nails and joint support." }),
];

export const ALL_BRANDS = Array.from(new Set(PRODUCTS.map((x) => x.brand))).sort();

export function getProduct(id: string) {
  return PRODUCTS.find((x) => x.id === id);
}

export function getSeller(id: string) {
  return SELLERS.find((x) => x.id === id);
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((x) => x.id === id)!;
}
