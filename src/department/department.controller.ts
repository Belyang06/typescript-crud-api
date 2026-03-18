// src/department/department.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { DepartmentService } from './department.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    DepartmentService.getAll()
        .then(departments => res.json(departments))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    DepartmentService.getById(Number(req.params.id))
        .then(department => res.json(department))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    DepartmentService.create(req.body)
        .then(department => res.json(department))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    DepartmentService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Department updated successfully' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    DepartmentService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Department deleted successfully' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow('').optional()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().allow('').optional()
    });
    validateRequest(req, next, schema);
}
