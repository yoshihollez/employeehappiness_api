import { EmployeeHappiness } from "../entities/EmployeeHappiness";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MOODS } from "../constants";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class EmployeeResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => EmployeeHappiness, { nullable: true })
  employeeHappiness?: EmployeeHappiness;
}

@Resolver()
export class EmployeeHappinessResolver {
  @Query(() => [EmployeeHappiness])
  getEmployeeHappinessData(
    @Ctx() { em }: MyContext
  ): Promise<EmployeeHappiness[]> {
    return em.find(EmployeeHappiness, {});
  }

  @Query(() => EmployeeHappiness, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<EmployeeHappiness | null> {
    return em.findOne(EmployeeHappiness, { id });
  }

  @Mutation(() => EmployeeResponse, { nullable: true })
  async addEmployeeMood(
    @Arg("mood") mood: string,
    @Ctx() { em, req }: MyContext
  ): Promise<EmployeeResponse> {
    if (MOODS.includes(mood)) {
      const employeeHappiness = em.create(EmployeeHappiness, { mood });
      await em.persistAndFlush(employeeHappiness);
      req.session.employeeMood = mood;
      return { employeeHappiness };
    } else {
      return {
        errors: [
          {
            field: "mood",
            message: "Mood must be sattisfied, neutral or dissatisfied",
          },
        ],
      };
    }
  }

  @Mutation(() => EmployeeResponse)
  async updateEmployeeMood(
    @Arg("id") id: number,
    @Arg("mood") mood: string,
    @Ctx() { em, req }: MyContext
  ): Promise<EmployeeResponse> {
    const employeeHappiness = await em.findOne(EmployeeHappiness, { id });
    if (!employeeHappiness) {
      return {
        errors: [
          {
            field: "id",
            message: "Could not find id",
          },
        ],
      };
    }
    if (typeof mood !== "undefined" && MOODS.includes(mood)) {
      employeeHappiness.mood = mood;
      await em.persistAndFlush(employeeHappiness);
    } else {
      return {
        errors: [
          {
            field: "mood",
            message: "Mood must be sattisfied, neutral or dissatisfied",
          },
        ],
      };
    }
    req.session.employeeMood = mood;
    return { employeeHappiness };
  }

  @Mutation(() => Boolean)
  async deleteEmployeeMood(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(EmployeeHappiness, { id });
    } catch {
      return false;
    }
    return true;
  }
}
