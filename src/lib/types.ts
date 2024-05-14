import {
  Item,
  ItemBaseData,
  Job,
  JobBaseData,
  Skill,
  SkillBaseData,
} from "@/baseData/basedata";

type GameData = {
  taskData: Record<string, Job | Skill>;
  itemData: Record<string, Item>;
  coins: number;
  days: number;
  evil: number;
  paused: boolean;
  timeWarpingEnabled: boolean;
  rebirthOneCount: number;
  rebirthTwoCount: number;
  currentJob: Job;
  currentSkill: Skill;
  currentProperty: Item;
  currentMisc: Item[];
};

type JobTaskData = {
  name: string;
  baseData: Record<string, JobBaseData>;
  level: number;
  maxLevel: number;
  xp: number;
  xpMultipliers: number[];
  incomeMultipliers: number[];
  income: number;
  getMaxLevelMultiplier: () => number;
};

type SkillTaskData = {
  name: string;
  baseData: Record<string, SkillBaseData>;
  level: number;
  maxLevel: number;
  xp: number;
  xpMultipliers: number[];
  getMaxLevelMultiplier: () => number;
  getEffect: () => number;
};

type ItemData = {
  name: string;
  baseData: Record<string, ItemBaseData>;
  expenseMultipliers: number[];
};

export type { GameData, SkillTaskData, JobTaskData, ItemData };
