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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Cabang_1 = require("./Cabang");
let Item = class Item {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "nama", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "deskripsi", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "satuanHarga", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Item.prototype, "hargaBeli", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "satuanBerat", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Item.prototype, "berat", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "brand", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Item.prototype, "dijual", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Item.prototype, "idCabang", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Item.prototype, "hargaJual", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Cabang_1.Cabang),
    typeorm_1.JoinColumn({ name: 'idCabang' }),
    __metadata("design:type", Cabang_1.Cabang)
], Item.prototype, "cabang", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "avatar", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Item.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Item.prototype, "updatedAt", void 0);
Item = __decorate([
    typeorm_1.Entity()
], Item);
exports.Item = Item;
//# sourceMappingURL=Item.js.map