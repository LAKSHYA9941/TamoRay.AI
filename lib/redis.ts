import { createClient } from 'redis';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables if not already loaded
if (!process.env.REDIS_HOST) {
    config({ path: resolve(__dirname, '../.env') });
}

// Remove quotes from environment variables if present
function cleanEnvVar(value: string | undefined): string | undefined {
    if (!value) return value;
    return value.replace(/^['"]|['"]$/g, '');
}

const redisHost = cleanEnvVar(process.env.REDIS_HOST);
const redisPort = parseInt(cleanEnvVar(process.env.REDIS_PORT) || '6379');
const redisPassword = cleanEnvVar(process.env.REDIS_PASSWORD);
const redisUsername = cleanEnvVar(process.env.REDIS_USERNAME) || 'default';

console.log('🔌 [Redis Client] Initializing with config:', {
    host: redisHost?.substring(0, 30) + '...',
    port: redisPort,
    username: redisUsername,
    hasPassword: !!redisPassword,
    tls: true
});

if (!redisHost || !redisPassword) {
    console.error('❌ [Redis Client] Missing REDIS_HOST or REDIS_PASSWORD in environment variables!');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('REDIS')));
}

// Use Redis Cloud (your existing Redis instance)
const redisClient = createClient({
    username: redisUsername,
    password: redisPassword,
    socket: {
        host: redisHost,
        port: redisPort,
        // Note: TLS disabled - enable only if your Redis instance requires it
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('❌ [Redis Client] Too many reconnection attempts, giving up');
                return new Error('Too many retries');
            }
            console.log(`🔄 [Redis Client] Reconnecting... (attempt ${retries})`);
            return Math.min(retries * 100, 3000);
        }
    }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ [Redis Client] Connected to Redis Cloud'));
redisClient.on('ready', () => console.log('✅ [Redis Client] Ready to accept commands'));

export default redisClient;
