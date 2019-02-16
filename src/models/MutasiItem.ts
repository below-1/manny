import * as torm from 'typeorm';
import { Transaksi } from './Transaksi';
import { Item } from './Item';
import { Cabang } from './Cabang';
import { User } from './User';
import { TimeSortable } from '../types';

@torm.Entity()
@torm.TableInheritance({ column: { type: "varchar", name: "mutasiType" } })
export class MutasiItem extends Transaksi implements TimeSortable {
  @torm.Column()
  jumlah: number;

  @torm.Column({ type: 'int', nullable: false })
  idItem: number;

  @torm.ManyToOne(type => Item, { onDelete: 'CASCADE' })
  @torm.JoinColumn({ name: 'idItem' })
  item: Item;

  @torm.Column('double', { default: 0 })
  nominal: number;

  @torm.Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  waktu: Date;

  @torm.Column({ default: '' })
  keterangan: string;

  @torm.Column({ type: 'int', nullable: false })
  idCabang: number;

  @torm.Column({ type: 'int', nullable: false })
  idAddedBy: number;

  @torm.ManyToOne(type => Cabang)
  @torm.JoinColumn({ name: 'idCabang' })
  cabang: Cabang;

  @torm.ManyToOne(type => User)
  @torm.JoinColumn({ name: 'idAddedBy' })
  addedBy: User;
}