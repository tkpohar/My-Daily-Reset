# My Daily Reset

My Daily Reset is a gentle daily planner app built for people who feel stuck at home, low on energy, or unsure what to do each day. It helps users choose a manageable plan instead of staring at an empty day.

## What the app does

- lets the user choose their energy level and mood
- generates a low-pressure daily reset plan
- supports low-energy, medium-energy, and high-energy days
- includes a small habit tracker for daily wins
- gives a short reflection section for self-check-ins
- works as a polished Vercel-ready web app

## Tech stack

- React
- Vite
- JavaScript
- LocalStorage for personal tracking

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal, usually:

http://localhost:3000

## Build for production

```bash
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to Vercel.
3. Import the repository.
4. Use the default Vite settings.
5. Deploy.

## Project structure

```text
My-Daily-Reset/
├── src/
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── README.md
├── .gitignore
└── app.py
```

## Notes

This version was rebuilt as a Vercel-friendly frontend so it can be deployed easily on Vercel instead of relying on the earlier Python Streamlit version.
