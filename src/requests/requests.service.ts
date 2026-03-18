// src/requests/requests.service.ts
import { db } from '../_helpers/db';
import { Request, RequestCreationAttributes } from './requests.model';

export const RequestService = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
    delete: _delete,
    approve,
    reject,
};

async function getAll(): Promise<Request[]> {
    return await db.Request.findAll({
        include: [{ model: db.User, as: 'user' }]
    });
}

async function getById(id: number): Promise<Request> {
    return await getRequest(id);
}

async function getByUserId(userId: number): Promise<Request[]> {
    return await db.Request.findAll({
        where: { userId },
        include: [{ model: db.User, as: 'user' }]
    });
}

async function create(params: RequestCreationAttributes): Promise<Request> {
    // Check if user exists
    const user = await db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }

    return await db.Request.create(params);
}

async function update(id: number, params: Partial<RequestCreationAttributes>): Promise<void> {
    const request = await getRequest(id);

    if (params.userId !== undefined) {
        const user = await db.User.findByPk(params.userId);
        if (!user) {
            throw new Error('User not found');
        }
    }

    await request.update(params);
}

async function approve(id: number): Promise<void> {
    const request = await getRequest(id);
    await request.update({ status: 'Approved' });
}

async function reject(id: number): Promise<void> {
    const request = await getRequest(id);
    await request.update({ status: 'Rejected' });
}

async function _delete(id: number): Promise<void> {
    const request = await getRequest(id);
    await request.destroy();
}

async function getRequest(id: number): Promise<Request> {
    const request = await db.Request.findByPk(id, {
        include: [{ model: db.User, as: 'user' }]
    });
    if (!request) throw new Error('Request not found');
    return request;
}
