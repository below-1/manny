import * as torm from 'typeorm';
import { Item } from './Item';
import { BaseTransaksi } from './BaseTransaksi';

@torm.Entity()
@torm.TableInheritance({ column: { type: "varchar", name: "mutasiType" } })
export class MutasiItem {
  @torm.PrimaryGeneratedColumn()
  id: number;

  @torm.Column()
  jumlah: number;

  @torm.Column({ type: 'int', nullable: false })
  idItem: number;

  @torm.ManyToOne(type => Item)
  @torm.JoinColumn({ name: 'idItem' })
  item: Item;

  @torm.Column(type => BaseTransaksi, { prefix: false })
  transaksi: BaseTransaksi;
}