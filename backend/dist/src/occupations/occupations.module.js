"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma.module");
const occupations_controller_1 = require("./occupations.controller");
const occupations_service_1 = require("./occupations.service");
let OccupationsModule = class OccupationsModule {
};
exports.OccupationsModule = OccupationsModule;
exports.OccupationsModule = OccupationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [occupations_controller_1.OccupationsController],
        providers: [occupations_service_1.OccupationsService],
        exports: [occupations_service_1.OccupationsService],
    })
], OccupationsModule);
//# sourceMappingURL=occupations.module.js.map