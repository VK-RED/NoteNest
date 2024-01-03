"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = require("./routes/auth");
const app = (0, express_1.default)();
const PORT = 3000;
const router = express_1.default.Router();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
router.get('/', (req, res) => {
    res.json({ message: 'The Server is Up !!!' });
});
app.use(router);
router.use('/api/auth', auth_1.authRouter);
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
