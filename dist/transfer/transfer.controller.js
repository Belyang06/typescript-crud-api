"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const transfer_service_1 = require("./transfer.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.put('/:id/approve', approveSchema, approve);
router.put('/:id/reject', rejectSchema, reject);
router.put('/:id/execute', execute);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    transfer_service_1.TransferService.getAll()
        .then(transfers => res.json(transfers))
        .catch(next);
}
function getById(req, res, next) {
    transfer_service_1.TransferService.getById(Number(req.params.id))
        .then(transfer => res.json(transfer))
        .catch(next);
}
function create(req, res, next) {
    transfer_service_1.TransferService.create(req.body)
        .then(transfer => res.json(transfer))
        .catch(next);
}
function update(req, res, next) {
    transfer_service_1.TransferService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Transfer updated successfully' }))
        .catch(next);
}
function approve(req, res, next) {
    transfer_service_1.TransferService.approve(Number(req.params.id), req.body.approvedBy)
        .then(() => res.json({ message: 'Transfer approved successfully' }))
        .catch(next);
}
function reject(req, res, next) {
    transfer_service_1.TransferService.reject(Number(req.params.id), req.body.approvedBy)
        .then(() => res.json({ message: 'Transfer rejected successfully' }))
        .catch(next);
}
function execute(req, res, next) {
    transfer_service_1.TransferService.executeTransfer(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer executed successfully' }))
        .catch(next);
}
function _delete(req, res, next) {
    transfer_service_1.TransferService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer deleted successfully' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        employeeId: joi_1.default.number().integer().required(),
        toDepartmentId: joi_1.default.number().integer().required(),
        reason: joi_1.default.string().allow('').optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        toDepartmentId: joi_1.default.number().integer().optional(),
        reason: joi_1.default.string().allow('').optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function approveSchema(req, res, next) {
    const schema = joi_1.default.object({
        approvedBy: joi_1.default.number().integer().required()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function rejectSchema(req, res, next) {
    const schema = joi_1.default.object({
        approvedBy: joi_1.default.number().integer().required()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
