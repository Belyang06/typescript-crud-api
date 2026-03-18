"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const employee_service_1 = require("./employee.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    employee_service_1.EmployeeService.getAll()
        .then(employees => res.json(employees))
        .catch(next);
}
function getById(req, res, next) {
    employee_service_1.EmployeeService.getById(Number(req.params.id))
        .then(employee => res.json(employee))
        .catch(next);
}
function create(req, res, next) {
    employee_service_1.EmployeeService.create(req.body)
        .then(employee => res.json(employee))
        .catch(next);
}
function update(req, res, next) {
    employee_service_1.EmployeeService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Employee updated successfully' }))
        .catch(next);
}
function _delete(req, res, next) {
    employee_service_1.EmployeeService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Employee deleted successfully' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        employeeId: joi_1.default.string().required(),
        userId: joi_1.default.number().integer().required(),
        position: joi_1.default.string().required(),
        departmentId: joi_1.default.number().integer().required()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        employeeId: joi_1.default.string().optional(),
        userId: joi_1.default.number().integer().optional(),
        position: joi_1.default.string().optional(),
        departmentId: joi_1.default.number().integer().optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
