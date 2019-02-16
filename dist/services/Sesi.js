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
const moment = __importStar(require("moment"));
class Sesi {
    constructor(connection) {
        this.connection = connection;
        this.sessionRepo = this.connection.getRepository(models.Sesi);
    }
    sessionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sessionRepo.findOne(id, {
                relations: ['barbermen', 'forUser', 'addedBy']
            });
        });
    }
    listSessionInRange(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let { start, end } = payload;
            let states = payload.states.map(s => models.SesiState[s]);
            let query = this.connection.createQueryBuilder()
                .select('sesi')
                .from(models.Sesi, 'sesi')
                .leftJoinAndSelect("sesi.addedBy", "addedBy")
                .leftJoinAndSelect("sesi.forUser", "user")
                .leftJoinAndSelect("sesi.barbermen", "barbermen")
                .where("sesi.scheduledStartTime > :start", { start })
                .andWhere("sesi.scheduledStartTime < :end", { end })
                .orderBy("sesi.scheduledStartTime", "DESC");
            // Ignore state filter if states is empty.
            let result = (states.length == 0)
                ? yield query.getMany()
                : yield query.andWhere("sesi.state IN (:states)", { states }).getMany();
            console.log(result);
            return result;
        });
    }
    listSessionInSimpleRange(idCabang, payload) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Book the session.
    */
    openSession(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let end = yield this.getEndTimeByPaketJasa(payload.idPaketJasa, payload.start);
            let sessionInput = {
                idCabang: payload.idCabang,
                idBarbermen: payload.idBarbermen,
                scheduledStartTime: payload.start,
                scheduledEndTime: end,
                idForUser: payload.idForUser,
                idAddedBy: payload.idAddedBy,
                idPaketJasa: payload.idPaketJasa,
                state: models.SesiState.SCHEDULED
            };
            let session = this.sessionRepo.create(sessionInput);
            // If session.date > currentDate: throw Error;
            session = yield this.sessionRepo.save(session);
            return session;
        });
    }
    changeState(idSesi, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield this.sessionRepo.findOne(idSesi);
            session.state = state;
            yield this.sessionRepo.save(session);
            return session;
        });
    }
    cancelSession(idSesi) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield this.sessionRepo.findOne(idSesi);
            if (session.state == models.SesiState.DONE) {
                throw new Error('Session already ended. Revert it first');
            }
            if (session.state == models.SesiState.ONGOING) {
                throw new Error('Session already started. Revert it first');
            }
            return this.changeState(idSesi, models.SesiState.CANCELED);
        });
    }
    startSession(idSesi) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield this.sessionRepo.findOne(idSesi);
            if (session.state == models.SesiState.DONE) {
                throw new Error('Session already ended. Revert it first');
            }
            if (session.state == models.SesiState.CANCELED) {
                throw new Error('Session already cancelled. Revert it first');
            }
            if (session.state == models.SesiState.ONGOING) {
                // Just return the current session
                return session;
            }
            session.state = models.SesiState.ONGOING;
            session.executionStartTime = new Date();
            session.executionEndTime = null;
            session = yield this.sessionRepo.save(session);
            return session;
        });
    }
    endSession(idSesi) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield this.sessionRepo.findOne(idSesi);
            if (session.state == models.SesiState.DONE) {
                throw new Error('Session already ended. Revert it first');
            }
            if (session.state == models.SesiState.CANCELED) {
                throw new Error('Session already cancelled. Revert it first');
            }
            if (session.state == models.SesiState.SCHEDULED) {
                throw new Error('Session not yet started. Start it first!');
            }
            if (!session.executionStartTime) {
                throw new Error(`Execution time is not defined ${session.executionStartTime}`);
            }
            session.state = models.SesiState.DONE;
            session.executionEndTime = new Date();
            // Add nominal based on package
            const repo = this.connection.getRepository(models.PaketJasa);
            const pj = yield repo.findOne(session.idPaketJasa);
            // session.nominal = pj.harga;
            session = yield this.sessionRepo.save(session);
            return session;
        });
    }
    revertSession(idSesi) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield this.sessionRepo.findOne(idSesi);
            session.state = models.SesiState.SCHEDULED;
            session.executionStartTime = null;
            session.executionEndTime = null;
            session = yield this.sessionRepo.save(session);
            return session;
        });
    }
    rescheduleSession(idSesi, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield this.sessionRepo.findOne(idSesi);
            let end = yield this.getEndTimeByPaketJasa(session.idPaketJasa, payload.start);
            session.state = models.SesiState.SCHEDULED;
            session.scheduledStartTime = payload.start;
            session.scheduledEndTime = end;
            session.executionStartTime = null;
            session.executionEndTime = null;
            session = yield this.sessionRepo.save(session);
            return session;
        });
    }
    rateSession(idSesi, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield this.sessionRepo.findOne(idSesi);
            if (session.state != models.SesiState.DONE) {
                throw new Error('Session is not DONE.');
            }
            session.rating = rating;
            session = yield this.sessionRepo.save(session);
            return session;
        });
    }
    nextSession() {
        return __awaiter(this, void 0, void 0, function* () {
            let sesi = yield this.connection.createQueryBuilder()
                .select("sesi")
                .from(models.Sesi, "sesi")
                .where("sesi.scheduledStartTime > NOW()")
                .andWhere("sesi.state = 'SCHEDULED'")
                .orderBy('sesi.scheduledStartTime', 'ASC')
                .getOne();
            return sesi;
        });
    }
    lastSession() {
        return __awaiter(this, void 0, void 0, function* () {
            let sesi = yield this.connection.createQueryBuilder()
                .select("sesi")
                .from(models.Sesi, "sesi")
                .where("sesi.scheduledStartTime < NOW()")
                .andWhere("sesi.state = 'DONE'")
                .orderBy('sesi.executionEndTime', 'DESC')
                .getOne();
            return sesi;
        });
    }
    countPerState() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.connection.createQueryBuilder()
                .select([
                "sesi.state",
                "COUNT(sesi.state) AS jumlah"
            ])
                .from(models.Sesi, "sesi")
                .groupBy("sesi.state")
                .getRawMany();
            let summary = result.reduce((acc, curr) => {
                acc[curr.sesi_state] = curr.jumlah;
                return acc;
            }, {});
            if (summary.SCHEDULED === undefined) {
                summary.SCHEDULED = 0;
            }
            if (summary.DONE === undefined) {
                summary.DONE = 0;
            }
            if (summary.ONGOING === undefined) {
                summary.ONGOING = 0;
            }
            if (summary.CANCELED === undefined) {
                summary.CANCELED = 0;
            }
            return summary;
        });
    }
    deleteSession(idSesi) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sessionRepo.delete(idSesi);
            return 1;
        });
    }
    getEndTimeByPaketJasa(idPaketJasa, start) {
        return __awaiter(this, void 0, void 0, function* () {
            const em = yield this.connection.createEntityManager();
            const paketJasa = yield em.findOne(models.PaketJasa, idPaketJasa);
            let endTime = moment.default(start).add(paketJasa.estimasiWaktu, 'minutes').toDate();
            return endTime;
        });
    }
}
exports.Sesi = Sesi;
//# sourceMappingURL=Sesi.js.map