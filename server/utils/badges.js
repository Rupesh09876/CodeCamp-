// Badge logic definitions

const BADGE_DEFINITIONS = {
  "First Steps": (stats) => stats.lessonsCompleted >= 1,
  "Code Curious": (stats) => stats.lessonsCompleted >= 5,
  "HTML Hero": (stats) => stats.htmlModuleCompleted === true,
  "Week Warrior": (stats, streak) => streak >= 7,
  "JS Ninja": (stats) => stats.jsModuleCompleted === true,
  "Challenge Accepted": (stats) => stats.challengesSolved >= 1,
  "Helping Hand": (stats) => stats.acceptedAnswers >= 1,
  "Century Club": (stats) => stats.lessonsCompleted >= 100,
};

exports.checkBadges = (userStats, streak) => {
  const earned = [];
  
  for (const [badgeName, checkFn] of Object.entries(BADGE_DEFINITIONS)) {
    // Provide default values so it doesn't crash if stats are missing
    const safeStats = {
      lessonsCompleted: userStats.lessonsCompleted || 0,
      challengesSolved: userStats.challengesSolved || 0,
      acceptedAnswers: userStats.acceptedAnswers || 0,
      htmlModuleCompleted: userStats.htmlModuleCompleted || false,
      jsModuleCompleted: userStats.jsModuleCompleted || false
    };

    if (checkFn(safeStats, streak)) {
      earned.push(badgeName);
    }
  }
  
  return earned;
};
