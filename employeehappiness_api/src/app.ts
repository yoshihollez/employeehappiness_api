// imports
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import dotenv from "dotenv";
import connectRedis from "connect-redis";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./resolvers/User";
import { User } from "./entities/User";
import session from "express-session";
import redis from "redis";
import { HappinessResolver } from "./resolvers/Happiness";
import { Happiness } from "./entities/Happiness";

// dotenv data
dotenv.config();
const PORT: string = process.env.PORT || "4000";
const DATABASE_NAME: string = process.env.DATABASENAME || "employeehappiness";
const DATABSE_USER: string = process.env.DATABSE_USER || "root";
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || "";
const REDIS_IP: number = Number(process.env.REDIS_IP) || 6373;

// everything is placed in a main class so async can be used.
const main = async () => {
  const app: express.Application = express();

  // connection for database with typeorm
  const conn = await createConnection({
    type: "mysql",
    database: DATABASE_NAME,
    username: DATABSE_USER,
    password: DATABASE_PASSWORD,
    url: "",
    logging: true,
    synchronize: true, // automatically updates the database tables, disable in production.
    // migrations: [path.join(__dirname, "./migrations/*")], // for manual migrations
    entities: [User, Happiness],
  });
  // redis setup, used to store sessiondata
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient(REDIS_IP);

  var routesArray = ["/login", "/rating", "/statistics", "/graphql"];

  // cookie settings
  app.use(
    routesArray,
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      secret: "afefgegzgzergdfghtyrjykiluimomrfsdvb",
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        maxAge: 1000 * 60 * 30, //30 min
        httpOnly: true,
        sameSite: "lax",
        secure: false, // only in https, enable in production.
      },
    })
  );
  // cors setup
  app.use(
    cors({
      origin: `http://${process.env.WEBSITE_IP}:${process.env.WEBSITE_PORT}/`,
      credentials: true,
      preflightContinue: true,
    })
  );
  // apollo setup
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, HappinessResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({
    app,
    // if you put / at the end of 3000 the cookie wil not be set.
    cors: {
      origin: `http://${process.env.WEBSITE_IP}:${process.env.WEBSITE_PORT}`,
    },
  });

  // sets up server with port from dotenv or default 4000
  app.listen(parseInt(PORT), "0.0.0.0", () => {
    console.log(`🚀 Server Started at PORT: ${PORT}  `);
  });
};

// calls main function
main();
