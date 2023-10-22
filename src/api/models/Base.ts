import { IBase } from "@/packages/interfaces/IBase";
import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class BaseModel extends BaseEntity implements IBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column({ default: null })
  deletedAt: Date | null;
  @Column({ default: null })
  archivedAt: Date | null;
  @Column({ default: false })
  archived: boolean;
}