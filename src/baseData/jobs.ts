const CommonWork = [
  { name: "Beggar", maxXp: 50, income: 5 },
  { name: "Farmer", maxXp: 100, income: 9 },
  { name: "Fisherman", maxXp: 200, income: 15 },
  { name: "Miner", maxXp: 400, income: 40 },
  { name: "Blacksmith", maxXp: 800, income: 80 },
  { name: "Merchant", maxXp: 1600, income: 150 },
];

const Military = [
  { name: "Squire", maxXp: 100, income: 5 },
  { name: "Footman", maxXp: 1000, income: 50 },
  {
    name: "Veteran footman",
    maxXp: 10000,
    income: 120,
  },
  { name: "Knight", maxXp: 100000, income: 300 },
  {
    name: "Veteran knight",
    maxXp: 1000000,
    income: 1000,
  },
  { name: "Elite knight", maxXp: 7500000, income: 3000 },
  { name: "Holy knight", maxXp: 40000000, income: 15000 },
  {
    name: "Legendary knight",
    maxXp: 150000000,
    income: 50000,
  },
];

const TheArcaneAssociation = [
  { name: "Student", maxXp: 100000, income: 100 },
  {
    name: "Apprentice mage",
    maxXp: 1000000,
    income: 1000,
  },
  { name: "Mage", maxXp: 10000000, income: 7500 },
  { name: "Wizard", maxXp: 100000000, income: 50000 },
  {
    name: "Master wizard",
    maxXp: 10000000000,
    income: 250000,
  },
  { name: "Chairman", maxXp: 1000000000000, income: 1000000 },
];

export { CommonWork, Military, TheArcaneAssociation };
