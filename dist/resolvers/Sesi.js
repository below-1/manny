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
function default_1(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { box, service } = options;
        return {
            Query: {
                listSessionInRange: (_, { options }) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield service.listSessionInRange(options);
                    // Change forUser to user
                    return result.map((it) => {
                        it.user = it.forUser;
                        return it;
                    });
                }),
                sessionById: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.sessionById(id);
                    result.user = result.forUser;
                    return result;
                }),
                nextSession: (_, __) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.nextSession();
                    if (!result)
                        return null;
                    return result;
                }),
                lastSession: (_, __) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.lastSession();
                    if (!result)
                        return null;
                    return result;
                }),
                countPerState: (_, __) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.countPerState();
                })
            },
            Mutation: {
                openSession: (_, { payload }, ctx) => __awaiter(this, void 0, void 0, function* () {
                    console.log(payload);
                    return yield service.openSession(payload);
                }),
                cancelSession: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.cancelSession(id);
                }),
                startSession: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.startSession(id);
                }),
                endSession: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.endSession(id);
                }),
                revertSession: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.revertSession(id);
                }),
                rescheduleSession: (_, { id, start }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.rescheduleSession(id, { start });
                }),
                rateSession: (_, { id, rating }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.rateSession(id, rating);
                }),
                deleteSession: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    yield service.deleteSession(id);
                    return 1;
                })
            },
            Sesi: {
                paketJasa: (sesi, __) => __awaiter(this, void 0, void 0, function* () {
                    return yield box.repo.paketJasa.findOne(sesi.idPaketJasa);
                }),
                user: (sesi, __) => __awaiter(this, void 0, void 0, function* () {
                    return yield box.repo.user.findOne(sesi.idForUser);
                }),
                addedBy: (sesi, __) => __awaiter(this, void 0, void 0, function* () {
                    return yield box.repo.user.findOne(sesi.idAddedBy);
                }),
                barbermen: (sesi, __) => __awaiter(this, void 0, void 0, function* () {
                    return yield box.repo.barbermen.findOne(sesi.idBarbermen);
                })
            }
        };
    });
}
exports.default = default_1;
;
//# sourceMappingURL=Sesi.js.map