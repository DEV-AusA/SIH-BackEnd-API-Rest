import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'authorizations',
})
export class Authorization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'integer',
    unique: true,
    nullable: false,
    generated: 'increment',
  })
  number: number;

  @Column({ type: 'uuid', nullable: false })
  user: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'integer', nullable: true })
  document: number;

  @Column({
    name: 'shipment_number',
    type: 'varchar',
    nullable: true,
  })
  shipmentNumber: string;

  @Column({ name: 'access_code', type: 'integer', nullable: false })
  accessCode: string;

  @Column({ name: 'expiration_time', type: 'timestamp' })
  expirationTime: Date;

  @Column({ name: 'date_generated', type: 'timestamp', nullable: false })
  dateGenerated: Date;

  @Column({ name: 'guard_id', type: 'uuid', nullable: true })
  guardId: string;

  @Column({ name: 'date_used', nullable: true })
  dateUsed: Date;
}
