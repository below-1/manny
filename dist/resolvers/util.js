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
Object.defineProperty(exports, "__esModule", { value: true });
const models = __importStar(require("../models"));
function default_1({ box }) {
    return __awaiter(this, void 0, void 0, function* () {
        function findMutations(idCabang, options) {
            return __awaiter(this, void 0, void 0, function* () {
                let list = yield box.repo.mutasiItem.find(Object.assign({}, options, { relations: ['cabang'], where: {
                        idCabang
                    } }));
                return list.map(it => {
                    if (it instanceof models.Penggunaan)
                        return it;
                    if (it instanceof models.Penjualan)
                        return it;
                    if (it instanceof models.Pembelian)
                        return it;
                });
            });
        }
        function findSession(idCabang, options) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield box.repo.sesi.find(Object.assign({}, options, { where: {
                        idCabang
                    } }));
            });
        }
        return {
            Query: {
                timeline: (_, { idCabang, options }) => __awaiter(this, void 0, void 0, function* () {
                    let cabang = yield box.repo.cabang.findOne(idCabang);
                    let pageOptions = options;
                    let mutations = (yield findMutations(idCabang, pageOptions));
                    let sessions = (yield findSession(idCabang, pageOptions));
                    let result = mutations.concat(sessions);
                    result = result.sort((a, b) => (a.waktu).getTime() - (b.waktu).getTime());
                    return result.slice(0, options.take);
                })
            },
            Mutation: {},
            MutasiItem: {
                __resolveType(obj, context, info) {
                    // return 'MutasiItem'
                    if (obj.type === 'Pembelian')
                        return 'Pembelian';
                    if (obj.type === 'Penjualan')
                        return 'Penjualan';
                    if (obj.type === 'Penggunaan')
                        return 'Penggunaan';
                    else {
                        console.log('This can not happen');
                        console.log(obj);
                    }
                }
            },
            Transaksi: {
                __resolveType(obj, context, info) {
                    if (obj instanceof models.Pembelian)
                        return 'Pembelian';
                    if (obj instanceof models.Penjualan)
                        return 'Penjualan';
                    if (obj instanceof models.Penggunaan)
                        return 'Penggunaan';
                    if (obj instanceof models.Sesi)
                        return 'Sesi';
                }
            }
        };
    });
}
exports.default = default_1;
//# sourceMappingURL=util.js.map