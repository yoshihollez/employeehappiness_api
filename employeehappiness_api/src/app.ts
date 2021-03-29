import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import * as dotenv from "dotenv";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { EmployeeHappinessResolver } from "./resolvers/employeeHappiness";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

dotenv.config();
const PORT: string = process.env.PORT || "";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();
  const app: express.Application = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient(6373);

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      secret: "afefgegzgzergdfghtyrjykiluimomrfsdvb",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 30, //30 min
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // only in https
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, EmployeeHappinessResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
    }),
  });
  apolloServer.applyMiddleware({ app });
  // const post = orm.em.create(Post, { title: "blabla" });
  // orm.em.persistAndFlush(post);
  // // Just checking if given PORT variable is an integer or not
  let port: number = parseInt(PORT || "");
  if (isNaN(port) || port === 0) {
    port = 4000;
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server Started at PORT: ${port}  `);
  });
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};
main();
