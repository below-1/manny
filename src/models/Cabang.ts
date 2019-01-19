import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable } from 'typeorm';

  @Entity()
  export class Cabang {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    nama: string;
  
    @Column()
    alamat: string;
  }