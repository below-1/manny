"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
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
        return {
            Query: {
                paketJasaById: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield (box.repo.paketJasa.findOne(id, { relations: ["listCabang"] }));
                    result.cabang = result.listCabang;
                    return result;
                })
            },
            Mutation: {
                createPaketJasa: (_, { payload }) => __awaiter(this, void 0, void 0, function* () {
                    return yield box.connection.transaction((em) => __awaiter(this, void 0, void 0, function* () {
                        let _payload = Object.assign({}, payload, { idsCabang: payload.listCabang });
                        delete _payload.listCabang;
                        _payload.items = JSON.stringify(_payload.items);
                        let repo = em.getRepository(models.PaketJasa);
                        let result = yield repo.create(_payload);
                        result = yield repo.save(_payload);
                        let relationRowInputs = _payload.idsCabang.map(id => ({ paketJasaId: result.id, cabangId: id }));
                        // Insert ids cabang.
                        yield em.createQueryBuilder()
                            .insert()
                            .into('paket_jasa_cabang')
                            .values(relationRowInputs)
                            .execute();
                        return result;
                    }));
                }),
                updatePaketJasa: (_, { id, payload }) => __awaiter(this, void 0, void 0, function* () {
                    return yield box.connection.transaction((em) => __awaiter(this, void 0, void 0, function* () {
                        let _payload = Object.assign({}, payload, { idsCabang: payload.listCabang });
                        delete _payload.listCabang;
                        _payload.items = JSON.stringify(_payload.items);
                        let { listCabang } = _payload, entData = __rest(_payload, ["listCabang"]);
                        let relationRowInputs = _payload.idsCabang.map(cabangId => ({ paketJasaId: id, cabangId }));
                        yield em.createQueryBuilder()
                            .update(models.PaketJasa)
                            .set(Object.assign({}, entData))
                            .where("id = :id", { id })
                            .execute();
                        yield em.createQueryBuilder()
                            .delete()
                            .from("paket_jasa_cabang")
                            .where("paketJasaId = :id", { id })
                            .execute();
                        yield em.createQueryBuilder()
                            .insert()
                            .into("paket_jasa_cabang")
                            .values(relationRowInputs)
                            .execute();
                        let result = yield em.createQueryBuilder(models.PaketJasa, "pj").where("pj.id = :id", { id }).getOne();
                        result.items = JSON.parse(result.items);
                        return result;
                    }));
                })
            },
            PaketJasa: {
                sessions: (paketJasa, { options }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi")
                        .leftJoinAndSelect("sesi.paketJasa", "pj")
                        .where("pj.id = :id", { id: paketJasa.id })
                        .skip(options.skip)
                        .take(options.take)
                        .getMany());
                    return result;
                }),
                items: (paketJasa, { options }) => __awaiter(this, void 0, void 0, function* () {
                    return JSON.parse(paketJasa.items);
                }),
                kunjunganTerakhir: (paketJasa) => __awaiter(this, void 0, void 0, function* () {
                    let temp = yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi.scheduledStartTime")
                        .leftJoinAndSelect("sesi.paketJasa", "paketJasa")
                        .where("paketJasa.id = :id", { id: paketJasa.id })
                        .orderBy("sesi.scheduledStartTime")
                        .getOne());
                    if (!temp)
                        return 'Never';
                    return temp.scheduledStartTime;
                }),
                totalKunjungan: (paketJasa) => __awaiter(this, void 0, void 0, function* () {
                    return yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi")
                        .leftJoinAndSelect("sesi.paketJasa", "paketJasa")
                        .where("paketJasa.id = :id", { id: paketJasa.id })
                        .getCount());
                })
            }
        };
    });
}
exports.default = default_1;
//# sourceMappingURL=PaketJasa.js.map