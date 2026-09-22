from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import streamlit as st

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_FILE = DATA_DIR / "daily_reset_data.json"

PLAN_LIBRARY = {
    "low": {
        "must_do": [
            "Drink a glass of water and get dressed.",
            "Open a window or step outside for 3 minutes.",
        ],
        "easy": [
            "Stretch for 5 minutes.",
            "Make your bed or tidy one surface.",
            "Wash one dish or fill the sink with a quick reset.",
        ],
        "self_care": [
            "Take a 10-minute rest break and breathe slowly.",
            "Shower and refresh your routine.",
            "Read 5 pages or listen to one calming song.",
        ],
        "fun": [
            "Watch one short episode or a comforting YouTube video.",
            "Do a quick creative activity like doodling or journaling.",
            "Text one person you enjoy talking to.",
        ],
    },
    "medium": {
        "must_do": [
            "Do one meaningful task that helps your day feel lighter.",
            "Take care of your room or a small home reset.",
        ],
        "easy": [
            "Take a 10-minute walk.",
            "Wash a few dishes or do a quick laundry load.",
            "Clean one visible area like a table or desk.",
        ],
        "self_care": [
            "Drink water and eat something simple.",
            "Take a short break away from screens.",
            "Spend 10 minutes on a hobby you enjoy.",
        ],
        "fun": [
            "Listen to a favorite album or podcast episode.",
            "Watch a comfort show or do a small creative task.",
            "Plan one enjoyable activity for later today.",
        ],
    },
    "high": {
        "must_do": [
            "Pick one important task and finish it before noon.",
            "Clean or organize one zone that matters to you.",
        ],
        "easy": [
            "Take a brisk 15-minute walk.",
            "Do a focused home reset in 15 minutes.",
            "Sort and prep one small area for the rest of the day.",
        ],
        "self_care": [
            "Take a healthy lunch break and reset your energy.",
            "Complete one small wellness habit like stretching or journaling.",
            "Move away from screens for a short recharge.",
        ],
        "fun": [
            "Plan a rewarding activity you genuinely enjoy.",
            "Spend time creating, watching, or learning something fun.",
            "Do one small thing that makes the day feel special.",
        ],
    },
}


def ensure_data_file() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        default_data = {"entries": []}
        DATA_FILE.write_text(json.dumps(default_data, indent=2), encoding="utf-8")


def load_entries() -> list:
    ensure_data_file()
    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            payload = json.load(file)
        return payload.get("entries", [])
    except json.JSONDecodeError:
        return []


def save_entries(entries: list) -> None:
    ensure_data_file()
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump({"entries": entries}, file, indent=2)


def generate_daily_plan(energy_level: str, mood: str, focus: str) -> dict:
    energy_key = (energy_level or "medium").lower()
    base_plan = PLAN_LIBRARY.get(energy_key, PLAN_LIBRARY["medium"]).copy()

    if focus == "rest":
        base_plan["self_care"] = [
            "Take a real rest break without guilt.",
            "Drink water and stretch for 5 minutes.",
            "Set one calming task for the next hour.",
        ]
    elif focus == "focus":
        base_plan["must_do"] = [
            "Pick the single most important task and complete it first.",
            "Clear one distraction before you begin.",
        ]
    elif focus == "movement":
        base_plan["easy"] = [
            "Take a 10-minute walk or do a quick mobility reset.",
            "Stand up, stretch, and move for a few minutes.",
            "Do a short bodyweight routine or dance for 5 minutes.",
        ]
    elif focus == "fun":
        base_plan["fun"] = [
            "Choose one thing that genuinely feels enjoyable.",
            "Try a quick hobby break or a light creative activity.",
            "Take a small reward moment for yourself today.",
        ]

    if mood.lower() in {"tired", "stressed"}:
        base_plan["self_care"] = [
            "Do a five-minute reset: breathe, water, and rest.",
            "Take a short screen-free break and reset your nervous system.",
            "Give yourself permission to keep the day very simple.",
        ]

    return base_plan


def save_today_plan(plan: dict, energy_level: str, mood: str, focus: str) -> None:
    entries = load_entries()
    today = date.today().isoformat()
    new_entry = {
        "date": today,
        "energy_level": energy_level,
        "mood": mood,
        "focus": focus,
        "plan": plan,
    }

    filtered_entries = [entry for entry in entries if entry.get("date") != today]
    filtered_entries.append(new_entry)
    save_entries(filtered_entries)


def render_plan(plan: dict) -> None:
    st.subheader("Your reset plan for today")
    columns = st.columns(4)
    sections = [
        ("Must do", plan["must_do"]),
        ("Easy wins", plan["easy"]),
        ("Self care", plan["self_care"]),
        ("Fun", plan["fun"]),
    ]

    for column, (title, items) in zip(columns, sections):
        with column:
            st.markdown(f"### {title}")
            for item in items:
                st.markdown(f"- {item}")


def render_habit_tracker() -> None:
    st.subheader("Daily habit check-in")
    habits = [
        "Drank water",
        "Moved my body",
        "Showered or refreshed",
        "Did one home reset task",
        "Spent time on something I enjoy",
    ]

    checked = []
    for habit in habits:
        if st.checkbox(habit, key=f"habit_{habit}"):
            checked.append(habit)

    st.caption(f"{len(checked)} of {len(habits)} habits complete")


def main() -> None:
    st.set_page_config(page_title="My Daily Reset", page_icon="🌤️", layout="wide")

    st.title("My Daily Reset")
    st.caption("A gentle daily plan for low-energy days, busy days, and everything in between.")

    today = date.today().strftime("%A, %B %d, %Y")
    st.markdown(f"## {today}")

    with st.sidebar:
        st.header("Daily check-in")
        energy_level = st.selectbox(
            "Energy level",
            ["Low", "Medium", "High"],
            index=1,
        )
        mood = st.selectbox(
            "How are you feeling?",
            ["Tired", "Neutral", "Stressed", "Bored", "Motivated", "Calm"],
            index=1,
        )
        focus = st.selectbox(
            "What do you need most today?",
            ["Rest", "Reset", "Focus", "Movement", "Fun"],
            index=1,
        )

        if st.button("Generate my reset plan"):
            plan = generate_daily_plan(energy_level, mood, focus)
            st.session_state["plan"] = plan
            st.session_state["energy_level"] = energy_level
            st.session_state["mood"] = mood
            st.session_state["focus"] = focus
            save_today_plan(plan, energy_level, mood, focus)
            st.success("Your reset plan is ready.")

    if "plan" not in st.session_state:
        default_plan = generate_daily_plan("medium", "neutral", "reset")
        st.session_state["plan"] = default_plan

    st.metric("Current energy", energy_level)
    st.metric("Current mood", mood)

    render_plan(st.session_state["plan"])
    render_habit_tracker()

    st.subheader("Quick reflection")
    reflection = st.text_area(
        "What stood out today?",
        placeholder="Write one sentence about what felt manageable or hard.",
    )
    if reflection:
        st.info("Thanks for checking in with yourself.")


if __name__ == "__main__":
    main()
