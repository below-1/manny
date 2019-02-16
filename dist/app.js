"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Go raging. No abstraction. Pure Hack... Enjoy it!
*/
const torm = __importStar(require("typeorm"));
const models = __importStar(require("./models"));
const resolvers_1 = __importDefault(require("./resolvers"));
const routes_1 = __importDefault(require("./routes"));
// import * as express from 'express'
const fs = __importStar(require("fs"));
const util = __importStar(require("util"));
const services = __importStar(require("./services"));
const cmdline = require('node-cmdline-parser');
const PORT = cmdline.get('port');
const MODE = cmdline.get('mode');
console.log('port:', PORT);
console.log('mode:', MODE);
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
// Load the config
const config = require('../config');
const dbConfig = config[MODE]['db'];
const apollo_server_express_1 = require("apollo-server-express");
const readFile = util.promisify(fs.readFile);
function createDbConnection({ sync }) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const dbConn = yield torm.createConnection(Object.assign({}, dbConfig, { entities }));
        const cabang = dbConn.getRepository(models.Cabang);
        const barbermen = dbConn.getRepository(models.Barbermen);
        return {
            connection: dbConn,
            repo: {
                cabang: (yield dbConn.getRepository(models.Cabang)),
                barbermen: (yield dbConn.getRepository(models.Barbermen)),
                paketJasa: (yield dbConn.getRepository(models.PaketJasa)),
                sesi: (yield dbConn.getRepository(models.Sesi)),
                user: (yield dbConn.getRepository(models.User)),
                item: (yield dbConn.getRepository(models.Item)),
                mutasiItem: (yield dbConn.getRepository(models.MutasiItem)),
                pembelian: (yield dbConn.getRepository(models.Pembelian)),
                penjualan: (yield dbConn.getRepository(models.Penjualan)),
                penggunaan: (yield dbConn.getRepository(models.Penggunaan))
            }
        };
    });
}
exports.createDbConnection = createDbConnection;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield createDbConnection({ sync: true });
        const resolverArgs = {
            box: db,
            inventory: new services.Inventory(db),
            sesi: new services.Sesi(db.connection)
        };
        const resolvers = yield resolvers_1.default(resolverArgs);
        const textGql = (yield readFile('schema.graphql')).toString();
        const schema = apollo_server_express_1.makeExecutableSchema({
            typeDefs: textGql,
            resolvers: resolvers
        });
        const apolloServer = new apollo_server_express_1.ApolloServer({ schema });
        const expressApp = express();
        expressApp.use(cors());
        expressApp.use(fileUpload());
        expressApp.use(express.static('static'));
        apolloServer.applyMiddleware({ app: expressApp });
        const routesOptions = {
            app: expressApp,
            context: db
        };
        const Routes = yield routes_1.default(routesOptions);
        expressApp.listen({ port: PORT }, () => {
            console.log(`SERVER RUN AT ${PORT}`);
        });
    });
}
exports.startServer = startServer;
//# sourceMappingURL=app.js.map