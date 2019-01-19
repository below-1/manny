import * as torm from 'typeorm';
import { Cabang } from './Cabang';
import { User } from './User'

export class BaseTransaksi {
  @torm.Column()
  type: string;

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
