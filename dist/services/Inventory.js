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
const entities = __importStar(require("../models"));
class Inventory {
    constructor(box) {
        this.itemRepo = box.repo.item;
        this.pembelianRepo = box.repo.pembelian;
        this.penjualanRepo = box.repo.penjualan;
        this.penggunaanRepo = box.repo.penggunaan;
        this.connection = box.connection;
    }
    buyNewItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create item
            let input = {
                nama: item.nama,
                avatar: item.avatar,
                deskripsi: item.deskripsi,
                idCabang: item.idCabang,
                dijual: item.dijual,
                hargaBeli: item.hargaBeli,
                satuanBerat: item.satuanBerat,
                brand: item.brand,
                berat: item.berat
            };
            if (input.dijual) {
                input.hargaJual = item.hargaJual;
            }
            let itemEnt = this.itemRepo.create(input);
            let result = yield this.itemRepo.save(itemEnt);
            // Add first mutasi for this item.
            let mutasiInput = {
                idItem: result.id,
                jumlah: item.jumlah,
                keterangan: item.keterangan,
                waktu: item.waktu,
                idAddedBy: item.idAddedBy,
                nominal: item.nominal
            };
            yield this.buyMoreItem(mutasiInput);
            return result;
        });
    }
    updateItem(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            let input = item;
            console.log(id);
            yield this.connection
                .createQueryBuilder()
                .update(entities.Item)
                .set(Object.assign({}, input))
                .where("id = :id", { id })
                .execute();
            return yield this.itemRepo.findOne(id);
        });
    }
    buyMoreItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get item
            let item = yield this.itemRepo.findOne(payload.idItem);
            // Create transaksi
            let idCabang = item.idCabang;
            let pembelian = this.pembelianRepo.create({
                jumlah: payload.jumlah,
                idItem: payload.idItem,
                idCabang: idCabang,
                idAddedBy: payload.idAddedBy,
                keterangan: payload.keterangan,
                waktu: payload.waktu,
                // Nominal must be negative here
                nominal: payload.nominal * -1
            });
            let result = yield this.pembelianRepo.save(pembelian);
            return result;
        });
    }
    sellItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.stockGreaterThan(payload.idItem, payload.jumlah))) {
                throw new Error("Stock tidak mencukupi");
            }
            // Get item
            let item = yield this.itemRepo.findOne(payload.idItem);
            // Create transaksi
            let idCabang = item.idCabang;
            let penjualanInput = {
                // Jumlah must be negative here
                jumlah: payload.jumlah * -1,
                idItem: payload.idItem,
                idForUser: payload.idForUser,
                idCabang,
                idAddedBy: payload.idAddedBy,
                waktu: payload.waktu,
                nominal: payload.nominal,
                keterangan: payload.keterangan
            };
            let penjualan = this.penjualanRepo.create(penjualanInput);
            return yield this.penjualanRepo.save(penjualan);
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.itemRepo.delete(id);
        });
    }
    useItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.stockGreaterThan(payload.idItem, payload.jumlah))) {
                throw new Error("Stock tidak mencukupi");
            }
            // Get item
            let item = yield this.itemRepo.findOne(payload.idItem);
            let idCabang = item.idCabang;
            let penggunaanInput = {
                // Jumlah must be negative
                jumlah: payload.jumlah * -1,
                idItem: payload.idItem,
                idCabang,
                idAddedBy: payload.idAddedBy,
                waktu: payload.waktu,
                keterangan: payload.keterangan,
                nominal: 0
            };
            let penggunaan = this.penggunaanRepo.create(penggunaanInput);
            return yield this.penggunaanRepo.save(penggunaan);
        });
    }
    mutationById(idMutasi) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.connection.createQueryBuilder()
                .select("mutasi_item")
                .from(entities.MutasiItem, "mutasi_item")
                .where("mutasi_item.id = :id", { id: idMutasi })
                .getOne();
            if (result instanceof entities.Pembelian) {
                result.type = 'Pembelian';
            }
            if (result instanceof entities.Penjualan) {
                result.type = 'Penjualan';
            }
            if (result instanceof entities.Penggunaan) {
                result.type = 'Penggunaan';
            }
            return result;
        });
    }
    mutationFor(idItem, { skip = 0, take = 30 }) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = { idItem };
            let options = { where, skip, take };
            let penggunaan = yield this.penggunaanRepo.find(Object.assign({}, options, { relations: ["addedBy"] }));
            let penjualan = yield this.penjualanRepo.find(Object.assign({}, options, { relations: ["forUser", "addedBy"] }));
            let pembelian = yield this.pembelianRepo.find(Object.assign({}, options, { relations: ["addedBy"] }));
            let result = penggunaan.concat(penjualan).concat(pembelian);
            // Sorting descending
            result = result.sort((a, b) => {
                return b.waktu.getTime() - a.waktu.getTime();
            });
            // Change (nominal) and (jumlah) accordingly
            // If row is Pembelian => change nominal to positive
            // If row is Penjualan or Penggunaan => change jumlah to positive
            result = result.map(t => {
                // let t: any = Object.assign({}, x);
                if (t instanceof entities.Penggunaan) {
                    t.jumlah *= -1;
                    t.type = 'Penggunaan';
                    let x = t;
                }
                if (t instanceof entities.Penjualan) {
                    t.jumlah *= -1;
                    t.type = 'Penjualan';
                    let x = t;
                }
                if (t instanceof entities.Pembelian) {
                    t.nominal *= -1;
                    t.type = 'Pembelian';
                    let x = t;
                }
                return t;
            });
            return result;
        });
    }
    updateMutasiFor(idMutasi, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let em = yield this.connection.createEntityManager();
            let row;
            row = yield em.findOne(entities.MutasiItem, idMutasi);
            if (row instanceof entities.Pembelian) {
                if (payload.nominal) {
                    payload.nominal *= -1;
                }
            }
            if (row instanceof entities.Penjualan) {
                if (payload.jumlah) {
                    payload.jumlah *= -1;
                }
            }
            if (row instanceof entities.Penggunaan) {
                if (payload.jumlah) {
                    payload.nominal = 0;
                }
            }
            if (payload.nominal)
                row.nominal = payload.nominal;
            if (payload.keterangan)
                row.keterangan = payload.keterangan;
            if (payload.jumlah)
                row.jumlah = payload.jumlah;
            if (payload.waktu)
                row.waktu = payload.waktu;
            let result = em.save(row);
            return result;
        });
    }
    deleteMutasi(idMutasi) {
        return __awaiter(this, void 0, void 0, function* () {
            let em = yield this.connection.createEntityManager();
            yield em.delete(entities.MutasiItem, idMutasi);
        });
    }
    stockOf(idItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.connection.getRepository(entities.MutasiItem);
            const result = yield repo.createQueryBuilder("mutasi")
                .select("SUM(mutasi.jumlah)", "total")
                .where("mutasi.idItem = :idItem", { idItem })
                .getRawOne();
            return result.total;
        });
    }
    stockGreaterThan(idItem, n) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentStock = yield this.stockOf(idItem);
            return currentStock > n;
        });
    }
}
exports.Inventory = Inventory;
//# sourceMappingURL=Inventory.js.map