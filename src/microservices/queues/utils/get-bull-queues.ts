import { BullAdapter } from "@bull-board/api/bullAdapter";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { BaseAdapter } from "node_modules/@bull-board/api/baseAdapter";

@Injectable()
export class BullBoardQueue {}

export const queuePool: Set<Queue> = new Set<Queue>();

export const getBullBoardQueues = (): BaseAdapter[] => {
  const bullBoardQueues = [...queuePool].reduce((acc: BaseAdapter[], val) => {
    acc.push(new BullAdapter(val));
    return acc;
  }, []);

  return bullBoardQueues;
};
