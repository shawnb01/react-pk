import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Item, Job, Skill } from "@/baseData/basedata";
import { ItemData, JobTaskData, SkillTaskData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const updataSpeed = 20;

// export const freshStartGameData: GameData = {

// };
// All the game logic and helper functionss will follow here.

export function formatBigNumber(num: number) {
  const tier = (Math.log10(num) / 3) | 0;
  if (tier === 0) return num;
  if (tier >= 10) return "Infinity";
  const suffix = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc"][tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  return scaled.toFixed(1) + suffix;
}

export function getBindedTaskEffect(
  taskName: string,
  taskData: Record<string, SkillTaskData | JobTaskData>,
): number {
  let task = taskData[taskName];
  if (task instanceof Skill) {
    // console.log("getBindedTaskEffect", taskName, task.getEffect());
    return task.getEffect();
  }
  return 1;
}

export function getBindedItemEffect(
  itemName: string,
  itemsData: Record<string, ItemData>,
): number {
  let item = itemsData[itemName];
  if (item instanceof Skill) {
    return item.getEffect();
  }
  // console.log("getBindedItemEffect", itemName, itemsData);
  return 1;
}

export function getNet(income: number, expenses: number) {
  return Math.abs(income - expenses);
}

export function calculateIncome(job: Job): number {
  return applyIncomeMultipliers(job.income, job.incomeMultipliers);
}

// export function calculateXp(job: JobTaskData) {
//   const xp = job.baseData[job.name].xp;
//   return xp;
// }

function applyIncomeMultipliers(
  income: number,
  incomeMultipliers: number[],
): number {
  let base = 1;
  incomeMultipliers.forEach((multiplier) => {
    base *= multiplier;
  });
  return Math.round(income * base);
}

function applySpeed(num: number): number {
  return (num * getGameSpeed()) / updataSpeed;
}

export function getExpenses(
  currentProperty: Item,
  currentMisc: Item[],
): number {
  let expense = 0;
  expense += applyExpenseMultipliers(
    currentProperty.expense,
    currentProperty.expenseMultipliers,
  );
  currentMisc.forEach((item) => {
    expense += applyExpenseMultipliers(item.expense, item.expenseMultipliers);
  });
  return expense;
}

function applyExpenseMultipliers(
  expense: number,
  expenseMultipliers: number[],
): number {
  let final = 1;
  expenseMultipliers.forEach((multiplier) => {
    final *= multiplier;
  });
  return Math.round(expense * final);
}
function getGameSpeed() {
  return 1;
}

function goBankrupt() {
  console.log("Bankrupt");
}
