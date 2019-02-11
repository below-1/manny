import {
  Box,
  PaginationOption,
  CreateAdminInput,
  TimeSortable
} from '../types';
import * as torm from 'typeorm';
import * as models from '../models';

export default async function ({ box } : { box: Box }) {

  async function findMutations (user: models.User, options: PaginationOption) : Promise<models.MutasiItem[]> {
    if (user.kategori == 'CUSTOMER') return [];
    let list = await box.repo.mutasiItem.find({ 
      ...options,
      relations: ['item'],
      where: {
        idAddedBy: user.id
      }
    });

    return list.map(it => {
      if (it instanceof models.Penggunaan) return it as models.Penggunaan
      if (it instanceof models.Penjualan) return it as models.Penjualan
      if (it instanceof models.Pembelian) return it as models.Pembelian
    })
  }

  async function findSession(user: models.User, options: PaginationOption) : Promise<models.Sesi[]> {
    if (user.kategori == 'CUSTOMER') {
      return await box.repo.sesi.find({ 
        ...options,
        where: {
          idForUser: user.id
        }
      });
    }
    let result = await box.repo.sesi.find({ 
      ...options,
      where: {
        idAddedBy: user.id
      }
    });
    result = result.map(it => {
      it.waktu = it.scheduledStartTime;
      return it;
    })
    return result;
  }

  return {
    Query: {
      listUser: async (_: any, { options } : { options: PaginationOption }) => {
        return await (
          box.repo.user.find()
        );
      },
      userById: async (_: any, { id }) => {
        let result: any = await (
          box.repo.user.findOne(id)
        );
        return result;
      },
      findUser: async (_: any, { keyword }) => {
        let k = `%${keyword.toUpperCase()}%`
        let result = await box.repo.user.createQueryBuilder('user')
          .where('UPPER(user.nama) LIKE :keyword', { keyword: k })
          .andWhere('user.kategori = :kat', { kat: 'CUSTOMER' })
          .take(30)
          .getMany()
        return result
      }
    },
    Mutation: {
      signUpCustomer: async (_: any, { name, avatar }) => {
        let username = name.replace(/\s\s+/g, '')
        let payload = { nama: name, username, kategori: 'CUSTOMER', avatar }
        let result = await box.repo.user.create(payload as torm.DeepPartial<models.User>);
        result = await box.repo.user.save(result);
        return result;
      },
      signUpAdmin: async (_: any, { payload } : { payload: CreateAdminInput }) => {
        // Setting the role and default password
        let x = { kategori: 'ADMIN', password: payload.username };
        let _payload = Object.assign(x, payload);
        let result = await box.repo.user.create(_payload as torm.DeepPartial<models.User>);
        result = await box.repo.user.save(result);
        return result;
      },
      deleteCustomer: async (_ : any, { id }) => {
        await box.repo.user.delete(id)
        return 1
      }
    },
    User: {
      transaksi: async (user: models.User, { options } : { options: PaginationOption }) => {
        let mutations = (await findMutations(user, options)) as TimeSortable[];
        let sessions = (await findSession(user, options)) as TimeSortable[];
        let result = mutations.concat(sessions);
        result = result.sort((a, b) => (a.waktu).getTime() - (b.waktu).getTime());
        return result.slice(0, options.take);
      },
      kunjunganTerakhir: async (user: models.User) => {
        let temp = await (
          box.repo.sesi
            .createQueryBuilder("sesi")
            .select("sesi.scheduledStartTime")
            .leftJoinAndSelect("sesi.forUser", "user")
            .where("user.id = :id", { id: user.id })
            .orderBy("sesi.scheduledStartTime")
            .getOne()
        )
        return temp.scheduledStartTime
      },
      totalKunjungan: async (user: models.User) => {
        return await (
          box.repo.sesi
            .createQueryBuilder("sesi")
            .select("sesi")
            .leftJoinAndSelect("sesi.forUser", "user")
            .where("user.id = :id", { id: user.id })
            .getCount()
        )
      },
      sessions: async (user: models.User, { options } : { options: PaginationOption }) => {
        let result = await (
          box.repo.sesi
            .createQueryBuilder("sesi")
            .select("sesi")
            .leftJoinAndSelect("sesi.forUser", "user")
            .where("user.id = :id", { id: user.id })
            .skip(options.skip)
            .take(options.take)
            .getMany()
        );
        return result
      }
    }
  }
}