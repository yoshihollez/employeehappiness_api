import { Request, Response } from "express";
import { Redis } from "ioredis";
import { Session, SessionData } from "express-session";
import { Field, ObjectType } from "type-graphql";

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: string };
  };
  redis: Redis;
  res: Response;
};

// defines how a error response should look like
@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
