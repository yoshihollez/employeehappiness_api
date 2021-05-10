// imports
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { FieldError, MyContext } from "../types";

// defines how a response should look like, either return data from a user or an errormessage
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {
    nullable: true,
  })
  errors?: FieldError[];

  @Field(() => User, {
    nullable: true,
  })
  user?: User;
}

//resolvers
@Resolver()
export class UserResolver {
  //querys, simply get data. don't make any changes.
  //returns a list of all users
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  // checks who is currently logged in with the cookie userId.
  @Query(() => UserResponse)
  async me(@Ctx() { req }: MyContext): Promise<UserResponse> {
    console.log(req.session.userId);
    //returns error message if no user is logged in.
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "You are not logged in",
          },
        ],
      };
    }
    //returns data of currently logged in user.
    const user = await User.findOne({
      id: req.session.userId,
    });
    return { user };
  }

  // gets data from one user using the id.
  @Query(() => User, {
    nullable: true,
  })
  user(@Arg("id") id: string): Promise<User | undefined> {
    return User.findOne(id);
  }

  // takes username and password and logs user in and sets cookie with userId.
  @Query(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    // looks for user using the username.
    const user = await User.findOne({
      username: username,
    });
    // if no user can be found return error message.
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username could not be found.",
          },
        ],
      };
    }
    // checks the hashed password with user given password.
    const valid = await argon2.verify(user?.password, password);
    // if they are the same set the cookie userId and return the user data. if not return error message.
    if (valid) {
      req.session.userId = user.id;
      return {
        user,
      };
    } else {
      return {
        errors: [
          {
            field: "password",
            message: "Wrong password.",
          },
        ],
      };
    }
  }

  @Query(() => Boolean)
  async logout(@Ctx() { req }: MyContext): Promise<boolean> {
    try {
      req.session.destroy(() => {});
    } catch (error) {
      return false;
    }
    return true;
  }

  //mutations, change data in the database.
  // creates a new user with hashed password and unique username aswell as uuid
  @Mutation(() => UserResponse)
  async createUser(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    //hashes the password
    const hashedPassword = await argon2.hash(password);
    // looks if a user can be found using the username.
    const usernameTaken = await User.findOne({
      username: username,
    });
    // if usernameTaken is undefined create the new user, if not return error message.
    if (usernameTaken) {
      return {
        errors: [
          {
            field: "username",
            message: "Username already taken.",
          },
        ],
      };
    } else {
      const user = await User.create({
        username: username,
        password: hashedPassword,
      }).save();
      return { user };
    }
  }

  // changes the username using the cookie userId.
  @Mutation(() => UserResponse)
  async changeUsername(
    //username cannot be null
    @Arg("username", () => String, {
      nullable: false,
    })
    username: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const id = req.session.userId;
    // if no id exists return error message.
    if (!id) {
      return {
        errors: [
          {
            field: "userId",
            message: "You are not logged in",
          },
        ],
      };
    }
    // gets user data using id
    const user = await User.findOne(id);
    // if user is undefined return error message that user could not be found.
    if (!user) {
      return {
        errors: [
          {
            field: "id",
            message: "No user with this id could be found",
          },
        ],
      };
    }
    // update username if it isn't undefined.
    if (typeof username !== "undefined") {
      user.username = username;
      await User.update(
        {
          id,
        },
        {
          username,
        }
      );
    }
    // returns user data.
    return { user };
  }

  //deletes user using the id
  @Mutation(() => Boolean)
  async deleteUser(@Ctx() { req }: MyContext): Promise<boolean> {
    // tries to delete user if it fails return false otherwise returns true
    try {
      // deltes user from database
      await User.delete({ id: req.session.userId });
      // deletes userId from cookie. Needs callback to work.
      req.session.destroy(() => {});
    } catch {
      return false;
    }
    return true;
  }
}
