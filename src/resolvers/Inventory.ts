import * as torm from 'typeorm';
import { DeepPartial } from 'typeorm';
import * as entities from '../models';
import { 
  Box,
  BaseMutasiInput,
  BaseUpdateMutasiInput,
  ItemCreateInput,
  ItemUpdateInput,
  BaseTransaksiInput,
  SellInput,
  PaginationOption,
  ItemMutationsOption
} from '../types';
import { Inventory } from '../services/Inventory';

export default async function (options: { box: Box, service: Inventory }) {
  const { box, service } = options;

  const getAddedBy = async (mutation, _) => {
    let idAddedBy = mutation.idAddedBy
    return await box.repo.user.findOne(idAddedBy)
  }

  const getItem = async (pembelian: entities.Pembelian, __) => {
    return await box.repo.item.findOne(pembelian.idItem)
  }

  function createListItem (filter) {
    return async function _listItem (_, { idCabang, options }) {
      let result = await box.repo.item.find({
        where: {
          idCabang: idCabang,
          ...filter
        },
        skip: options.skip,
        take: options.take
      });
      return result;
    }
  }

  return {
    Query: {
      itemById: async (_: any, { id }: { id: number }, ctx: any) => {
        let item: any = await box.repo.item.findOne(id);
        return item;
      },
      mutationsByItem: async (_: any, { idItem, options: { skip, take } }) => {
        let result = await service.mutationFor(idItem, { skip, take })
        return result
      },
      mutationById: async (_: any, { id } : { id: number}) => {
        let result = await service.mutationById(id)
        return result
      },
      listItem: createListItem({}),
      listProduk: createListItem({ dijual: true })
    },
    Mutation: {
      buyNewItem: async (_: any, { payload } : { payload: ItemCreateInput }, ctx: any) => {
        let result = await service.buyNewItem(payload);
        return result;
      },
      buyMoreItem: async (_: any, { payload } : { payload: BaseMutasiInput }, ctx: any) => {
        return await service.buyMoreItem(payload);
      },
      deleteItem: async (_: any, { id } : { id: number }) => {
        await service.deleteItem(id)
        return 1
      },
      sellItem: async (_: any, { payload }: { payload: SellInput }, ctx: any) => {
        return await service.sellItem(payload);
      },
      useItem: async (_: any, { payload } : { payload: BaseMutasiInput }, ctx: any) => {
        return await service.useItem(payload);
      },
      updateItem: async (_: any, { id, payload } : { id: number, payload: ItemUpdateInput }) => {
        return await service.updateItem(id, payload)
      },
      updateMutation: async (_: any, { idMutasi, payload }: { idMutasi: number, payload: BaseUpdateMutasiInput }) => {
        let result = await service.updateMutasiFor(idMutasi, payload)
        return 1
      }
    },
    Item: {
      stock: async (item, __) => {
        let result = await service.stockOf(item.id)
        return result
      },
      mutations: async (item, { skip, take }) => {
        return await service.mutationFor(item.id, { skip, take })
      }
    },
    Pembelian: {
      item: getItem,
      addedBy: getAddedBy
    },
    Penjualan: {
      item: getItem,
      addedBy: getAddedBy
    },
    Penggunaan: {
      item: getItem,
      addedBy: getAddedBy
    }
  };
};
