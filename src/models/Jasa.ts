import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Jasa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: String;

  @Column('double')
  harga: number;
}