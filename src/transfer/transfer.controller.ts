// src/transfer/transfer.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { TransferService } from './transfer.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.put('/:id/approve', approveSchema, approve);
router.put('/:id/reject', rejectSchema, reject);
router.put('/:id/execute', execute);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    TransferService.getAll()
        .then(transfers => res.json(transfers))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    TransferService.getById(Number(req.params.id))
        .then(transfer => res.json(transfer))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    TransferService.create(req.body)
        .then(transfer => res.json(transfer))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    TransferService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Transfer updated successfully' }))
        .catch(next);
}

function approve(req: Request, res: Response, next: NextFunction): void {
    TransferService.approve(Number(req.params.id), req.body.approvedBy)
        .then(() => res.json({ message: 'Transfer approved successfully' }))
        .catch(next);
}

function reject(req: Request, res: Response, next: NextFunction): void {
    TransferService.reject(Number(req.params.id), req.body.approvedBy)
        .then(() => res.json({ message: 'Transfer rejected successfully' }))
        .catch(next);
}

function execute(req: Request, res: Response, next: NextFunction): void {
    TransferService.executeTransfer(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer executed successfully' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    TransferService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer deleted successfully' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeId: Joi.number().integer().required(),
        toDepartmentId: Joi.number().integer().required(),
        reason: Joi.string().allow('').optional()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        toDepartmentId: Joi.number().integer().optional(),
        reason: Joi.string().allow('').optional()
    });
    validateRequest(req, next, schema);
}

function approveSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        approvedBy: Joi.number().integer().required()
    });
    validateRequest(req, next, schema);
}

function rejectSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        approvedBy: Joi.number().integer().required()
    });
    validateRequest(req, next, schema);
}
