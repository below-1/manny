import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable,
  RelationId } from 'typeorm';
import { Cabang } from './Cabang';

@Entity()
export class PaketJasa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: String;

  @Column()
  avatar: String;

  @Column('double')
  harga: number;

  @Column('text')
  items: any;

  @Column()
  keterangan: string;

  @Column('int')
  estimasiWaktu: number;

  @ManyToMany(type => Cabang, cabang => cabang.listPaketJasa)
  @JoinTable({ name: 'paket_jasa_cabang' })
  listCabang: Cabang[];
  @RelationId((pj: PaketJasa) => pj.listCabang)
  idsCabang: number[];
}