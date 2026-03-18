// src/employee/employee.service.ts
import { db } from '../_helpers/db';
import { Employee, EmployeeCreationAttributes } from './employee.model';

export const EmployeeService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByUserId,
};

async function getAll(): Promise<Employee[]> {
    return await db.Employee.findAll({
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'department' }
        ]
    });
}

async function getById(id: number): Promise<Employee> {
    return await getEmployee(id);
}

async function getByUserId(userId: number): Promise<Employee | null> {
    return await db.Employee.findOne({
        where: { userId },
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'department' }
        ]
    });
}

async function create(params: EmployeeCreationAttributes): Promise<Employee> {
    const existingEmp = await db.Employee.findOne({ where: { employeeId: params.employeeId } });
    if (existingEmp) {
        throw new Error(`Employee ID "${params.employeeId}" already exists`);
    }

    // Check if user exists
    const user = await db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department) {
        throw new Error('Department not found');
    }

    const existingUser = await db.Employee.findOne({ where: { userId: params.userId } });
    if (existingUser) {
        throw new Error('User is already linked to an employee record');
    }

    return await db.Employee.create(params);
}

async function update(id: number, params: Partial<EmployeeCreationAttributes>): Promise<void> {
    const employee = await getEmployee(id);

    if (params.userId !== undefined) {
        const user = await db.User.findByPk(params.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const existingUser = await db.Employee.findOne({ where: { userId: params.userId } });
        if (existingUser && existingUser.id !== id) {
            throw new Error('User is already linked to another employee record');
        }
    }

    if (params.departmentId !== undefined) {
        const department = await db.Department.findByPk(params.departmentId);
        if (!department) {
            throw new Error('Department not found');
        }
    }

    await employee.update(params);
}

async function _delete(id: number): Promise<void> {
    const employee = await getEmployee(id);
    await employee.destroy();
}

async function getEmployee(id: number): Promise<Employee> {
    const employee = await db.Employee.findByPk(id, {
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'department' }
        ]
    });
    if (!employee) throw new Error('Employee not found');
    return employee;
}
