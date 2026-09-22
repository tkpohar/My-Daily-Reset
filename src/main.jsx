import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const planLibrary = {
  low: {
    mustDo: ['Drink water and get dressed.', 'Step outside for 3 minutes.', 'Open the curtains and start the day gently.'],
    easy: ['Stretch for 5 minutes.', 'Make the bed or tidy one corner.', 'Wash one dish or reset one surface.'],
    selfCare: ['Take a short screen-free break.', 'Shower and freshen up.', 'Read five pages or listen to one calm song.'],
    fun: ['Watch one comfort show episode.', 'Text someone you enjoy.', 'Do a quick creative or doodling activity.'],
  },
  medium: {
    mustDo: ['Do one meaningful task for the day.', 'Tidy a room or reset one small area.', 'Pick one thing that will make tomorrow easier.'],
    easy: ['Take a ten-minute walk.', 'Quickly wash a few dishes.', 'Clean a table, desk, or sink.'],
    selfCare: ['Eat something simple and nourishing.', 'Take a short break away from screens.', 'Spend ten minutes on a hobby you enjoy.'],
    fun: ['Listen to a favorite album or podcast.', 'Plan one enjoyable activity later.', 'Take a small reward break for yourself.'],
  },
  high: {
    mustDo: ['Finish one important task before noon.', 'Clear one cluttered area.', 'Set up the rest of the day with a clear next action.'],
    easy: ['Take a brisk walk.', 'Do a focused 15-minute reset.', 'Organize one small zone.'],
    selfCare: ['Recharge with a healthy meal break.', 'Stretch or journal for a few minutes.', 'Move away from screens for a proper rest.'],
    fun: ['Choose one thing you genuinely enjoy.', 'Do a creative or relaxing activity.', 'Give yourself one light reward moment.'],
  },
};

const moods = ['Tired', 'Neutral', 'Stressed', 'Bored', 'Motivated', 'Calm'];
const energyLevels = ['Low', 'Medium', 'High'];
const focusTypes = ['Rest', 'Reset', 'Focus', 'Movement', 'Fun'];
const habitList = ['Drank water', 'Moved my body', 'Showered or refreshed', 'Did one home reset task', 'Spent time on something I enjoy'];
const motivationPool = [
  'Small steps still move you forward.',
  'Your pace is valid, even when it is quiet.',
  'You do not need a perfect day to have a meaningful one.',
  'A gentle routine can still be powerful.',
  'You are allowed to start small and still succeed.',
  'Progress is often a calm reset, not a dramatic win.',
  'Today is not about doing everything; it is about doing what matters.',
  'You are building a life that feels steadier one small act at a time.',
  'Even a tiny win deserves celebration.',
  'Let your energy guide you, not your guilt.',
  'Rest is not falling behind; it is part of the process.',
  'You can recover, rebuild, and begin again today.',
];

const challengePool = [
  'Drink water and stretch for 1 minute.',
  'Take a 5-minute walk around your room or outside.',
  'Tidy one small surface and leave it clean.',
  'Text one person you feel good talking to.',
  'Make your bed and open the curtains.',
  'Take a screen-free break and breathe deeply.',
  'Do one thing that makes your space feel nicer.',
  'Listen to one song that lifts your mood.',
];

function getDailyMotivation() {
  const todayKey = Math.floor(Date.now() / 86400000);
  const saved = JSON.parse(localStorage.getItem('my-daily-reset-motivation') || 'null');

  if (saved && saved.dayKey === todayKey) {
    return saved;
  }

  const quote = motivationPool[todayKey % motivationPool.length];
  const nextValue = {
    dayKey: todayKey,
    code: `MOT-${String(todayKey % 1000).padStart(3, '0')}`,
    quote,
  };

  localStorage.setItem('my-daily-reset-motivation', JSON.stringify(nextValue));
  return nextValue;
}

function generatePlan(energy, mood, focus) {
  const energyKey = (energy || 'Medium').toLowerCase();
  const base = planLibrary[energyKey] || planLibrary.medium;

  const adjusted = {
    mustDo: [...base.mustDo],
    easy: [...base.easy],
    selfCare: [...base.selfCare],
    fun: [...base.fun],
  };

  if (focus === 'Rest') {
    adjusted.selfCare = ['Take a real rest break without guilt.', 'Drink water and stretch for five minutes.', 'Set one calming task for the next hour.'];
  }

  if (focus === 'Focus') {
    adjusted.mustDo = ['Pick the single most important task and finish it first.', 'Clear one distraction before you begin.'];
  }

  if (focus === 'Movement') {
    adjusted.easy = ['Take a ten-minute walk or mobility reset.', 'Stand up and stretch for a few minutes.', 'Do a short bodyweight routine or dance for five minutes.'];
  }

  if (focus === 'Fun') {
    adjusted.fun = ['Choose one thing that genuinely feels enjoyable.', 'Try a quick hobby break or creative activity.', 'Give yourself one small reward moment today.'];
  }

  if (['Tired', 'Stressed'].includes(mood)) {
    adjusted.selfCare = ['Do a five-minute reset: breathe, water, and rest.', 'Take a short screen-free break and calm your mind.', 'Give yourself permission to keep the day very simple.'];
  }

  return adjusted;
}

function App() {
  const [energy, setEnergy] = useState('Medium');
  const [mood, setMood] = useState('Neutral');
  const [focus, setFocus] = useState('Reset');
  const [plan, setPlan] = useState(() => generatePlan('Medium', 'Neutral', 'Reset'));
  const [tab, setTab] = useState('today');
  const [reflection, setReflection] = useState('');
  const [habitState, setHabitState] = useState(() => habitList.map(() => false));
  const [motivation, setMotivation] = useState(() => getDailyMotivation());
  const [diceValue, setDiceValue] = useState(1);
  const [challenge, setChallenge] = useState(() => challengePool[0]);

  useEffect(() => {
    const saved = localStorage.getItem('my-daily-reset-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.energy) setEnergy(parsed.energy);
      if (parsed.mood) setMood(parsed.mood);
      if (parsed.focus) setFocus(parsed.focus);
      if (parsed.habitState) setHabitState(parsed.habitState);
      if (parsed.reflection) setReflection(parsed.reflection);
      if (parsed.plan) setPlan(parsed.plan);
    }
  }, []);

  useEffect(() => {
    const state = { energy, mood, focus, habitState, reflection, plan };
    localStorage.setItem('my-daily-reset-state', JSON.stringify(state));
  }, [energy, mood, focus, habitState, reflection, plan]);

  const completedHabits = useMemo(() => habitState.filter(Boolean).length, [habitState]);

  const handleGenerate = () => {
    setPlan(generatePlan(energy, mood, focus));
  };

  const handleDiceRoll = () => {
    setDiceValue(Math.floor(Math.random() * 6) + 1);
  };

  const handleChallengeDraw = () => {
    const randomChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];
    setChallenge(randomChallenge);
  };

  const toggleHabit = (index) => {
    setHabitState((prev) => prev.map((item, i) => (i === index ? !item : item)));
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="page-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="topbar">
        <div className="brand">My Daily Reset</div>
        <div className="date-pill">{todayLabel}</div>
      </header>

      <section className="hero-panel">
        <div>
          <div className="eyebrow">A gentle reset for your day</div>
          <h1>Make today feel manageable.</h1>
          <p>
            Pick how you feel, choose what you need, and let this gentle plan help you move forward without pressure.
          </p>
        </div>

        <div className="motivation-card">
          <span className="motivation-label">Daily motivation code</span>
          <strong>{motivation.code}</strong>
          <p>“{motivation.quote}”</p>
        </div>
      </section>

      <div className="content-grid">
        <aside className="side-panel">
          <div className="panel-header">Daily check-in</div>

          <label>
            Energy level
            <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
              {energyLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </label>

          <label>
            Mood
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              {moods.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            What do you need most?
            <select value={focus} onChange={(e) => setFocus(e.target.value)}>
              {focusTypes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <button className="primary-btn" onClick={handleGenerate}>Generate my reset plan</button>
        </aside>

        <main className="main-panel">
          <div className="tabs">
            {['today', 'habits', 'reflection', 'wins', 'games'].map((name) => (
              <button
                key={name}
                className={tab === name ? 'tab active' : 'tab'}
                onClick={() => setTab(name)}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'today' && (
            <>
              <div className="metrics">
                <div className="metric-card">
                  <span>Energy</span>
                  <strong>{energy}</strong>
                </div>
                <div className="metric-card">
                  <span>Mood</span>
                  <strong>{mood}</strong>
                </div>
              </div>

              <div className="plan-grid">
                <div className="plan-card pink">
                  <h3>Must do</h3>
                  <ul>
                    {plan.mustDo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="plan-card mint">
                  <h3>Easy wins</h3>
                  <ul>
                    {plan.easy.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="plan-card gold">
                  <h3>Self care</h3>
                  <ul>
                    {plan.selfCare.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="plan-card blue">
                  <h3>Fun</h3>
                  <ul>
                    {plan.fun.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {tab === 'habits' && (
            <div className="content-card">
              <h3>Daily habit check-in</h3>
              <div className="habit-list">
                {habitList.map((habit, index) => (
                  <label className="habit-item" key={habit}>
                    <input type="checkbox" checked={habitState[index]} onChange={() => toggleHabit(index)} />
                    <span>{habit}</span>
                  </label>
                ))}
              </div>
              <div className="habit-progress">{completedHabits} of {habitList.length} habits complete</div>
            </div>
          )}

          {tab === 'reflection' && (
            <div className="content-card">
              <h3>Quick reflection</h3>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write one sentence about what felt manageable or hard today."
              />
              {reflection && <div className="note">Thanks for checking in with yourself.</div>}
            </div>
          )}

          {tab === 'wins' && (
            <div className="content-card">
              <h3>Small wins</h3>
              <ul className="wins-list">
                <li>Drank water</li>
                <li>Moved my body</li>
                <li>Handled one hard task</li>
                <li>Created a calmer routine</li>
              </ul>
            </div>
          )}

          {tab === 'games' && (
            <div className="games-grid">
              <div className="content-card game-card">
                <h3>Lucky Dice</h3>
                <div className="dice-face">{diceValue}</div>
                <button className="secondary-btn" onClick={handleDiceRoll}>Roll the dice</button>
              </div>

              <div className="content-card game-card">
                <h3>Mini challenge</h3>
                <p className="challenge-text">{challenge}</p>
                <button className="secondary-btn" onClick={handleChallengeDraw}>New challenge</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
