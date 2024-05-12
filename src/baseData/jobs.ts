export type JobBaseData = {
  name: string;
  maxXp: number;
  income: number;
};

const Jobs: Record<string, Record<string, JobBaseData>> = {
  "Common Work": {
    Beggar: {
      name: "Beggar",
      maxXp: 50,
      income: 5,
    },
    Farmer: {
      name: "Farmer",
      maxXp: 100,
      income: 9,
    },
    Fisherman: {
      name: "Fisherman",
      maxXp: 200,
      income: 15,
    },
    Miner: {
      name: "Miner",
      maxXp: 400,
      income: 40,
    },
    Blacksmith: {
      name: "Blacksmith",
      maxXp: 800,
      income: 80,
    },
    Merchant: {
      name: "Merchant",
      maxXp: 1600,
      income: 150,
    },
  },
  Military: {
    Squire: {
      name: "Squire",
      maxXp: 100,
      income: 5,
    },
    Footman: {
      name: "Footman",
      maxXp: 1000,
      income: 50,
    },
    VeteranFootman: {
      name: "Veteran footman",
      maxXp: 10000,
      income: 120,
    },
    Knight: {
      name: "Knight",
      maxXp: 100000,
      income: 300,
    },
    VeteranKnight: {
      name: "Veteran knight",
      maxXp: 1000000,
      income: 1000,
    },
    EliteKnight: {
      name: "Elite knight",
      maxXp: 7500000,
      income: 3000,
    },
    HolyKnight: {
      name: "Holy knight",
      maxXp: 40000000,
      income: 15000,
    },
    LegendaryKnight: {
      name: "Legendary knight",
      maxXp: 150000000,
      income: 50000,
    },
  },
  "The Arcane Association": {
    Student: {
      name: "Student",
      maxXp: 100000,
      income: 100,
    },
    ApprenticeMage: {
      name: "Apprentice mage",
      maxXp: 1000000,
      income: 1000,
    },
    Mage: {
      name: "Mage",
      maxXp: 10000000,
      income: 7500,
    },
    Wizard: {
      name: "Wizard",
      maxXp: 100000000,
      income: 50000,
    },
    MasterWizard: {
      name: "Master wizard",
      maxXp: 10000000000,
      income: 250000,
    },
    Chairman: {
      name: "Chairman",
      maxXp: 1000000000000,
      income: 1000000,
    },
  },
};

export { Jobs };
