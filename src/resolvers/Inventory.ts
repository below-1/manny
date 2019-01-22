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
import { Inventory } from '../services/Inventory';

export default async function (options: { box: Box, service: Inventory }) {
  const { box, service } = options;
  return {
    Query: {
      itemById: async (_: any, { id, options: { skip, take } }: { id: number, options: PaginationOption }, ctx: any) => {
        let item: any = await box.repo.item.findOne(id);
        let mutations = await service.mutationFor(id, { skip, take });
        let stock = await service.stockOf(id);
        item.stock = stock;
        item.mutations = mutations;
        return item;
      }
    },
    Mutation: {
      buyNewItem: async (_: any, { payload } : { payload: ItemCreateInput }, ctx: any) => {
        return await service.buyNewItem(payload);
      },
      buyMoreItem: async (_: any, { payload } : { payload: BaseMutasiInput }, ctx: any) => {
        return await service.buyMoreItem(payload);
      },
      sellItem: async (_: any, { payload }: { payload: SellInput }, ctx: any) => {
        return await service.sellItem(payload);
      },
      useItem: async (_: any, input: BaseMutasiInput, ctx: any) => {
        return await service.useItem(input);
      }
    }
  };
};
