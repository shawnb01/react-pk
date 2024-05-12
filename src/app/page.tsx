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
} from "@/baseData/basedata";
import { useState } from "react";
import JobTable from "./_components/jobsTable";
import Coins from "./_components/coins";
import SkillsTable from "./_components/skillsTable";
import ItemsTable from "./_components/itemsTable";
import { GameData } from "@/lib/types";
import { getExpenses, calculateIncome, getNet } from "@/lib/utils";

export default function HomePage() {
  const jobsData = useJobData(jobData);
  const skillsData = useSkillData(skillData);
  const itemsData = useItemData(itemData);

  const startGameData: GameData = {
    taskData: {},
    itemData: {},
    coins: 0,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,
    rebirthOneCount: 1,
    rebirthTwoCount: 0,
    currentJob: jobsData["Beggar"]!,
    currentSkill: skillData["Concentration"]!,
    currentProperty: itemsData["Homeless"]!,
    currentMisc: [],
  };

  const [gameData, setGameData] = useState(startGameData);

  function updateGameData(newData: Partial<GameData>) {
    setGameData({ ...gameData, ...newData });
  }

  // console.log(jobsData);

  // function handleJobChange(cI: number, jI: number) {
  //   Object.keys(jobsData).forEach((jobsType, cI) => {
  //     Object.values(jobsData[jobsType] || {}).forEach((job, jI) => {
  //       if (cI === jI) {
  //         updateGameData({ currentJob: job });
  //       }
  //     });
  //   });
  // }

  function update() {
    // Call the functions to update the game state
    updateGameData({
      days: increseDays(),
      coins: gameData.coins + calculateIncome(gameData.currentJob),
    });
  }

  function increseDays() {
    let increase = applySpeed(1);
    return gameData.days + increase;
  }

  function applySpeed(speed: number) {
    return gameData.paused ? 0 : speed;
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
            {getNet(income, expenses) > 0 ? (
              <span className="text-green-600"> + </span>
            ) : (
              <span className="text-red-600"> - </span>
            )}
            <Coins coins={getNet(income, expenses)} />
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
                // style={{ width: `${(currentXp / xpLeft) * 100}%` }}
                style={{ width: "33%" }}
              >
                <div className="absolute bottom-0 top-0 p-[5px]">
                  {/* {gameData.currentSkill.name} */}
                </div>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Current Skill</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span>Happiness: 1.0</span>
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
