"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// const pgClieent = new Client("postgresql://neondb_owner:npg_QCePW9k0FNYO@ep-tight-violet-a13zi3h3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
const pgClient = new pg_1.Client({
    user: "neondb_owner",
    password: "npg_QCePW9k0FNYO",
    port: 5432,
    host: "ep-tight-violet-a13zi3h3-pooler.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    ssl: true
});
pgClient.connect();
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, city, country, street, pincode } = req.body;
        const userQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`;
        const addressQuery = `INSERT INTO addresses(city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4,$5)`;
        pgClient.query("BEGIN;");
        const userResponse = yield pgClient.query(userQuery, [username, password, email]);
        const user_id = userResponse.rows[0].id;
        yield pgClient.query(addressQuery, [city, country, street, pincode, user_id]);
        pgClient.query("COMMIT;");
        res.json({
            message: "You have signed up"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            message: "Couldnt sign up"
        });
    }
}));
app.get("/metadata/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const query = `SELECT users.id, users.username, users.email, users.password, addresses.user_id, addresses.country, addresses.city, addresses.street, addresses.pincode FROM users JOIN addresses ON users.id = addresses.user_id WHERE users.id = $1;`;
    const response = yield pgClient.query(query, [id]);
    res.json(response.rows);
}));
app.listen(3000);
