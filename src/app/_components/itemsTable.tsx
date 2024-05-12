import { ItemsBaseData } from "@/baseData/items";
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
import { ItemData } from "@/lib/types";
import { Item, headerRowColors, itemCategories } from "@/baseData/basedata";

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

function ItemRow(props: { itemData: Item; active: boolean; effect: string }) {
  const { itemData, active, effect } = props;
  const { name, expense } = itemData;
  return (
    <TableRow key={name}>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Check
          className="rounded-sm border border-primary bg-primary text-primary-foreground"
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
}) {
  const { itemsData, currentMisc, currentProperty } = props;

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
                      // updateActiveItem={updateCurrentItem}
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
