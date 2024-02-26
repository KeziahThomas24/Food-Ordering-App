// src/types/global.d.ts or src/global.d.ts

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
  }
  
  export {};
  