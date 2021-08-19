import apiRouter from './api/index.js';
import resourceRouter from './resources/index.js';
import test from '../app/controllers/test.js';

export default function route(app){
    app.use('/api',apiRouter);
    app.use('/src',resourceRouter);
    app.get('/test',test);
};