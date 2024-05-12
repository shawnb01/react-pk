import { Item, Job, Skill } from "@/baseData/basedata";
import { ItemsBaseData } from "@/baseData/items";
import { JobBaseData } from "@/baseData/jobs";
import { SkillBaseData } from "@/baseData/skills";

type GameData = {
  taskData: Record<string, JobTaskData | SkillTaskData>;
  itemData: Record<string, ItemData>;
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
};

type SkillTaskData = {
  name: string;
  baseData: Record<string, SkillBaseData>;
  level: number;
  maxLevel: number;
  xp: number;
  xpMultipliers: number[];
};

type ItemData = {
  name: string;
  baseData: Record<string, ItemsBaseData>;
  expenseMultipliers: number[];
};

export type { GameData, SkillTaskData, JobTaskData, ItemData };
