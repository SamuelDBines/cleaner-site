export interface IBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  archivedAt: Date | null;
  archived: boolean;
}