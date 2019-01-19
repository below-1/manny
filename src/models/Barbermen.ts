import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn, ManyToOne,
  CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cabang } from './Cabang';

@Entity()
export class Barbermen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column()
  avatar: string;

  @Column()
  aktif: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column('int')
  idCabang: number;

  @ManyToOne(type => Cabang)
  @JoinColumn({ name: 'idCabang' })
  cabang: Cabang;

}