/**
* Go raging. No abstraction. Pure Hack... Enjoy it!
*/
import * as torm from 'typeorm';
import * as models from './models';
import * as inventory from './inventory';
import * as fs from 'fs';
import * as util from 'util';
const express = require('express');
import {
  Box
} from './types';
import {
  ApolloServer,
  makeExecutableSchema
} from 'apollo-server-express';

const readFile = util.promisify(fs.readFile);

export async function createDbConnection() : Promise<Box> {
  const entities = [
    models.Cabang,
    models.User,
    models.Barbermen,
    models.Jasa,
    models.PaketJasa,
    models.Transaksi,
    models.Sesi,
    models.Picture,
    models.Item,
    models.MutasiItem,
    models.Media,
    models.BaseTransaksi,
    models.Pembelian,
    models.Penjualan,
    models.Penggunaan
  ];
  const dbConn: torm.Connection = await torm.createConnection({
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    port: 3306,
    database: 'manliest-db',
    synchronize: true,
    logging: true,
    entities
  });

  const cabang = dbConn.getRepository<models.Cabang>(models.Cabang);
  const barbermen = dbConn.getRepository<models.Barbermen>(models.Barbermen);
  return {
    connection: dbConn,
    repo: {
      cabang: (await dbConn.getRepository<models.Cabang>(models.Cabang)),
      barbermen: (await dbConn.getRepository<models.Barbermen>(models.Barbermen)),
      paketJasa: (await dbConn.getRepository<models.PaketJasa>(models.PaketJasa)),
      sesi: (await dbConn.getRepository<models.Sesi>(models.Sesi)),
      user: (await dbConn.getRepository<models.User>(models.User)),
      mutasiItem: (await dbConn.getRepository<models.MutasiItem>(models.MutasiItem)),
      item: (await dbConn.getRepository<models.Item>(models.Item)),
      pembelian: (await dbConn.getRepository<models.Pembelian>(models.Pembelian)),
      penjualan: (await dbConn.getRepository<models.Penjualan>(models.Penjualan)),
      penggunaan: (await dbConn.getRepository<models.Penggunaan>(models.Penggunaan)),
      transaksi: (await dbConn.getRepository<models.Transaksi>(models.Transaksi))
    }
  };
}

export async function startServer() {
  const db = await createDbConnection();

  const inventoryService = new inventory.Inventory(db);
  const inventoryResolver = await inventory.Resolver({ box: db, service: inventoryService });

  const textGql = (await readFile('./src/schema.graphql')).toString();
  const schema = makeExecutableSchema({
    typeDefs: textGql,
    resolvers: inventoryResolver
  });
  const apolloServer = new ApolloServer({ schema });

  const expressApp = express();
  apolloServer.applyMiddleware({ app: expressApp });

  expressApp.listen({ port: 4000 }, () => {
    console.log(`SERVER RUN AT 4000`);
  });

}