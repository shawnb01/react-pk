import { Job } from "@/baseData/jobs";
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
  updateCurrentJob: (job: string) => void;
  rebirthOne: number;
}) {
  const currentXp = 0;
  const { jobData, updateCurrentJob, current } = props;
  const { name, maxXp: xpLeft, income } = jobData;
  //   const { name, currentLevel, income, xpGain, xpLeft, maxLevel } = jobData;
  return (
    <TableRow key={name}>
      <TableCell>
        <div
          className="relative w-[200px] cursor-pointer bg-blue-700"
          onClick={() => {
            updateCurrentJob(name);
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
      <TableCell>
        <Coins coins={income} />
      </TableCell>
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

export default function JobTable(props: {
  jobsData: Record<string, Record<string, Job>>;
  currentJob: string;
  rebirthOne: number;
  updateCurrentJob: (job: string) => void;
}) {
  const { jobsData, currentJob, updateCurrentJob, rebirthOne } = props;

  if (!jobsData) {
    return <></>;
  }

  return (
    <Table className="w-full md:container">
      {Object.keys(jobsData).map((jobsType: string) => {
        return (
          <React.Fragment key={jobsType}>
            <JobHeader
              title={jobsType}
              color="bg-green-800"
              rebirthOne={rebirthOne}
            />
            <TableBody>
              {jobsData[jobsType] &&
                Object.values(jobsData[jobsType] || {}).map((job: Job) => (
                  <JobRow
                    key={job.name}
                    jobData={job}
                    current={currentJob}
                    updateCurrentJob={updateCurrentJob}
                    rebirthOne={rebirthOne}
                  />
                ))}
            </TableBody>
          </React.Fragment>
        );
      })}
    </Table>
  );
}
