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
  ItemMutationsOption,
  OpenSessionInput,
  CommonTimeFilter,
  SimpleTimeSelection,
  FindSessionInRangeOptions
} from '../types';
import { Sesi } from '../services/Sesi';

export default async function (options: { box: Box, service: Sesi }) {
  
  const { box, service } = options;

  return {
    Query: {
      listSessionInRange: async (_: any, { options } : { options: FindSessionInRangeOptions }) => {
        const result = await service.listSessionInRange(options)
        // Change forUser to user
        return result.map((it: any) => {
          it.user = it.forUser
          return it
        })
      },
      sessionById: async (_, { id } : { id: number }) => {
        let result: any = await service.sessionById(id);
        result.user = result.forUser;
        return result;
      },
      nextSession: async (_, __) => {
        let result = await service.nextSession()
        if (!result) return null
        return result
      },
      lastSession: async (_, __) => {
        let result = await service.lastSession()
        if (!result) return null
        return result
      },
      countPerState : async (_, __) => {
        return await service.countPerState()
      }
    },
    Mutation: {
      openSession: async (_: any, { payload }: { payload: OpenSessionInput }, ctx: any) => {
        console.log(payload);
        return await service.openSession(payload);
      },

      cancelSession: async (_: any, { id }) => {
        return await service.cancelSession(id);
      },
      startSession: async (_: any, { id }) => {
        return await service.startSession(id);
      },
      endSession: async (_: any, { id }) => {
        return await service.endSession(id);
      },
      revertSession: async (_: any, { id }) => {
        return await service.revertSession(id);
      },

      rescheduleSession: async (_: any, { id, start } : { id: number, start: Date }) => {
        return await service.rescheduleSession(id, { start });
      },

      rateSession: async (_: any, { id, rating } : { id: number, rating: number }) => {
        return await service.rateSession(id, rating);
      },

      deleteSession: async (_: any, { id } : { id: number }) => {
        await service.deleteSession(id);
        return 1;
      }
    },
    Sesi: {
      paketJasa: async (sesi: entities.Sesi, __ : any) => {
        return await box.repo.paketJasa.findOne(sesi.idPaketJasa);
      },
      user: async (sesi: entities.Sesi, __: any) => {
        return await box.repo.user.findOne(sesi.idForUser);
      },
      addedBy: async (sesi: entities.Sesi, __: any) => {
        return await box.repo.user.findOne(sesi.idAddedBy);
      },
      barbermen: async (sesi: entities.Sesi, __: any) => {
        return await box.repo.barbermen.findOne(sesi.idBarbermen);
      }
    }
  };
};
