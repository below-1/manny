import * as torm from 'typeorm';
import { DeepPartial } from 'typeorm';
import * as entities from '../models';
import {
  Box,
  BaseMutasiInput,
  BaseUpdateMutasiInput,
  ItemCreateInput,
  BaseTransaksiInput,
  SellInput,
  PaginationOption,
  ItemMutationsOption
} from '../types';

function transaksi(btInput: BaseTransaksiInput) : entities.BaseTransaksi {
  let bt = new entities.BaseTransaksi();
  bt.embedded_idAddedBy = btInput.idAddedBy;
  bt.embedded_idCabang = btInput.idCabang;
  bt.nominal = btInput.nominal;
  bt.waktu = btInput.waktu;
  bt.keterangan = btInput.keterangan;
  return bt;
}

export class Inventory {

  private itemRepo: torm.Repository<entities.Item>;
  private pembelianRepo: torm.Repository<entities.Pembelian>;
  private penggunaanRepo: torm.Repository<entities.Penggunaan>;
  private penjualanRepo: torm.Repository<entities.Penjualan>;
  private connection: torm.Connection;

  constructor (box: Box) {
    this.itemRepo = box.repo.item;
    this.pembelianRepo = box.repo.pembelian;
    this.penjualanRepo = box.repo.penjualan;
    this.penggunaanRepo = box.repo.penggunaan;
    this.connection = box.connection;
  }

  public async buyNewItem (item: ItemCreateInput) : Promise<entities.Item> {
    // Create item
    console.log(item);
    let input: DeepPartial<entities.Item> = {
      nama: item.nama,
      avatar: item.avatar,
      hargaJual: item.hargaJual,
      deskripsi: item.deskripsi,
      idCabang: item.idCabang
    };
    let itemEnt = this.itemRepo.create(input);
    console.log(itemEnt);
    let result = await this.itemRepo.save(itemEnt);

    // Add first mutasi for this item.
    let mutasiInput: BaseMutasiInput = {
      idItem: result.id,
      jumlah: item.jumlah,
      keterangan: item.keterangan,
      waktu: item.waktu,
      idAddedBy: item.idAddedBy,
      nominal: item.nominal
    };

    await this.buyMoreItem(mutasiInput);

    return result;
  }

  public async buyMoreItem (payload: BaseMutasiInput) : Promise<entities.Pembelian> {
    let pembelian = this.pembelianRepo.create({ jumlah: payload.jumlah, idItem: payload.idItem } as DeepPartial<entities.Pembelian>);
    // Get item
    let item = await this.itemRepo.findOne(payload.idItem);
    // Create transaksi
    let idCabang = item.idCabang;

    pembelian.transaksi = transaksi({
      idCabang: idCabang,
      idAddedBy: payload.idAddedBy,
      keterangan: payload.keterangan,
      waktu: payload.waktu,

      // Nominal must be negative here
      nominal: payload.nominal * -1
    });

    let result = await this.pembelianRepo.save(pembelian);
    return result;
  }

  public async sellItem (payload : SellInput) : Promise<entities.Penjualan> {
    if (!(await this.stockGreaterThan(payload.idItem, payload.jumlah))) {
      throw new Error("Stock tidak mencukupi");
    }
    let penjualanInput = {
      // Jumlah must be negative here
      jumlah: payload.jumlah * -1,
      idItem: payload.jumlah,
      idForUser: payload.idForUser
    } as DeepPartial<entities.Penjualan>;
    let penjualan = this.penjualanRepo.create(penjualanInput);
  
    // Get item
    let item = await this.itemRepo.findOne(payload.idItem);
    // Create transaksi
    let idCabang = item.idCabang;
    let transaksiInput = {
      idCabang,
      idAddedBy: payload.idAddedBy,
      waktu: payload.waktu,
      nominal: payload.nominal,
      keterangan: payload.keterangan
    };
    penjualan.transaksi = transaksi(transaksiInput);
    return await this.penjualanRepo.save(penjualan);
  }

  public async useItem (payload: BaseMutasiInput) : Promise<entities.Penggunaan> {
    if (!(await this.stockGreaterThan(payload.idItem, payload.jumlah))) {
      throw new Error("Stock tidak mencukupi");
    }

    let penggunaanInput = {
      // Jumlah must be negative
      jumlah: payload.jumlah * -1,
      idItem: payload.jumlah
    } as DeepPartial<entities.Penggunaan>;
    let penggunaan = this.penggunaanRepo.create(penggunaanInput);
    // Get item
    let item = await this.itemRepo.findOne(payload.idItem);
    // Create transaksi
    let idCabang = item.idCabang;

    let transaksiInput = {
      idCabang,
      idAddedBy: payload.idAddedBy,
      waktu: payload.waktu,
      keterangan: payload.keterangan,
      nominal: 0
    };

    penggunaan.transaksi = transaksi(transaksiInput);
    return await this.penggunaanRepo.save(penggunaan);
  }

  public async mutationFor(idItem: number, { skip = 0, take = 30 }: PaginationOption): Promise<entities.MutasiItem[]> {
    let where = { idItem };
    let options = { where, skip, take };
    let penggunaan : entities.MutasiItem[] = await this.penggunaanRepo.find(options);
    let penjualan : entities.MutasiItem[] = await this.penjualanRepo.find({ ...options, relations: ["forUser"] });
    let pembelian : entities.MutasiItem[] = await this.pembelianRepo.find(options);

    let result = penggunaan.concat(penjualan).concat(pembelian);

    // Sorting descending
    result = result.sort((a, b) => a.transaksi.waktu.getMilliseconds() - b.transaksi.waktu.getMilliseconds());

    // Change (nominal) and (jumlah) accordingly
    // If row is Pembelian => change nominal to positive
    // If row is Penjualan or Penggunaan => change jumlah to positive
    result = result.map(t => {
      if (t instanceof entities.Penggunaan || t instanceof entities.Penjualan) {
        t.jumlah *= -1;
      }
      if (t instanceof entities.Pembelian) {
        t.transaksi.nominal *= -1;
      }
      return t;
    });

    return result;
  }

  public async updateMutasiFor(idMutasi: number, payload: BaseUpdateMutasiInput) : Promise<entities.MutasiItem> {
    let em = await this.connection.createEntityManager();
    let row = await em.findOne<entities.MutasiItem>(entities.MutasiItem, idMutasi);

    if (row instanceof entities.Pembelian) {
      if (payload.nominal) { payload.nominal *= -1; }
    }
    if (row instanceof entities.Penjualan) {
      if (payload.jumlah) { payload.jumlah *= -1; }
    }
    if (row instanceof entities.Penggunaan) {
      if (payload.jumlah) { payload.nominal = 0; }
    }

    if (payload.nominal) row.transaksi.nominal = payload.nominal;
    if (payload.keterangan) row.transaksi.keterangan = payload.keterangan;
    if (payload.jumlah) row.jumlah = payload.jumlah;

    let result = em.save(row);
    return result;
  }

  public async deleteMutasi(idMutasi: number) {
    let em = await this.connection.createEntityManager();
    await em.delete(entities.MutasiItem, idMutasi);
  }

  public async stockOf(idItem: number) : Promise<number> {
    const repo = this.connection.getRepository<entities.MutasiItem>(entities.MutasiItem);
    const result = await repo.createQueryBuilder("mutasi")
      .select("SUM(mutasi.jumlah)", "total")
      .where("mutasi.idItem = :idItem", { idItem })
      .getRawOne();
    return result.total;
  }

  private async stockGreaterThan(idItem: number, n: number) : Promise<boolean> {
    let currentStock = await this.stockOf(idItem);
    return currentStock > n;
  }
}
