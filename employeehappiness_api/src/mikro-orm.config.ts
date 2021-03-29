import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { EmployeeHappiness } from "./entities/EmployeeHappiness";

// initializing .env variables
const DATABASENAME: string = process.env.DATABASENAME || "mikroorm";
const DATABSE_USER: string = process.env.DATABSE_USER || "root";
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || "";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: [Post, EmployeeHappiness],
  dbName: DATABASENAME,
  user: DATABSE_USER,
  password: DATABASE_PASSWORD,
  type: "mysql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
