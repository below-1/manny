"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("./util"));
const Barbermen_1 = __importDefault(require("./Barbermen"));
const Cabang_1 = __importDefault(require("./Cabang"));
const PaketJasa_1 = __importDefault(require("./PaketJasa"));
const User_1 = __importDefault(require("./User"));
const Sesi_1 = __importDefault(require("./Sesi"));
const Inventory_1 = __importDefault(require("./Inventory"));
function default_1(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let justBox = { box: options.box };
        let inventoryArgs = { box: options.box, service: options.inventory };
        let sesiArgs = { box: options.box, service: options.sesi };
        return [
            yield Barbermen_1.default(justBox),
            yield PaketJasa_1.default(justBox),
            yield Cabang_1.default(justBox),
            yield User_1.default(justBox),
            yield util_1.default(justBox),
            yield Sesi_1.default(sesiArgs),
            yield Inventory_1.default(inventoryArgs)
        ];
    });
}
exports.default = default_1;
;
//# sourceMappingURL=index.js.map