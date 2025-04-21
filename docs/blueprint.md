# **App Name**: TransitWise

## Core Features:

- Transport Options Display: Display available transport options (bus, train, auto) based on user-entered destination.
- Route Visualization: Show route on Google Maps with current vehicle positions and estimated time of arrival.
- Real-Time Data Fetch: Fetch live location and fare for each transport mode.
- AI-Powered Recommendation: Use an AI model to rank transport options based on ETA, fare, user preferences, and live weather conditions, presenting the user with the best option, acting as a tool to help the user decide.
- Weather Data Integration: Fetch current weather data using OpenWeatherMap API or similar.

## Style Guidelines:

- Dark theme with a primary dark background and lighter text for contrast.
- Use a vibrant accent color, like Teal (#008080), for interactive elements and highlights.
- Minimalist design with a clean and modern layout using DaisyUI components.
- Use clear and recognizable icons for different transport modes and map markers.
- Subtle transitions and animations for loading data and displaying route updates.

## Original User Request:
I want you to develop a full-stack web application for Public Transport Tracking in India. The app should help users track buses, local trains, and auto-rickshaws in real-time, compare fares for different transport options, and recommend the most optimal mode of transport based on live weather conditions using an AI-based recommendation system. Below are the complete requirements:

🧩 Core Features:
User Authentication (Login/Signup) with email/password.

Real-time tracking of:

Buses (including intercity and local).

Local trains (e.g., Mumbai locals, Kolkata metro, etc.).

Auto-rickshaws (static/fixed routes + live GPS if available).

Live fare comparisons based on:

Distance

Mode of transport

Dynamic pricing for autos (based on traffic or surge)

AI-based smart recommendations for transport mode:

Based on current weather (e.g., avoid auto in rain).

Based on ETA, fare, and user preferences.

Should use a basic AI model or logic to rank & suggest the best option.

🗺️ UI & UX Requirements:
Must be a website (responsive, mobile-friendly).

Use Google Maps API to display:

Routes

Current vehicle positions

Landmarks/stops

UI should be:

Dark-themed

Minimal and modern

Built with Next.js + DaisyUI (Tailwind variant)

🧠 Backend & Tech Stack:
Next.js as the framework

API routes

Google Maps API for route display and location services

OpenWeatherMap API or similar to fetch current weather data

Optional: Use a simple AI model or rule-based logic for transport recommendation

🎯 Functional Flow:
User logs in → sees a dashboard

Enters destination → sees available options (bus/train/auto)

System fetches:

Live locations

Fare for each mode

Weather for that route

AI ranks best option based on all factors

User clicks on an option → sees route on map + ETA

🔮 Extra Features (Optional/Future Scope):
Save favorite routes

Real-time notifications on delays

Multi-language support (Hindi/English)

Admin panel to add/update transport data

Please make sure the code is clean, modular, and well-documented. Start with core functionality first and iterate with AI and weather integration. All data should ideally work with mock APIs initially and then later shift to live feeds
  