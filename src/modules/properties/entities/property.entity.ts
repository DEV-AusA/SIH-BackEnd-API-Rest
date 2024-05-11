import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
  name: 'properties',
})
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', unique: true, nullable: false })
  number: number;

  @Column({
    type: 'varchar',
    default:
      'https://res.cloudinary.com/dcqdilhek/image/upload/c_thumb,w_200,g_face/v1715345521/casa-default_vrlvzn.jpg',
    nullable: false,
  })
  image: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  ubication: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  code: string;

  @ManyToOne(() => User, (user) => user.properties)
  user: User;
}
