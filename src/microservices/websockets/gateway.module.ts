import { Module } from "@nestjs/common";
import { DefaultWebsocketGateway } from "./default.gateway";

@Module({
  providers: [DefaultWebsocketGateway],
  exports: [DefaultWebsocketGateway],
})
export class GatewayModule {}
