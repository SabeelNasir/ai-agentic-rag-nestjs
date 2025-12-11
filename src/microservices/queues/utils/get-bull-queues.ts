import { BullAdapter } from "@bull-board/api/bullAdapter";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class BullBoardQueue {}

export const queuePool: Set<Queue> = new Set<Queue>();

export const getBullBoardQueues = (): BullAdapter[] => {
  const bullBoardQueues = [...queuePool].reduce((acc: BullAdapter[], val) => {
    acc.push(new BullAdapter(val));
    return acc;
  }, []);

  return bullBoardQueues;
};
