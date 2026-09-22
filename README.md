# My Daily Reset

My Daily Reset is a gentle daily planner app built for people who feel stuck at home, low on energy, or unsure what to do each day. It helps users make a simple plan instead of staring at an empty day.

## What the app does

- lets the user choose their energy level and mood
- generates a low-pressure daily reset plan
- supports low-energy, medium-energy, and high-energy days
- includes a small habit tracker for daily wins
- gives a short reflection section for self-check-ins

## Why this app exists

This app is designed for people who need structure without pressure. It is especially useful for anyone who stays home a lot, struggles with motivation, or has no routine to follow.

## Features

- Energy-based plan generation
- Daily mood and focus check-in
- Simple self-care suggestions
- Encouraging routine-building tasks
- Local daily tracking saved in a JSON file

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

Then open the local Streamlit URL shown in the terminal.

## Project structure

```text
My-Daily-Reset/
├── app.py
├── requirements.txt
├── README.md
├── data/
│   └── daily_reset_data.json
├── tests/
│   └── test_daily_reset.py
└── .gitignore
```

## Tech stack

- Python 3.9+
- Streamlit
- JSON local storage for daily tracking

## Future ideas

- weekly habit streaks
- mood trend charts
- reminders and notifications
- custom task categories
- AI-generated daily suggestions
