import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InternalInfoStatusType } from './internal-info.enum';

@Entity('internal_info')
export class InternalInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('internal_info_title_idx')
  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'other_description', nullable: true, type: 'text' })
  otherDescription: string;

  @Column({ name: 'expire_date', type: 'date', nullable: true })
  expireDate: Date;

  @Column({ name: 'change_inactive', default: false })
  changeInactive: boolean;

  @Column({
    type: 'simple-enum',
    enum: InternalInfoStatusType,
    default: InternalInfoStatusType.Active,
  })
  status: InternalInfoStatusType;

  @Column({ name: 'product_description', nullable: true, type: 'text' })
  productDescription: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @Index('internal_info_updated_at_idx')
  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;
}
