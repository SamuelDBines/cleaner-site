import { Entity, Column } from "typeorm";
import { BaseModel } from "./Base";
import { IUser } from "@/packages/interfaces/IUser";
import { IUserOnTenant } from "@/packages/interfaces/IUserOnTenant";

@Entity()
export class User extends BaseModel implements IUser {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  telephone?: string;

  @Column({ nullable: true })
  telephoneExtension?: string;

  @Column({ nullable: true })
  filters: string;

  @Column({ default: true })
  firstLogin: boolean;

  @Column({ default: true })
  remember: boolean;

  @Column("jsonb", { nullable: true })
  tenants: IUserOnTenant[] | null;


  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}