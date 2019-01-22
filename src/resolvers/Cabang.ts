import {
  WithBox,
  CreateBarbermenInput,
  CreateCabangInput,
  PaginationOption,
  Box
} from '../types';
import * as torm from 'typeorm';
import * as models from '../models';

export default async function ({ box } : { box: Box }) {
  return {
    Query: {
      listCabang: async (_: any, __: any) => {
        return await ( box.repo.cabang.find() );
      },
      cabangById: async (_: any, { id } : { id: number }) => {
        return await ( box.repo.cabang.findOne(id) );
      }
    },
    Mutation: {
      createCabang: async (_: any, { payload } : { payload: CreateCabangInput }, ctx: any) => {
        let cabangInput = await box.repo.cabang.create(payload as torm.DeepPartial<models.Cabang>);
        let result = await box.repo.cabang.save(cabangInput);
        return result;
      }
    },
    Cabang: {
      listBarbermen: async (cabang: models.Cabang, __ : any) => {
        return await (
          box.repo.barbermen.find({
            where: {
              idCabang: cabang.id
            }
          })
        );
      },
      listPaketJasa: async (cabang: models.Cabang, __ : any) => {
        return await (
          box.repo.cabang.findOne(cabang.id, {
            relations: ['listPaketJasa']
          })
        );
      }
    }
  }
}