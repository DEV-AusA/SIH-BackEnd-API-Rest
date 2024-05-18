import { Property } from 'src/modules/properties/entities/property.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', nullable: true })
  ticket: number;

  @Column({
    name: 'type_expenses',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  typeExpenses: string;

  @Column({
    name: 'number_operation',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  numberOperation: string;

  @Column({
    name: 'user_property',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  userProperty: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ name: 'date_generated', type: 'date', nullable: true })
  dateGenerated: Date;

  @Column({ name: 'date_paid', type: 'date', nullable: true })
  datePaid: Date;

  // @Column({ type: 'varchar', length: 20, nullable: true })

  @Column({ type: 'boolean', default: false })
  state: boolean;

  @ManyToOne(() => Property, (property) => property.expences)
  property: Property;
}
