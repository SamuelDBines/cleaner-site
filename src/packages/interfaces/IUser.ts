import { IBase } from './IBase';
import { IUserOnTenant } from './IUserOnTenant';

export interface IUser extends IBase {
  firstName: string;
  lastName: string;
  email: string;  //@unique
  password?: string;
  title?: string;
  telephone?: string;
  telephoneExtension?: string;
  firstLogin: boolean;
  filters: string;
  remember: boolean;
  tenants: IUserOnTenant[] | null;
  // bricks Brick[] @relation(name: "owner")
  // Stakeholder Stakeholder[];
}