import * as torm from 'typeorm';
import * as models from '../models';
import {
  CreateBarbermenInput,
  PaginationOption,
  CreatePaketJasaInput,
  TimeSortable,
  TimelineOptions,
  Box
} from '../types';

export default async function ({ box } : { box: Box }) {

  async function findMutations (idCabang: number, options: PaginationOption) : Promise<models.MutasiItem[]> {
    let list = await box.repo.mutasiItem.find({ 
      ...options,
      relations: ['cabang'],
      where: {
        idCabang
      }
    });

    return list.map(it => {
      if (it instanceof models.Penggunaan) return it as models.Penggunaan
      if (it instanceof models.Penjualan) return it as models.Penjualan
      if (it instanceof models.Pembelian) return it as models.Pembelian
    })
  }

  async function findSession(idCabang: number, options: PaginationOption) : Promise<models.Sesi[]> {
    return await box.repo.sesi.find({ 
      ...options,
      where: {
        idCabang
      }
    });
  }

  return {
    Query: {
      timeline: async (_: any, { idCabang, options }) => {
        let cabang = await box.repo.cabang.findOne(idCabang);
        let pageOptions = options;
        let mutations = (await findMutations(idCabang, pageOptions)) as TimeSortable[];
        let sessions = (await findSession(idCabang, pageOptions)) as TimeSortable[];
        let result = mutations.concat(sessions);
        result = result.sort((a, b) => (a.waktu).getTime() - (b.waktu).getTime());
        return result.slice(0, options.take);
      }
    },
    Mutation: {
    },
    MutasiItem: {
      __resolveType(obj, context, info) {
        // return 'MutasiItem'
        if (obj.type === 'Pembelian') return 'Pembelian';
        if (obj.type === 'Penjualan') return 'Penjualan';
        if (obj.type === 'Penggunaan') return 'Penggunaan';
        else {
          console.log('This can not happen')
          console.log(obj)
        }
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