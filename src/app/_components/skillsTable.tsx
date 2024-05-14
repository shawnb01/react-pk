import {
  Skill,
  skillCategories,
  headerRowColors,
  jobCategories,
  tooltips,
} from "@/baseData/basedata";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  Table,
  TableBody,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBigNumber } from "@/lib/utils";
import React from "react";

function SkillHeader(props: {
  title: string;
  color: string;
  rebirthOne: number;
}) {
  return (
    <TableHeader className={`${props.color}`}>
      <TableRow>
        <TableHead className="min-w-[250px]">{props.title}</TableHead>
        <TableHead>Level</TableHead>
        <TableHead>Effect</TableHead>
        <TableHead>XP/Day</TableHead>
        <TableHead>XP Left</TableHead>
        <TableHead
          className={`text-right`}
          style={{ display: props.rebirthOne > 0 ? "table-cell" : "none" }}
        >
          Max Level
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

function SkillRow(props: {
  skillData: Skill;
  xpGain: number;
  xpLeft: number;
  current: string;
  rebirthOne: number;
  effect: string;
  tooltip: string;
  maxXp: number;
  updateCurrentSkill: (name: string) => void;
}) {
  const {
    skillData,
    updateCurrentSkill,
    current,
    rebirthOne,
    xpGain,
    xpLeft,
    effect,
    tooltip,
    maxXp,
  } = props;
  const { name, maxLevel, level } = skillData;
  //   const { name, currentLevel, income, xpGain, xpLeft, maxLevel } = jobData;
  return (
    <TableRow key={name}>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <div
              className="relative w-[200px] cursor-pointer bg-blue-700"
              onClick={() => {
                updateCurrentSkill(name);
              }}
            >
              <div
                className={`h-[30px] ${current === name ? "bg-yellow-500" : "bg-blue-600"}`}
                style={{ width: `${(skillData.xp / maxXp) * 100}%` }}
                // style={{ width: "50%" }}
              ></div>
              <div className="absolute bottom-0 top-0 p-[5px]">{name}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-64 text-center">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>{level}</TableCell>
      <TableCell>{effect}</TableCell>
      <TableCell>{formatBigNumber(xpGain)}</TableCell>
      <TableCell>{formatBigNumber(xpLeft)}</TableCell>
      <TableCell
        className="text-right"
        style={{ display: rebirthOne > 0 ? "table-cell" : "none" }}
      >
        {maxLevel}
      </TableCell>
    </TableRow>
  );
}

export default function SkillsTable(props: {
  skillsData: Record<string, Skill>;
  currentSkill: string;
  rebirthOne: number;
  updateCurrentSkill: (name: string) => void;
}) {
  const { skillsData, currentSkill, rebirthOne, updateCurrentSkill } = props;

  if (!skillsData) {
    return <></>;
  }

  return (
    <Table className="w-full md:container">
      {Object.keys(skillCategories).map((skillCategory: string) => {
        return (
          <React.Fragment key={skillCategory}>
            <SkillHeader
              title={skillCategory}
              color={headerRowColors[skillCategory]!}
              rebirthOne={rebirthOne}
            />
            <TableBody>
              {skillCategories[skillCategory]?.map((skill: string) => {
                if (skillsData[skill]?.name == skill) {
                  return (
                    <SkillRow
                      key={skill}
                      skillData={skillsData[skill]!}
                      effect={`x${skillsData[skill]!.getEffect().toFixed(2)} ${skillsData[skill]!.getEffectDescription()}`}
                      xpGain={skillsData[skill]!.getXpGain()}
                      xpLeft={skillsData[skill]!.getXpLeft()}
                      maxXp={skillsData[skill]!.getMaxXp()}
                      tooltip={tooltips[skill]!}
                      current={currentSkill}
                      updateCurrentSkill={updateCurrentSkill}
                      rebirthOne={rebirthOne}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </TableBody>
          </React.Fragment>
        );
      })}
    </Table>
  );
}
