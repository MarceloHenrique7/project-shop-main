import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import router from './routes/routes';

import {requireAuth} from './shared/middleware/AuthMiddleware';
import { StatusCodes } from 'http-status-codes';

dotenv.config()

const app = express()
const PORT = process.env.PORT


app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(router)


app.set('view engine', 'ejs');


app.get('/', requireAuth, (req, res) => {
    
    if (res.locals.user != null) {
        return res.redirect('/home')
    }
    
    res.status(StatusCodes.OK).render('start')
})

app.get('/home', requireAuth, (req, res) => {
    if (res.locals.user == null) {
        return res.redirect('/')
    }
    res.status(StatusCodes.OK).render('home')
})

app.get('/profile', requireAuth, (req, res) => {
    res.status(StatusCodes.OK).render('profile')
})

const USERNAME = process.env.MONGODB_USERNAME
const PASSWORD = process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@mern-food-ordering-app.cljl3ik.mongodb.net/?retryWrites=true&w=majority&appName=mern-food-ordering-app`, {})
.then((res) => app.listen(PORT || 3000, () => console.log(`Connect to Server ${PORT || 3000}`)))
.catch((err) => console.log(err))