import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Coins from "./coins";
import { cn, formatBigNumber } from "@/lib/utils";
import React from "react";
import {
  Job,
  jobCategories,
  headerRowColors,
  tooltips,
  TaskBaseData,
  TaskRequirement,
  EvilRequirement,
  AgeRequirement,
  CoinRequirement,
  Requirement,
} from "@/baseData/basedata";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function JobHeader(props: {
  title: string;
  color: string;
  rebirthOne: number;
  className?: string;
}) {
  return (
    <TableHeader className={cn(`${props.color}`, props.className)}>
      <TableRow>
        <TableHead className="min-w-[250px]">{props.title}</TableHead>
        <TableHead>Level</TableHead>
        <TableHead>Income/Day</TableHead>
        <TableHead>XP/Day</TableHead>
        <TableHead>XP Left</TableHead>
        <TableHead
          className="text-right"
          style={{ display: props.rebirthOne > 0 ? "table-cell" : "none" }}
        >
          Max Level
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

function JobRow(props: {
  jobData: Job;
  current: string;
  income: number;
  xpGain: number;
  xpLeft: number;
  tooltip: string;
  updateCurrentJob: (name: string) => void;
  rebirthOne: number;
  maxXp: number;
  className?: string;
  requirements: any;
}) {
  const {
    jobData,
    updateCurrentJob,
    current,
    income,
    xpGain,
    xpLeft,
    tooltip,
    maxXp,
    requirements,
  } = props;
  const { name, maxLevel, level } = jobData;

  return (
    <TableRow key={name} className={cn(props.className)}>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <div
              className="relative w-[200px] cursor-pointer bg-sky-400 dark:bg-blue-700"
              onClick={() => {
                updateCurrentJob(name);
              }}
            >
              <div
                className={`h-[30px] ${current === name ? "bg-yellow-400 dark:bg-yellow-600" : "bg-sky-600 dark:bg-blue-600"}`}
                style={{ width: `${(jobData.xp / maxXp) * 100}%` }}
                // style={{ width: "50%" }}
              ></div>
              <div className="absolute bottom-0 top-0 p-[5px]">{name}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-64 text-center">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>{level}</TableCell>
      <TableCell>
        <Coins coins={income} />
      </TableCell>
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

export default function JobTable(props: {
  jobsData: Record<string, Job>;
  currentJob: string;
  rebirthOne: number;
  updateCurrentJob: (name: string) => void;
  requirements: Record<
    string,
    | TaskRequirement
    | CoinRequirement
    | AgeRequirement
    | EvilRequirement
    | Requirement
  >;
}) {
  const { jobsData, currentJob, updateCurrentJob, rebirthOne, requirements } =
    props;

  return (
    <Table className="w-full md:container">
      {Object.keys(jobCategories).map((jobCategory: string) => {
        return (
          <React.Fragment key={jobCategory}>
            <JobHeader
              title={jobCategory}
              color={headerRowColors[jobCategory]!}
              rebirthOne={rebirthOne}
              className={requirements[jobCategory]?.isCompleted ? "hidden" : ""}
            />
            <TableBody>
              {jobCategories[jobCategory]?.map((job) => {
                if (jobsData[job]?.name == job) {
                  return (
                    <JobRow
                      key={job}
                      jobData={jobsData[job]!}
                      income={jobsData[job]!.getIncome()}
                      xpGain={jobsData[job]!.getXpGain()}
                      xpLeft={jobsData[job]!.getXpLeft()}
                      maxXp={jobsData[job]!.getMaxXp()}
                      current={currentJob}
                      tooltip={tooltips[job]!}
                      updateCurrentJob={updateCurrentJob}
                      rebirthOne={rebirthOne}
                      className={requirements[job]?.completed ? "" : "hidden"}
                      requirements={requirements[job]?.requirements}
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
