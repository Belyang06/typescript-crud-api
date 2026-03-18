"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const department_service_1 = require("./department.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    department_service_1.DepartmentService.getAll()
        .then(departments => res.json(departments))
        .catch(next);
}
function getById(req, res, next) {
    department_service_1.DepartmentService.getById(Number(req.params.id))
        .then(department => res.json(department))
        .catch(next);
}
function create(req, res, next) {
    department_service_1.DepartmentService.create(req.body)
        .then(department => res.json(department))
        .catch(next);
}
function update(req, res, next) {
    department_service_1.DepartmentService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Department updated successfully' }))
        .catch(next);
}
function _delete(req, res, next) {
    department_service_1.DepartmentService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Department deleted successfully' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().allow('').optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().optional(),
        description: joi_1.default.string().allow('').optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
