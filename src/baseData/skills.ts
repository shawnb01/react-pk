export type Skill = {
  name: string;
  maxXp: number;
  effect: number;
  description: string;
};

const Skills: Record<string, Record<string, Skill>> = {
  Fundamentals: {
    Concentration: {
      name: "Concentration",
      maxXp: 100,
      effect: 0.01,
      description: "Skill xp",
    },
    Productivity: {
      name: "Productivity",
      maxXp: 100,
      effect: 0.01,
      description: "Job xp",
    },
    Bargaining: {
      name: "Bargaining",
      maxXp: 100,
      effect: -0.01,
      description: "Expenses",
    },
    Meditation: {
      name: "Meditation",
      maxXp: 100,
      effect: 0.01,
      description: "Happiness",
    },
  },
  Combat: {
    Strength: {
      name: "Strength",
      maxXp: 100,
      effect: 0.01,
      description: "Military pay",
    },
    "Battle tactics": {
      name: "Battle tactics",
      maxXp: 100,
      effect: 0.01,
      description: "Military xp",
    },
    "Muscle memory": {
      name: "Muscle memory",
      maxXp: 100,
      effect: 0.01,
      description: "Strength xp",
    },
  },
  Magic: {
    "Mana control": {
      name: "Mana control",
      maxXp: 100,
      effect: 0.01,
      description: "T.A.A. xp",
    },
    Immortality: {
      name: "Immortality",
      maxXp: 100,
      effect: 0.01,
      description: "Longer lifespan",
    },
    "Time warping": {
      name: "Time warping",
      maxXp: 100,
      effect: 0.01,
      description: "Gamespeed",
    },
    "Super immortality": {
      name: "Super immortality",
      maxXp: 100,
      effect: 0.01,
      description: "Longer lifespan",
    },
  },

  "Evil Magic": {
    "Dark influence": {
      name: "Dark influence",
      maxXp: 100,
      effect: 0.01,
      description: "All xp",
    },
    "Evil control": {
      name: "Evil control",
      maxXp: 100,
      effect: 0.01,
      description: "Evil gain",
    },
    Intimidation: {
      name: "Intimidation",
      maxXp: 100,
      effect: -0.01,
      description: "Expenses",
    },
    "Demon training": {
      name: "Demon training",
      maxXp: 100,
      effect: 0.01,
      description: "All xp",
    },
    "Blood meditation": {
      name: "Blood meditation",
      maxXp: 100,
      effect: 0.01,
      description: "Evil gain",
    },
    "Demon's wealth": {
      name: "Demon's wealth",
      maxXp: 100,
      effect: 0.002,
      description: "Job pay",
    },
  },
};

export { Skills };
