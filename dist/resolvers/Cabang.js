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
        return {
            Query: {
                listCabang: (_, __) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield (box.repo.cabang.find());
                    return result;
                }),
                cabangById: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield (box.repo.cabang.findOne(id));
                    return result;
                })
            },
            Mutation: {
                createCabang: (_, { payload }, ctx) => __awaiter(this, void 0, void 0, function* () {
                    let cabangInput = yield box.repo.cabang.create(payload);
                    let result = yield box.repo.cabang.save(cabangInput);
                    return result;
                }),
                updateCabang: (_, { id, payload }) => __awaiter(this, void 0, void 0, function* () {
                    let cabang = yield box.repo.cabang.findOne(id);
                    if (!cabang) {
                        throw Error('can not find cabang');
                    }
                    cabang.nama = payload.nama;
                    cabang.alamat = payload.alamat;
                    return cabang;
                })
            },
            Cabang: {
                listBarbermen: (cabang, __) => __awaiter(this, void 0, void 0, function* () {
                    return yield (box.repo.barbermen.find({
                        where: {
                            idCabang: cabang.id
                        }
                    }));
                }),
                listPaketJasa: (cabang, __) => __awaiter(this, void 0, void 0, function* () {
                    let result;
                    try {
                        let xs = (yield box.connection.createQueryBuilder(models.Cabang, "cabang")
                            .leftJoinAndSelect("cabang.listPaketJasa", "pj")
                            .where("cabang.id = :id", { id: cabang.id })
                            .getOne());
                        result = xs.listPaketJasa;
                        console.log(result);
                    }
                    catch (err) {
                        console.log(err);
                        throw err;
                    }
                    // console.log(result);
                    return result;
                })
            }
        };
    });
}
exports.default = default_1;
//# sourceMappingURL=Cabang.js.map