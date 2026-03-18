// src/transfer/transfer.service.ts
import { db } from '../_helpers/db';
import { Transfer, TransferCreationAttributes } from './transfer.model';

export const TransferService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    approve,
    reject,
    executeTransfer,
};

async function getAll(): Promise<Transfer[]> {
    return await db.Transfer.findAll({
        include: [
            { 
                model: db.Employee, 
                as: 'employee', 
                include: [{ model: db.User, as: 'user' }] 
            },
            { model: db.Department, as: 'fromDepartment' },
            { model: db.Department, as: 'toDepartment' },
            { model: db.User, as: 'approver' }
        ]
    });
}

async function getById(id: number): Promise<Transfer> {
    return await getTransfer(id);
}

async function create(params: TransferCreationAttributes): Promise<Transfer> {
    // Get the employee's current department
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee) {
        throw new Error('Employee not found');
    }

    // Check if toDepartment exists
    const toDepartment = await db.Department.findByPk(params.toDepartmentId);
    if (!toDepartment) {
        throw new Error('Target department not found');
    }

    const transferData = {
        ...params,
        fromDepartmentId: employee.departmentId
    };

    return await db.Transfer.create(transferData);
}

async function update(id: number, params: Partial<TransferCreationAttributes>): Promise<void> {
    const transfer = await getTransfer(id);

    if (params.employeeId !== undefined) {
        const employee = await db.Employee.findByPk(params.employeeId);
        if (!employee) {
            throw new Error('Employee not found');
        }
    }

    if (params.toDepartmentId !== undefined) {
        const department = await db.Department.findByPk(params.toDepartmentId);
        if (!department) {
            throw new Error('Target department not found');
        }
    }

    if (params.approvedBy !== undefined && params.approvedBy !== null) {
        const user = await db.User.findByPk(params.approvedBy);
        if (!user) {
            throw new Error('Approver not found');
        }
    }

    await transfer.update(params);
}

async function approve(id: number, approvedBy: number): Promise<void> {
    const user = await db.User.findByPk(approvedBy);
    if (!user) {
        throw new Error('Approver not found');
    }

    const transfer = await getTransfer(id);
    await transfer.update({ status: 'Approved', approvedBy });
}

async function reject(id: number, approvedBy: number): Promise<void> {
    const user = await db.User.findByPk(approvedBy);
    if (!user) {
        throw new Error('Approver not found');
    }

    const transfer = await getTransfer(id);
    await transfer.update({ status: 'Rejected', approvedBy });
}

async function executeTransfer(id: number): Promise<void> {
    const transfer = await getTransfer(id);
    if (transfer.status !== 'Approved') {
        throw new Error('Transfer must be approved before execution');
    }

    // Update employee's department
    const employee = await db.Employee.findByPk(transfer.employeeId);
    if (!employee) {
        throw new Error('Employee not found');
    }

    await employee.update({ departmentId: transfer.toDepartmentId });
}

async function _delete(id: number): Promise<void> {
    const transfer = await getTransfer(id);
    await transfer.destroy();
}

async function getTransfer(id: number): Promise<Transfer> {
    const transfer = await db.Transfer.findByPk(id, {
        include: [
            { model: db.Employee, as: 'employee', include: [{ model: db.User, as: 'user' }] },
            { model: db.Department, as: 'fromDepartment' },
            { model: db.Department, as: 'toDepartment' },
            { model: db.User, as: 'approver' }
        ]
    });
    if (!transfer) throw new Error('Transfer not found');
    return transfer;
}
