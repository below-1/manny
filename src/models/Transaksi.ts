import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable } from 'typeorm';
import { Cabang } from './Cabang';
import { User } from './User'
import { BaseTransaksi } from './BaseTransaksi';

@Entity()
export class Transaksi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(type => BaseTransaksi)
  transaksi: BaseTransaksi;
}
