import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nayan';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connects to MongoDB with connection pooling and caching.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000, // Quick timeout fallback if DB is not reached
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('Successfully connected to MongoDB');
      return m;
    }).catch((err) => {
      console.warn('MongoDB connection warning (running in resilient fallback mode):', err.message);
      cached!.promise = null;
      return null as unknown as typeof mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    return null;
  }

  return cached!.conn;
}

export default connectToDatabase;
