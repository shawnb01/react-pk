import { GameData } from "@/lib/types";
import { useRef } from "react";

export type TaskBaseData = {
  name: string;
  maxXp: number;
  [key: string]: string | number; // Index
};

export type JobBaseData = {
  name: string;
  maxXp: number;
  income: number;
  [key: string]: string | number; // Index
};

export type SkillBaseData = {
  name: string;
  maxXp: number;
  effect: number;
  description: string;
  [key: string]: string | number; // Index
};

export type ItemBaseData = {
  name: string;
  expense: number;
  effect: number;
  description?: string | undefined;
  [key: string]: string | number | undefined; // Index
};

export type Categories = {
  [key: string]: string[];
};

class Task {
  baseData: TaskBaseData | JobBaseData | SkillBaseData;
  name: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpMultipliers: number[];
  constructor(baseData: TaskBaseData) {
    this.baseData = baseData;
    this.name = baseData.name;
    this.level = 0;
    this.maxLevel = 0;
    this.xp = 0;
    this.xpMultipliers = [];
  }

  getMaxXp() {
    return Math.round(
      this.baseData.maxXp * (this.level + 1) * Math.pow(1.01, this.level),
    );
  }

  getXpLeft() {
    return Math.round(this.getMaxXp() - this.xp);
  }

  getMaxLevelMultiplier(): number {
    return 1 + this.maxLevel / 10;
  }

  getXpGain() {
    return applyMultipliers(10, this.xpMultipliers);
  }

  increaseXp(applySpeed: (value: number) => number) {
    this.xp += applySpeed(this.getXpGain());
    if (this.xp >= this.getMaxXp()) {
      let excess = this.xp - this.getMaxXp();
      while (excess >= 0) {
        this.level++;
        excess -= this.getMaxXp();
      }
      this.xp = this.getMaxXp() + excess;
    }
  }
}

export class Job extends Task {
  incomeMultipliers: number[];
  income: number;
  constructor(baseData: JobBaseData) {
    super(baseData);
    this.income = baseData.income;
    this.incomeMultipliers = [];
  }

  getLevelMultiplier() {
    return 1 + Math.log10(this.level + 1);
  }

  getIncome() {
    return applyMultipliers(this.income, this.incomeMultipliers);
  }
}

export class Skill extends Task {
  effect: number;
  description: string;
  constructor(baseData: SkillBaseData) {
    super(baseData);
    this.effect = baseData.effect;
    this.description = baseData.description;
  }

  getEffect() {
    return 1 + this.level * this.effect;
  }

  getEffectDescription() {
    return this.description;
  }
}

function applyMultipliers(base: number, multipliers: number[]) {
  let result = 1;
  multipliers.forEach((m) => {
    let multiplier = m;
    result *= multiplier;
  });
  return Math.round(base * result);
}

export class Item {
  baseData: ItemBaseData;
  name: string;
  expense: number;
  expenseMultipliers: number[];
  constructor(baseData: ItemBaseData) {
    this.baseData = baseData;
    this.name = baseData.name as string;
    this.expense = baseData.expense as number;
    this.expenseMultipliers = [];
  }

  getEffect() {
    return this.baseData.effect;
  }

  getEffectDescription() {
    return typeof this.baseData.description === "undefined"
      ? "Happiness"
      : this.baseData.description;
  }

  getExpense() {
    return applyMultipliers(
      this.baseData.expense as number,
      this.expenseMultipliers,
    );
  }
}

export class Requirement {
  requirements: { task: string; requirement: number }[];
  completed: boolean;
  constructor(requirements: { task: string; requirement: number }[]) {
    this.requirements = requirements;
    this.completed = false;
  }

  isCompleted(gameData: GameData) {
    return this.completed;
  }
}

export class TaskRequirement extends Requirement {
  type: string;
  constructor(requirements: { task: string; requirement: number }[]) {
    super(requirements);
    this.type = "Task";
  }

  getCondition(task: string, requirement: number, gameData: GameData) {
    return gameData.taskData[task]!.level >= requirement;
  }

  isCompleted(gameData: GameData) {
    this.completed = this.requirements.every((r) =>
      this.getCondition(r.task!, r.requirement, gameData),
    );

    return this.completed;
  }
}

export class CoinRequirement extends Requirement {
  type: string;
  constructor(requirements: { task: string; requirement: number }[]) {
    super(requirements);
    this.type = "Coin";
  }

  getCondition(coins: number, requirement: number) {
    return coins >= requirement;
  }

  isCompleted(gameData: GameData) {
    this.completed = this.requirements.every((r) =>
      this.getCondition(gameData.coins, r.requirement),
    );

    return this.completed;
  }
}

export class AgeRequirement extends Requirement {
  type: string;
  constructor(requirements: { task: string; requirement: number }[]) {
    super(requirements);
    this.type = "Age";
  }

  getCondition(days: number, requirement: number) {
    return days >= requirement * 365;
  }

  isCompleted(gameData: GameData) {
    this.completed = this.requirements.every((r) =>
      this.getCondition(gameData.days, r.requirement),
    );

    return this.completed;
  }
}

export class EvilRequirement extends Requirement {
  type: string;
  constructor(requirements: { task: string; requirement: number }[]) {
    super(requirements);
    this.type = "Evil";
  }

  getCondition(evil: number, requirement: number) {
    return evil >= requirement;
  }

  isCompleted(gameData: GameData) {
    this.completed = this.requirements.every((r) =>
      this.getCondition(gameData.evil, r.requirement),
    );

    return this.completed;
  }
}

const jobBaseData = {
  Beggar: { name: "Beggar", maxXp: 50, income: 5 },
  Farmer: { name: "Farmer", maxXp: 100, income: 9 },
  Fisherman: { name: "Fisherman", maxXp: 200, income: 15 },
  Miner: { name: "Miner", maxXp: 400, income: 40 },
  Blacksmith: { name: "Blacksmith", maxXp: 800, income: 80 },
  Merchant: { name: "Merchant", maxXp: 1600, income: 150 },
  Squire: { name: "Squire", maxXp: 100, income: 5 },
  Footman: { name: "Footman", maxXp: 1000, income: 50 },
  "Veteran footman": { name: "Veteran footman", maxXp: 10000, income: 120 },
  Knight: { name: "Knight", maxXp: 100000, income: 300 },
  "Veteran knight": { name: "Veteran knight", maxXp: 1000000, income: 1000 },
  "Elite knight": { name: "Elite knight", maxXp: 7500000, income: 3000 },
  "Holy knight": { name: "Holy knight", maxXp: 40000000, income: 15000 },
  "Legendary knight": {
    name: "Legendary knight",
    maxXp: 150000000,
    income: 50000,
  },
  Student: { name: "Student", maxXp: 100000, income: 100 },
  "Apprentice mage": { name: "Apprentice mage", maxXp: 1000000, income: 1000 },
  Mage: { name: "Mage", maxXp: 10000000, income: 7500 },
  Wizard: { name: "Wizard", maxXp: 100000000, income: 50000 },
  "Master wizard": {
    name: "Master wizard",
    maxXp: 10000000000,
    income: 250000,
  },
  Chairman: { name: "Chairman", maxXp: 1000000000000, income: 1000000 },
};

const skillBaseData = {
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
};

const itemBaseData = {
  Homeless: { name: "Homeless", expense: 0, effect: 1 },
  Tent: { name: "Tent", expense: 15, effect: 1.4 },
  "Wooden hut": { name: "Wooden hut", expense: 100, effect: 2 },
  Cottage: { name: "Cottage", expense: 750, effect: 3.5 },
  House: { name: "House", expense: 3000, effect: 6 },
  "Large house": { name: "Large house", expense: 25000, effect: 12 },
  "Small palace": { name: "Small palace", expense: 300000, effect: 25 },
  "Grand palace": { name: "Grand palace", expense: 5000000, effect: 60 },
  Castle: { name: "Castle", expense: 100000000, effect: 150 },

  Book: { name: "Book", expense: 10, effect: 1.5, description: "Skill xp" },
  Dumbbells: {
    name: "Dumbbells",
    expense: 50,
    effect: 1.5,
    description: "Strength xp",
  },
  "Personal squire": {
    name: "Personal squire",
    expense: 200,
    effect: 2,
    description: "Job xp",
  },
  "Steel longsword": {
    name: "Steel longsword",
    expense: 1000,
    effect: 2,
    description: "Military xp",
  },
  Butler: {
    name: "Butler",
    expense: 7500,
    effect: 1.5,
    description: "Happiness",
  },
  "Sapphire charm": {
    name: "Sapphire charm",
    expense: 50000,
    effect: 3,
    description: "Magic xp",
  },
  "Study desk": {
    name: "Study desk",
    expense: 1000000,
    effect: 2,
    description: "Skill xp",
  },
  Library: {
    name: "Library",
    expense: 10000000,
    effect: 1.5,
    description: "Skill xp",
  },
};
const jobCategories: Categories = {
  "Common work": [
    "Beggar",
    "Farmer",
    "Fisherman",
    "Miner",
    "Blacksmith",
    "Merchant",
  ],
  Military: [
    "Squire",
    "Footman",
    "Veteran footman",
    "Knight",
    "Veteran knight",
    "Elite knight",
    "Holy knight",
    "Legendary knight",
  ],
  "The Arcane Association": [
    "Student",
    "Apprentice mage",
    "Mage",
    "Wizard",
    "Master wizard",
    "Chairman",
  ],
};

const skillCategories: Categories = {
  Fundamentals: ["Concentration", "Productivity", "Bargaining", "Meditation"],
  Combat: ["Strength", "Battle tactics", "Muscle memory"],
  Magic: ["Mana control", "Immortality", "Time warping", "Super immortality"],
  "Dark magic": [
    "Dark influence",
    "Evil control",
    "Intimidation",
    "Demon training",
    "Blood meditation",
    "Demon's wealth",
  ],
};

const itemCategories: Categories = {
  Properties: [
    "Homeless",
    "Tent",
    "Wooden hut",
    "Cottage",
    "House",
    "Large house",
    "Small palace",
    "Grand palace",
    "Castle",
  ],
  Misc: [
    "Book",
    "Dumbbells",
    "Personal squire",
    "Steel longsword",
    "Butler",
    "Sapphire charm",
    "Study desk",
    "Library",
  ],
};

const headerRowColors: { [key: string]: string } = {
  "Common work": "bg-green-600 dark:bg-green-800",
  Military: "bg-red-600 dark:bg-red-800",
  "The Arcane Association": "bg-violet-600 dark:bg-violet-800",
  Fundamentals: "bg-cyan-600 dark:bg-cyan-800",
  Combat: "bg-amber-600 dark:bg-amber-800",
  Magic: "bg-fuchsia-600 dark:bg-fuchsia-800",
  "Dark magic": "bg-rose-600 dark:bg-rose-800",
  Properties: "bg-blue-600 dark:bg-blue-800",
  Misc: "bg-indigo-600 dark:bg-indigo-800",
};

const tooltips: { [key: string]: string } = {
  Beggar:
    "Struggle day and night for a couple of copper coins. It feels like you are at the brink of death each day.",
  Farmer:
    "Plow the fields and grow the crops. It's not much but it's honest work.",
  Fisherman:
    "Reel in various fish and sell them for a handful of coins. A relaxing but still a poor paying job.",
  Miner:
    "Delve into dangerous caverns and mine valuable ores. The pay is quite meager compared to the risk involved.",
  Blacksmith:
    "Smelt ores and carefully forge weapons for the military. A respectable and OK paying commoner job.",
  Merchant:
    "Travel from town to town, bartering fine goods. The job pays decently well and is a lot less manually-intensive.",

  Squire:
    "Carry around your knight's shield and sword along the battlefield. Very meager pay but the work experience is quite valuable.",
  Footman:
    "Put down your life to battle with enemy soldiers. A courageous, respectable job but you are still worthless in the grand scheme of things.",
  "Veteran footman":
    "More experienced and useful than the average footman, take out the enemy forces in battle with your might. The pay is not that bad.",
  Knight:
    "Slash and pierce through enemy soldiers with ease, while covered in steel from head to toe. A decently paying and very respectable job.",
  "Veteran knight":
    "Utilising your unmatched combat ability, slaugher enemies effortlessly. Most footmen in the military would never be able to acquire such a well paying job like this.",
  "Elite knight":
    "Obliterate squadrons of enemy soldiers in one go with extraordinary proficiency, while equipped with the finest gear. Such a feared unit on the battlefield is paid extremely well.",
  "Holy knight":
    "Collapse entire armies in mere seconds with your magically imbued blade. The handful of elite knights who attain this level of power are showered with coins.",
  "Legendary knight":
    "Feared worldwide, obliterate entire nations in a blink of an eye. Roughly every century, only one holy knight is worthy of receiving such an esteemed title.",

  Student:
    "Study the theory of mana and practice basic spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a mage.",
  "Apprentice mage":
    "Under the supervision of a mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.",
  Mage: "Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.",
  Wizard:
    "Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay.",
  "Master wizard":
    "Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that a master wizard has enough destructive power to wipe an empire off the map.",
  Chairman:
    "Spend your days administrating The Arcane Association and investigate the concepts of true immortality. The chairman receives ludicrous amounts of pay daily.",

  Concentration:
    "Improve your learning speed through practising intense concentration activities.",
  Productivity:
    "Learn to procrastinate less at work and receive more job experience per day.",
  Bargaining:
    "Study the tricks of the trade and persuasive skills to lower any type of expense.",
  Meditation:
    "Fill your mind with peace and tranquility to tap into greater happiness from within.",

  Strength:
    "Condition your body and strength through harsh training. Stronger individuals are paid more in the military.",
  "Battle tactics":
    "Create and revise battle strategies, improving experience gained in the military.",
  "Muscle memory":
    "Strengthen your neurons through habit and repetition, improving strength gains throughout the body.",

  "Mana control":
    "Strengthen your mana channels throughout your body, aiding you in becoming a more powerful magical user.",
  Immortality:
    "Lengthen your lifespan through the means of magic. However, is this truly the immortality you have tried seeking for...?",
  "Time warping":
    "Bend space and time through forbidden techniques, resulting in a faster gamespeed.",
  "Super immortality":
    "Through harnessing ancient, forbidden techniques, lengthen your lifespan drastically beyond comprehension.",

  "Dark influence":
    "Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
  "Evil control":
    "Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
  Intimidation:
    "Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
  "Demon training":
    "A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
  "Blood meditation":
    "Grow and culture the evil within you through the sacrifise of other living beings, drastically increasing evil gain.",
  "Demon's wealth":
    "Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",

  Homeless:
    "Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
  Tent: "A thin sheet of tattered cloth held up by a couple of feeble, wooden sticks. Horrible living conditions but at least you have a roof over your head.",
  "Wooden hut":
    "Shabby logs and dirty hay glued together with horse manure. Much more sturdy than a tent, however, the stench isn't very pleasant.",
  Cottage:
    "Structured with a timber frame and a thatched roof. Provides decent living conditions for a fair price.",
  House:
    "A building formed from stone bricks and sturdy timber, which contains a few rooms. Although quite expensive, it is a comfortable abode.",
  "Large house":
    "Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.",
  "Small palace":
    "A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.",
  "Grand palace":
    "A grand residence completely composed of gold and silver. Provides the utmost luxurious and comfortable living conditions possible for a ludicrous price.",

  Book: "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
  Dumbbells:
    "Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before. ",
  "Personal squire":
    "Assists you in completing day to day activities, giving you more time to be productive at work.",
  "Steel longsword":
    "A fine blade used to slay enemies even quicker in combat and therefore gain more experience.",
  Butler:
    "Keeps your household clean at all times and also prepares three delicious meals per day, leaving you in a happier, stress-free mood.",
  "Sapphire charm":
    "Embedded with a rare sapphire, this charm activates more mana channels within your body, providing a much easier time learning magic.",
  "Study desk":
    "A dedicated area which provides many fine stationary and equipment designed for furthering your progress in research.",
  Library:
    "Stores a collection of books, each containing vast amounts of information from basic life skills to complex magic spells.",
};

const jobData: Record<string, Job> = {};
const skillData: Record<string, Skill> = {};
const itemData: Record<string, Item> = {};
const requirementData: Record<string, Requirement> = {};

for (const [key, value] of Object.entries(jobBaseData)) {
  jobData[key] = new Job(value);
}

for (const [key, value] of Object.entries(skillBaseData)) {
  skillData[key] = new Skill(value);
}

for (const [key, value] of Object.entries(itemBaseData)) {
  itemData[key] = new Item(value);
}

const baseRequirements = {
  //Other
  "The Arcane Association": new TaskRequirement([
    { task: "Concentration", requirement: 200 },
    { task: "Meditation", requirement: 200 },
  ]),
  "Dark magic": new EvilRequirement([{ task: "", requirement: 1 }]),
  Shop: new CoinRequirement([
    { task: "coin", requirement: itemData["Tent"]!.getExpense() * 50 },
  ]),
  "Rebirth tab": new AgeRequirement([{ task: "Age", requirement: 25 }]),
  "Rebirth note 1": new AgeRequirement([{ task: "Age", requirement: 45 }]),
  "Rebirth note 2": new AgeRequirement([{ task: "Age", requirement: 65 }]),
  "Rebirth note 3": new AgeRequirement([{ task: "Age", requirement: 200 }]),
  "Evil info": new EvilRequirement([{ task: "Evil", requirement: 1 }]),
  "Time warping info": new TaskRequirement([{ task: "Mage", requirement: 10 }]),
  Automation: new AgeRequirement([{ task: "Age", requirement: 20 }]),
  "Quick task display": new AgeRequirement([{ task: "Age", requirement: 20 }]),

  //Common work
  Beggar: new TaskRequirement([]),
  Farmer: new TaskRequirement([{ task: "Beggar", requirement: 10 }]),
  Fisherman: new TaskRequirement([{ task: "Farmer", requirement: 10 }]),
  Miner: new TaskRequirement([
    { task: "Strength", requirement: 10 },
    { task: "Fisherman", requirement: 10 },
  ]),
  Blacksmith: new TaskRequirement([
    { task: "Strength", requirement: 30 },
    { task: "Miner", requirement: 10 },
  ]),
  Merchant: new TaskRequirement([
    { task: "Bargaining", requirement: 50 },
    { task: "Blacksmith", requirement: 10 },
  ]),

  //Military
  Squire: new TaskRequirement([{ task: "Strength", requirement: 5 }]),
  Footman: new TaskRequirement([
    { task: "Strength", requirement: 20 },
    { task: "Squire", requirement: 10 },
  ]),
  "Veteran footman": new TaskRequirement([
    { task: "Battle tactics", requirement: 40 },
    { task: "Footman", requirement: 10 },
  ]),
  Knight: new TaskRequirement([
    { task: "Strength", requirement: 100 },
    { task: "Veteran footman", requirement: 10 },
  ]),
  "Veteran knight": new TaskRequirement([
    { task: "Battle tactics", requirement: 150 },
    { task: "Knight", requirement: 10 },
  ]),
  "Elite knight": new TaskRequirement([
    { task: "Strength", requirement: 300 },
    { task: "Veteran knight", requirement: 10 },
  ]),
  "Holy knight": new TaskRequirement([
    { task: "Mana control", requirement: 500 },
    { task: "Elite knight", requirement: 10 },
  ]),
  "Legendary knight": new TaskRequirement([
    { task: "Mana control", requirement: 1000 },
    { task: "Battle tactics", requirement: 1000 },
    { task: "Holy knight", requirement: 10 },
  ]),

  //The Arcane Association
  Student: new TaskRequirement([
    { task: "Concentration", requirement: 200 },
    { task: "Meditation", requirement: 200 },
  ]),
  "Apprentice mage": new TaskRequirement([
    { task: "Mana control", requirement: 400 },
    { task: "Student", requirement: 10 },
  ]),
  Mage: new TaskRequirement([
    { task: "Mana control", requirement: 700 },
    { task: "Apprentice mage", requirement: 10 },
  ]),
  Wizard: new TaskRequirement([
    { task: "Mana control", requirement: 1000 },
    { task: "Mage", requirement: 10 },
  ]),
  "Master wizard": new TaskRequirement([
    { task: "Mana control", requirement: 1500 },
    { task: "Wizard", requirement: 10 },
  ]),
  Chairman: new TaskRequirement([
    { task: "Mana control", requirement: 2000 },
    { task: "Master wizard", requirement: 10 },
  ]),

  //Fundamentals
  Concentration: new TaskRequirement([]),
  Productivity: new TaskRequirement([
    { task: "Concentration", requirement: 5 },
  ]),
  Bargaining: new TaskRequirement([{ task: "Concentration", requirement: 20 }]),
  Meditation: new TaskRequirement([
    { task: "Concentration", requirement: 30 },
    { task: "Productivity", requirement: 20 },
  ]),

  //Combat
  Strength: new TaskRequirement([]),
  "Battle tactics": new TaskRequirement([
    { task: "Concentration", requirement: 20 },
  ]),
  "Muscle memory": new TaskRequirement([
    { task: "Concentration", requirement: 30 },
    { task: "Strength", requirement: 30 },
  ]),

  //Magic
  "Mana control": new TaskRequirement([
    { task: "Concentration", requirement: 200 },
    { task: "Meditation", requirement: 200 },
  ]),
  Immortality: new TaskRequirement([
    { task: "Apprentice mage", requirement: 10 },
  ]),
  "Time warping": new TaskRequirement([{ task: "Mage", requirement: 10 }]),
  "Super immortality": new TaskRequirement([
    { task: "Chairman", requirement: 1000 },
  ]),

  //Dark magic
  "Dark influence": new EvilRequirement([{ task: "Evil", requirement: 1 }]),
  "Evil control": new EvilRequirement([{ task: "Evil", requirement: 1 }]),
  Intimidation: new EvilRequirement([{ task: "Evil", requirement: 1 }]),
  "Demon training": new EvilRequirement([{ task: "Evil", requirement: 25 }]),
  "Blood meditation": new EvilRequirement([{ task: "Evil", requirement: 75 }]),
  "Demon's wealth": new EvilRequirement([{ task: "Evil", requirement: 500 }]),

  //Properties
  Homeless: new CoinRequirement([{ task: "Coin", requirement: 0 }]),
  Tent: new CoinRequirement([{ task: "Coin", requirement: 0 }]),
  "Wooden hut": new CoinRequirement([
    { task: "Coin", requirement: itemData["Wooden hut"]!.getExpense() * 100 },
  ]),
  Cottage: new CoinRequirement([
    { task: "Coin", requirement: itemData["Cottage"]!.getExpense() * 100 },
  ]),
  House: new CoinRequirement([
    { task: "Coin", requirement: itemData["House"]!.getExpense() * 100 },
  ]),
  "Large house": new CoinRequirement([
    { task: "Coin", requirement: itemData["Large house"]!.getExpense() * 100 },
  ]),
  "Small palace": new CoinRequirement([
    { task: "Coin", requirement: itemData["Small palace"]!.getExpense() * 100 },
  ]),
  "Grand palace": new CoinRequirement([
    { task: "Coin", requirement: itemData["Grand palace"]!.getExpense() * 100 },
  ]),

  //Misc
  Book: new CoinRequirement([{ task: "Coin", requirement: 0 }]),
  Dumbbells: new CoinRequirement([
    { task: "Coin", requirement: itemData["Dumbbells"]!.getExpense() * 100 },
  ]),
  "Personal squire": new CoinRequirement([
    {
      task: "Coin",
      requirement: itemData["Personal squire"]!.getExpense() * 100,
    },
  ]),
  "Steel longsword": new CoinRequirement([
    {
      task: "Coin",
      requirement: itemData["Steel longsword"]!.getExpense() * 100,
    },
  ]),
  Butler: new CoinRequirement([
    { task: "Coin", requirement: itemData["Butler"]!.getExpense() * 100 },
  ]),
  "Sapphire charm": new CoinRequirement([
    {
      task: "Coin",
      requirement: itemData["Sapphire charm"]!.getExpense() * 100,
    },
  ]),
  "Study desk": new CoinRequirement([
    { task: "Coin", requirement: itemData["Study desk"]!.getExpense() * 100 },
  ]),
  Library: new CoinRequirement([
    { task: "Coin", requirement: itemData["Library"]!.getExpense() * 100 },
  ]),
};

for (const [key, value] of Object.entries(baseRequirements)) {
  requirementData[key] = value;
}

function useJobData(initialData: Record<string, Job>) {
  const job = useRef(initialData);
  if (!job.current) {
    job.current = initialData;
  }
  return job.current;
}

function useSkillData(initialData: Record<string, Skill>) {
  const skill = useRef(initialData);
  if (!skill.current) {
    skill.current = initialData;
  }
  return skill.current;
}

function useItemData(initialData: Record<string, Item>) {
  const item = useRef(initialData);
  if (!item.current) {
    item.current = initialData;
  }
  return item.current;
}

function useRequirements(
  initialData: Record<
    string,
    | CoinRequirement
    | AgeRequirement
    | EvilRequirement
    | TaskRequirement
    | Requirement
  >,
) {
  const req = useRef(initialData);
  if (!req.current) {
    req.current = initialData;
  }
  return req.current;
}

export { jobData, jobCategories, useJobData };
export { skillData, skillCategories, useSkillData };
export { itemData, itemCategories, useItemData };
export { requirementData, useRequirements };
export { headerRowColors, tooltips };
