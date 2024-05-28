import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'establishments' })
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'bigint', nullable: true })
  cellphone: number;

  @Column({ type: 'varchar', nullable: true })
  image: string;
}
