# Kishan Sathi - Agricultural Dashboard

## Current State
The project is a fresh Caffeine scaffold with React + TypeScript + Tailwind CSS. There is a basic App.tsx entry point and standard shadcn/ui component setup. No agricultural functionality exists yet.

## Requested Changes (Diff)

### Add
- Top navigation bar with logo, nav links, multi-language toggle (EN/HI/BN), notification bell, user avatar
- Hero section with greeting banner, current date/weather, and stats row (Soil Health Score, Active Crops, Weather Alert)
- Crop Recommendation card (left): sliders for N/P/K, inputs for temperature, humidity, rainfall, pH; "Get Recommendation" CTA; result area with crop + confidence score
- Plant Disease Detection card (right): drag-and-drop image upload area, result preview with disease name, confidence bar, treatment recommendation; "Analyze Disease" CTA
- 7-day weather forecast strip below main cards
- Market prices ticker (wheat, rice, tomato)
- Floating AI chatbot widget (bottom-right) with animated pulse ring, expandable chat window with sample conversation
- Language switching: key UI text updates for EN, HI, BN
- Micro-interactions: hover lifts, button press effects, smooth transitions

### Modify
- index.css: Add custom agricultural color tokens, Google Fonts import (Inter/Poppins), keyframe animations for pulse ring and ticker

### Remove
- Default placeholder content

## Implementation Plan
1. Update index.css with agricultural color variables, font imports, and custom animations
2. Build App.tsx with:
   - Language state (EN/HI/BN) and translation map
   - Navigation component
   - Hero section with stats
   - Two-column main cards layout
   - CropRecommendation component with functional sliders
   - PlantDiseaseDetection component with drag-and-drop UI
   - WeatherStrip component
   - MarketPrices ticker
   - ChatbotWidget with open/close state
3. Apply full color palette: greens (#2D6A4F, #52B788, #95D5B2), browns (#6B4226, #A0522D), whites (#F8F9FA), gold (#F4A261)
4. Ensure mobile-first responsive layout with Tailwind breakpoints

## UX Notes
- Dribbble-quality visual polish: generous spacing, layered shadows, gradient CTAs
- Mobile-first: single column on small screens, side-by-side cards on lg+
- Language toggle cycles EN → HI → BN and updates nav links, section titles, button labels, placeholder text
- Sliders are fully interactive and show live number updates
- Drag-and-drop zone has distinct hover/dragover states with color changes
- Chatbot widget floats fixed at bottom-right, visible on all pages
- Weather strip uses emoji icons for weather conditions
- Market prices ticker scrolls horizontally or is presented as a clean grid
