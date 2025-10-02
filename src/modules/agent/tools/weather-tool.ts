// src/ai/tools/weather-tool.ts
import { tool } from "@langchain/core/tools";
import { ConfigService } from "@nestjs/config";
import fetch from "node-fetch";
import { EnvConfigService } from "src/config/env-config.service";
import z from "zod";

export const WeatherTool = tool(
  async ({ location }): Promise<string> => {
    // const apiKey = process.env.WEATHER_API_KEY; // put your key in .env
    const apiKey = "97c02b3147bfa0e9ef6341f39b8a4168"; // put your key in .env
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location,
    )}&units=metric&appid=${apiKey}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.statusText}`);
    }
    const data = await res.json();
    return `The weather in ${location} is ${data.weather[0].description}, temperature ${data.main.temp}°C.`;
  },
  {
    name: "get_weather",
    description: "Fetches current weather for a location requested by user.",
    schema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
  },
);
