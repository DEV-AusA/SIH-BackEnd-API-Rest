import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity({
  name: 'chat',
})
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // maximo 50 chars y no puede ser nulo
  name: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ name: 'message_date', nullable: false })
  messageDate: Date;

  @OneToMany(() => Property, (prop) => prop.user, { eager: true })
  @JoinColumn()
  properties: Property[];
}
