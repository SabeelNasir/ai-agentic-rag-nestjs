import { Injectable } from "@nestjs/common";
import { DtoLiveblocksAuthPayload } from "./interfaces/liveblocks-request.dto";
import axios from "axios";
import { EnvConfigService } from "src/config/env-config.service";
import { Liveblocks } from "@liveblocks/node";
import { USER_INFO } from "src/common/enums/enums";

@Injectable()
export class LiveblocksService {
  private liveblocks: Liveblocks;
  constructor(private readonly confService: EnvConfigService) {
    this.liveblocks = new Liveblocks({ secret: this.confService.getLiveblocksSecretKey() });
  }

  async prepareSession(payload: DtoLiveblocksAuthPayload) {
    try {
      // const user = { id: 1000, name: "Sabeel", color: "#85EED6", avatar: "https://liveblocks.io/avatars/avatar-4.png" };
      const user: any = this.getRandomUser();
      const session = this.liveblocks.prepareSession(user.id.toString(), { userInfo: user.info });
      session.allow(payload.roomId, session.FULL_ACCESS);
      const { status, body } = await session.authorize();
      if (status !== 200) {
        throw new Error("Liveblocks auth error: " + status);
      }
      return JSON.parse(body);
    } catch (err) {
      throw new Error(`Liveblocks auth failed: ${err}`);
    }
  }

  getRandomUser() {
    return USER_INFO[Math.floor(Math.random() * 10) % USER_INFO.length];
  }

  getUser(id: string) {
    return USER_INFO.find((u: any) => u.id === id) || null;
  }

  getUsers() {
    return USER_INFO;
  }
}
