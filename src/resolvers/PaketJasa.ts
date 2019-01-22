import {
  WithBox,
  CreatePaketJasaInput,
  PaginationOption,
  Box
} from '../types';
import * as torm from 'typeorm';
import * as models from '../models';

export default async function ({ box } : { box: Box }) {
  return {
    Query: {
      paketJasaById: async (_: any, { id }) => {
        let result: any = await (
          box.repo.paketJasa.findOne(id, { relations: ["listCabang"] })
        );
        result.cabang = result.listCabang;
        return result;
      }
    },
    Mutation: {
      createPaketJasa: async (_: any, { payload } : { payload: CreatePaketJasaInput }) => {
        let _payload: any = { ...payload, idsCabang: payload.listCabang };
        delete _payload.listCabang;
        _payload.items = JSON.stringify(_payload.items);
        let result = await box.repo.paketJasa.create(_payload as torm.DeepPartial<models.PaketJasa>);
        result = await box.repo.paketJasa.save(_payload);
        return result;
      }
    },
    PaketJasa: {
      sessions: async (paketJasa: models.PaketJasa, { options } : { options: PaginationOption }) => {
        let result = await (
          box.repo.sesi
            .createQueryBuilder("sesi")
            .select("sesi")
            .leftJoinAndSelect("sesi.paketJasa", "pj")
            .where("pj.id = :id", { id: paketJasa.id })
            .skip(options.skip)
            .take(options.take)
            .getMany()
        );
        return result;
      }
    }
  }
}