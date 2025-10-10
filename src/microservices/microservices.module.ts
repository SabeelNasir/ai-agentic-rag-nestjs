import { Module } from "@nestjs/common";
import { BullQueuesModule } from "./queues/bull-queues.module";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [BullQueuesModule, EventEmitterModule.forRoot()],
})
export class MicroservicesModule {}
