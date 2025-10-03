import { Module } from "@nestjs/common";
import { BullQueuesModule } from "./queues/bull-queues.module";

@Module({
  imports: [BullQueuesModule],
})
export class MicroservicesModule {}
