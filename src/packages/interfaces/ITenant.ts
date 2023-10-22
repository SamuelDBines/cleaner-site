import { IBase } from './IBase';
import { IUserOnTenant } from './IUserOnTenant';

export interface ITenant extends IBase {
  name: string;
  archived: boolean;
  bucket?: string;
  alias: string;
  members: IUserOnTenant[] | null;
  email: string;
  provider: string;
}