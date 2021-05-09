import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { FieldError, MyContext } from "../types";
import { DateType } from "@mikro-orm/core";
enum moods {
  sattisfied,
  neutral,
  dissatisfied,
}

@ObjectType()
@Entity()
export class Happiness extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  createdAt!: string;

  // @Field()
  // @UpdateDateColumn()
  // updatedAt: Date;

  @Field()
  @Column()
  mood!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.happiness)
  user: User;
}
