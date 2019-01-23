import {
  WithBox,
  CreateBarbermenInput,
  PaginationOption,
  Box
} from '../types';
import * as torm from 'typeorm';
import * as models from '../models';

export default async function ({ box } : { box: Box }) {
  return {
    Query: {
      barbermenById: async (_: any, { id }) => {
        return await (
          box.repo.barbermen.findOne(id, { relations: ["cabang"] })
        );
      }
    },
    Mutation: {
      createBarbermen: async (_: any, { payload } : { payload: CreateBarbermenInput }) => {
        let result = await box.repo.barbermen.create(payload as torm.DeepPartial<models.Barbermen>)
        await box.repo.barbermen.save(result)
        return result
      },
      updateBarbermen: async (_: any, { id, payload } : { id: number, payload: CreateBarbermenInput }) => {
        let barbermen = await box.repo.barbermen.findOne(id);
        if (!barbermen) throw new Error('Can not find barbermen');
        barbermen.nama = payload.nama;
        barbermen.avatar = payload.avatar;
        barbermen.idCabang = payload.idCabang;
        return barbermen;
      }
    },
    Barbermen: {
      sessions: async (barbermen: models.Barbermen, { options } : { options: PaginationOption }) => {
        let result = await (
          box.repo.sesi
            .createQueryBuilder("sesi")
            .select("sesi")
            .leftJoinAndSelect("sesi.barbermen", "barbermen")
            .where("barbermen.id = :id", { id: barbermen.id })
            .getMany()
        );
        return result;
      }
    }
  }
}