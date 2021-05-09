import { FieldError, MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Happiness } from "../entities/Happiness";
import { isLoggedIn } from "../middleware/isLoggedIn";

// defines how a response should look like, either return data from a user or an errormessage
@ObjectType()
class HappinessResponse {
  @Field(() => [FieldError], {
    nullable: true,
  })
  errors?: FieldError[];

  @Field(() => Happiness, {
    nullable: true,
  })
  happiness?: Happiness;
}

@Resolver()
export class HappinessResolver {
  @Query(() => [Happiness])
  happiness(): Promise<Happiness[]> {
    return Happiness.find();
  }

  //mutations, change data in the database.
  // creates a new Happiness with a mood and userId and createdAt.
  @Mutation(() => HappinessResponse)
  @UseMiddleware(isLoggedIn)
  async createHappiness(
    @Arg("mood") mood: string,
    @Ctx() { req }: MyContext
  ): Promise<HappinessResponse> {
    const id = req.session.userId;
    console.log(id);
    // gets today date in datetime in '2021-05-09' format.
    let datetime = new Date().toISOString().slice(0, 10);

    // looks if the user has voted today.
    const hasUserAlreadyVotedToday = await Happiness.findOne({
      where: { userId: id, createdAt: datetime },
    });
    // if hasUserAlreadyVotedToday is undefined create the new Happiness, if not return error message.
    if (hasUserAlreadyVotedToday) {
      return {
        errors: [
          {
            field: "general",
            message: "You have already voted today.",
          },
        ],
      };
    } else {
      const happiness = await Happiness.create({
        mood: mood,
        createdAt: datetime,
        userId: id,
      }).save();
      return { happiness };
    }
  }

  //deletes user happiness vote using the id and user UUID
  @Mutation(() => Boolean)
  @UseMiddleware(isLoggedIn)
  async deleteHappiness(
    @Arg("id") id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // tries to delete playlist if it fails return false otherwise returns true
    try {
      // deletes Happiness from database
      // not sure if i should return error message in case someone tries to delete data from someone else.
      await Happiness.delete({ id: id, userId: req.session.userId });
    } catch {
      return false;
    }
    return true;
  }
}
