import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'establishments' })
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  news: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'finish_date', type: 'timestamp', nullable: true })
  finishDate: Date;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'bigint', nullable: true })
  cellphone: number;

  @Column({ type: 'varchar', nullable: true })
  image: string;
}
