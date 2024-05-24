import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Coins from "./coins";
import { Check } from "./icons";
import {
  AgeRequirement,
  CoinRequirement,
  EvilRequirement,
  Item,
  Requirement,
  TaskRequirement,
  headerRowColors,
  itemCategories,
  tooltips,
} from "@/baseData/basedata";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function ItemHeader(props: { title: string; color: string }) {
  return (
    <TableHeader className={`${props.color}`}>
      <TableRow>
        <TableHead className="w-[250px] min-w-[250px]">{props.title}</TableHead>
        <TableHead>Active</TableHead>
        <TableHead>Effect</TableHead>
        <TableHead>Expense/Day</TableHead>
      </TableRow>
    </TableHeader>
  );
}

function ItemRow(props: {
  itemData: Item;
  active: boolean;
  effect: string;
  tooltip: string;
  expense: number;
  updateCurrentItem: (name: string) => void;
  requirement: any;
  className?: string;
}) {
  const {
    itemData,
    active,
    effect,
    tooltip,
    updateCurrentItem,
    expense,
    requirement,
  } = props;
  const { name } = itemData;
  return (
    <TableRow key={name} className={cn(props.className)}>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <Button
              className="w-[200px]"
              variant={"secondary"}
              onClick={() => updateCurrentItem(name)}
            >
              {name}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-64 text-center">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Check
          className="h-8 w-8 rounded-sm border border-primary bg-primary text-primary-foreground"
          style={{ display: active ? "" : "none" }}
        />
      </TableCell>
      <TableCell>{effect}</TableCell>
      <TableCell>
        <Coins coins={expense} />
      </TableCell>
    </TableRow>
  );
}

export default function ItemTable(props: {
  itemsData: Record<string, Item>;
  currentProperty: string;
  currentMisc: Item[];
  updateCurrentItem: (name: string) => void;
  requirements: Record<
    string,
    | Requirement
    | TaskRequirement
    | CoinRequirement
    | AgeRequirement
    | EvilRequirement
  >;
}) {
  const { itemsData, currentMisc, currentProperty, updateCurrentItem } = props;

  if (!itemsData) {
    return <></>;
  }

  function isItemActive(itemName: string): boolean {
    return (
      currentProperty === itemName ||
      currentMisc.some((item) => item.name === itemName)
    );
  }

  return (
    <Table className="w-full md:container">
      {Object.keys(itemCategories).map((itemCategory: string) => {
        return (
          <React.Fragment key={itemCategory}>
            <ItemHeader
              title={itemCategory}
              color={headerRowColors[itemCategory]!}
            />
            <TableBody>
              {itemCategories[itemCategory]?.map((item: string) => {
                if (itemsData[item]?.name == item) {
                  return (
                    <ItemRow
                      key={item}
                      itemData={itemsData[item]!}
                      effect={`x${itemsData[item]!.getEffect().toFixed(2)} ${itemsData[item]!.getEffectDescription()}`}
                      active={isItemActive(item)}
                      tooltip={tooltips[item]!}
                      expense={itemsData[item]!.getExpense()}
                      updateCurrentItem={updateCurrentItem}
                      className={
                        props.requirements[item]?.completed ? "" : "hidden"
                      }
                      requirement={props.requirements[item]?.requirements}
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
