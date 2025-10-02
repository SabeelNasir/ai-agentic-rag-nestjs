import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";

// Employees List SChema
const employeesSchema = z.array(
  z.object({
    fullname: z.string().describe("name of the employee who is fit for the job role"),
    height: z.string().describe("height of the employee"),
    gender: z.string().describe("gender of the employee"),
    experience: z.number().describe("number of years of experience of the employee in market"),
    skills: z.array(
      z.object({
        name: z.string().describe("name of the skill"),
        skill_level_perc: z.number().describe("skill level proficient/good percentage"),
      }),
    ),
  }),
);
const employeesSchemaParser = StructuredOutputParser.fromZodSchema(employeesSchema);
export type EmployeesList = z.infer<typeof employeesSchema>;

// Employees Summary List SChema
const employeesSummarySchema = z.array(
  z.object({
    employees_list: z
      .array(z.string().describe("Summary of employee in one line"))
      .describe("list of employees with summarized details"),
  }),
);
const employeesSummarySchemaParser = StructuredOutputParser.fromZodSchema(employeesSchema);
export type EmployeesSummaryList = z.infer<typeof employeesSummarySchema>;

export { employeesSchemaParser, employeesSummarySchemaParser };
