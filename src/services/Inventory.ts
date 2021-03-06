import * as torm from 'typeorm';
import { DeepPartial } from 'typeorm';
import * as entities from '../models';
import {
  Box,
  BaseMutasiInput,
  BaseUpdateMutasiInput,
  ItemCreateInput,
  ItemUpdateInput,
  BaseTransaksiInput,
  SellInput,
  PaginationOption,
  ItemMutationsOption
} from '../types';

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
    let input: DeepPartial<entities.Item> = {
      nama: item.nama,
      avatar: item.avatar,
      deskripsi: item.deskripsi,
      idCabang: item.idCabang,
      dijual: item.dijual,
      hargaBeli: item.hargaBeli,
      satuanBerat: item.satuanBerat,
      brand: item.brand,
      berat: item.berat
    };

    if (input.dijual) {
      input.hargaJual = item.hargaJual;
    }

    let itemEnt = this.itemRepo.create(input);
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

  public async updateItem (id: number, item: ItemUpdateInput) : Promise<entities.Item> {
    let input: DeepPartial<entities.Item> = item
    console.log(id)
    await this.connection
      .createQueryBuilder()
      .update(entities.Item)
      .set({ ...input })
      .where("id = :id", { id })
      .execute()
    return await this.itemRepo.findOne(id)
  }

  public async buyMoreItem (payload: BaseMutasiInput) : Promise<entities.Pembelian> {
    // Get item
    let item = await this.itemRepo.findOne(payload.idItem);
    // Create transaksi
    let idCabang = item.idCabang;

    let pembelian = this.pembelianRepo.create({ 
      jumlah: payload.jumlah,
      idItem: payload.idItem,
      idCabang: idCabang,
      idAddedBy: payload.idAddedBy,
      keterangan: payload.keterangan,
      waktu: payload.waktu,

      // Nominal must be negative here
      nominal: payload.nominal * -1
    } as DeepPartial<entities.Pembelian>);

    let result = await this.pembelianRepo.save(pembelian);
    return result;
  }

  public async sellItem (payload : SellInput) : Promise<entities.Penjualan> {
    if (!(await this.stockGreaterThan(payload.idItem, payload.jumlah))) {
      throw new Error("Stock tidak mencukupi");
    }

    // Get item
    let item = await this.itemRepo.findOne(payload.idItem);
    // Create transaksi
    let idCabang = item.idCabang;

    let penjualanInput = {
      // Jumlah must be negative here
      jumlah: payload.jumlah * -1,
      idItem: payload.idItem,
      idForUser: payload.idForUser,
      idCabang,
      idAddedBy: payload.idAddedBy,
      waktu: payload.waktu,
      nominal: payload.nominal,
      keterangan: payload.keterangan
    } as DeepPartial<entities.Penjualan>;
    let penjualan = this.penjualanRepo.create(penjualanInput);
  
    return await this.penjualanRepo.save(penjualan);
  }

  public async deleteItem(id: number) : Promise<any> {
    await this.itemRepo.delete(id)
  }

  public async useItem (payload: BaseMutasiInput) : Promise<entities.Penggunaan> {
    if (!(await this.stockGreaterThan(payload.idItem, payload.jumlah))) {
      throw new Error("Stock tidak mencukupi");
    }

    // Get item
    let item = await this.itemRepo.findOne(payload.idItem);
    let idCabang = item.idCabang;
    let penggunaanInput = {
      // Jumlah must be negative
      jumlah: payload.jumlah * -1,
      idItem: payload.idItem,
      idCabang,
      idAddedBy: payload.idAddedBy,
      waktu: payload.waktu,
      keterangan: payload.keterangan,
      nominal: 0
    } as DeepPartial<entities.Penggunaan>;
    let penggunaan = this.penggunaanRepo.create(penggunaanInput);

    return await this.penggunaanRepo.save(penggunaan);
  }

  public async mutationById(idMutasi: number) : Promise<entities.MutasiItem> {
    let result = await this.connection.createQueryBuilder()
      .select("mutasi_item")
      .from(entities.MutasiItem, "mutasi_item")
      .where("mutasi_item.id = :id", { id: idMutasi })
      .getOne()
    if (result instanceof entities.Pembelian) {
      result.type = 'Pembelian'
    }
    if (result instanceof entities.Penjualan) {
      result.type = 'Penjualan'
    }
    if (result instanceof entities.Penggunaan) {
      result.type = 'Penggunaan'
    }
    return result
  }

  public async mutationFor(idItem: number, { skip = 0, take = 30 }: PaginationOption): Promise<entities.MutasiItem[]> {
    let where = { idItem };
    let options = { where, skip, take };
    let penggunaan : entities.Penggunaan[] = await this.penggunaanRepo.find({ ...options, relations: ["addedBy"] });
    let penjualan : entities.Penjualan[] = await this.penjualanRepo.find({ ...options, relations: ["forUser", "addedBy"] });
    let pembelian : entities.Pembelian[] = await this.pembelianRepo.find({ ...options, relations: ["addedBy"] });

    let result: any[] = penggunaan.concat(penjualan).concat(pembelian);

    // Sorting descending
    result = result.sort((a, b) => {
      return b.waktu.getTime() - a.waktu.getTime()
    });

    // Change (nominal) and (jumlah) accordingly
    // If row is Pembelian => change nominal to positive
    // If row is Penjualan or Penggunaan => change jumlah to positive
    result = result.map(t => {
      // let t: any = Object.assign({}, x);
      if (t instanceof entities.Penggunaan) {
        t.jumlah *= -1;
        t.type = 'Penggunaan';
        let x: any = t
      }
      if (t instanceof entities.Penjualan) {
        t.jumlah *= -1;
        t.type = 'Penjualan';
        let x: any = t
      }
      if (t instanceof entities.Pembelian) {
        t.nominal *= -1;
        t.type = 'Pembelian';
        let x: any = t
      }
      return t;
    });

    return result;
  }

  public async updateMutasiFor(idMutasi: number, payload: BaseUpdateMutasiInput) : Promise<entities.MutasiItem> {
    let em = await this.connection.createEntityManager();
    let row: entities.MutasiItem;
    row = await em.findOne<entities.MutasiItem>(entities.MutasiItem, idMutasi);

    if (row instanceof entities.Pembelian) {
      if (payload.nominal) { payload.nominal *= -1; }
    }
    if (row instanceof entities.Penjualan) {
      if (payload.jumlah) { payload.jumlah *= -1; }
    }
    if (row instanceof entities.Penggunaan) {
      if (payload.jumlah) { payload.nominal = 0; }
    }

    if (payload.nominal) row.nominal = payload.nominal;
    if (payload.keterangan) row.keterangan = payload.keterangan;
    if (payload.jumlah) row.jumlah = payload.jumlah;
    if (payload.waktu) row.waktu = payload.waktu;

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
