/**
* Go raging. No abstraction. Pure Hack... Enjoy it!
*/
import * as torm from 'typeorm';
import * as models from './models';
import mainResolverFn from './resolvers';
import mainRoutesFn from './routes';
// import * as express from 'express'
import * as fs from 'fs';
import * as util from 'util';
import * as services from './services';

const cmdline = require('node-cmdline-parser')
const PORT = cmdline.get('port')
const MODE = cmdline.get('mode')
console.log('port:', PORT)
console.log('mode:', MODE)

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// Load the config
const config = require('../config')
const dbConfig = config[MODE]['db']

import {
  Box
} from './types';

import {
  ApolloServer,
  makeExecutableSchema
} from 'apollo-server-express';

const readFile = util.promisify(fs.readFile);

export async function createDbConnection({ sync }) : Promise<Box> {
  const entities = [
    models.Cabang,
    models.User,
    models.Barbermen,
    models.Jasa,
    models.PaketJasa,
    models.Sesi,
    models.Picture,
    models.Item,
    models.MutasiItem,
    models.Media,
    models.Pembelian,
    models.Penjualan,
    models.Penggunaan
  ];
  const dbConn: torm.Connection = await torm.createConnection({
    ...dbConfig,
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
      item: (await dbConn.getRepository<models.Item>(models.Item)),
      mutasiItem: (await dbConn.getRepository<models.MutasiItem>(models.MutasiItem)),
      pembelian: (await dbConn.getRepository<models.Pembelian>(models.Pembelian)),
      penjualan: (await dbConn.getRepository<models.Penjualan>(models.Penjualan)),
      penggunaan: (await dbConn.getRepository<models.Penggunaan>(models.Penggunaan))
    }
  };
}

export async function startServer() {
  const db = await createDbConnection({ sync: true });

  const resolverArgs = {
    box: db,
    inventory: new services.Inventory(db),
    sesi: new services.Sesi(db.connection)
  };

  const resolvers = await mainResolverFn(resolverArgs);
  const textGql = (await readFile('schema.graphql')).toString();

  const schema = makeExecutableSchema({
    typeDefs: textGql,
    resolvers: resolvers
  });
  const apolloServer = new ApolloServer({ schema });

  const expressApp = express();
  expressApp.use(cors());
  expressApp.use(fileUpload());
  expressApp.use(express.static('static'));
  apolloServer.applyMiddleware({ app: expressApp });

  const routesOptions = {
    app: expressApp,
    context: db
  }
  const Routes = await mainRoutesFn(routesOptions);

  expressApp.listen({ port: PORT }, () => {
    console.log(`SERVER RUN AT ${PORT}`);
  });

}