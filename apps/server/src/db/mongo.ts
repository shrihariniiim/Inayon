/**
 * ============================================================================
 * MongoDB Atlas Database Connection & Initialization Manager
 * ============================================================================
 * 
 * Provides robust connection pooling for MongoDB Atlas with auto-reconnection,
 * custom DNS configuration for Windows development environments, and automatic
 * database seeding if the collections are pristine.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { seedAtlasIfNeeded } from './seedAtlas';

dotenv.config();

// Workaround: Resolve Windows Node.js querySrv ECONNREFUSED issues
// Node.js on certain Windows network configurations fails SRV lookup for mongodb+srv://.
// Setting explicit Google/Cloudflare DNS servers circumvents local router resolver failures.
if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    // Gracefully ignore if custom DNS cannot be bound
  }
}

/**
 * Connects to the MongoDB Atlas cluster and verifies connection health.
 * 
 * @returns {Promise<boolean>} True if connection succeeded or was already established, false otherwise.
 */
export async function connectMongo(): Promise<boolean> {
  // Return early if an active or connecting connection already exists (prevents connection churn)
  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  // Fallback to configured connection string if environment variable is not explicitly populated
  const uri = process.env.MONGODB_URI || 'mongodb+srv://thamilprakasam2005:appichithamil@cluster0.qqwny.mongodb.net/TAglobal?appName=Cluster0';

  if (!uri) {
    console.warn('[MongoDB Atlas] No MONGODB_URI provided in environment variables.');
    return false;
  }

  try {
    console.log('[MongoDB Atlas] Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('[MongoDB Atlas] ✅ Connected successfully to MongoDB Atlas (database: anthurium)!');

    // Run auto-seeder to populate initial baseline data if database is fresh
    await seedAtlasIfNeeded();
    return true;
  } catch (error: any) {
    console.error('[MongoDB Atlas] ❌ Failed to connect to MongoDB Atlas:', error.message || error);
    return false;
  }
}
