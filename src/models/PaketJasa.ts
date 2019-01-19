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

  @Column('double')
  harga: number;

  @Column('text')
  items: any;

  @Column()
  keterangan: string;

  @Column('int')
  estimasiWaktu: number;

  @ManyToMany(type => Cabang)
  @JoinTable()
  listCabang: Cabang[];

  @RelationId((pj: PaketJasa) => pj.listCabang)
  idsCabang: number[];
}