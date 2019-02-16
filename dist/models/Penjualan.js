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
const User_1 = require("./User");
const MutasiItem_1 = require("./MutasiItem");
let Penjualan = class Penjualan extends MutasiItem_1.MutasiItem {
};
__decorate([
    torm.Column('int'),
    __metadata("design:type", Number)
], Penjualan.prototype, "idForUser", void 0);
__decorate([
    torm.ManyToOne(type => User_1.User),
    torm.JoinColumn({ name: 'idForUser' }),
    __metadata("design:type", User_1.User)
], Penjualan.prototype, "forUser", void 0);
Penjualan = __decorate([
    torm.ChildEntity()
], Penjualan);
exports.Penjualan = Penjualan;
//# sourceMappingURL=Penjualan.js.map