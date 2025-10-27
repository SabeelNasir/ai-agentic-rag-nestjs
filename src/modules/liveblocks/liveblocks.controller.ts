import { Body, Controller, Post } from "@nestjs/common";
import { LiveblocksService } from "./liveblocks.service";
import { DtoLiveblocksAuthPayload } from "./interfaces/liveblocks-request.dto";

@Controller("liveblocks")
export class LiveblocksController {
  constructor(private service: LiveblocksService) {}

  @Post("auth")
  auth(@Body() body: DtoLiveblocksAuthPayload) {
    return this.service.prepareSession(body);
  }
}
