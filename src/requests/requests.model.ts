// src/requests/requests.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface RequestAttributes {
    id: number;
    userId: number;
    type: string;
    items: string; // JSON string of items array
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestCreationAttributes
    extends Optional<RequestAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

export class Request
    extends Model<RequestAttributes, RequestCreationAttributes>
    implements RequestAttributes {

    public id!: number;
    public userId!: number;
    public type!: string;
    public items!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function(sequelize: Sequelize): typeof Request {
    Request.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            type: {
                type: DataTypes.ENUM('Equipment', 'Leave', 'Resources'),
                allowNull: false
            },
            items: {
                type: DataTypes.JSON,
                 allowNull: false
            },
            status: {
                type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
                allowNull: false,
                defaultValue: 'Pending'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        } as any,
        {
            sequelize,
            modelName: 'Request',
            tableName: 'requests',
            timestamps: true
        }
    );

    return Request;
}
