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
const interestRotationLibrary = {
  Wellness: {
    mustDo: ['Drink water and open the curtains.', 'Take a 5-minute stretch and breathe deeply.', 'Do one important task before noon.', 'Clear one small surface in your space.', 'Set your day up with one calm plan.', 'Eat something nourishing and simple.', 'Take a quick screen-free reset.', 'Make your bed and refresh your space.', 'Choose one task that matters most today.', 'Give yourself a gentler start to the day.'],
    easy: ['Wash a mug or small dish.', 'Open the window for fresh air.', 'Take a short walk around your home or block.', 'Make a simple cup of tea or water break.', 'Tidy one visible surface.', 'Stretch your shoulders and neck.', 'Sit outside for a few minutes.', 'Put on comfortable clothes.', 'Organize one tray or bag.', 'Do a 2-minute reset before lunch.'],
    selfCare: ['Take a quiet break without guilt.', 'Refresh your face or shower if needed.', 'Read a few pages or listen to calm music.', 'Do a gentle breathing exercise.', 'Take a short rest away from screens.', 'Treat yourself to a warm drink or snack.', 'Pause and notice what feels heavy today.', 'Spend a few minutes doing something soothing.', 'Take a proper stretch break.', 'Give yourself an easy, kind reset.'],
    fun: ['Listen to one favorite song or podcast.', 'Watch a short comfort clip or show.', 'Text someone you enjoy.', 'Do a quick creative hobby for 10 minutes.', 'Enjoy a small reward after your tasks.', 'Take a brief walk and notice your surroundings.', 'Read a chapter or enjoy a quiet moment.', 'Do something playful and low-pressure.', 'Let yourself rest without apologizing.', 'Celebrate one small win.'],
  },
  Sports: {
    mustDo: ['Do a 10-minute movement session.', 'Lay out your gear or shoes for later.', 'Stretch after your main task.', 'Take a short walk or mobility reset.', 'Move your body before your day gets busy.', 'Prepare for a workout or active session.', 'Pick one movement goal and do it.', 'Reset your energy with a quick motion break.', 'Set a simple sports or workout plan for today.', 'Make room for a short physical boost.'],
    easy: ['Do 5 minutes of mobility work.', 'Walk around the block or your home.', 'Stretch your calves, hips, and shoulders.', 'Put on workout clothes and get ready.', 'Take a brisk walk for fresh air.', 'Do a few bodyweight exercises.', 'Roll out or loosen tight muscles.', 'Do a quick squat or stretch session.', 'Do a brief movement challenge.', 'Play a short active video or music routine.'],
    selfCare: ['Hydrate and cool down properly.', 'Take a short rest after movement.', 'Refuel with something simple and energizing.', 'Take a moment to relax your muscles.', 'Wash up and reset after exercise.', 'Listen to a calm track after activity.', 'Stretch out cramped muscles gently.', 'Take a slow cooldown break.', 'Refill water before the next task.', 'Reward yourself after a workout.'],
    fun: ['Play a short skill challenge.', 'Do a little drill you enjoy.', 'Take a sports break that feels energizing.', 'Watch a favorite highlight or game clip.', 'Go outside for a quick active moment.', 'Do a recreational activity you love.', 'Try a mini challenge with a friend.', 'Have a light movement reward.', 'Do a fun activity you look forward to.', 'Celebrate your energy by moving.'],
  },
  Cooking: {
    mustDo: ['Plan one simple recipe for today.', 'Prep ingredients for one easy meal.', 'Clean one kitchen surface before or after eating.', 'Cook one nourishing meal.', 'Set aside time to make something comforting.', 'Choose a recipe that feels easy and enjoyable.', 'Keep the prep simple and realistic.', 'Prepare a healthy snack or light meal.', 'Make one part of your meal ahead.', 'Wash a pan or prep a simple ingredient.'],
    easy: ['Wash one pan or utensil.', 'Set out a healthy snack or drink.', 'Prep one ingredient for later.', 'Clear one counter area.', 'Put ingredients in one visible spot.', 'Wipe the table before eating.', 'Clean the sink or a small area.', 'Organize one food shelf or drawer.', 'Set out bowls or containers.', 'Choose a simple recipe before lunch.'],
    selfCare: ['Eat something warm and nourishing.', 'Take a small break from screens while cooking.', 'Create a meal that feels comforting and easy.', 'Cook something you look forward to eating.', 'Enjoy one meal without rushing.', 'Give yourself space to slow down.', 'Use ingredients you enjoy.', 'Take a water break before or after cooking.', 'Let the kitchen feel calmer and lighter.', 'Enjoy one simple, comforting meal.'],
    fun: ['Cook a favorite comforting meal.', 'Try a quick recipe you enjoy.', 'Use a favorite ingredient or flavor.', 'Create a mini meal-prep win.', 'Make something easy and satisfying.', 'Cook alongside music or a favorite show.', 'Enjoy a meal without multitasking.', 'Try a fun variation on a favorite dinner.', 'Make a snack that feels like a treat.', 'Give yourself a small culinary reward.'],
  },
  Outdoors: {
    mustDo: ['Step outside for 10 minutes.', 'Open the curtains and let in light.', 'Take a short walk near fresh air.', 'Get outside before the day gets busy.', 'Go for a brief reset outdoors.', 'Spend some time in natural light.', 'Take a small outdoor break today.', 'Walk outside and reset your focus.', 'Do a quick outdoor reset before lunch.', 'Get one moment of fresh air.'],
    easy: ['Sit outside for a few minutes.', 'Walk to the mailbox or corner.', 'Take a short loop around the block.', 'Open a window and enjoy the air.', 'Step outside for a drink break.', 'Sit in sunlight for a calm reset.', 'Take a quick wander in a nearby space.', 'Stand outside and breathe deeply.', 'Take a short neighborhood walk.', 'Take one outdoor break without rushing.'],
    selfCare: ['Take a slow outdoor pause.', 'Give yourself quiet time in fresh air.', 'Listen to birds or sounds outside.', 'Sit somewhere peaceful and breathe.', 'Take a screen-free break outdoors.', 'Spend a few calm minutes outside.', 'Use your time outside as a mental reset.', 'Enjoy a restorative micronap or sit break.', 'Take a slow walk and clear your head.', 'Let the outdoors calm your mind.'],
    fun: ['Take a walk in a new area.', 'Sit somewhere pretty and relax.', 'Take a scenic route for a few minutes.', 'Visit a park or outdoor spot nearby.', 'Enjoy one outdoor moment that feels good.', 'Bring a drink and take a relaxing walk.', 'Take an outdoor break with a favorite song.', 'Let yourself enjoy the weather.', 'Take a calm outdoor reward break.', 'Do one outdoor thing that lifts your mood.'],
  },
  Creative: {
    mustDo: ['Spend 15 minutes on a creative task.', 'Start one small creative project today.', 'Make room for something playful and low-pressure.', 'Do a short creative reset.', 'Create something for yourself without pressure.', 'Set aside time for a hobby you enjoy.', 'Finish a tiny creative win.', 'Start one creative task and keep it small.', 'Give yourself a low-stakes creative block.', 'Let creativity be part of your day.'],
    easy: ['Doodle, draw, write, or sketch.', 'Organize your creative tools.', 'Write a quick note or idea.', 'Take a creative pause with music.', 'Refresh a work surface for creativity.', 'Make one small piece of art or design.', 'Use color or inspiration for a short break.', 'Jot down one idea or plan.', 'Take a quick hobby break.', 'Make a tiny creative change in your space.'],
    selfCare: ['Give yourself a guilt-free creative break.', 'Let your mind wander for a few minutes.', 'Take a quiet, calm creative moment.', 'Pause and make something soothing.', 'Use creativity as a mental reset tool.', 'Take a low-pressure activity break.', 'Make space for joy and expression.', 'Reward yourself with a creative break.', 'Use art or writing as stress relief.', 'Let your creativity be playful.'],
    fun: ['Do a hobby you genuinely enjoy.', 'Make one fun thing today.', 'Take a creative break with no pressure.', 'Try a small playful project.', 'Create something just because you like it.', 'Write, draw, or experiment for a moment.', 'Use color and texture in a fun way.', 'Create one tiny piece of joy.', 'Give yourself a light artistic reward.', 'Enjoy a fun, relaxing creative session.'],
  },
  Learning: {
    mustDo: ['Spend a little time learning something new.', 'Focus on one useful skill or topic.', 'Read or watch something educational.', 'Keep learning small and realistic today.', 'Set a ten-minute learning goal.', 'Learn one new idea that feels useful.', 'Give yourself a brain-stimulating break.', 'Choose one topic to revisit or explore.', 'Make a small learning win happen.', 'Use a small amount of time to grow.'],
    easy: ['Read one page or article.', 'Watch a short educational video.', 'Try one small brain exercise.', 'Take a quick language or study break.', 'Look up one useful fact or topic.', 'Write down one thing you want to learn.', 'Read a piece that sparks interest.', 'Practice one small skill for 10 minutes.', 'Learn one short idea from a topic you like.', 'Add one fresh fact to your knowledge.'],
    selfCare: ['Take a calm, focused break.', 'Give your brain a gentle challenge.', 'Learn without forcing yourself to be perfect.', 'Use learning as a positive routine.', 'Let your curiosity guide your effort.', 'Take a short, useful brain break.', 'Read something enriching and pleasant.', 'Spend a little time on personal growth.', 'Learn in a way that feels comfortable.', 'Prepare yourself for a low-stress win.'],
    fun: ['Explore a topic you find interesting.', 'Read or watch something you enjoy.', 'Learn in a way that feels fun and light.', 'Use a short educational break as a reward.', 'Let curiosity guide your next step.', 'Enjoy a quick knowledge boost.', 'Move your brain in a fun way.', 'Try one small personal-growth activity.', 'Learn something surprising and interesting.', 'Give yourself a tiny educational reward.'],
  },
  'Family time': {
    mustDo: ['Call or check in with someone you love.', 'Spend a little intentional time with family.', 'Plan one meaningful connection today.', 'Do one caring task for your household.', 'Create a small moment of togetherness.', 'Check in with a family member or loved one.', 'Make one family or home connection.', 'Take time to be present with someone important.', 'Plan a small, warm family moment.', 'Choose one act of care for home or family.'],
    easy: ['Send a message to a loved one.', 'Share a photo or update with family.', 'Make a cup of tea or snack for home.', 'Talk to someone for a few minutes.', 'Do one helpful task for a household member.', 'Organize a small family activity.', 'Make a call before the day gets busy.', 'Arrange a simple family check-in.', 'Create a small moment of connection.', 'Do a little home task with someone.'],
    selfCare: ['Take a moment to feel supported.', 'Let yourself enjoy connection without pressure.', 'Spend a calm moment with someone you trust.', 'Give yourself space to be cared for too.', 'Take a rest and enjoy warm company.', 'Make time for a positive connection.', 'Let communication feel easy and light.', 'Give love and receive it in return.', 'Slow down and be present with people.', 'Enjoy a supportive relationship moment.'],
    fun: ['Share a laugh or favorite memory.', 'Play a quick game or conversation activity.', 'Plan a small outing or family moment.', 'Have a nice conversation with someone.', 'Do one joyful family activity.', 'Take a small break with someone you love.', 'Make the day feel warm and connected.', 'Enjoy one friendly and easy interaction.', 'Share a positive moment with those around you.', 'Celebrate love and connection today.'],
  },
  Relaxing: {
    mustDo: ['Take an intentional calm break.', 'Reduce one pressure point in your day.', 'Do one thing that helps you settle down.', 'Create a quiet moment for yourself.', 'Slow down and take a breath.', 'Give yourself a lower-pressure start.', 'Choose one calming task for today.', 'Take a rest moment without guilt.', 'Set the tone for a less hurried day.', 'Make your day feel easier to carry.'],
    easy: ['Sit quietly for 3 minutes.', 'Dim lights or create a softer atmosphere.', 'Take a slow tea or water break.', 'Put on calming music or a playlist.', 'Take a short break from notifications.', 'Turn off one distraction for a while.', 'Make a comfortable rest spot.', 'Listen to a gentle sound or podcast.', 'Slow your pace and put on soft music.', 'Take a break without multitasking.'],
    selfCare: ['Spend a few calm minutes in stillness.', 'Take a screen-free reset.', 'Enjoy gentle rest and quiet breathing.', 'Do one soothing self-care action.', 'Let yourself pause for a moment.', 'Create a restful pocket in the day.', 'Take a lighter approach to your routine.', 'Use rest as part of your progress.', 'Give yourself permission to slow down.', 'Have a peaceful reset and enjoy it.'],
    fun: ['Enjoy a comfort activity you love.', 'Treat yourself to a gentle pleasure.', 'Do one low-key reward thing today.', 'Relax in a way that feels satisfying.', 'Take a soft, comforting break.', 'Choose something cozy and joyful.', 'Enjoy a calm, easy mental reset.', 'Do a restful activity you actually like.', 'Turn one small moment into a reward.', 'Give yourself one comfortable, pleasant pause.'],
  },
  Gardening: {
    mustDo: ['Water one plant or small garden area.', 'Tidy a small plant or garden spot.', 'Take a few minutes outside with your plants.', 'Care for one plant or flower bed.', 'Check on what needs attention.', 'Choose one gardening task to finish.', 'Refresh a pot or plant area.', 'Create a tiny gardening win today.', 'Water or trim something in your plant space.', 'Take a moment to enjoy nature.'],
    easy: ['Trim a few leaves or dead stems.', 'Wipe down a pot or garden tool.', 'Move a plant to a brighter spot.', 'Add soil or fresh compost to one pot.', 'Water a plant or window box.', 'Remove dead leaves or weeds.', 'Refresh a small garden area.', 'Organize your garden tools.', 'Take a short outdoor break with plants.', 'Notice one plant that looks better today.'],
    selfCare: ['Take a calm moment with nature.', 'Spend time around plants without pressure.', 'Enjoy a peaceful outdoor reset.', 'Use plant care as a calming routine.', 'Let fresh air and plants help you reset.', 'Take a gentle outdoor break with your garden.', 'Reward yourself with quiet time outdoors.', 'Sit near plants and breathe deeply.', 'Use nature as a calming reset tool.', 'Take a moment to appreciate what grows.'],
    fun: ['Enjoy a small garden moment.', 'Let plant care become a calming hobby.', 'Take a slow walk through your garden.', 'Enjoy one outdoor break in nature.', 'Do a little gardening as a reward.', 'Take a peaceful gardening break.', 'Spend time with plants for a mood boost.', 'Enjoy a fresh, calm atmosphere.', 'Pay attention to something growing.', 'Make nature part of your daily reset.'],
  },
  Reading: {
    mustDo: ['Read 10 minutes of a book or article.', 'Pick one reading session for today.', 'Give yourself a quiet, no-phone moment.', 'Read something that feels helpful or uplifting.', 'Set a goal to read a few pages.', 'Read a chapter or article before work starts.', 'Use reading as a calm reset.', 'Choose one comforting book or piece.', 'Spend a few minutes on something meaningful.', 'Read something that feels nourishing.'],
    easy: ['Read one page before checking messages.', 'Read a short interesting article.', 'Read in a cozy chair or outside.', 'Make tea and settle in with one chapter.', 'Read something easy and enjoyable.', 'Take a quiet, comfortable reading break.', 'Read in a calm space for a few minutes.', 'Choose a simple reading topic.', 'Read a short story or article.', 'Read before bed or after lunch.'],
    selfCare: ['Give yourself a quiet, screen-free break.', 'Read something comforting and calming.', 'Use reading as a way to unwind.', 'Take a moment for your mind to slow down.', 'Enjoy a gentle, restful activity.', 'Spend time in a comforting mental escape.', 'Read without pressure or deadlines.', 'Let reading feel like a reward.', 'Take a moment to rest with a good book.', 'Use books to reset your energy.'],
    fun: ['Read a chapter you love.', 'Pick something entertaining and easy.', 'Give yourself a relaxing reading break.', 'Enjoy one literary reward moment.', 'Read something that makes you smile.', 'Take a quiet reading pause.', 'Pick a book or article that feels uplifting.', 'Let reading be calming and enjoyable.', 'Read a short piece for joy.', 'Enjoy a comfortable reading ritual.'],
  },
  Travel: {
    mustDo: ['Plan a simple outing or change of scenery.', 'Prepare what you need for a short trip or outing.', 'Take one step toward a fresh environment.', 'Choose one small adventure today.', 'Plan a brief change of place today.', 'Make a little travel moment happen.', 'Take a small excursion or outing.', 'Give yourself a change of scenery.', 'Plan something simple outside your usual routine.', 'Create a mini adventure that feels doable.'],
    easy: ['Walk somewhere new for a few minutes.', 'Pack a bag for a quick outing.', 'Take a short drive or walk to a new place.', 'Open a window and imagine a fresh place.', 'Do a mini local exploration.', 'Visit one nearby spot you enjoy.', 'Take a short trip around your area.', 'Update your travel plans for later.', 'Take a small excursion with a purpose.', 'Choose a scenic route or new location.'],
    selfCare: ['Enjoy a break from routine.', 'Let yourself reset in a new space.', 'Take a calm trip or outing for your mind.', 'Use a change of scenery to recharge.', 'Give yourself a quiet adventure.', 'Take a new environment as a mental reset.', 'Enjoy a restful outing without pressure.', 'Travel lightly and simply.', 'Use movement and new places to reset.', 'Take a small change of pace.'],
    fun: ['Take a scenic outing or small adventure.', 'Plan a mini treat for yourself.', 'Do one thing that feels exciting but manageable.', 'Go somewhere refreshing for a bit.', 'Enjoy a break from your usual setting.', 'Take a low-stress change-of-place moment.', 'Turn one outing into a reward.', 'Explore a place you have not seen in a while.', 'Enjoy a small trip around town.', 'Give yourself a taste of exploration.'],
  },
  Music: {
    mustDo: ['Play one favorite song to reset your energy.', 'Take a short movement break with music.', 'Use a playlist to make a task feel lighter.', 'Choose a song that boosts your mood.', 'Set one uplifting track for the day.', 'Play something calming before a task.', 'Pick music that matches your energy.', 'Give yourself a 5-minute music reset.', 'Use a playlist as your backdrop for one task.', 'Choose a track that feels encouraging.'],
    easy: ['Dance for 2 minutes.', 'Stretch while playing music.', 'Put on calm music while tidying.', 'Play a favorite track while cleaning.', 'Create a short music reset break.', 'Listen to one song while you rest.', 'Switch your environment with a new playlist.', 'Play music while folding or organizing.', 'Take one upbeat song break.', 'Use music to energize a small task.'],
    selfCare: ['Give yourself a soothing music break.', 'Use calm music to relax and reset.', 'Let music lower stress for a few minutes.', 'Take a peaceful listening break.', 'Enjoy a track that calms your nervous system.', 'Use music to ease tension.', 'Let a song reset your focus and mood.', 'Play one comforting track while resting.', 'Give yourself a little emotional reset.', 'Use music to help you slow down.'],
    fun: ['Pick a favorite song and enjoy it.', 'Create a mini mood boost with music.', 'Listen to something that makes you smile.', 'Take a fun music reward break.', 'Learn a song you love to repeat.', 'Let music make a boring task more playful.', 'Create a soundtrack for your day.', 'Listen to something uplifting and happy.', 'Start your day with a favorite tune.', 'Let music turn a small task into a ritual.'],
  },
  Skincare: {
    mustDo: ['Wash your face gently and reset.', 'Apply moisturizer to hydrate your skin.', 'Cleanse your skin and refresh your routine.', 'Use sunscreen if you are heading outside.', 'Do a simple facial care reset today.', 'Clean your skin and prep for the day ahead.', 'Take a few minutes for a basic skin ritual.', 'Use toner or serum if you have one.', 'Do a gentle cleanse and finish with moisturizer.', 'Refresh your skincare routine without rushing.'],
    easy: ['Wash your hands and clean your face.', 'Apply a hydrating mist or spray.', 'Clean up and remove makeup gently.', 'Use a toner or soothing step.', 'Apply a simple moisturizer.', 'Clean your pillow and set up your routine.', 'Take a short skincare break.', 'Use a gentle sheet mask or calming treatment.', 'Apply sunscreen before going outside.', 'Take a few minutes to restore your skin.'],
    selfCare: ['Enjoy a calming skincare ritual.', 'Take a moment to care for your skin gently.', 'Treat your skin like a priority, not a chore.', 'Use a soothing routine to slow down.', 'Take a brief, relaxing skincare reset.', 'Give your face a fresh and calm start.', 'Take a screen-free moment while you care for yourself.', 'Let skincare be a calming ritual, not a rush.', 'Use a nourishing product that feels good.', 'Take a gentle reset for your skin and mind.'],
    fun: ['Try a product you enjoy using.', 'Treat yourself to a soothing skincare moment.', 'Use your favorite facial step as a reward.', 'Turn skincare into a little ritual of care.', 'Enjoy a mindful skin routine.', 'Make your skincare time feel like a reset.', 'Use calming products and enjoy the process.', 'Do a mini self-care ritual with no rush.', 'Give yourself one gentle luxury moment.', 'Refresh your skin and enjoy a calm, cozy ritual.'],
  },
  'Home reset': {
    mustDo: ['Clear one visible surface today.', 'Reset one room or corner of your space.', 'Tidy one high-impact area in your home.', 'Set up one zone so it feels easier.', 'Focus on one home task that reduces friction.', 'Do one small home reset before the day ends.', 'Tidy a sink, table, or entry area.', 'Reset one part of your home for calm.', 'Choose the easiest room or surface to fix.', 'Make one area of your home feel lighter.'],
    easy: ['Do one quick laundry fold.', 'Wash one dish or tray.', 'Put away one basket or pile.', 'Clear one table or countertop.', 'Reset one chair or corner.', 'Put away clutter from a visible spot.', 'Wipe down one table or shelf.', 'Straighten one small area quickly.', 'Take 5 minutes to make things calmer.', 'Make one home task feel easy and quick.'],
    selfCare: ['Make your environment feel calmer and more comfortable.', 'Enjoy the comfort of a tidier space.', 'Take a breath and enjoy your reset.', 'Use home care as a stress reset.', 'Give yourself a calmer living space.', 'Let your home feel easier to move through.', 'Create a nicer environment without pressure.', 'Simplify one space to make life lighter.', 'Take pride in a small home win.', 'Let the reset feel satisfying and easy.'],
    fun: ['Make your room feel fresh and cozy.', 'Turn a little reset into a mini reward.', 'Take a short home reset break with music.', 'Enjoy the feeling of a calmer room.', 'Make one space feel lighter and nicer.', 'Create a cozy zone that feels better.', 'Treat your home reset like a reward.', 'Refresh a room and enjoy the difference.', 'Make your environment feel brighter.', 'Celebrate a clean and calmer space.'],
  },
  Mindfulness: {
    mustDo: ['Take 5 minutes for a breathing break.', 'Pause and notice your body and breath.', 'Take a short mindfulness reset.', 'Do one calming reflective check-in.', 'Stop for a moment and slow your thoughts.', 'Practice one mindful pause today.', 'Take a no-pressure breath break.', 'Choose a calming anchor for your day.', 'Reset with one breath and one pause.', 'Notice one thing that feels manageable.'],
    easy: ['Sit comfortably and breathe deeply.', 'Close your eyes for a minute and reset.', 'Take a calm phone-free rest.', 'Take a quiet moment to feel your feet.', 'Look around and notice one grounding thing.', 'Stretch slowly and breathe deeply.', 'Use a gentle breath exercise.', 'Pause and feel your shoulders release.', 'Take a soft reset from hectic thoughts.', 'Take a quiet, grounding break.'],
    selfCare: ['Give your mind a gentle, supportive pause.', 'Use mindfulness to lower tension.', 'Spend time calming your thoughts.', 'Reduce pressure with a calm reset.', 'Take a thoughtful break without judgment.', 'Notice what feels heavy and let it soften.', 'Create a mindful pocket in the day.', 'Make room for a deeper breath.', 'Use stillness to recharge your mind.', 'Take a few restful moments to settle.'],
    fun: ['Enjoy a peaceful and grounding break.', 'Make calmness feel like a reward.', 'Take a quiet mindful pause you actually enjoy.', 'Give yourself a gentle mental reset.', 'Take a low-pressure spiritual or mindful moment.', 'Let stillness feel comforting and rewarding.', 'Rest in a soft, soothing moment.', 'Use mindfulness as a small but meaningful treat.', 'Enjoy a moment that makes you feel calmer.', 'Let peaceful grounding become part of your routine.'],
  },
  Community: {
    mustDo: ['Reach out to someone you appreciate.', 'Do one kind thing for your community.', 'Check in with a friend or neighbor.', 'Take one step toward connection today.', 'Make one supportive human contact.', 'Think of one person who may need encouragement.', 'Do a kind or helpful act today.', 'Reach out to someone and be present.', 'Create one warm social moment.', 'Choose a small act of connection.'],
    easy: ['Send a quick message to a friend.', 'Say hello to someone nearby.', 'Be kind to the person next to you.', 'Offer a helpful comment or gesture.', 'Chat with someone for a few minutes.', 'Give a compliment or kind word.', 'Reach out and reconnect with one person.', 'Do one nice thing for a neighbor.', 'Use a small moment of kindness.', 'Take a step toward social connection.'],
    selfCare: ['Enjoy a warm connection without pressure.', 'Take a social break that feels positive.', 'Let connection help lower stress.', 'Spend a small amount of time feeling supported.', 'Use community as a source of comfort.', 'Take a moment for human warmth.', 'Give yourself a kind social reset.', 'Let kindness become part of your day.', 'Choose one uplifting connection.', 'Enjoy a supportive interaction.'],
    fun: ['Have a positive conversation with someone.', 'Text someone you enjoy talking to.', 'Plan a small friendly interaction.', 'Share a kind or encouraging message.', 'Send a happy note to someone you care about.', 'Take a positive social reward break.', 'Choose one uplifting connection today.', 'Enjoy a warm, easy interaction.', 'Be a little more social than usual.', 'Let connection feel pleasant and energizing.'],
  },
  'Personal care': {
    mustDo: ['Take a few minutes to care for yourself.', 'Refresh your body and space today.', 'Do one personal care task without rushing.', 'Give yourself a gentle reset for your body.', 'Keep your personal care simple and consistent.', 'Refresh your routine with something basic and useful.', 'Take time to look after yourself properly.', 'Complete one self-care task today.', 'Set aside one small self-care moment.', 'Give yourself a kind and easy reset.'],
    easy: ['Drink water and wash your face.', 'Brush your hair or freshen up.', 'Change into comfortable clothes.', 'Take a short shower or refresh routine.', 'Wear something comfortable and easy.', 'Set out your essentials for later.', 'Take a 5-minute reset break.', 'Do a gentle stretch and hydrate.', 'Use a simple daily care ritual.', 'Take a few minutes to reset physically.'],
    selfCare: ['Make self-care feel easy and kind.', 'Take a moment to feel refreshed.', 'Use self-care as a gentle reset tool.', 'Treat your body with patience and care.', 'Let self-care be a comfort, not a task.', 'Take a quiet, personal care pause.', 'Give yourself permission to reset gently.', 'Make your routine feel supportive and calm.', 'Use self-care as a healthy daily habit.', 'Take a moment to feel restored.'],
    fun: ['Turn self-care into a small joy.', 'Enjoy a nice personal care ritual.', 'Give yourself one little treat you enjoy.', 'Use a small comfort step as a reward.', 'Create a pleasant care moment for yourself.', 'Make self-care feel warm and calming.', 'Enjoy a soft, positive reset activity.', 'Treat yourself to a calm and gentle routine.', 'Take a moment that makes you feel cared for.', 'Make your body care feel nourishing and easy.'],
  },
};

function getRotatedInterestOptions(interest, activities = '') {
  const baseOptions = interestRotationLibrary[interest] || interestRotationLibrary.Wellness;
  const dayKey = Math.floor(Date.now() / 86400000);
  const seed = `${(interest || 'Wellness').toLowerCase()}-${dayKey}`;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const offset = Math.abs(hash) % 10;
  const rotate = (items = []) => Array.from({ length: Math.min(3, items.length) }, (_, index) => items[(offset + index) % items.length]);

  const customActivityText = activities ? activities.trim() : '';
  const withCustom = customActivityText ? {
    mustDo: [
      `Focus on ${customActivityText} for a few minutes.`,
      ...rotate(baseOptions.mustDo),
    ].slice(0, 3),
    easy: [
      `Prepare for ${customActivityText} in a simple way.`,
      ...rotate(baseOptions.easy),
    ].slice(0, 3),
    selfCare: [
      `Take a gentle pause while you enjoy ${customActivityText}.`,
      ...rotate(baseOptions.selfCare),
    ].slice(0, 3),
    fun: [
      `Make ${customActivityText} feel fun and easy today.`,
      ...rotate(baseOptions.fun),
    ].slice(0, 3),
  } : {
    mustDo: rotate(baseOptions.mustDo),
    easy: rotate(baseOptions.easy),
    selfCare: rotate(baseOptions.selfCare),
    fun: rotate(baseOptions.fun),
  };

  return withCustom;
}
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

  const rotatedOptions = getRotatedInterestOptions(interest, activities);

  if (interest && interestRotationLibrary[interest]) {
    adjusted.mustDo = rotatedOptions.mustDo;
    adjusted.easy = rotatedOptions.easy;
    adjusted.selfCare = rotatedOptions.selfCare;
    adjusted.fun = rotatedOptions.fun;
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
