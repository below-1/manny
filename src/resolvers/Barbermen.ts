import {
  WithBox,
  CreateBarbermenInput,
  PaginationOption
} from '../types';
import * as torm from 'typeorm';
import * as models from '../models';

export default async function ({ box, services } : WithBox) {
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