import { Tool } from "@langchain/core/tools";
import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class PostgresListTablesTool extends Tool {
  name = "postgres_list_tables";
  description = "List all tables in the PostgreSQL database.";
  constructor(private readonly pool: Pool) {
    super();
  }

  async _call(_: string) {
    const sql = `SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;`;
    const result = await this.pool.query(sql);

    return JSON.stringify(result.rows);
  }
}
