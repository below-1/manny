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
const PaketJasa_1 = require("./PaketJasa");
const Barbermen_1 = require("./Barbermen");
const User_1 = require("./User");
var SesiState;
(function (SesiState) {
    SesiState["SCHEDULED"] = "SCHEDULED";
    SesiState["ONGOING"] = "ONGOING";
    SesiState["DONE"] = "DONE";
    SesiState["CANCELED"] = "CANCELED";
})(SesiState = exports.SesiState || (exports.SesiState = {}));
let Sesi = class Sesi {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Sesi.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('timestamp', { nullable: false }),
    __metadata("design:type", Date)
], Sesi.prototype, "scheduledStartTime", void 0);
__decorate([
    typeorm_1.Column('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Sesi.prototype, "scheduledEndTime", void 0);
__decorate([
    typeorm_1.Column('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Sesi.prototype, "executionStartTime", void 0);
__decorate([
    typeorm_1.Column('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Sesi.prototype, "executionEndTime", void 0);
__decorate([
    typeorm_1.Column('enum', { enum: SesiState, nullable: false, default: SesiState.SCHEDULED }),
    __metadata("design:type", String)
], Sesi.prototype, "state", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Sesi.prototype, "rating", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Sesi.prototype, "idBarbermen", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Barbermen_1.Barbermen, {
        onDelete: 'CASCADE'
    }),
    typeorm_1.JoinColumn({ name: 'idBarbermen' }),
    __metadata("design:type", Barbermen_1.Barbermen)
], Sesi.prototype, "barbermen", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Sesi.prototype, "idForUser", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, {
        onDelete: 'CASCADE'
    }),
    typeorm_1.JoinColumn({ name: 'idForUser' }),
    __metadata("design:type", User_1.User)
], Sesi.prototype, "forUser", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Sesi.prototype, "idPaketJasa", void 0);
__decorate([
    typeorm_1.ManyToOne(type => PaketJasa_1.PaketJasa),
    typeorm_1.JoinColumn({ name: 'idPaketJasa' }),
    __metadata("design:type", PaketJasa_1.PaketJasa)
], Sesi.prototype, "paketJasa", void 0);
__decorate([
    typeorm_1.Column('double', { default: 0 }),
    __metadata("design:type", Number)
], Sesi.prototype, "nominal", void 0);
__decorate([
    typeorm_1.Column('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Sesi.prototype, "waktu", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Sesi.prototype, "idCabang", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Sesi.prototype, "idAddedBy", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Cabang_1.Cabang),
    typeorm_1.JoinColumn({ name: 'idCabang' }),
    __metadata("design:type", Cabang_1.Cabang)
], Sesi.prototype, "cabang", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User),
    typeorm_1.JoinColumn({ name: 'idAddedBy' }),
    __metadata("design:type", User_1.User)
], Sesi.prototype, "addedBy", void 0);
Sesi = __decorate([
    typeorm_1.Entity()
], Sesi);
exports.Sesi = Sesi;
//# sourceMappingURL=Sesi.js.map