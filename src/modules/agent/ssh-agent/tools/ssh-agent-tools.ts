import { tool } from "@langchain/core/tools";
import { Injectable, Logger } from "@nestjs/common";
import { SshExecuterService } from "src/modules/ssh-executer/ssh-executer.service";
import { SshSessionManager } from "src/modules/ssh-executer/ssh-session-manager.service";
import z from "zod";

@Injectable()
export class SshAgentTools {
  constructor(
    private readonly sshExecuter: SshExecuterService,
    private readonly sshSessionManager: SshSessionManager,
  ) {}
  private logger = new Logger(SshAgentTools.name);

  toolConnectSsh() {
    return tool(
      async (input) => {
        this.logger.log(`Calling SSH Tool`);
        const cfg = {
          host: input.host,
          username: input.username,
          port: input.port,
          privateKey: input.privateKey || undefined,
          password: input.password || undefined,
          timeoutMs: input.readyTimeout,
        };
        this.logger.log(`Config for SSH Tool: `, JSON.stringify(cfg));

        const ok = await this.sshExecuter.testConnectivity(cfg);

        return {
          success: ok,
          message: ok
            ? `SSH connectivity verified for host ${input.host}`
            : `SSH connectivity failed for host ${input.host}`,
        };
      },
      {
        name: "connect-ssh-tool",
        description:
          "Test SSH connectivity using host, username, and authentication (privateKey or password). Returns success/failure.",
        schema: z
          .object({
            host: z
              .string()
              .min(1, "Host is required")
              .regex(/^(([a-zA-Z0-9.-]+)|(\d{1,3}(\.\d{1,3}){3}))$/, "Invalid host (IP or hostname)"),

            username: z.string().min(1, "Username is required"),

            port: z.number().int().min(1).max(65535).optional().default(22),

            privateKey: z.string().optional().nullable(),
            password: z.string().optional().nullable(),

            readyTimeout: z.number().int().min(100).max(60000).optional().default(5000),
          })
          .refine((data) => data.privateKey || data.password, {
            message: "Either privateKey or password must be provided",
            path: ["privateKey"],
          }),
      },
    );
  }

  toolRunSshCommand() {
    return tool(
      async (input) => {
        const cfg = {
          host: input.host,
          username: input.username,
          port: input.port,
          privateKey: input.privateKey || undefined,
          password: input.password || undefined,
        };

        // Allowed safe commands
        // const allowed = [
        //   "top -b -n 1",
        //   "ls -l",
        //   "ls",
        //   "pwd",
        //   "pm2 list",
        //   "pm2 jlist",
        //   "pm2 status",
        //   "pm2 ls",
        //   "pm2 logs",
        //   "whoami",
        //   "uptime",
        // ];

        // if (!allowed.includes(input.command)) {
        //   return {
        //     success: false,
        //     message: `Command '${input.command}' is not allowed.`,
        //   };
        // }

        // const result = await this.sshExecuter.runRawCommand(cfg, input.command);
        const result = await this.sshSessionManager.execInSession(cfg, input.command);

        return {
          success: result.success,
          exitCode: result.exitCode,
          stdout: result.stdout,
          stderr: result.stderr,
        };
      },
      {
        name: "ssh-run-command-tool",
        description: "Run a safe allowed SSH command (like 'top', 'ls -l', 'pm2 list') on the remote host.",
        schema: z
          .object({
            host: z.string().min(1),
            username: z.string().min(1),
            port: z.number().optional().default(22),

            privateKey: z.string().optional().nullable(),
            password: z.string().optional().nullable(),

            command: z.string().min(1, "Command required"),
          })
          .refine((data) => data.privateKey || data.password, "Either privateKey or password must be provided"),
      },
    );
  }
}
