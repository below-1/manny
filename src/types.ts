import { Connection, Repository } from 'typeorm';
import { Cabang, User, Barbermen, Jasa, PaketJasa,
    Sesi, Picture, Item, Media,
    Pembelian, Penggunaan, Penjualan, SesiState,
    MutasiItem } from './models';

import * as models from './models';

interface Repo {
  cabang: Repository<Cabang>;
  barbermen: Repository<Barbermen>;
  paketJasa: Repository<PaketJasa>;
  sesi: Repository<Sesi>;
  user: Repository<User>;
  mutasiItem: Repository<MutasiItem>;
  item: Repository<Item>;
  pembelian: Repository<Pembelian>;
  penjualan: Repository<Penjualan>;
  penggunaan: Repository<Penggunaan>;
}

export interface Box {
  connection: Connection;
  repo: Repo;
}

export interface ItemCreateInput {
  nama: string;
  avatar: string;
  deskripsi: string;
  hargaJual: number;
  idCabang: number;

  nominal: number;
  jumlah: number;
  keterangan?: string;
  waktu?: Date;
  idAddedBy: number;
}

export interface BaseTransaksiInput {
  nominal: number;
  keterangan?: string;
  waktu?: Date;
  idCabang: number;
  idAddedBy: number;
}

export interface BaseMutasiInput {
  idItem: number;
  nominal: number;
  jumlah: number;
  keterangan?: string;
  waktu?: Date;
  idAddedBy: number;
}

export interface BaseUpdateMutasiInput {
  idItem: number;
  nominal: number;
  jumlah?: number;
  keterangan?: string;
  waktu?: Date;
}

export interface SellInput extends BaseMutasiInput {
  idForUser: number;
}

export interface OpenSessionInput {
  idCabang: number;
  idBarbermen: number;
  idForUser: number;
  idAddedBy: number;
  idPaketJasa: number;
  start: Date;
}

export interface RescheduleInput {
  start: Date;
}

export interface PaginationOption {
  skip?: number;
  take?: number;
}

export interface ItemMutationsOption extends PaginationOption {
  idItem: number;
}

export interface ListSessionOptions extends PaginationOption {
  idsCabang: number[];
  states: SesiState[];
}

export interface CommonTimeFilter {
  start: Date;
  end: Date;
}

export enum SimpleTimeSelection {
  TODAY,
  THIS_WEEK,
  THIS_MONTH,
  THIS_QUARTIL,
  THIS_YEAR
}

export interface FindSessionInRangeOptions extends CommonTimeFilter {
  idCabang: number;
  states: SesiState[];
}