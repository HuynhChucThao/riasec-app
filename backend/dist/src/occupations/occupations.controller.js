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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationsController = void 0;
const common_1 = require("@nestjs/common");
const occupations_service_1 = require("./occupations.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const occupations_dto_1 = require("./dto/occupations.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const client_1 = require("@prisma/client");
let OccupationsController = class OccupationsController {
    constructor(occupationsService) {
        this.occupationsService = occupationsService;
    }
    findAll(keyword, riasecCode, mainCode, page, limit) {
        return this.occupationsService.findAll({
            keyword,
            riasecCode,
            mainCode,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
    findOne(id, userId) {
        return this.occupationsService.findOne(id, userId);
    }
    create(dto) {
        return this.occupationsService.create(dto);
    }
    update(id, dto) {
        return this.occupationsService.update(id, dto);
    }
    remove(id) {
        return this.occupationsService.remove(id);
    }
};
exports.OccupationsController = OccupationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('keyword')),
    __param(1, (0, common_1.Query)('riasecCode')),
    __param(2, (0, common_1.Query)('mainCode')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], OccupationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], OccupationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [occupations_dto_1.CreateOccupationDto]),
    __metadata("design:returntype", void 0)
], OccupationsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, occupations_dto_1.UpdateOccupationDto]),
    __metadata("design:returntype", void 0)
], OccupationsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OccupationsController.prototype, "remove", null);
exports.OccupationsController = OccupationsController = __decorate([
    (0, common_1.Controller)('occupations'),
    __metadata("design:paramtypes", [occupations_service_1.OccupationsService])
], OccupationsController);
//# sourceMappingURL=occupations.controller.js.map