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
const Barbermen_1 = require("./Barbermen");
const PaketJasa_1 = require("./PaketJasa");
let Cabang = class Cabang {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Cabang.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Cabang.prototype, "nama", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Cabang.prototype, "alamat", void 0);
__decorate([
    typeorm_1.ManyToMany(type => PaketJasa_1.PaketJasa, pj => pj.listCabang),
    __metadata("design:type", Array)
], Cabang.prototype, "listPaketJasa", void 0);
__decorate([
    typeorm_1.RelationId((cabang) => cabang.listPaketJasa),
    __metadata("design:type", Array)
], Cabang.prototype, "idsPaketJasa", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Barbermen_1.Barbermen, barbermen => barbermen.cabang),
    __metadata("design:type", Array)
], Cabang.prototype, "listBarbermen", void 0);
Cabang = __decorate([
    typeorm_1.Entity()
], Cabang);
exports.Cabang = Cabang;
//# sourceMappingURL=Cabang.js.map