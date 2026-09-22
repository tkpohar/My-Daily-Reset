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
        ("Must do", plan["must_do"], "#ff8fab"),
        ("Easy wins", plan["easy"], "#7ec8b8"),
        ("Self care", plan["self_care"], "#ffd166"),
        ("Fun", plan["fun"], "#9bb7ff"),
    ]

    for column, (title, items, color) in zip(columns, sections):
        with column:
            st.markdown(
                f"""
                <div class="plan-card" style="border-top: 5px solid {color};">
                    <h3 style="margin-top: 0; color: #2b2d42;">{title}</h3>
                    <ul>
                        {''.join(f'<li style="margin-bottom: 0.6rem;">{item}</li>' for item in items)}
                    </ul>
                </div>
                """,
                unsafe_allow_html=True,
            )


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

    st.markdown(
        """
        <style>
        :root {
            --bg1: #fff3ec;
            --bg2: #eef7ff;
            --bg3: #f4f1ff;
            --card: rgba(255,255,255,0.72);
            --primary: #ff7aa2;
            --secondary: #66c7b4;
            --accent: #ffd166;
            --text: #1d2433;
            --muted: #58657c;
            --border: rgba(29, 36, 51, 0.08);
        }

        .stApp {
            background:
                radial-gradient(circle at top left, rgba(255, 122, 162, 0.22), transparent 30%),
                radial-gradient(circle at bottom right, rgba(102, 199, 180, 0.22), transparent 25%),
                linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 50%, var(--bg3) 100%);
            color: var(--text);
            animation: drift 18s ease-in-out infinite alternate;
            position: relative;
            overflow: hidden;
        }

        .stApp::before,
        .stApp::after {
            content: "";
            position: fixed;
            inset: auto;
            width: 380px;
            height: 380px;
            border-radius: 50%;
            filter: blur(70px);
            opacity: 0.45;
            z-index: 0;
            pointer-events: none;
            animation: floatGlow 20s ease-in-out infinite alternate;
        }

        .stApp::before {
            left: -60px;
            top: 10%;
            background: rgba(255, 122, 162, 0.28);
        }

        .stApp::after {
            right: -80px;
            bottom: 10%;
            background: rgba(102, 199, 180, 0.26);
            animation-delay: 6s;
        }

        .stSidebar {
            background: rgba(255,255,255,0.45);
            backdrop-filter: blur(12px);
            border-right: 1px solid var(--border);
        }

        h1, h2, h3, h4 {
            color: var(--text);
            position: relative;
            z-index: 1;
        }

        .block-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
            position: relative;
            z-index: 1;
        }

        div[data-testid="stMetricValue"] {
            color: var(--text);
            font-weight: 700;
        }

        div[data-testid="stMetricLabel"] {
            color: var(--muted);
        }

        .stButton > button {
            background: linear-gradient(135deg, var(--primary), #ffb3c8);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            padding: 0.65rem 1.05rem;
            box-shadow: 0 10px 22px rgba(255, 122, 162, 0.23);
        }

        .stCheckbox {
            background: rgba(255,255,255,0.7);
            border-radius: 10px;
            padding: 0.15rem 0.5rem;
            border: 1px solid var(--border);
        }

        .stTextArea textarea,
        .stSelectbox > div,
        .stTextInput > div {
            border-radius: 12px;
            border: 1px solid rgba(102, 199, 180, 0.4);
            background: rgba(255,255,255,0.8);
        }

        .stAlert {
            border-radius: 14px;
            border: 1px solid rgba(102, 199, 180, 0.35);
            background: rgba(102, 199, 180, 0.12);
        }

        .plan-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 1rem 1rem 0.3rem 1rem;
            box-shadow: 0 12px 28px rgba(39, 45, 90, 0.08);
            margin-top: 0.75rem;
            backdrop-filter: blur(8px);
        }

        .tab-card {
            background: rgba(255,255,255,0.56);
            border: 1px solid rgba(255,255,255,0.5);
            border-radius: 16px;
            padding: 0.75rem 1rem;
            margin-bottom: 0.75rem;
        }

        @keyframes floatGlow {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(30px, -20px) scale(1.15); }
        }

        @keyframes drift {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

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

    overview, habits, reflection, wins = st.tabs(["Today", "Habits", "Reflection", "Wins"])

    with overview:
        st.markdown('<div class="tab-card">', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        with c1:
            st.metric("Current energy", energy_level)
        with c2:
            st.metric("Current mood", mood)
        st.markdown('</div>', unsafe_allow_html=True)
        render_plan(st.session_state["plan"])

    with habits:
        render_habit_tracker()

    with reflection:
        reflection = st.text_area(
            "What stood out today?",
            placeholder="Write one sentence about what felt manageable or hard.",
        )
        if reflection:
            st.info("Thanks for checking in with yourself.")

    with wins:
        st.markdown(
            """
            <div class="tab-card">
                <h3>Small wins</h3>
                <ul>
                    <li>Drank water</li>
                    <li>Moved my body</li>
                    <li>Handled one hard task</li>
                    <li>Created a calmer routine</li>
                </ul>
            </div>
            """,
            unsafe_allow_html=True,
        )


if __name__ == "__main__":
    main()
