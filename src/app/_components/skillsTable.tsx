import { Skill } from "@/baseData/skills";
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
  current: string;
  rebirthOne: number;
  updateCurrentSkill: (skill: string) => void;
}) {
  const currentXp = 0;
  const { skillData, updateCurrentSkill, current, rebirthOne } = props;
  const { name, maxXp: xpLeft, effect, description } = skillData;
  const skillMultiplyer = 1 + effect;
  //   const { name, currentLevel, income, xpGain, xpLeft, maxLevel } = jobData;
  return (
    <TableRow key={name}>
      <TableCell>
        <div
          className="relative w-[200px] cursor-pointer bg-blue-700"
          onClick={() => {
            updateCurrentSkill(name);
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
      <TableCell>{0}</TableCell>
      <TableCell>{`x${skillMultiplyer + " " + description}`}</TableCell>
      <TableCell>{0}</TableCell>
      <TableCell>{formatBigNumber(xpLeft)}</TableCell>
      <TableCell
        className="text-right"
        style={{ display: props.rebirthOne > 0 ? "table-cell" : "none" }}
      >
        {0}
      </TableCell>
    </TableRow>
  );
}

export default function SkillsTable(props: {
  skillsData: Record<string, Record<string, Skill>>;
  currentSkill: string;
  rebirthOne: number;
  updateCurrentSkill: (job: string) => void;
}) {
  const { skillsData, currentSkill, rebirthOne, updateCurrentSkill } = props;

  if (!skillsData) {
    return <></>;
  }

  return (
    <Table className="w-full md:container">
      {Object.keys(skillsData).map((skillType: string) => {
        return (
          <React.Fragment key={skillType}>
            <SkillHeader
              title={skillType}
              color="bg-green-800"
              rebirthOne={rebirthOne}
            />
            <TableBody>
              {skillsData[skillType] &&
                Object.values(skillsData[skillType] || {}).map(
                  (skill: Skill) => (
                    <SkillRow
                      key={skill.name}
                      skillData={skill}
                      current={currentSkill}
                      rebirthOne={rebirthOne}
                      updateCurrentSkill={updateCurrentSkill}
                    />
                  ),
                )}
            </TableBody>
          </React.Fragment>
        );
      })}
    </Table>
  );
}
