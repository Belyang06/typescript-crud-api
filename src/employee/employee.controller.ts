// src/employee/employee.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { EmployeeService } from './employee.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    EmployeeService.getAll()
        .then(employees => res.json(employees))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    EmployeeService.getById(Number(req.params.id))
        .then(employee => res.json(employee))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    EmployeeService.create(req.body)
        .then(employee => res.json(employee))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    EmployeeService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Employee updated successfully' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    EmployeeService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Employee deleted successfully' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeId: Joi.string().required(),
        userId: Joi.number().integer().required(),
        position: Joi.string().required(),
        departmentId: Joi.number().integer().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeId: Joi.string().optional(),
        userId: Joi.number().integer().optional(),
        position: Joi.string().optional(),
        departmentId: Joi.number().integer().optional()
    });
    validateRequest(req, next, schema);
}
