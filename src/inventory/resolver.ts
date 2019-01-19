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
  ItemMutationsOption
} from '../types';
import { Inventory } from './service';

export async function Resolver (options: { box: Box, service: Inventory }) {
  const { box, service } = options;
  return {
    Query: {
      mutationFor: async (_: any, input: ItemMutationsOption, ctx: any) => {
        return await service.mutationFor(input.idItem, { skip: input.skip, take: input.take });
      }
    },
    Mutation: {
      buyNewItem: async (_: any, { payload } : { payload: ItemCreateInput }, ctx: any) => {
        return await service.buyNewItem(payload);
      },
      buyMoreItem: async (_: any, input: BaseMutasiInput, ctx: any) => {
        return await service.buyMoreItem(input);
      },
      sellItem: async (_: any, input: SellInput, ctx: any) => {
        return await service.sellItem(input);
      },
      useItem: async (_: any, input: BaseMutasiInput, ctx: any) => {
        return await service.useItem(input);
      }
    }
  };
};
