import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable,
  ChildEntity } from 'typeorm';
import { Cabang } from './Cabang';
import { PaketJasa } from './PaketJasa';
import { Barbermen } from './Barbermen';
import { User } from './User';
import { Transaksi } from './Transaksi';
import { TimeSortable } from '../types';

export enum SesiState {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  DONE = 'DONE',
  CANCELED = 'CANCELED'
}

@Entity()
export class Sesi implements TimeSortable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp', { nullable: false })
  scheduledStartTime: Date;

  @Column('timestamp', { nullable: true })
  scheduledEndTime: Date;

  @Column('timestamp', { nullable: true })
  executionStartTime: Date;

  @Column('timestamp', { nullable: true })
  executionEndTime: Date;

  @Column('enum', { enum: SesiState, nullable: false, default: SesiState.SCHEDULED })
  state: SesiState;

  @Column('int')
  rating: number;

  @Column({ type: 'int', nullable: false })
  idBarbermen: number;
  @ManyToOne(type => Barbermen)
  @JoinColumn({ name: 'idBarbermen' })
  barbermen: Barbermen;

  @Column({ type: 'int', nullable: false })
  idForUser: number;
  @ManyToOne(type => User)
  @JoinColumn({ name: 'idForUser' })
  forUser: User;

  @Column({ type: 'int', nullable: false })
  idPaketJasa: number;
  @ManyToOne(type => PaketJasa)
  @JoinColumn({ name: 'idPaketJasa' })
  paketJasa: PaketJasa;

  @Column('double', { default: 0 })
  nominal: number;

  @Column('timestamp', { nullable: true })
  waktu: Date;

  @Column({ type: 'int', nullable: false })
  idCabang: number;

  @Column({ type: 'int', nullable: false })
  idAddedBy: number;

  @ManyToOne(type => Cabang)
  @JoinColumn({ name: 'idCabang' })
  cabang: Cabang;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'idAddedBy' })
  addedBy: User;
}