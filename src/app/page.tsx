import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Jobs from "@/baseData/jobs";

export default function HomePage() {
  const days = 185 + 365 * 18;

  return (
    <main className="flex gap-4">
      <aside className="bg-secondary text-foreground flex max-h-[480px] w-72 flex-grow-0 flex-col gap-4 p-3">
        <div className="flex flex-col">
          <span className="text-xl">{`Age: ${Math.floor(days / 365)} | Day: ${days % 365}`}</span>
          <span className="text-muted-foreground text-sm">
            Lifespan: 70 years
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"default"}>Play/Pause</Button>
          <div className="flex flex-col">
            <span>Auto-Promote</span>
            <span>Auto-Learn</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span>
            <span className="text-cyan-400">0p</span>
            <span className="text-amber-600">0g</span>
            <span className="text-gray-400">0s</span>
            <span className="text-yellow-800">0c</span>
          </span>
          <span className="text-muted-foreground text-sm">
            Balance (in coins)
          </span>
        </div>
        <div className="flex flex-col">
          <span>Net/day: 0c</span>
          <span>Income/day: 0c</span>
          <span>Expenses/day: 0c</span>
        </div>
        <div className="flex flex-col">
          <span>Current Job</span>
          <span>Current Skill</span>
        </div>
        <div className="flex flex-col">
          <span>Happiness: 1.0</span>
          <span className="text-muted-foreground text-sm">
            Affects all xp gains
          </span>
        </div>
      </aside>
      <section className="flex flex-col">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <Table>
              <TableHeader className="bg-green-800">
                <TableRow>
                  <TableHead className="w-[250px]">Common Work</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Income/Day</TableHead>
                  <TableHead>XP/Day</TableHead>
                  <TableHead>XP Left</TableHead>
                  <TableHead>Max Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Jobs.CommonWork.map((job) => (
                  <TableRow>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{job.income}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{job.maxXp}</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHeader className="bg-red-800">
                <TableRow>
                  <TableHead className="w-[250px]">Military</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Income/Day</TableHead>
                  <TableHead>XP/Day</TableHead>
                  <TableHead>XP Left</TableHead>
                  <TableHead>Max Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Jobs.Military.map((job) => (
                  <TableRow>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{job.income}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{job.maxXp}</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHeader className="bg-purple-800">
                <TableRow>
                  <TableHead className="w-[250px]">
                    The Arcane Association
                  </TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Income/Day</TableHead>
                  <TableHead>XP/Day</TableHead>
                  <TableHead>XP Left</TableHead>
                  <TableHead>Max Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Jobs.TheArcaneAssociation.map((job) => (
                  <TableRow>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{job.income}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{job.maxXp}</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="skills">
            Display all available skills here.
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
