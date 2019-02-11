import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Media {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: String;

  @Column()
  description: String;

  @Column()
  avatar: boolean;

  @Column()
  url: string;

  @Column('int')
  target: number;
}