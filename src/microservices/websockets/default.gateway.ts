import { Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ENUM_EMITTER_EVENTS, ENUM_WEBSOCKET_EVENTS } from "src/common/enums/enums";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ["websocket"],
})
export class DefaultWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(DefaultWebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: client-id: ${client.id}`);
  }
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: client-id: ${client.id}`);
  }

  @OnEvent(ENUM_EMITTER_EVENTS.EMBEDDING_COMPLETED)
  handleEmbeddingCompleted(payload: { timestamp: Date; totalJobsCount: number }) {
    this.server.emit(ENUM_WEBSOCKET_EVENTS.EMBEDDING_COMPLETED, payload);
  }
}
