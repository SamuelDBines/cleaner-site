import { IBase } from './IBase';

export interface IUserOnTenant extends IBase {
  userId: string;
  tenantId: string;
  assignedBy: string | null;
  selected: boolean;
  role: string;
}