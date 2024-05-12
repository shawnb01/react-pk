import { JobBaseData } from "../baseData/jobs";
import { SkillsBaseData } from "../baseData/skills";

class Task {
  name: string;
  baseData: {
    maxXp: number;
    name: any;
  };
  level: number;
  maxLevel: number;
  xp: number;
  xpMultipliers: number[];
  constructor(baseData: { maxXp: number; name: string }) {
    this.baseData = baseData;
    this.name = baseData.name;
    this.level = 0;
    this.maxLevel = 0;
    this.xp = 0;

    this.xpMultipliers = [];
  }

  getMaxXp(): number {
    return Math.round(
      this.baseData.maxXp * (this.level + 1) * Math.pow(1.01, this.level),
    );
  }

  getXpLeft(): number {
    return Math.round(this.getMaxXp() - this.xp);
  }

  getMaxLevelMultiplier(): number {
    return 1 + this.maxLevel / 10;
  }

  getXpGain(): number {
    return applyMultipliers(10, this.xpMultipliers);
  }

  increaseXp(gameSpeed: number) {
    this.xp += this.getXpGain() * gameSpeed;
    if (this.xp >= this.getMaxXp()) {
      var excess = this.xp - this.getMaxXp();
      while (excess >= 0) {
        this.level += 1;
        excess -= this.getMaxXp();
      }
      this.xp = this.getMaxXp() + excess;
    }
  }
}

class Job extends Task {
  incomeMultipliers: number[];
  income: number;
  constructor(baseData: JobBaseData) {
    super(baseData);
    this.income = baseData.income;
    this.incomeMultipliers = [];
  }

  getLevelMultiplier() {
    var levelMultiplier = 1 + Math.log10(this.level + 1);
    return levelMultiplier;
  }

  getIncome() {
    return applyMultipliers(this.income, this.incomeMultipliers);
  }
}

class Skill extends Task {
  effect: number;
  effectMultipliers: number[];
  constructor(baseData: SkillsBaseData) {
    super(baseData);
    this.effect = baseData.effect;
    this.effectMultipliers = [];
  }

  getEffect() {
    return applyMultipliers(this.effect, this.effectMultipliers);
  }
}

class Item {
  baseData: any;
  name: any;
  expenseMultipliers: never[];
  constructor(baseData) {
    this.baseData = baseData;
    this.name = baseData.name;
    this.expenseMultipliers = [];
  }

  getEffect() {
    if (
      gameData.currentProperty != this &&
      !gameData.currentMisc.includes(this)
    )
      return 1;
    var effect = this.baseData.effect;
    return effect;
  }

  getEffectDescription() {
    var description = this.baseData.description;
    if (itemCategories["Properties"].includes(this.name))
      description = "Happiness";
    var text = "x" + this.baseData.effect.toFixed(1) + " " + description;
    return text;
  }

  getExpense() {
    return applyMultipliers(this.baseData.expense, this.expenseMultipliers);
  }
}

class Requirement {
  elements: any;
  requirements: any;
  completed: boolean;
  constructor(elements, requirements) {
    this.elements = elements;
    this.requirements = requirements;
    this.completed = false;
  }

  isCompleted() {
    if (this.completed) {
      return true;
    }
    for (var requirement of this.requirements) {
      if (!this.getCondition(requirement)) {
        return false;
      }
    }
    this.completed = true;
    return true;
  }
  getCondition(requirement: any) {
    throw new Error("Method not implemented.");
  }
}

class TaskRequirement extends Requirement {
  type: string;
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "task";
  }

  getCondition(requirement) {
    return gameData.taskData[requirement.task].level >= requirement.requirement;
  }
}

class CoinRequirement extends Requirement {
  type: string;
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "coins";
  }

  getCondition(requirement) {
    return gameData.coins >= requirement.requirement;
  }
}

class AgeRequirement extends Requirement {
  type: string;
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "age";
  }

  getCondition(requirement) {
    return daysToYears(gameData.days) >= requirement.requirement;
  }
}

class EvilRequirement extends Requirement {
  type: string;
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "evil";
  }

  getCondition(requirement) {
    return gameData.evil >= requirement.requirement;
  }
}

function applyMultipliers(arg0: number, xpMultipliers: any[]): number {
  throw new Error("Function not implemented.");
}
function applySpeed(arg0: void) {
  throw new Error("Function not implemented.");
}

function daysToYears(days: any) {
  throw new Error("Function not implemented.");
}
