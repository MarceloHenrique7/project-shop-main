"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes/routes"));
const AuthMiddleware_1 = require("./shared/middleware/AuthMiddleware");
const http_status_codes_1 = require("http-status-codes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(routes_1.default);
app.get('*', AuthMiddleware_1.checkUser);
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    if (res.locals.user != null) {
        return res.redirect('/home');
    }
    res.status(http_status_codes_1.StatusCodes.OK).render('start');
});
app.get('/home', AuthMiddleware_1.requireAuth, (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).render('home');
});
const USERNAME = process.env.MONGODB_USERNAME;
const PASSWORD = process.env.MONGODB_PASSWORD;
mongoose_1.default.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.yd9kiua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {})
    .then((res) => app.listen(PORT || 3000, () => console.log(`Connect to Server ${PORT || 3000}`)))
    .catch((err) => console.log(err));
