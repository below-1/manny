import { Box } from '../types';
import * as torm from 'typeorm';
import * as models from '../models';
import {
  CreateBarbermenInput,
  PaginationOption,
  CreatePaketJasaInput,
  TimeSortable,
  WithBox
} from '../types';

export default async function ({ box, services } : WithBox) {

  async function findMutations (cabang: models.Cabang, options: PaginationOption) : Promise<models.MutasiItem[]> {
    let list = await box.repo.mutasiItem.find({ 
      ...options,
      relations: ['cabang'],
      where: {
        idCabang: cabang.id
      }
    });

    return list.map(it => {
      if (it instanceof models.Penggunaan) return it as models.Penggunaan
      if (it instanceof models.Penjualan) return it as models.Penjualan
      if (it instanceof models.Pembelian) return it as models.Pembelian
    })
  }

  async function findSession(cabang: models.Cabang, options: PaginationOption) : Promise<models.Sesi[]> {
    return await box.repo.sesi.find({ 
      ...options,
      where: {
        idCabang: cabang.id
      }
    });
  }

  return {
    Query: {
      timeline: async (cabang: models.Cabang, { options } : { options: PaginationOption }) => {
        let mutations = (await findMutations(cabang, options)) as TimeSortable[];
        let sessions = (await findSession(cabang, options)) as TimeSortable[];
        let result = mutations.concat(sessions);
        result = result.sort((a, b) => (a.waktu).getTime() - (b.waktu).getTime());
        return result.slice(0, options.take);
      }
    },
    Mutation: {
    },
    MutasiItem: {
      __resolveType(obj, context, info) {
        if (obj.type == 'Pembelian') return 'Pembelian';
        if (obj.type == 'Penjualan') return 'Penjualan';
        if (obj.type == 'Penggunaan') return 'Penggunaan';
      }
    },
    Transaksi: {
      __resolveType(obj, context, info) {
        if (obj instanceof models.Pembelian) return 'Pembelian';
        if (obj instanceof models.Penjualan) return 'Penjualan';
        if (obj instanceof models.Penggunaan) return 'Penggunaan';
        if (obj instanceof models.Sesi) return 'Sesi';
      }
    }
  };
}