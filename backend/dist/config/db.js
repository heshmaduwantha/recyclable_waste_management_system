"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabase = exports.newId = exports.verifyPassword = exports.hashPassword = exports.PICKER_COMMISSION_RATE = exports.POINT_VALUE_LKR = exports.pool = exports.pgConfig = void 0;
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const { Pool, types } = pg_1.default;
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
// Return NUMERIC columns as JS numbers and DATE columns as 'YYYY-MM-DD' strings.
types.setTypeParser(1700, (v) => parseFloat(v));
types.setTypeParser(1082, (v) => v);
exports.pgConfig = {
    host: process.env.PG_DB_HOST || 'localhost',
    port: parseInt(process.env.PG_DB_PORT || '5432', 10),
    database: process.env.PG_DB_NAME || 'eco_collect',
    user: process.env.PG_DB_USER || 'postgres',
    password: process.env.PG_DB_PASSWORD,
};
exports.pool = new Pool(exports.pgConfig);
/** 1 Eco Point is worth LKR 0.20. */
exports.POINT_VALUE_LKR = 0.2;
/** Collector earns this share of the material value of each completed pickup. */
exports.PICKER_COMMISSION_RATE = 0.25;
function hashPassword(plain) {
    const salt = crypto_1.default.randomBytes(16).toString('hex');
    const hash = crypto_1.default.scryptSync(plain, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}
exports.hashPassword = hashPassword;
function verifyPassword(plain, stored) {
    const [salt, hash] = (stored || '').split(':');
    if (!salt || !hash)
        return false;
    const candidate = crypto_1.default.scryptSync(plain, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return candidate.length === expected.length && crypto_1.default.timingSafeEqual(candidate, expected);
}
exports.verifyPassword = verifyPassword;
function newId(prefix) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${crypto_1.default.randomBytes(2).toString('hex').toUpperCase()}`;
}
exports.newId = newId;
async function checkDatabase() {
    const { rows } = await exports.pool.query("SELECT COUNT(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pickups'");
    if (rows[0].n === 0) {
        throw new Error('Schema missing. Run `npm run db:setup` in backend/ first.');
    }
    console.log(`Connected to PostgreSQL '${exports.pgConfig.database}' on ${exports.pgConfig.host}:${exports.pgConfig.port}`);
}
exports.checkDatabase = checkDatabase;
