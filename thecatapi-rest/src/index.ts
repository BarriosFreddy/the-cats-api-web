import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './interfaces/rest/routes';
import { MongoDBConnection } from './config/MongoDB';
import { FRONTEND_URL, PORT } from './config/EnvVariables';


if (!PORT) {
    throw new Error("La variable PORT no puede ser nula");
}

const corsOptions = {
    origin: FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        name: "The cat API Test",
        version: "0.0.1"
    })
})

routes(app)

app.listen(PORT, async (error) => {
    if (error) console.error("Ha ocurrido un error: ", error);
    await MongoDBConnection()
    console.log(`El servidor está escuchando en el puerto: http://localhost:${PORT}`);
})
