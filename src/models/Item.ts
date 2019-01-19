import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable,
  CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cabang } from './Cabang';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column()
  deskripsi: string;

  @Column()
  satuanHarga: string;

  @Column('double')
  hargaBeli: number;

  @Column()
  satuanBerat: string;

  @Column('double')
  berat: number;

  @Column()
  brand: string;

  @Column()
  dijual: boolean;

  @Column({ type: 'int', nullable: false })
  idCabang: number;

  @Column('double')
  hargaJual: number;

  @ManyToOne(type => Cabang)
  @JoinColumn({ name: 'idCabang' })
  cabang: Cabang;

  @Column()
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}