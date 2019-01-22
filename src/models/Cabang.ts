import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable,
  RelationId } from 'typeorm';
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
    @RelationId((cabang: Cabang) => cabang.listPaketJasa)
    idsPaketJasa: number[];

    @ManyToOne(type => Barbermen, barbermen => barbermen.cabang)
    listBarbermen: Barbermen[];
  }