import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GameData, ItemData, JobTaskData, SkillTaskData } from "@/lib/types";
import { Jobs } from "@/baseData/jobs";
import { Items } from "@/baseData/items";
import { Skills } from "@/baseData/skills";
import { Item, Job } from "@/baseData/basedata";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// console.log(Jobs, Items, Skills);

if (!Skills["Fundamentals"]) {
  throw new Error("Skills.Fundamentals is not defined");
}

const updataSpeed = 20;

// export const freshStartGameData: GameData = {

// };
// All the game logic and helper functionss will follow here.

export function formatBigNumber(num: number) {
  const tier = (Math.log10(num) / 3) | 0;
  if (tier === 0) return num;
  if (tier >= 5) return "Infinity";
  const suffix = ["", "K", "M", "B", "T"][tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  return scaled.toFixed(1) + suffix;
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

export function applyExpenses(
  coins: number,
  currentProperty: Item,
  currentMisc: Item[],
): number {
  let debt = applySpeed(getExpenses(currentProperty, currentMisc));
  coins -= debt;
  if (coins < 0) {
    goBankrupt();
  }
  return coins;
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
