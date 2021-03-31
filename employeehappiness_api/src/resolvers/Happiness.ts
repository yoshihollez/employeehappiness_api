import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Happiness } from "src/entities/Happiness";

@Resolver()
export class HappinessResolver {
  @Query(() => [Happiness])
  posts(@Ctx() { em }: MyContext): Promise<Happiness[]> {
    return em.find(Happiness, {});
  }

  @Mutation(() => Happiness, { nullable: true })
  async addHappiness(
    @Arg("mood") mood: String,
    @Ctx() { em }: MyContext
  ): Promise<Happiness> {
    const newMood = em.create(Happiness, { mood });
    await em.persistAndFlush(newMood);
    return newMood;
  }
  @Mutation(() => Happiness, { nullable: true })
  async UpdateHappiness(
    @Arg("id") id: number,
    @Arg("mood", () => String, { nullable: true }) mood: string,
    @Ctx() { em }: MyContext
  ): Promise<Happiness | null> {
    const happiness = await em.findOne(Happiness, { id });
    if (!happiness) {
      return null;
    }
    if (typeof mood !== "undefined") {
      happiness.mood = mood;
      await em.persistAndFlush(happiness);
    }
    return happiness;
  }
  @Mutation(() => Boolean)
  async deleteHappiness(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Happiness, { id });
    } catch {
      return false;
    }
    return true;
  }
}
