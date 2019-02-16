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
        const getAddedBy = (mutation, _) => __awaiter(this, void 0, void 0, function* () {
            let idAddedBy = mutation.idAddedBy;
            return yield box.repo.user.findOne(idAddedBy);
        });
        const getItem = (pembelian, __) => __awaiter(this, void 0, void 0, function* () {
            return yield box.repo.item.findOne(pembelian.idItem);
        });
        function createListItem(filter) {
            return function _listItem(_, { idCabang, options }) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result = yield box.repo.item.find({
                        where: Object.assign({ idCabang: idCabang }, filter),
                        skip: options.skip,
                        take: options.take
                    });
                    return result;
                });
            };
        }
        return {
            Query: {
                itemById: (_, { id }, ctx) => __awaiter(this, void 0, void 0, function* () {
                    let item = yield box.repo.item.findOne(id);
                    return item;
                }),
                mutationsByItem: (_, { idItem, options: { skip, take } }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.mutationFor(idItem, { skip, take });
                    return result;
                }),
                mutationById: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.mutationById(id);
                    return result;
                }),
                listItem: createListItem({}),
                listProduk: createListItem({ dijual: true })
            },
            Mutation: {
                buyNewItem: (_, { payload }, ctx) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.buyNewItem(payload);
                    return result;
                }),
                buyMoreItem: (_, { payload }, ctx) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.buyMoreItem(payload);
                }),
                deleteItem: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
                    yield service.deleteItem(id);
                    return 1;
                }),
                sellItem: (_, { payload }, ctx) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.sellItem(payload);
                }),
                useItem: (_, { payload }, ctx) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.useItem(payload);
                }),
                updateItem: (_, { id, payload }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.updateItem(id, payload);
                }),
                updateMutation: (_, { idMutasi, payload }) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.updateMutasiFor(idMutasi, payload);
                    return 1;
                })
            },
            Item: {
                stock: (item, __) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield service.stockOf(item.id);
                    return result;
                }),
                mutations: (item, { skip, take }) => __awaiter(this, void 0, void 0, function* () {
                    return yield service.mutationFor(item.id, { skip, take });
                })
            },
            Pembelian: {
                item: getItem,
                addedBy: getAddedBy
            },
            Penjualan: {
                item: getItem,
                addedBy: getAddedBy
            },
            Penggunaan: {
                item: getItem,
                addedBy: getAddedBy
            }
        };
    });
}
exports.default = default_1;
;
//# sourceMappingURL=Inventory.js.map