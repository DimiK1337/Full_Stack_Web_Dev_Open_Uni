"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: 'http://localhost:5173'
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use((0, cors_1.default)(corsOptions));
app.get('/api/ping', (_req, res) => {
    res.send('pong');
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
});
