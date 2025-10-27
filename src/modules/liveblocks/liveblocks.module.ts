import { Module } from "@nestjs/common";
import { LiveblocksService } from "./liveblocks.service";
import { LiveblocksController } from "./liveblocks.controller";

@Module({
  providers: [LiveblocksService],
  controllers: [LiveblocksController],
  exports: [LiveblocksService],
})
export class LiveblocksModule {}
