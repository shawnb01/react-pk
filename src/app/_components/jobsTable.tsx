import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Coins from "./coins";
import { formatBigNumber } from "@/lib/utils";
import React from "react";
import {
  Job,
  jobCategories,
  headerRowColors,
  tooltips,
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
}) {
  return (
    <TableHeader className={`${props.color}`}>
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
  updateCurrentJob: (cI: number, jI: number) => void;
  rebirthOne: number;
  maxXp: number;
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
  } = props;
  const { name, maxLevel, level } = jobData;
  return (
    <TableRow key={name}>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <div
              className="relative w-[200px] cursor-pointer bg-blue-700"
              onClick={() => {
                // updateCurrentJob(props.catergory, props.row);
              }}
            >
              <div
                className={`h-[30px] ${current === name ? "bg-yellow-500" : "bg-blue-600"}`}
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
  updateCurrentJob: (cI: number, jI: number) => void;
}) {
  const { jobsData, currentJob, updateCurrentJob, rebirthOne } = props;

  return (
    <Table className="w-full md:container">
      {Object.keys(jobCategories).map((jobCategory: string) => {
        return (
          <React.Fragment key={jobCategory}>
            <JobHeader
              title={jobCategory}
              color={headerRowColors[jobCategory]!}
              rebirthOne={rebirthOne}
            />
            <TableBody>
              {jobCategories[jobCategory]?.map((job, jI) => {
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
