"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const requests_service_1 = require("./requests.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.get('/user/:userId', getByUserId);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.put('/:id/approve', approve);
router.put('/:id/reject', reject);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    requests_service_1.RequestService.getAll()
        .then(requests => {
        const parsed = requests.map(r => ({
            ...r.toJSON(),
            items: JSON.parse(r.items)
        }));
        res.json(parsed);
    })
        .catch(next);
}
function getById(req, res, next) {
    requests_service_1.RequestService.getById(Number(req.params.id))
        .then(request => {
        const parsed = {
            ...request.toJSON(),
            items: JSON.parse(request.items)
        };
        res.json(parsed);
    })
        .catch(next);
}
function getByUserId(req, res, next) {
    requests_service_1.RequestService.getByUserId(Number(req.params.userId))
        .then(requests => {
        const parsed = requests.map(r => ({
            ...r.toJSON(),
            items: JSON.parse(r.items)
        }));
        res.json(parsed);
    })
        .catch(next);
}
function create(req, res, next) {
    const params = req.body;
    if (Array.isArray(params.items)) {
        params.items = JSON.stringify(params.items);
    }
    requests_service_1.RequestService.create(params)
        .then(request => {
        const parsed = {
            ...request.toJSON(),
            items: JSON.parse(request.items)
        };
        res.json(parsed);
    })
        .catch(next);
}
function update(req, res, next) {
    const params = req.body;
    if (params.items && Array.isArray(params.items)) {
        params.items = JSON.stringify(params.items);
    }
    requests_service_1.RequestService.update(Number(req.params.id), params)
        .then(() => res.json({ message: 'Request updated successfully' }))
        .catch(next);
}
function approve(req, res, next) {
    requests_service_1.RequestService.approve(Number(req.params.id))
        .then(() => res.json({ message: 'Request approved successfully' }))
        .catch(next);
}
function reject(req, res, next) {
    requests_service_1.RequestService.reject(Number(req.params.id))
        .then(() => res.json({ message: 'Request rejected successfully' }))
        .catch(next);
}
function _delete(req, res, next) {
    requests_service_1.RequestService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Request deleted successfully' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const itemSchema = joi_1.default.object({
        name: joi_1.default.string().required(),
        quantity: joi_1.default.number().integer().min(1).required()
    });
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().required(),
        type: joi_1.default.string().valid('Equipment', 'Leave', 'Resources').required(),
        items: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.array().items(itemSchema)).required()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const itemSchema = joi_1.default.object({
        name: joi_1.default.string().required(),
        quantity: joi_1.default.number().integer().min(1).required()
    });
    const schema = joi_1.default.object({
        type: joi_1.default.string().valid('Equipment', 'Leave', 'Resources').optional(),
        items: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.array().items(itemSchema)).optional(),
        status: joi_1.default.string().valid('Pending', 'Approved', 'Rejected').optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
