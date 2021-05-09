import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isLoggedIn: MiddlewareFn<MyContext> = ({ context }, next) => {
  console.log(context.req.session);
  if (!context.req.session.userId) {
    // if no id exists return error message.
    throw new Error("You are not logged in.");
  }
  return next();
};
