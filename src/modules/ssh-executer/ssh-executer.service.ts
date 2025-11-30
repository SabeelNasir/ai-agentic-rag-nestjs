import { Injectable, Logger } from "@nestjs/common";
import { NodeSSH, Config as SSHConfig } from "node-ssh";

export type ExecResult = {
  success: boolean;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  durationMs: number;
};

@Injectable()
export class SshExecuterService {
  constructor() {}

  private logger = new Logger(SshExecuterService.name);

  async testConnectivity(cfg: SSHConfig & { timeoutMs?: number }): Promise<boolean> {
    const ssh = new NodeSSH();
    try {
      const connectCfg = {
        host: cfg.host,
        username: cfg.username,
        port: cfg.port ?? 22,
        privateKey: cfg.privateKey,
        password: cfg.password,
        readyTimeout: cfg.timeoutMs ?? 5000,
      };
      await ssh.connect(connectCfg);
      const res = await ssh.execCommand("echo OK", { cwd: "~" });
      await ssh.dispose();
      return res.stdout.trim() === "OK";
    } catch (err) {
      this.logger.warn("connectivity test failed: " + String(err));
      return false;
    }
  }

  async runRawCommand(
    cfg: {
      host: string;
      username: string;
      port?: number;
      privateKey?: string;
      password?: string;
    },
    command: string,
  ) {
    const ssh = new NodeSSH();
    const start = Date.now();

    try {
      await ssh.connect({
        host: cfg.host,
        username: cfg.username,
        port: cfg.port ?? 22,
        privateKey: cfg.privateKey,
        password: cfg.password,
        readyTimeout: 5000,
      });

      const { stdout, stderr, code } = await ssh.execCommand(command, {
        cwd: "~",
        execOptions: {
          timeout: 25_000, // 25s max
        },
      });

      const duration = Date.now() - start;

      // limit output to avoid flooding
      const maxLen = 25000;
      const cleanStdout = stdout.length > maxLen ? stdout.slice(0, maxLen) + "\n...[truncated]" : stdout;
      const cleanStderr = stderr.length > maxLen ? stderr.slice(0, maxLen) + "\n...[truncated]" : stderr;

      await ssh.dispose();

      return {
        success: code === 0,
        exitCode: code,
        stdout: cleanStdout,
        stderr: cleanStderr,
        durationMs: duration,
      };
    } catch (err: any) {
      ssh.dispose();
      const duration = Date.now() - start;

      return {
        success: false,
        exitCode: null,
        stdout: "",
        stderr: String(err),
        durationMs: duration,
      };
    }
  }
}
