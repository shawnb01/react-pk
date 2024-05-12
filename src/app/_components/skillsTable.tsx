import {
  Skill,
  skillCategories,
  headerRowColors,
  jobCategories,
} from "@/baseData/basedata";
import { SkillBaseData } from "@/baseData/skills";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  Table,
  TableBody,
} from "@/components/ui/table";
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
  updateCurrentSkill: (cI: number, sI: number) => void;
}) {
  const currentXp = 0;
  const {
    skillData,
    updateCurrentSkill,
    current,
    rebirthOne,
    xpGain,
    xpLeft,
    effect,
  } = props;
  const { name, maxLevel, level } = skillData;
  //   const { name, currentLevel, income, xpGain, xpLeft, maxLevel } = jobData;
  return (
    <TableRow key={name}>
      <TableCell>
        <div
          className="relative w-[200px] cursor-pointer bg-blue-700"
          onClick={() => {
            // updateCurrentSkill(props.catergory, props.row);
          }}
        >
          <div
            className={`h-[30px] ${current === name ? "bg-yellow-500" : "bg-blue-600"}`}
            // style={{ width: `${(currentXp / xpLeft) * 100}%` }}
            style={{ width: "50%" }}
          ></div>
          <div className="absolute bottom-0 top-0 p-[5px]">{name}</div>
        </div>
      </TableCell>
      <TableCell>{level}</TableCell>
      <TableCell>{effect}</TableCell>
      <TableCell>{formatBigNumber(xpGain)}</TableCell>
      <TableCell>{formatBigNumber(xpLeft)}</TableCell>
      <TableCell
        className="text-right"
        style={{ display: props.rebirthOne > 0 ? "table-cell" : "none" }}
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
  updateCurrentSkill: (cI: number, sI: number) => void;
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
