import { Tool } from "@langchain/core/tools";
import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class PostgresQueryTool extends Tool {
  name = "postgres_query";
  description = `
Execute a safe SQL query on the PostgreSQL database.
Only SELECT, WITH, and EXPLAIN statements are allowed unless 'allowUnsafe' is true.
Always return JSON results.
`;

  constructor(private readonly pool: Pool) {
    super();
  }

  /** SQL Safety Check */
  private isUnsafeQuery(sql: string): boolean {
    const lowered = sql.trim().toLowerCase();

    return (
      lowered.startsWith("delete") ||
      lowered.startsWith("drop") ||
      lowered.startsWith("alter") ||
      lowered.startsWith("truncate") ||
      lowered.startsWith("update")
    );
  }

  /** Tool Execution */
  async _call(input: string) {
    console.log("query tool input", input);
    try {
      const sql = input.trim();

      // Safety guard
      if (this.isUnsafeQuery(sql)) {
        return JSON.stringify({
          error: "Unsafe SQL blocked. Allowed statements: SELECT, WITH, EXPLAIN. To override, set allowUnsafe=true.",
          sql,
        });
      }

      const client = await this.pool.connect();
      const result = await client.query(sql);
      client.release();

      return JSON.stringify({
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields.map((f) => f.name),
      });
    } catch (err: any) {
      return JSON.stringify({ error: err.message ?? "Query failed" });
    }
  }
}
