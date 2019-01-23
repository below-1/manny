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
        let result = await ( box.repo.cabang.find() );
        return result;
      },
      cabangById: async (_: any, { id } : { id: number }) => {
        let result = await ( box.repo.cabang.findOne(id) );
        return result;
      }
    },
    Mutation: {
      createCabang: async (_: any, { payload } : { payload: CreateCabangInput }, ctx: any) => {
        let cabangInput = await box.repo.cabang.create(payload as torm.DeepPartial<models.Cabang>);
        let result = await box.repo.cabang.save(cabangInput);
        return result;
      },
      updateCabang: async (_: any, { id, payload }) => {
        let cabang = await box.repo.cabang.findOne(id);
        if (!cabang) {
          throw Error('can not find cabang')
        }
        cabang.nama = payload.nama;
        cabang.alamat = payload.alamat;
        return cabang;
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
        let result: models.PaketJasa[];
        try {
          let xs = (
            await box.connection.createQueryBuilder(models.Cabang, "cabang")
              .leftJoinAndSelect("cabang.listPaketJasa", "pj")
              .where("cabang.id = :id", { id: cabang.id })
              .getOne()
          );
          result = xs.listPaketJasa;
        } catch (err) {
          console.log(err);
          throw err;
        }
        
        // console.log(result);
        return result;
      }
    }
  }
}