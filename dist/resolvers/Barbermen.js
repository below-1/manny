"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function default_1({ box }) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            Query: {
                barbermenById: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    return yield (box.repo.barbermen.findOne(id, { relations: ["cabang"] }));
                })
            },
            Mutation: {
                createBarbermen: (_, { payload }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield box.repo.barbermen.create(payload);
                    yield box.repo.barbermen.save(result);
                    return result;
                }),
                updateBarbermen: (_, { id, payload }) => __awaiter(this, void 0, void 0, function* () {
                    let barbermen = yield box.repo.barbermen.findOne(id);
                    if (!barbermen)
                        throw new Error('Can not find barbermen');
                    barbermen.nama = payload.nama;
                    barbermen.avatar = payload.avatar;
                    barbermen.idCabang = payload.idCabang;
                    return barbermen;
                }),
                changeBarbermenName: (_, { id, nama }) => __awaiter(this, void 0, void 0, function* () {
                    let barbermen = yield box.repo.barbermen.findOne(id);
                    if (!barbermen)
                        throw new Error('Can not find barbermen');
                    barbermen.nama = nama;
                    yield box.repo.barbermen.save(barbermen);
                    return barbermen;
                })
            },
            Barbermen: {
                sessions: (barbermen, { options }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi")
                        .leftJoinAndSelect("sesi.barbermen", "barbermen")
                        .where("barbermen.id = :id", { id: barbermen.id })
                        .skip(options.skip)
                        .take(options.take)
                        .getMany());
                    return result;
                }),
                kunjunganTerakhir: (barbermen) => __awaiter(this, void 0, void 0, function* () {
                    let temp = yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi.scheduledStartTime")
                        .leftJoinAndSelect("sesi.barbermen", "barbermen")
                        .where("barbermen.id = :id", { id: barbermen.id })
                        .orderBy("sesi.scheduledStartTime")
                        .getOne());
                    return temp.scheduledStartTime;
                }),
                totalKunjungan: (barbermen) => __awaiter(this, void 0, void 0, function* () {
                    return yield (box.repo.sesi
                        .createQueryBuilder("sesi")
                        .select("sesi")
                        .leftJoinAndSelect("sesi.barbermen", "barbermen")
                        .where("barbermen.id = :id", { id: barbermen.id })
                        .getCount());
                })
            }
        };
    });
}
exports.default = default_1;
//# sourceMappingURL=Barbermen.js.map