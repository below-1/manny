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

export interface ItemUpdateInput {
  nama: string;
  avatar: string;
  deskripsi: string;
  idCabang: number;
  dijual: boolean;
  hargaJual: number;
  hargaBeli: number;
  satuanBerat: string;
  berat: number;
  brand: string;
}

export interface ItemCreateInput {
  nama: string;
  avatar: string;
  deskripsi: string;
  hargaJual: number;
  idCabang: number;
  dijual: boolean;
  hargaBeli: number;
  satuanBerat: string;
  berat: number;
  brand: string;

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

export interface WithBox {
  box: Box;
  services: any;
}

export interface CreateCabangInput {
  nama: string;
  avatar: string;
  alamat: string;
}

export interface CreateBarbermenInput {
  nama: string;
  avatar: string;
  idCabang: number;
}

export interface CreatePaketJasaInput {
  nama: string;
  items: string[];
  estimasiWaktu: number;
  listCabang: number[];
  avatar: string;
  harga: number;
}

export interface UpdatePaketJasaInput {
  nama: string;
  items: string[];
  estimasiWaktu: number;
  avatar: string;
  listCabang: number[];
  harga: number;
  keterangan: string;
}

export interface CreateAdminInput {
  username: string;
  nama: string;
  idsCabang: number[];
}

export interface TimeSortable {
  waktu: Date;
}

export interface TimelineOptions extends PaginationOption {
  idCabang: number;
}