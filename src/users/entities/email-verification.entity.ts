import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/entities/base.entity';
import { User } from './user.entity';

@Entity()
export class EmailVerification extends BaseEntity {
  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}
