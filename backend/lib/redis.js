import Redis from "ioredis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const url = process.env.UPSTASH_REDIS_URL;
console.log(url);
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// You need to use await at top level in a module like this:
await redis.set('foo', 'bar'); // This line is OK now.

export default redis;