import * as torm from 'typeorm';
import { User } from './User';
import { MutasiItem } from './MutasiItem';
import { Item } from './Item';

@torm.ChildEntity()
export class Penjualan extends MutasiItem {
  @torm.Column('int')
  idForUser: number;

  @torm.ManyToOne(type => User)
  @torm.JoinColumn({ name: 'idForUser' })
  forUser: User;
}