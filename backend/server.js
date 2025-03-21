import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import opeRoutes from './routes/operatorRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200);
    res.send('Hello World');

}
);
app.use('/user',userRoutes);
app.use('/operator',opeRoutes);


connectDB().then(() => {
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
}
);