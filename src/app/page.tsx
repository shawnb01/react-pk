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
  itemCategories,
  useRequirements,
  requirementData,
} from "@/baseData/basedata";
import { useEffect, useState } from "react";
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
import { Moon, Sun } from "./_components/icons";
import { useTheme } from "next-themes";

export default function HomePage() {
  const baseGameSpeed = 4;
  const baseLifeSpan = 365 * 70;
  const updateSpeed = 20;

  const { setTheme, theme } = useTheme();
  const jobsData = useJobData(jobData);
  const skillsData = useSkillData(skillData);
  const itemsData = useItemData(itemData);
  const requirements = useRequirements(requirementData);

  const [nextJob, setNextJob] = useState<string>("Beggar");
  const [nextSkill, setNextSkill] = useState<string>("Concentration");
  const [nextProperty, setNextProperty] = useState<string>("Homeless");
  const [nextMisc, setNextMisc] = useState<string[]>([]);

  const startGameData: GameData = {
    taskData: {
      ...jobsData,
      ...skillsData,
    },
    itemData: { ...itemsData },
    requirements: requirements,
    coins: 0,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,
    rebirthOneCount: 0,
    rebirthTwoCount: 0,
    currentJob: jobsData[nextJob]!,
    currentSkill: skillData[nextSkill]!,
    currentProperty: itemsData[nextProperty]!,
    currentMisc: nextMisc.map((item) => itemsData[item]!),
  };

  const [gameData, setGameData] = useState(startGameData);

  useEffect(() => {
    const gameloop = setInterval(update, 1000 / updateSpeed);
    return () => clearInterval(gameloop);
  }, [
    nextJob,
    nextSkill,
    nextProperty,
    nextMisc,
    gameData.coins,
    gameData.days,
    gameData.paused,
  ]);

  function updateGameData(newData: Partial<GameData>) {
    setGameData({ ...gameData, ...newData });
  }

  function update() {
    // Call the functions to update the game state
    addMultipliers();
    gameData.currentJob.increaseXp(applySpeed);
    gameData.currentSkill.increaseXp(applySpeed);
    for (let req in gameData.requirements) {
      gameData.requirements[req]?.isCompleted(gameData);
    }

    let updateProperty = gameData.currentProperty;
    let updateMisc = gameData.currentMisc;
    let updateJob = gameData.taskData[nextJob]! as Job;
    let updateSkill = gameData.taskData[nextSkill]! as Skill;

    let updateCoins =
      calculateIncome(gameData.currentJob, applySpeed) +
      applyExpenses(
        gameData.coins,
        gameData.currentProperty,
        gameData.currentMisc,
      );

    if (updateCoins < 0) {
      // Set property to homeless and remove items from misc
      updateProperty = itemsData["Homeless"]!;
      updateMisc = [];
      updateCoins = 0;
    }

    updateGameData({
      taskData: gameData.taskData,
      itemData: gameData.itemData,
      requirements: gameData.requirements,
      days: increseDays(),
      coins: updateCoins,
      currentJob: updateJob,
      currentSkill: updateSkill,
      currentProperty: updateProperty,
      currentMisc: updateMisc,
    });
  }

  function updateCurrentJob(name: string) {
    setNextJob(name);
  }

  function updateCurrentSkill(name: string) {
    setNextSkill(name);
    updateGameData({
      currentSkill: skillData[name]!,
    });
  }

  function updateCurrentItem(name: string) {
    // Check if the item is a property or a misc item
    const containsProperty = itemCategories["Properties"]?.includes(name);
    if (containsProperty) {
      updateCurrentProperty(name);
    } else {
      // Check if the item is already in the currentMisc array
      const containsItem = gameData.currentMisc.some(
        (item) => item.name === name,
      );
      if (containsItem) {
        // Remove the item from the currentMisc array
        const newMisc = gameData.currentMisc.filter(
          (item) => item.name !== name,
        );
        updateGameData({
          currentMisc: newMisc,
        });
      } else {
        // Add the item to the currentMisc array
        const newMisc = gameData.currentMisc;
        newMisc.push(itemsData[name]!);
        updateCurrentMisc(newMisc.map((item) => item.name));
      }
    }
  }

  function updateCurrentProperty(name: string) {
    setNextProperty(name);
    updateGameData({
      currentProperty: itemsData[name]!,
    });
  }

  function updateCurrentMisc(name: string[]) {
    setNextMisc(name);
    updateGameData({
      currentMisc: name.map((item) => itemsData[item]!),
    });
  }

  function rebirthOne() {
    updateGameData({
      rebirthOneCount: gameData.rebirthOneCount + 1,
    });

    rebirthReset();
  }

  function rebirthTwo() {
    updateGameData({
      rebirthTwoCount: gameData.rebirthTwoCount + 1,
      evil: getEvilGain(),
    });

    rebirthReset();

    for (let taskName in gameData.taskData) {
      let task = gameData.taskData[taskName]!;
      task.maxLevel = 0;
    }
  }

  function rebirthReset() {
    updateGameData({
      coins: 0,
      days: 365 * 14,
      paused: false,
      timeWarpingEnabled: true,
      currentJob: jobsData["Beggar"]!,
      currentSkill: skillData["Concentration"]!,
      currentProperty: itemsData["Homeless"]!,
      currentMisc: [],
    });
  }

  function getEvilGain() {
    let evilControl = gameData.taskData["Evil control"] as Skill;
    let bloodMeditation = gameData.taskData["Blood meditation"] as Skill;
    let evil = evilControl.getEffect() * bloodMeditation.getEffect();
    // console.log(evil)
    return evil;
  }

  function increseDays() {
    let increase = applySpeed(1);
    return gameData.days + increase;
  }

  function applySpeed(speed: number) {
    return gameData.paused ? 0 : (speed * getGameSpeed()) / baseGameSpeed;
  }

  function addMultipliers() {
    for (let taskName in gameData.taskData) {
      let task = gameData.taskData[taskName]!;

      task.xpMultipliers = new Array<number>(); // Update the type of task.xpMultipliers to allow numbers
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
          getBindedItemEffect(
            "Personal squire",
            gameData.itemData,
            gameData.currentMisc.some(
              (item) => item.name === "Personal squire",
            ),
          ),
        );
      } else if (task instanceof Skill) {
        task.xpMultipliers.push(
          getBindedTaskEffect("Concentration", gameData.taskData),
        );
        task.xpMultipliers.push(
          getBindedItemEffect(
            "Book",
            gameData.itemData,
            gameData.currentMisc.some((item) => item.name === "Book"),
          ),
        );
        task.xpMultipliers.push(
          getBindedItemEffect(
            "Study desk",
            gameData.itemData,
            gameData.currentMisc.some((item) => item.name === "Study desk"),
          ),
        );
        task.xpMultipliers.push(
          getBindedItemEffect(
            "Library",
            gameData.itemData,
            gameData.currentMisc.some((item) => item.name === "Library"),
          ),
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
          getBindedItemEffect(
            "Steel longsword",
            gameData.itemData,
            gameData.currentMisc.some(
              (item) => item.name === "Steel longsword",
            ),
          ),
        );
      } else if (task.name == "Strength") {
        task.xpMultipliers.push(
          getBindedTaskEffect("Muscle memory", gameData.taskData),
        );
        task.xpMultipliers.push(
          getBindedItemEffect(
            "Dumbbells",
            gameData.itemData,
            gameData.currentMisc.some((item) => item.name === "Dumbbells"),
          ),
        );
      } else if (skillCategories["Magic"]!.includes(task.name)) {
        task.xpMultipliers.push(
          getBindedItemEffect(
            "Sapphire charm",
            gameData.itemData,
            gameData.currentMisc.some((item) => item.name === "Sapphire charm"),
          ),
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
    let butlerEffect = getBindedItemEffect(
      "Butler",
      gameData.itemData,
      gameData.currentMisc.some((item) => item.name === "Butler"),
    );
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

  function getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
  }

  const income = calculateIncome(gameData.currentJob);
  const expenses = getExpenses(gameData.currentProperty, gameData.currentMisc);

  function setCustomEffects() {
    var bargaining = gameData.taskData["Bargaining"]! as Skill;
    bargaining.getEffect = function () {
      var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10;
      if (multiplier < 0.1) {
        multiplier = 0.1;
      }
      return multiplier;
    };

    var intimidation = gameData.taskData["Intimidation"]! as Skill;
    intimidation.getEffect = function () {
      var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10;
      if (multiplier < 0.1) {
        multiplier = 0.1;
      }
      return multiplier;
    };

    var timeWarping = gameData.taskData["Time warping"]! as Skill;
    timeWarping.getEffect = function () {
      var multiplier = 1 + getBaseLog(13, timeWarping.level + 1);
      return multiplier;
    };

    var immortality = gameData.taskData["Immortality"]! as Skill;
    immortality.getEffect = function () {
      var multiplier = 1 + getBaseLog(33, immortality.level + 1);
      return multiplier;
    };
  }

  setCustomEffects();

  function pause() {
    updateGameData({
      paused: !gameData.paused,
    });
  }

  function getGameSpeed() {
    const timeWarping = gameData.taskData["Time warping"] as Skill;
    const timeWarpingSpeed = gameData.timeWarpingEnabled
      ? timeWarping.getEffect()
      : 1;
    return baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed;
  }

  function isAlive() {
    const condition = gameData.days < getLifespan();
    if (!condition) {
      goCommitDie();
    }
    return condition;
  }

  function getLifespan() {
    const immortality = gameData.taskData["Immortality"] as Skill;
    const superImmortality = gameData.taskData["Super immortality"] as Skill;
    return (
      baseLifeSpan * immortality.getEffect() * superImmortality.getEffect()
    );
  }

  function goCommitDie() {
    console.log("You died");
  }

  return (
    <main className="flex gap-4">
      <aside className="flex max-h-[720px] min-h-fit w-72 flex-shrink-0 flex-col gap-4 bg-secondary p-3 text-foreground">
        <div className="flex flex-col">
          <span className="text-xl">{`Age: ${Math.floor(gameData.days / 365)} | Day: ${Math.floor(gameData.days % 365)}`}</span>
          <span className="text-sm text-muted-foreground">
            Lifespan: {Math.floor(getLifespan() / 365)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"default"}
            onClick={() => {
              pause();
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
        {/* Display Gamespeed options */}
        <div className="flex flex-col">
          <span>Game Speed</span>
          <span>Time Warping</span>
        </div>
        {/* Display Evil level */}
        <div className="flex flex-col">
          <span>Evil: {gameData.evil.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            Affects dark magic xp gains
          </span>
        </div>
      </aside>
      <section className="flex flex-col">
        <Tabs defaultValue="jobs" className="w-[900px]">
          <TabsList className="flex justify-start">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger
              value="shop"
              className={
                gameData.requirements["Shop"]?.completed ? "" : "hidden"
              }
            >
              Shop
            </TabsTrigger>
            <TabsTrigger
              className={
                gameData.requirements["Rebirth tab"]?.completed ? "" : "hidden"
              }
              value="rebirth"
            >
              Amulet
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <JobTable
              jobsData={jobsData}
              currentJob={gameData.currentJob.name}
              updateCurrentJob={updateCurrentJob}
              rebirthOne={gameData.rebirthOneCount}
              requirements={gameData.requirements}
            />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsTable
              skillsData={skillsData}
              currentSkill={gameData.currentSkill.name}
              updateCurrentSkill={updateCurrentSkill}
              rebirthOne={gameData.rebirthOneCount}
              requirements={gameData.requirements}
            />
          </TabsContent>
          <TabsContent value="shop">
            <ItemsTable
              itemsData={itemsData}
              currentProperty={gameData.currentProperty.name}
              currentMisc={gameData.currentMisc}
              updateCurrentItem={updateCurrentItem}
              requirements={gameData.requirements}
            />
          </TabsContent>
          <TabsContent value="rebirth">
            <div className="flex flex-col gap-2">
              <Button
                variant={"default"}
                onClick={() => {
                  rebirthOne();
                }}
              >
                Rebirth One
              </Button>
              <Button
                variant={"default"}
                onClick={() => {
                  rebirthTwo();
                }}
              >
                Rebirth Two
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Moon className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <Sun className="absolute rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
