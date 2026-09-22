import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
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
const interestOptions = ['Wellness', 'Sports', 'Cooking', 'Outdoors', 'Creative', 'Learning', 'Family time', 'Relaxing'];
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

const getSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

const getLocalHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('my-daily-reset-history') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const mergeHistoryEntries = (localEntries = [], remoteEntries = []) => {
  const merged = [...remoteEntries, ...localEntries];
  const unique = new Map();

  merged.forEach((entry) => {
    const key = `${entry.date || ''}-${entry.mood || ''}-${entry.energy || ''}-${entry.focus || ''}-${entry.reflection || ''}`;
    if (!unique.has(key)) {
      unique.set(key, entry);
    }
  });

  return Array.from(unique.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const fetchRemoteHistory = async () => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('daily_resets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);

    if (error || !data) {
      return [];
    }

    return data.map((row) => ({
      date: row.date || row.created_at,
      energy: row.energy,
      mood: row.mood,
      focus: row.focus,
      reflection: row.reflection || '',
      habits: Array.isArray(row.habits) ? row.habits : [],
      plan: row.plan || null,
    }));
  } catch {
    return [];
  }
};

const saveRemoteHistory = async (entry) => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  try {
    const record = {
      date: entry.date,
      energy: entry.energy,
      mood: entry.mood,
      focus: entry.focus,
      reflection: entry.reflection,
      habits: entry.habits,
      plan: entry.plan,
    };

    await supabase.from('daily_resets').insert(record);
  } catch {
    // Fallback quietly if the remote table is not configured yet.
  }
};

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

function generatePlan(energy, mood, focus, profile = {}) {
  const energyKey = (energy || 'Medium').toLowerCase();
  const base = planLibrary[energyKey] || planLibrary.medium;
  const interest = profile.interest || 'Wellness';
  const activities = profile.activities || '';

  const adjusted = {
    mustDo: [...base.mustDo],
    easy: [...base.easy],
    selfCare: [...base.selfCare],
    fun: [...base.fun],
  };

  if (interest === 'Sports') {
    const sportText = activities ? activities.trim() : 'your favorite sport';
    adjusted.mustDo = [`Do a 10-minute ${sportText} session or movement reset.`, 'Lay out your gear or shoes for later.', 'Take a quick stretch after your main task.'];
    adjusted.fun = ['Play a short workout or skill challenge.', 'Take a small break to enjoy your favorite sports moment.', 'Give yourself a light reward after the activity.'];
  }

  if (interest === 'Cooking') {
    const recipeText = activities ? activities.trim() : 'one simple recipe';
    adjusted.mustDo = [`Plan ${recipeText} for today or prep ingredients.`, 'Clean one kitchen surface before or after eating.', 'Make one easy, nourishing meal.'];
    adjusted.easy = ['Wash one pan or prep one ingredient.', 'Set out a healthy snack or drink.', 'Do a quick kitchen reset.'];
  }

  if (interest === 'Outdoors') {
    const outsideText = activities ? activities.trim() : 'a short walk';
    adjusted.mustDo = [`Step outside for 10 minutes and do ${outsideText}.`, 'Open the curtains and let in more light.', 'Take a brief reset near fresh air.'];
    adjusted.fun = ['Enjoy one outdoor moment that feels easy and calming.', 'Take a gentle walk or sit outside for a few minutes.', 'Make your outdoor time feel like a reward.'];
  }

  if (interest === 'Creative') {
    const creativeText = activities ? activities.trim() : 'a creative hobby';
    adjusted.mustDo = [`Give yourself 15 minutes for ${creativeText}.`, 'Start one small creative task and keep it low-pressure.', 'Make room for something playful today.'];
    adjusted.fun = ['Do a short hobby break that feels energizing.', 'Create something small and enjoyable.', 'Take a tiny reward moment after you finish.'];
  }

  if (interest === 'Learning') {
    const learningText = activities ? activities.trim() : 'one small learning goal';
    adjusted.mustDo = [`Spend a little time on ${learningText}.`, 'Focus on one skill or topic that feels useful.', 'Keep the effort small and sustainable.'];
    adjusted.fun = ['Read, watch, or explore something that sparks curiosity.', 'Give yourself a short brain break.', 'Celebrate progress even if it is tiny.'];
  }

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
  const [personalInterest, setPersonalInterest] = useState('Wellness');
  const [activities, setActivities] = useState('');
  const [plan, setPlan] = useState(() => generatePlan('Medium', 'Neutral', 'Reset', { interest: 'Wellness', activities: '' }));
  const [tab, setTab] = useState('today');
  const [reflection, setReflection] = useState('');
  const [habitState, setHabitState] = useState(() => habitList.map(() => false));
  const [motivation, setMotivation] = useState(() => getDailyMotivation());
  const [diceValue, setDiceValue] = useState(1);
  const [challenge, setChallenge] = useState(() => challengePool[0]);
  const [history, setHistory] = useState(() => getLocalHistory());

  useEffect(() => {
    const hydrateHistory = async () => {
      const remoteEntries = await fetchRemoteHistory();
      const merged = mergeHistoryEntries(getLocalHistory(), remoteEntries);
      setHistory(merged);
    };

    hydrateHistory();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('my-daily-reset-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.energy) setEnergy(parsed.energy);
      if (parsed.mood) setMood(parsed.mood);
      if (parsed.focus) setFocus(parsed.focus);
      if (parsed.personalInterest) setPersonalInterest(parsed.personalInterest);
      if (parsed.activities) setActivities(parsed.activities);
      if (parsed.habitState) setHabitState(parsed.habitState);
      if (parsed.reflection) setReflection(parsed.reflection);
      if (parsed.plan) setPlan(parsed.plan);
    }
  }, []);

  useEffect(() => {
    const state = { energy, mood, focus, personalInterest, activities, habitState, reflection, plan };
    localStorage.setItem('my-daily-reset-state', JSON.stringify(state));
  }, [energy, mood, focus, personalInterest, activities, habitState, reflection, plan]);

  useEffect(() => {
    localStorage.setItem('my-daily-reset-history', JSON.stringify(history));
  }, [history]);

  const completedHabits = useMemo(() => habitState.filter(Boolean).length, [habitState]);

  const handleGenerate = () => {
    const generatedPlan = generatePlan(energy, mood, focus, { interest: personalInterest, activities });
    setPlan(generatedPlan);

    const entry = {
      date: new Date().toISOString(),
      energy,
      mood,
      focus,
      reflection,
      habits: habitState,
      plan: generatedPlan,
      interest: personalInterest,
      activities,
    };

    const updatedHistory = [entry, ...history].slice(0, 12);
    setHistory(updatedHistory);
    saveRemoteHistory(entry);
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

          <label>
            What do you enjoy most?
            <select value={personalInterest} onChange={(e) => setPersonalInterest(e.target.value)}>
              {interestOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Favorite activities or hobbies
            <input
              type="text"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="e.g. golf, fishing, cooking, yoga"
            />
          </label>

          <button className="primary-btn" onClick={handleGenerate}>Generate my reset plan</button>
        </aside>

        <main className="main-panel">
          <div className="tabs">
            {['today', 'habits', 'reflection', 'wins', 'games', 'history'].map((name) => (
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

          {tab === 'history' && (
            <div className="content-card">
              <h3>Past history</h3>
              {history.length === 0 ? (
                <p className="placeholder-text">Your saved daily check-ins will appear here.</p>
              ) : (
                <div className="history-list">
                  {history.map((entry) => (
                    <div key={entry.date} className="history-item">
                      <div className="history-date">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="history-meta">
                        <span>{entry.energy}</span>
                        <span>{entry.mood}</span>
                        <span>{entry.focus}</span>
                      </div>
                      <p>{entry.reflection || 'No reflection recorded.'}</p>
                    </div>
                  ))}
                </div>
              )}
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
