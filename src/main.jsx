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
const interestOptions = ['Wellness', 'Sports', 'Cooking', 'Outdoors', 'Creative', 'Learning', 'Family time', 'Relaxing', 'Gardening', 'Reading', 'Travel', 'Music', 'Skincare', 'Home reset', 'Mindfulness', 'Community', 'Personal care'];
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

const recipeCategories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Quick dinner', 'Snack', 'Easy dinner', 'Protein'];

const recipeLibrary = [
  {
    id: 'lemon-garlic-chicken-bowl',
    title: 'Lemon Garlic Chicken Bowl',
    time: '20 min',
    category: 'Protein',
    ingredients: ['2 chicken breasts', '1 lemon', '2 cups cooked rice', 'spinach', 'garlic'],
    steps: [
      'Cook the rice and set it aside.',
      'Season the chicken and sear it with garlic.',
      'Add lemon juice and cook until the chicken is done.',
      'Serve over rice with spinach and extra lemon on top.',
    ],
  },
  {
    id: 'veggie-pasta',
    title: 'Quick Veggie Pasta',
    time: '15 min',
    category: 'Easy dinner',
    ingredients: ['pasta', 'zucchini', 'tomatoes', 'olive oil', 'parmesan'],
    steps: [
      'Boil the pasta until tender.',
      'Sauté the vegetables in olive oil.',
      'Add the pasta to the pan and toss everything together.',
      'Finish with parmesan and a little pepper.',
    ],
  },
  {
    id: 'protein-breakfast-bowl',
    title: 'Protein Breakfast Bowl',
    time: '10 min',
    category: 'Breakfast',
    ingredients: ['eggs', 'avocado', 'spinach', 'toast', 'hot sauce'],
    steps: [
      'Scramble or fry the eggs.',
      'Warm the spinach gently in a pan.',
      'Top the toast with eggs, avocado, and spinach.',
      'Add hot sauce if you want a little extra flavor.',
    ],
  },
  {
    id: 'salmon-rice-salad',
    title: 'Salmon Rice Salad',
    time: '18 min',
    category: 'Lunch',
    ingredients: ['salmon', 'rice', 'cucumber', 'greens', 'lemon dressing'],
    steps: [
      'Cook the rice and let it cool slightly.',
      'Bake or pan-cook the salmon until flaky.',
      'Mix the rice with cucumber and greens.',
      'Top with salmon and lemon dressing before serving.',
    ],
  },
  {
    id: 'cinnamon-oatmeal',
    title: 'Cinnamon Oatmeal Bowl',
    time: '8 min',
    category: 'Breakfast',
    ingredients: ['oats', 'milk', 'cinnamon', 'banana', 'nuts'],
    steps: [
      'Cook the oats with milk until creamy.',
      'Stir in cinnamon and a little sweetness if desired.',
      'Top with banana slices and nuts.',
      'Serve warm and enjoy slowly.',
    ],
  },
  {
    id: 'turkey-wraps',
    title: 'Turkey Wraps',
    time: '12 min',
    category: 'Lunch',
    ingredients: ['whole wheat wraps', 'turkey slices', 'lettuce', 'tomato', 'avocado'],
    steps: [
      'Lay out the wraps and add lettuce and tomato.',
      'Place turkey slices and avocado on top.',
      'Roll tightly and slice in half.',
      'Enjoy with fruit or a side salad.',
    ],
  },
  {
    id: 'greek-salmon-bowl',
    title: 'Greek Salmon Bowl',
    time: '22 min',
    category: 'Dinner',
    ingredients: ['salmon', 'quinoa', 'cucumber', 'tomatoes', 'feta', 'lemon'],
    steps: [
      'Cook the quinoa until fluffy.',
      'Bake or pan-sear the salmon until flaky.',
      'Add cucumber, tomatoes, and feta to the bowl.',
      'Top with lemon juice and serve warm.',
    ],
  },
  {
    id: 'sheet-pan-veggies-eggs',
    title: 'Sheet Pan Veggie Eggs',
    time: '18 min',
    category: 'Breakfast',
    ingredients: ['eggs', 'peppers', 'spinach', 'onion', 'olive oil'],
    steps: [
      'Roast the vegetables with olive oil until tender.',
      'Add the vegetables to a baking dish and crack in the eggs.',
      'Bake until the eggs are set.',
      'Serve with toast if you want a little extra fullness.',
    ],
  },
  {
    id: 'chicken-quesadillas',
    title: 'Chicken Quesadillas',
    time: '15 min',
    category: 'Quick dinner',
    ingredients: ['tortillas', 'chicken', 'cheese', 'black beans', 'salsa'],
    steps: [
      'Warm the chicken and beans in a pan.',
      'Add cheese and chicken to half of each tortilla.',
      'Fold and cook until golden on both sides.',
      'Serve with salsa and a side salad.',
    ],
  },
  {
    id: 'berry-yogurt-parfait',
    title: 'Berry Yogurt Parfait',
    time: '7 min',
    category: 'Breakfast',
    ingredients: ['greek yogurt', 'berries', 'granola', 'chia seeds', 'honey'],
    steps: [
      'Spoon yogurt into a bowl or glass.',
      'Layer with berries, granola, and chia seeds.',
      'Add a little honey on top if desired.',
      'Enjoy as a fast, fresh breakfast.',
    ],
  },
  {
    id: 'lentil-soup',
    title: 'Simple Lentil Soup',
    time: '30 min',
    category: 'Dinner',
    ingredients: ['lentils', 'carrots', 'celery', 'onion', 'vegetable broth'],
    steps: [
      'Sauté onion, celery, and carrots until softened.',
      'Add lentils and broth, then simmer until tender.',
      'Stir in any seasonings you like.',
      'Serve warm with toast or a side salad.',
    ],
  },
  {
    id: 'shrimp-rice-bowl',
    title: 'Garlic Shrimp Rice Bowl',
    time: '20 min',
    category: 'Dinner',
    ingredients: ['shrimp', 'rice', 'garlic', 'broccoli', 'soy sauce'],
    steps: [
      'Cook the rice and steam the broccoli.',
      'Sauté shrimp with garlic until pink and cooked through.',
      'Add a splash of soy sauce and toss together.',
      'Serve over rice with broccoli on top.',
    ],
  },
  {
    id: 'avocado-toast-egg',
    title: 'Avocado Egg Toast',
    time: '10 min',
    category: 'Breakfast',
    ingredients: ['whole grain bread', 'avocado', 'egg', 'lemon', 'pepper'],
    steps: [
      'Toast the bread until crisp.',
      'Mash avocado with lemon and pepper.',
      'Top with a fried or scrambled egg.',
      'Serve immediately while warm.',
    ],
  },
  {
    id: 'chickpea-salad-wrap',
    title: 'Chickpea Salad Wrap',
    time: '12 min',
    category: 'Lunch',
    ingredients: ['chickpeas', 'wraps', 'lettuce', 'tomato', 'yogurt dressing'],
    steps: [
      'Mash the chickpeas with a little yogurt dressing.',
      'Add lettuce and tomato to the wrap.',
      'Spoon the salad into the wrap and fold.',
      'Enjoy with fruit or a side salad.',
    ],
  },
  {
    id: 'turkey-chili',
    title: 'Turkey Chili',
    time: '35 min',
    category: 'Dinner',
    ingredients: ['ground turkey', 'beans', 'tomatoes', 'onion', 'chili spices'],
    steps: [
      'Cook the turkey with onion until browned.',
      'Add tomatoes, beans, and chili spices.',
      'Simmer until the chili thickens.',
      'Serve with avocado, yogurt, or rice.',
    ],
  },
  {
    id: 'banana-oat-smoothie',
    title: 'Banana Oat Smoothie',
    time: '5 min',
    category: 'Snack',
    ingredients: ['banana', 'oats', 'milk', 'peanut butter', 'cinnamon'],
    steps: [
      'Blend all ingredients until smooth.',
      'Adjust thickness with more milk if needed.',
      'Pour into a glass and enjoy cold.',
      'Use it as a quick breakfast or afternoon snack.',
    ],
  },
  {
    id: 'veggie-fried-rice',
    title: 'Veggie Fried Rice',
    time: '15 min',
    category: 'Quick dinner',
    ingredients: ['rice', 'peas', 'carrots', 'eggs', 'soy sauce'],
    steps: [
      'Cook the rice if not already done.',
      'Scramble the eggs and set them aside.',
      'Stir-fry the vegetables in a hot pan.',
      'Add rice, eggs, and soy sauce and toss together.',
    ],
  },
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
    adjusted.mustDo = [
      `Plan ${recipeText} for today or prep ingredients.`,
      'Clean one kitchen surface before or after eating.',
      'Make one easy, nourishing meal.',
    ];
    adjusted.easy = ['Wash one pan or prep one ingredient.', 'Set out a healthy snack or drink.', 'Do a quick kitchen reset.'];
    adjusted.fun = ['Cook something simple that feels comforting.', 'Use your favorite ingredients for a quick win.', 'Enjoy one meal without rushing or multitasking.'];
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

  if (interest === 'Gardening') {
    const gardenText = activities ? activities.trim() : 'a plant or garden task';
    adjusted.mustDo = [`Care for ${gardenText} for a few minutes.`, 'Water one plant or tidy a small space.', 'Take a moment to notice the outdoor environment around you.'];
    adjusted.easy = ['Trim a few leaves or remove dead stems.', 'Wipe down a pot or small gardening tool.', 'Step outside for fresh air and a short reset.'];
    adjusted.fun = ['Enjoy a calm outdoor break with your plants.', 'Take a mindful minute to notice what is growing.', 'Use this time to slow down and reconnect with nature.'];
  }

  if (interest === 'Reading') {
    const readingText = activities ? activities.trim() : 'a book or article';
    adjusted.mustDo = [`Spend 10 minutes with ${readingText}.`, 'Read something uplifting or useful for your day.', 'Create a quiet moment for focus and calm.'];
    adjusted.easy = ['Make tea or water before your reading break.', 'Read one page before checking messages.', 'Take a short pause away from screens.'];
    adjusted.fun = ['Enjoy one chapter or a short article.', 'Read something comforting and easy.', 'Reward yourself with a quiet, screen-free moment.'];
  }

  if (interest === 'Travel') {
    const travelText = activities ? activities.trim() : 'a local outing';
    adjusted.mustDo = [`Plan a simple ${travelText} or little adventure today.`, 'Pack or prepare what you need for a short outing.', 'Take one small step toward something new or refreshing.'];
    adjusted.easy = ['Take a walk in a new area.', 'Open the curtains and imagine a fresh place to visit.', 'Set up your bag or essentials for later.'];
    adjusted.fun = ['Give yourself a small adventure moment.', 'Enjoy a brief outing or change of scenery.', 'Take a photo or note something new you noticed.'];
  }

  if (interest === 'Music') {
    const musicText = activities ? activities.trim() : 'one playlist or song';
    adjusted.mustDo = [`Play ${musicText} to reset your energy.`, 'Take a brief movement break while music plays.', 'Choose one song that feels uplifting.'];
    adjusted.easy = ['Dance for two minutes or stretch to a beat.', 'Put on a calm track while you tidy one space.', 'Take a short break to enjoy the sound around you.'];
    adjusted.fun = ['Create a mini mood boost with your favorite sound.', 'Let music make a boring task feel lighter.', 'Give yourself a small reward while listening.'];
  }

  if (interest === 'Skincare') {
    const skincareText = activities ? activities.trim() : 'your skin reset routine';
    adjusted.mustDo = [`Do a gentle ${skincareText} or refresh ritual.`, 'Wash your face or clean up for the day.', 'Take a few minutes for a calming personal care routine.'];
    adjusted.easy = ['Apply moisturizer or facial mist.', 'Wash your hands and clean up before lunch.', 'Take a quick reset and drink water.'];
    adjusted.fun = ['Give yourself a soothing self-care moment.', 'Enjoy a calming ritual without rushing.', 'Treat this like a slow, nurturing reward.'];
  }

  if (interest === 'Home reset') {
    const homeText = activities ? activities.trim() : 'one room or surface';
    adjusted.mustDo = [`Reset ${homeText} and make it feel easier to use.`, 'Clear one clutter zone or surface.', 'Set up the next part of your day with less friction.'];
    adjusted.easy = ['Wash one dish or tidy one basket.', 'Fold a blanket or arrange a corner.', 'Open windows or light a candle for a fresh feel.'];
    adjusted.fun = ['Give your space a quick breathing room.', 'Turn a small reset into a satisfying win.', 'Enjoy the comfort of a calmer home.'];
  }

  if (interest === 'Mindfulness') {
    const mindfulText = activities ? activities.trim() : 'a short breathing or reflection break';
    adjusted.mustDo = [`Take 5 minutes for ${mindfulText}.`, 'Pause and notice your breathing.', 'Let your day feel a little simpler and more grounded.'];
    adjusted.easy = ['Sit quietly and notice one calming thing.', 'Stretch gently and breathe deeply.', 'Take a no-phone break for a few minutes.'];
    adjusted.fun = ['Enjoy a soft, restful pause.', 'Give yourself a peaceful reset without pressure.', 'Celebrate a moment of calm.'];
  }

  if (interest === 'Community') {
    const communityText = activities ? activities.trim() : 'one supportive connection';
    adjusted.mustDo = [`Reach out to someone or do ${communityText}.`, 'Do one kind act or helpful gesture.', 'Create a small moment of connection today.'];
    adjusted.easy = ['Send a message to someone you appreciate.', 'Say hello to a neighbor or coworker.', 'Take a short walk and enjoy the world around you.'];
    adjusted.fun = ['Make one small connection that feels good.', 'Choose a friendly, uplifting interaction.', 'Give yourself a warm and human moment.'];
  }

  if (interest === 'Personal care') {
    const personalText = activities ? activities.trim() : 'your daily care ritual';
    adjusted.mustDo = [`Give yourself time for ${personalText}.`, 'Refresh your body and space for the next phase of the day.', 'Take care of one small wellbeing task without rushing.'];
    adjusted.easy = ['Wash your face or shower.', 'Drink water and stretch for a minute.', 'Set out clothes or a simple daily routine.'];
    adjusted.fun = ['Make self-care feel enjoyable, not strict.', 'Treat yourself to a soothing, unhurried moment.', 'Enjoy the comfort of taking care of yourself.'];
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
  const [selectedRecipe, setSelectedRecipe] = useState(recipeLibrary[0]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('my-daily-reset-favorite-recipes') || '[]');
      const legacy = localStorage.getItem('my-daily-reset-favorite-recipe');
      if (Array.isArray(saved)) {
        return legacy && !saved.includes(legacy) ? [...saved, legacy] : saved;
      }
      return legacy ? [legacy] : [];
    } catch {
      return [];
    }
  });
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState('All');
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
    const nextPlan = generatePlan(energy, mood, focus, { interest: personalInterest, activities });
    setPlan(nextPlan);
  }, [energy, mood, focus, personalInterest, activities]);

  useEffect(() => {
    const state = { energy, mood, focus, personalInterest, activities, habitState, reflection, plan };
    localStorage.setItem('my-daily-reset-state', JSON.stringify(state));
  }, [energy, mood, focus, personalInterest, activities, habitState, reflection, plan]);

  useEffect(() => {
    localStorage.setItem('my-daily-reset-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('my-daily-reset-favorite-recipes', JSON.stringify(favoriteRecipeIds));
    if (favoriteRecipeIds.length > 0) {
      localStorage.setItem('my-daily-reset-favorite-recipe', favoriteRecipeIds[0]);
    }
  }, [favoriteRecipeIds]);

  const completedHabits = useMemo(() => habitState.filter(Boolean).length, [habitState]);
  const filteredRecipes = useMemo(() => {
    const query = recipeSearch.trim().toLowerCase();

    return recipeLibrary.filter((recipe) => {
      const matchesCategory = recipeCategoryFilter === 'All' || recipe.category === recipeCategoryFilter;
      const matchesQuery = !query || recipe.title.toLowerCase().includes(query)
        || recipe.category.toLowerCase().includes(query)
        || recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [recipeSearch, recipeCategoryFilter]);

  const favoriteRecipes = useMemo(
    () => recipeLibrary.filter((recipe) => favoriteRecipeIds.includes(recipe.id)),
    [favoriteRecipeIds]
  );

  const activeRecipe = filteredRecipes.some((recipe) => recipe.id === selectedRecipe.id)
    ? selectedRecipe
    : (filteredRecipes[0] || recipeLibrary[0]);

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

    setHistory((prev) => [entry, ...prev].slice(0, 12));
    saveRemoteHistory(entry);
  };

  const handleDiceRoll = () => {
    setDiceValue(Math.floor(Math.random() * 6) + 1);
  };

  const handleChallengeDraw = () => {
    const randomChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];
    setChallenge(randomChallenge);
  };

  const toggleFavoriteRecipe = (recipeId) => {
    setFavoriteRecipeIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [recipeId, ...prev].slice(0, 8)
    );
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

          <div className="profile-summary">
            <span>Profile focus</span>
            <strong>{personalInterest}</strong>
            {activities && <small>{activities}</small>}
          </div>

          <button className="primary-btn" onClick={handleGenerate}>Generate my reset plan</button>
        </aside>

        <main className="main-panel">
          <div className="tabs">
            {['today', 'habits', 'reflection', 'wins', 'recipes', 'profile', 'games', 'history'].map((name) => (
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

          {tab === 'recipes' && (
            <div className="content-card">
              <h3>Easy recipes</h3>
              <div className="recipe-search-wrap">
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  placeholder="Search recipes, ingredients, or meals"
                />
              </div>

              <div className="recipe-filter-row">
                {recipeCategories.map((category) => (
                  <button
                    key={category}
                    className={recipeCategoryFilter === category ? 'recipe-filter active' : 'recipe-filter'}
                    onClick={() => setRecipeCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="recipe-layout">
                <div className="recipe-list">
                  {filteredRecipes.length === 0 ? (
                    <div className="empty-state">No recipes match your search.</div>
                  ) : (
                    filteredRecipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        className={activeRecipe.id === recipe.id ? 'recipe-option active' : 'recipe-option'}
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <span>{recipe.title}</span>
                        <small>{recipe.category} · {recipe.time}</small>
                      </button>
                    ))
                  )}
                </div>

                {activeRecipe && (
                  <div className="recipe-detail">
                    <div className="recipe-header-row">
                      <div>
                        <h4>{activeRecipe.title}</h4>
                        <div className="recipe-time">{activeRecipe.time}</div>
                      </div>
                      <button
                        className={favoriteRecipeIds.includes(activeRecipe.id) ? 'favorite-btn active' : 'favorite-btn'}
                        onClick={() => toggleFavoriteRecipe(activeRecipe.id)}
                      >
                        {favoriteRecipeIds.includes(activeRecipe.id) ? '★ Favorite' : '☆ Favorite'}
                      </button>
                    </div>
                    <div className="recipe-section">
                      <h5>Ingredients</h5>
                      <ul>
                        {activeRecipe.ingredients.map((ingredient) => (
                          <li key={ingredient}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="recipe-section">
                      <h5>Steps</h5>
                      <ol>
                        {activeRecipe.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="content-card">
              <h3>Profile preferences</h3>
              <div className="profile-summary-box">
                <div className="profile-row">
                  <span>Interest</span>
                  <strong>{personalInterest}</strong>
                </div>
                <div className="profile-row">
                  <span>Activities</span>
                  <strong>{activities || 'Not set yet'}</strong>
                </div>
                <div className="profile-row">
                  <span>Favorite recipes</span>
                  <strong>{favoriteRecipes.length > 0 ? favoriteRecipes.map((recipe) => recipe.title).join(', ') : 'No favorites yet'}</strong>
                </div>
              </div>

              {favoriteRecipes.length > 0 && (
                <div className="favorite-list">
                  {favoriteRecipes.map((recipe) => (
                    <button key={recipe.id} className="favorite-list-item" onClick={() => setSelectedRecipe(recipe)}>
                      <span>{recipe.title}</span>
                      <small>{recipe.category}</small>
                    </button>
                  ))}
                </div>
              )}

              <div className="chip-group">
                {interestOptions.map((item) => (
                  <button
                    key={item}
                    className={personalInterest === item ? 'interest-chip active' : 'interest-chip'}
                    onClick={() => setPersonalInterest(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
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
