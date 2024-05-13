"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  jobData,
  useJobData,
  skillData,
  useSkillData,
  itemData,
  useItemData,
  Job,
  jobCategories,
  Skill,
  skillCategories,
  Item,
} from "@/baseData/basedata";
import { useState } from "react";
import JobTable from "./_components/jobsTable";
import Coins from "./_components/coins";
import SkillsTable from "./_components/skillsTable";
import ItemsTable from "./_components/itemsTable";
import { GameData, ItemData, JobTaskData, SkillTaskData } from "@/lib/types";
import {
  getExpenses,
  calculateIncome,
  getNet,
  getBindedTaskEffect,
  getBindedItemEffect,
} from "@/lib/utils";
import { get } from "http";

export default function HomePage() {
  const jobsData = useJobData(jobData);
  const skillsData = useSkillData(skillData);
  const itemsData = useItemData(itemData);

  const startGameData: GameData = {
    taskData: {
      ...jobsData,
      ...skillsData,
    } as unknown as Record<string, JobTaskData | SkillTaskData>,
    itemData: { ...itemsData } as unknown as Record<string, ItemData>,
    coins: 0,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,
    rebirthOneCount: 0,
    rebirthTwoCount: 0,
    currentJob: jobsData["Beggar"]!,
    currentSkill: skillData["Concentration"]!,
    currentProperty: itemsData["Homeless"]!,
    currentMisc: [itemsData["Book"]!],
  };

  const [gameData, setGameData] = useState(startGameData);

  function updateGameData(newData: Partial<GameData>) {
    setGameData({ ...gameData, ...newData });
  }

  function update() {
    // Call the functions to update the game state
    addMultipliers();
    gameData.currentJob.increaseXp();
    gameData.currentSkill.increaseXp();

    const updateCoins =
      calculateIncome(gameData.currentJob) +
      applyExpenses(
        gameData.coins,
        gameData.currentProperty,
        gameData.currentMisc,
      );

    updateGameData({
      taskData: gameData.taskData,
      itemData: gameData.itemData,
      days: increseDays(),
      coins: updateCoins > 0 ? updateCoins : 0,
      currentProperty:
        updateCoins > 0 ? gameData.currentProperty : itemsData["Homeless"]!,
      currentMisc: gameData.currentMisc,
    });
  }

  function increseDays() {
    let increase = applySpeed(1);
    return gameData.days + increase;
  }

  function applySpeed(speed: number) {
    return gameData.paused ? 0 : speed;
  }

  // JobxPMultipliers = [maxLevelMultiplier, Happiness, Dark influence, Demon training, Productivity, Personal Squire]
  // SkillxPMultipliers = [maxLevelMultiplier, Happiness, Dark influence, Demon training, Concentration, Book, Study desk, Library]
  // MilitaryxPMultipliers = [...JobxPMultipliers, Battle tactics, Steel longsword]

  // JobIncomeMultipliers = [levelMultiplier, Demon's wealth]
  // MilitaryIncomeMultipliers = [...JobIncomeMultipliers, Strength]
  function addMultipliers() {
    for (let taskName in gameData.taskData) {
      let task = gameData.taskData[taskName]!;

      task.xpMultipliers = [];
      if (task instanceof Job) task.incomeMultipliers = [];

      task.xpMultipliers.push(task.getMaxLevelMultiplier()); // Index: 0
      task.xpMultipliers.push(getHappiness()); // Index: 1
      task.xpMultipliers.push(
        getBindedTaskEffect("Dark influence", gameData.taskData),
      );
      task.xpMultipliers.push(
        getBindedTaskEffect("Demon training", gameData.taskData),
      );

      if (task instanceof Job) {
        task.incomeMultipliers.push(task.getLevelMultiplier());
        task.incomeMultipliers.push(
          getBindedTaskEffect("Demon's wealth", gameData.taskData),
        );
        task.xpMultipliers.push(
          getBindedTaskEffect("Productivity", gameData.taskData),
        );
        task.xpMultipliers.push(
          getBindedItemEffect("Personal squire", gameData.itemData),
        );
      } else if (task instanceof Skill) {
        task.xpMultipliers.push(
          getBindedTaskEffect("Concentration", gameData.taskData),
        );
        task.xpMultipliers.push(getBindedItemEffect("Book", gameData.itemData));
        task.xpMultipliers.push(
          getBindedItemEffect("Study desk", gameData.itemData),
        );
        task.xpMultipliers.push(
          getBindedItemEffect("Library", gameData.itemData),
        );
      }

      if (
        jobCategories["Military"]!.includes(task.name) &&
        task instanceof Job
      ) {
        task.incomeMultipliers.push(
          getBindedTaskEffect("Strength", gameData.taskData),
        );
        task.xpMultipliers.push(
          getBindedTaskEffect("Battle tactics", gameData.taskData),
        );
        task.xpMultipliers.push(
          getBindedItemEffect("Steel longsword", gameData.itemData),
        );
      } else if (task.name == "Strength") {
        task.xpMultipliers.push(
          getBindedTaskEffect("Muscle memory", gameData.taskData),
        );
        task.xpMultipliers.push(
          getBindedItemEffect("Dumbbells", gameData.itemData),
        );
      } else if (skillCategories["Magic"]!.includes(task.name)) {
        task.xpMultipliers.push(
          getBindedItemEffect("Sapphire charm", gameData.itemData),
        );
      } else if (jobCategories["The Arcane Association"]!.includes(task.name)) {
        task.xpMultipliers.push(
          getBindedTaskEffect("Mana control", gameData.taskData),
        );
      } else if (skillCategories["Dark magic"]!.includes(task.name)) {
        task.xpMultipliers.push(getEvil());
      }
    }

    for (let itemName in gameData.itemData) {
      var item = gameData.itemData[itemName];
      item!.expenseMultipliers = [];
      item!.expenseMultipliers.push(
        getBindedTaskEffect("Bargaining", gameData.taskData),
      );
      item!.expenseMultipliers.push(
        getBindedTaskEffect("Intimidation", gameData.taskData),
      );
    }
  }

  function getHappiness() {
    let meditationEffect = getBindedTaskEffect("Meditation", gameData.taskData);
    let butlerEffect = getBindedItemEffect("Butler", gameData.itemData);
    return (
      meditationEffect * butlerEffect * gameData.currentProperty.getEffect()
    );
  }

  function getEvil() {
    return gameData.evil;
  }

  function applyExpenses(
    coins: number,
    currentProperty: Item,
    currentMisc: Item[],
  ): number {
    let debt = applySpeed(getExpenses(currentProperty, currentMisc));
    coins -= debt;
    return coins;
  }

  const income = calculateIncome(gameData.currentJob);
  const expenses = getExpenses(gameData.currentProperty, gameData.currentMisc);

  return (
    <main className="flex gap-4">
      <aside className="flex max-h-[480px] w-72 flex-shrink-0 flex-col gap-4 bg-secondary p-3 text-foreground">
        <div className="flex flex-col">
          <span className="text-xl">{`Age: ${Math.floor(gameData.days / 365)} | Day: ${gameData.days % 365}`}</span>
          <span className="text-sm text-muted-foreground">
            Lifespan: 70 years
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"default"}
            onClick={() => {
              update();
            }}
          >
            {gameData.paused ? "Play" : "Pause"}
          </Button>
          <div className="flex flex-col">
            <span>Auto-Promote</span>
            <span>Auto-Learn</span>
          </div>
        </div>
        <div className="flex flex-col">
          <Coins coins={gameData.coins} />
          <span className="text-sm text-muted-foreground">
            Balance (in coins)
          </span>
        </div>
        <div className="flex flex-col">
          <span>
            Net/day:{" "}
            <Coins
              coins={getNet(income, expenses)}
              income={income}
              expenses={expenses}
            />
          </span>
          <span>
            Income/day: <Coins coins={income} />
          </span>
          <span>
            Expenses/day: <Coins coins={expenses} />
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div className="relative w-[200px] bg-blue-700">
              <div
                className="h-[30px] bg-yellow-500"
                style={{
                  width: `${(gameData.currentJob.xp / gameData.currentJob.getMaxXp()) * 100}%`,
                }}
                // style={{ width: "50%" }}
              >
                <div className="absolute bottom-0 top-0 p-[5px]">
                  {gameData.currentJob.name}
                </div>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Current Job</span>
          </div>
          <div>
            <div className="relative w-[200px] bg-blue-700">
              <div
                className="h-[30px] bg-yellow-500"
                style={{
                  width: `${(gameData.currentSkill.xp / gameData.currentSkill.getMaxXp()) * 100}%`,
                }}
                // style={{ width: "33%" }}
              >
                <div className="absolute bottom-0 top-0 p-[5px]">
                  {gameData.currentSkill.name}
                </div>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Current Skill</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span>Happiness: {getHappiness().toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            Affects all xp gains
          </span>
        </div>
      </aside>
      <section className="flex flex-col">
        <Tabs defaultValue="jobs" className="w-[900px]">
          <TabsList className="flex justify-start">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="settings" className="">
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <JobTable
              jobsData={jobsData}
              currentJob={gameData.currentJob.name}
              updateCurrentJob={(cI, jI) => {}}
              rebirthOne={gameData.rebirthOneCount}
            />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsTable
              skillsData={skillsData}
              currentSkill={gameData.currentSkill.name}
              updateCurrentSkill={(cI, sI) => {}}
              rebirthOne={gameData.rebirthOneCount}
            />
          </TabsContent>
          <TabsContent value="shop">
            <ItemsTable
              itemsData={itemsData}
              currentProperty={gameData.currentProperty.name}
              currentMisc={gameData.currentMisc}
            />
          </TabsContent>
          <TabsContent value="settings">
            Display all available settings here.
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
