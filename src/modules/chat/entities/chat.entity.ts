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
    name: 'user_id_from',
    type: 'uuid',
    nullable: false,
  })
  userIdFrom: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // maximo 50 chars y no puede ser nulo
  name: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ name: 'message_date', nullable: false })
  messageDate: Date;

  @Column({ name: 'room_id_chat', nullable: false })
  roomIdChat: string;

  @Column({ name: 'user_id_to', type: 'uuid', nullable: false })
  userIdTo: string;

  @OneToMany(() => Property, (prop) => prop.user, { eager: true })
  @JoinColumn()
  properties: Property[];
}
