import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable } from 'typeorm';
import {
  Barbermen
} from './Barbermen';
import {
  PaketJasa
} from './PaketJasa';

  @Entity()
  export class Cabang {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    nama: string;
  
    @Column()
    alamat: string;

    @ManyToMany(type => PaketJasa, pj => pj.listCabang)
    listPaketJasa: PaketJasa[];

    @ManyToMany(type => Barbermen, barbermen => barbermen.cabang)
    listBarbermen: Barbermen[];
  }