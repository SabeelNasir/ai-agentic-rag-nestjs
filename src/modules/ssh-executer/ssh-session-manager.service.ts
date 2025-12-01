import { Injectable, Logger } from "@nestjs/common";
import { NodeSSH } from "node-ssh";

type SessionKey = string;

interface SshSession {
  ssh: NodeSSH;
  lastUsed: number;
  config: {
    host: string;
    username: string;
    port?: number;
    privateKey?: string;
    password?: string;
  };
}

@Injectable()
export class SshSessionManager {
  private readonly logger = new Logger(SshSessionManager.name);
  private sessions = new Map<SessionKey, SshSession>();

  // expire after 10 minutes idle
  private readonly SESSION_TTL = 10 * 60 * 1000;

  constructor() {
    // run cleanup every minute
    setInterval(() => this.cleanupExpiredSessions(), 60_000);
  }

  private buildKey(cfg: any): string {
    return `${cfg.username}@${cfg.host}:${cfg.port ?? 22}`;
  }

  async getOrCreateSession(cfg: {
    host: string;
    username: string;
    port?: number;
    privateKey?: string;
    password?: string;
  }) {
    const key = this.buildKey(cfg);
    const existing = this.sessions.get(key);

    if (existing) {
      existing.lastUsed = Date.now();
      this.logger.log(`Ssh Session already active : ${key}`)
      return existing.ssh;
    }

    // create new session
    const ssh = new NodeSSH();
    await ssh.connect({
      host: cfg.host,
      username: cfg.username,
      port: cfg.port ?? 22,
      privateKey: cfg.privateKey,
      password: cfg.password,
      readyTimeout: 5000,
    });

    this.sessions.set(key, {
      ssh,
      config: cfg,
      lastUsed: Date.now(),
    });

    this.logger.log(`Created new SSH session: ${key}`);

    return ssh;
  }

  async execInSession(cfg: any, command: string) {
    const ssh = await this.getOrCreateSession(cfg);
    const start = Date.now();

    try {
      const { stdout, stderr, code } = await ssh.execCommand(command, {
        cwd: "~",
        execOptions: { timeout: 30_000 },
      });

      return {
        success: code === 0,
        exitCode: code,
        stdout,
        stderr,
        durationMs: Date.now() - start,
      };
    } catch (err: any) {
      return {
        success: false,
        exitCode: null,
        stdout: "",
        stderr: String(err),
        durationMs: Date.now() - start,
      };
    }
  }

  private cleanupExpiredSessions() {
    const now = Date.now();
    for (const [key, session] of this.sessions.entries()) {
      if (now - session.lastUsed > this.SESSION_TTL) {
        this.logger.log(`Closing idle SSH session: ${key}`);
        session.ssh.dispose();
        this.sessions.delete(key);
      }
    }
  }
}
