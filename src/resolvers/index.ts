import { Box } from '../types';
import * as torm from 'typeorm';
import * as models from '../models';

interface WithBox {
  box: Box;
  services: any;
}

interface CreateCabangInput {
  nama: string;
  avatar: string;
  alamat: string;
}

interface CreateBarbermenInput {
  nama: string;
  avatar: string;
  idCabang: number;
}

interface CreatePaketJasaInput {
  nama: string;
  items: string[];
  estimasiWaktu: number;
  listCabang: number[];
  avatar: string;
  harga: number;
}

export default async function ({ box, services } : WithBox) {
  return {
    Query: {
    },
    Mutation: {
      createCabang: async (_: any, { payload } : { payload: CreateCabangInput }, ctx: any) => {
        let cabangInput = await box.repo.cabang.create(payload as torm.DeepPartial<models.Cabang>);
        let result = await box.repo.cabang.save(cabangInput);
        return result;
      },
      createBarbermen: async (_: any, { payload } : { payload: CreateBarbermenInput }) => {
        let result = await box.repo.barbermen.create(payload as torm.DeepPartial<models.Barbermen>);
        await box.repo.barbermen.save(result);
        return result;
      },
      createPaketJasa: async (_:any, { payload } : { payload: CreatePaketJasaInput }) => {
        let _payload: any = { ...payload, idsCabang: payload.listCabang };
        delete _payload.listCabang;
        _payload.items = JSON.stringify(_payload.items);
        let result = await box.repo.paketJasa.create(_payload as torm.DeepPartial<models.PaketJasa>);
        result = await box.repo.paketJasa.save(_payload);
        return result;
      }
    },
    MutasiItem: {
      __resolveType(obj, context, info) {
        if (obj.type == 'Pembelian') return 'Pembelian';
        if (obj.type == 'Penjualan') return 'Penjualan';
        if (obj.type == 'Penggunaan') return 'Penggunaan';
      }
    }
  };
}