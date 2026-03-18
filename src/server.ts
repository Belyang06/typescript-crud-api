// src/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import userController from './users/users.controller';
import departmentController from './department/department.controller';
import employeeController from './employee/employee.controller';
import requestController from './requests/request.controller';
console.log('requestController:', requestController);
import transferController from './transfer/transfer.controller';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/users', userController);
app.use('/departments', departmentController);
app.use('/employees', employeeController);
console.log('Mounting /requests');
app.use('/requests', requestController);
app.use('/transfers', transferController);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log('Test with: POST /users with {email, password, ...}');
        });

    })
    .catch((err) => {
        console.error('Failed to initialize database', err);
        process.exit(1)
    });