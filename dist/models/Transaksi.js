"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const torm = __importStar(require("typeorm"));
const Cabang_1 = require("./Cabang");
const User_1 = require("./User");
let Transaksi = class Transaksi {
};
__decorate([
    torm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Transaksi.prototype, "id", void 0);
__decorate([
    torm.Column(),
    __metadata("design:type", String)
], Transaksi.prototype, "type", void 0);
__decorate([
    torm.Column('double', { default: 0 }),
    __metadata("design:type", Number)
], Transaksi.prototype, "nominal", void 0);
__decorate([
    torm.Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Transaksi.prototype, "waktu", void 0);
__decorate([
    torm.Column({ default: '' }),
    __metadata("design:type", String)
], Transaksi.prototype, "keterangan", void 0);
__decorate([
    torm.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Transaksi.prototype, "idCabang", void 0);
__decorate([
    torm.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Transaksi.prototype, "idAddedBy", void 0);
__decorate([
    torm.ManyToOne(type => Cabang_1.Cabang),
    torm.JoinColumn({ name: 'idCabang' }),
    __metadata("design:type", Cabang_1.Cabang)
], Transaksi.prototype, "cabang", void 0);
__decorate([
    torm.ManyToOne(type => User_1.User),
    torm.JoinColumn({ name: 'idAddedBy' }),
    __metadata("design:type", User_1.User)
], Transaksi.prototype, "addedBy", void 0);
Transaksi = __decorate([
    torm.Entity(),
    torm.TableInheritance({ column: { type: "varchar", name: "type" } })
], Transaksi);
exports.Transaksi = Transaksi;
//# sourceMappingURL=Transaksi.js.map