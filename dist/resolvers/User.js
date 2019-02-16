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
        function findMutations(user, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (user.kategori == 'CUSTOMER')
                    return [];
                let list = yield box.repo.mutasiItem.find(Object.assign({}, options, { relations: ['item'], where: {
                        idAddedBy: user.id
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
        function findSession(user, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (user.kategori == 'CUSTOMER') {
                    return yield box.repo.sesi.find(Object.assign({}, options, { where: {
                            idForUser: user.id
                        } }));
                }
                let result = yield box.repo.sesi.find(Object.assign({}, options, { where: {
                        idAddedBy: user.id
                    } }));
                result = result.map(it => {
                    it.waktu = it.scheduledStartTime;
                    return it;
                });
                return result;
            });
        }
        return {
            Query: {
                listUser: (_, { options }) => __awaiter(this, void 0, void 0, function* () {
                    return yield (box.repo.user.find());
                }),
                userById: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield (box.repo.user.findOne(id));
                    return result;
                }),
                findUser: (_, { keyword }) => __awaiter(this, void 0, void 0, function* () {
                    let k = `%${keyword.toUpperCase()}%`;
                    let result = yield box.repo.user.createQueryBuilder('user')
                        .where('UPPER(user.nama) LIKE :keyword', { keyword: k })
                        .andWhere('user.kategori = :kat', { kat: 'CUSTOMER' })
                        .take(30)
                        .getMany();
                    return result;
                })
            },
            Mutation: {
                signUpCustomer: (_, { name, avatar }) => __awaiter(this, void 0, void 0, function* () {
                    let username = name.replace(/\s\s+/g, '');
                    let payload = { nama: name, username, kategori: 'CUSTOMER', avatar };
                    let result = yield box.repo.user.create(payload);
                    result = yield box.repo.user.save(result);
                    return result;
                }),
                signUpAdmin: (_, { payload }) => __awaiter(this, void 0, void 0, function* () {
                    // Setting the role and default password
                    let x = { kategori: 'ADMIN', password: payload.username };
                    let _payload = Object.assign(x, payload);
                    let result = yield box.repo.user.create(_payload);
                    result = yield box.repo.user.save(result);
                    return result;
                }),
                deleteCustomer: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    yield box.repo.user.delete(id);
                    return 1;
                })
            },
            User: {
                transaksi: (user, { options }) => __awaiter(this, void 0, void 0, function* () {
                    let mutations = (yield findMutations(user, options));
                    let sessions = (yield findSession(user, options));
                    let result = mutations.concat(sessions);
                    result = result.sort((a, b) => (a.waktu).getTime() - (b.waktu).getTime());
                    return result.slice(0, options.take);
                }),
                kunjunganTerakhir: (user) => __awaiter(this, void 0, void 0, function* () {
                    let temp = yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi.scheduledStartTime")
                        .leftJoinAndSelect("sesi.forUser", "user")
                        .where("user.id = :id", { id: user.id })
                        .orderBy("sesi.scheduledStartTime")
                        .getOne());
                    return temp.scheduledStartTime;
                }),
                totalKunjungan: (user) => __awaiter(this, void 0, void 0, function* () {
                    return yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi")
                        .leftJoinAndSelect("sesi.forUser", "user")
                        .where("user.id = :id", { id: user.id })
                        .getCount());
                }),
                sessions: (user, { options }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi")
                        .leftJoinAndSelect("sesi.forUser", "user")
                        .where("user.id = :id", { id: user.id })
                        .skip(options.skip)
                        .take(options.take)
                        .getMany());
                    return result;
                })
            }
        };
    });
}
exports.default = default_1;
//# sourceMappingURL=User.js.map