// src/requests/request.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { RequestService } from './requests.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/user/:userId', getByUserId);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.put('/:id/approve', approve);
router.put('/:id/reject', reject);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    RequestService.getAll()
        .then(requests => {
            const parsed = requests.map(r => ({
                ...r.toJSON(),
                items: JSON.parse(r.items)
            }));
            res.json(parsed);
        })
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    RequestService.getById(Number(req.params.id))
        .then(request => {
            const parsed = {
                ...request.toJSON(),
                items: JSON.parse(request.items)
            };
            res.json(parsed);
        })
        .catch(next);
}

function getByUserId(req: Request, res: Response, next: NextFunction): void {
    RequestService.getByUserId(Number(req.params.userId))
        .then(requests => {
            const parsed = requests.map(r => ({
                ...r.toJSON(),
                items: JSON.parse(r.items)
            }));
            res.json(parsed);
        })
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    const params = req.body;
    if (Array.isArray(params.items)) {
        params.items = JSON.stringify(params.items);
    }
    RequestService.create(params)
        .then(request => {
            const parsed = {
                ...request.toJSON(),
                items: JSON.parse(request.items)
            };
            res.json(parsed);
        })
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    const params = req.body;
    if (params.items && Array.isArray(params.items)) {
        params.items = JSON.stringify(params.items);
    }
    RequestService.update(Number(req.params.id), params)
        .then(() => res.json({ message: 'Request updated successfully' }))
        .catch(next);
}

function approve(req: Request, res: Response, next: NextFunction): void {
    RequestService.approve(Number(req.params.id))
        .then(() => res.json({ message: 'Request approved successfully' }))
        .catch(next);
}

function reject(req: Request, res: Response, next: NextFunction): void {
    RequestService.reject(Number(req.params.id))
        .then(() => res.json({ message: 'Request rejected successfully' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    RequestService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Request deleted successfully' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const itemSchema = Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
    });

    const schema = Joi.object({
        userId: Joi.number().integer().required(),
        type: Joi.string().valid('Equipment', 'Leave', 'Resources').required(),
        items: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(itemSchema)
        ).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const itemSchema = Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
    });

    const schema = Joi.object({
        type: Joi.string().valid('Equipment', 'Leave', 'Resources').optional(),
        items: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(itemSchema)
        ).optional(),
        status: Joi.string().valid('Pending', 'Approved', 'Rejected').optional()
    });
    validateRequest(req, next, schema);
}
