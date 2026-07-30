const User = require('../models/User');

const XP_RULES = {
  job_applied: 20,
  job_hired: 100,
  job_completed: 200,
  post_created: 10,
  comment_created: 5,
  profile_completed: 50
};

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000];

async function awardXP(userId, actionType) {
  const user = await User.findById(userId);
  if (!user) return null;

  const gain = XP_RULES[actionType] || 0;
  user.xp += gain;
  user.lastActiveAt = new Date();

  // Level calculation
  let newLevel = user.level;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (user.xp >= LEVEL_THRESHOLDS[i]) {
      newLevel = i + 1;
      break;
    }
  }

  if (newLevel > user.level) {
    user.level = newLevel;
    console.log(`${user.name} leveled up to Level ${newLevel}!`);
  }

  await user.save();
  return { xp: user.xp, level: user.level, gained: gain };
}

module.exports = { awardXP };
