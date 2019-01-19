import { 
  Entity, PrimaryGeneratedColumn,
  Column, JoinColumn,
  ManyToOne, OneToMany,
  ManyToMany, JoinTable } from 'typeorm';
import { Cabang } from './Cabang';
import { PaketJasa } from './PaketJasa';
import { Barbermen } from './Barbermen';
import { User } from './User';
import { BaseTransaksi } from './BaseTransaksi';

export enum SesiState {
  SCHEDULED,
  ONGOING,
  DONE,
  CANCELED
}

@Entity()
export class Sesi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  scheduledStartTime: Date;

  @Column('timestamp')
  scheduledEndTime: Date;

  @Column('timestamp')
  executionStartTime: Date;

  @Column('timestamp')
  executionEndTime: Date;

  @Column('enum', { enum: SesiState })
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

  @Column(type => BaseTransaksi, { prefix: false })
  transaksi: BaseTransaksi;

  @Column({ type: 'int', nullable: false })
  idPaketJasa: number;
  @ManyToOne(type => PaketJasa)
  @JoinColumn({ name: 'idPaketJasa' })
  paketJasa: PaketJasa;

  @Column({ type: 'int', nullable: false })
  idCabang: number;
}