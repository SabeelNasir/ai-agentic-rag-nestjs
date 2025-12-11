import { Tool } from "@langchain/core/tools";
import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class PostgresDescribeTableTool extends Tool {
  name = "postgres_describe_table";
  description = "Describe a table: columns, types, nullability, default values.";

  constructor(private readonly pool: Pool) {
    super();
  }

  async _call(input: string) {
    console.log("describe table", input);
    const sql = `SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name=$1
      ORDER BY ordinal_position;`;
    const result = await this.pool.query(sql, [input]);
    return JSON.stringify(result.rows);
  }
}
