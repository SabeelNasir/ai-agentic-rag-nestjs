import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { Request, Response, All, Controller, Next, Get, Post } from "@nestjs/common";
import express from "express";
import { getBullBoardQueues } from "./utils/get-bull-queues";

@Controller("/admin/queues")
export class BullBoardController {
  @All("*")
  admin(@Request() req: express.Request, @Response() res: express.Response, @Next() next: express.NextFunction) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/admin/queues");
    const queues = getBullBoardQueues();
    const router = serverAdapter.getRouter() as express.Express;
    const { setQueues } = createBullBoard({
      queues: [],
      serverAdapter,
    });
    setQueues(queues);
    const entryPointPath = "/admin/queues/";
    req.url = req.url.replace(entryPointPath, "/");
    router(req, res, next);
  }
}
