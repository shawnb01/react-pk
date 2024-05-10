"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Jobs } from "@/baseData/jobs";
import { useState } from "react";
import JobTable from "./_components/jobsTable";
import Coins from "./_components/coins";
import { Skills } from "@/baseData/skills";
import SkillsTable from "./_components/skillsTable";

export default function HomePage() {
  const [gameData, setGameData] = useState({
    taskData: {},
    itemData: {},
    coins: 110,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,
    rebirthOneCount: 0,
    rebirthTwoCount: 0,
    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,
  });
  const [currentSkill, setCurrentSkill] = useState(
    gameData.currentSkill || "Concentration",
  );
  const [currentJob, setCurrentJob] = useState(gameData.currentJob || "Beggar");
  const [jobsData, setJobsData] = useState(Jobs);
  const [skillsData, setSkillsData] = useState(Skills);

  function updateGameData(newData: any) {
    setGameData({ ...gameData, ...newData });
  }

  function updateCurrentJob(job: string) {
    setCurrentJob(job);
  }

  function updateCurrentSkill(skill: string) {
    setCurrentSkill(skill);
  }

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
              updateGameData({ paused: !gameData.paused });
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
            Net/day: <Coins coins={0} />
          </span>
          <span>
            Income/day: <Coins coins={0} />
          </span>
          <span>
            Expenses/day: <Coins coins={0} />
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div className="relative w-[200px] bg-blue-700">
              <div
                className="h-[30px] bg-yellow-500"
                // style={{ width: `${(currentXp / xpLeft) * 100}%` }}
                style={{ width: "50%" }}
              >
                <div className="absolute bottom-0 top-0 p-[5px]">
                  {currentJob}
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
                  {currentSkill}
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
              currentJob={currentJob}
              updateCurrentJob={updateCurrentJob}
              rebirthOne={gameData.rebirthOneCount}
            />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsTable
              skillsData={skillsData}
              currentSkill={currentSkill}
              updateCurrentSkill={updateCurrentSkill}
              rebirthOne={gameData.rebirthOneCount}
            />
          </TabsContent>
          <TabsContent value="shop">
            Display all available items in the shop.
          </TabsContent>
          <TabsContent value="settings">
            Display all available settings here.
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
