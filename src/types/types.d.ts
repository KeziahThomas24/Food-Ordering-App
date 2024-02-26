import { Document } from 'mongoose';
import NextAuth from "next-auth";

// Extending environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      MONGO_URL: string;
    }
  }
}

// Defining User interface for Mongoose model
interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  name?: string;
  image?: string;
  // Add any other fields your User schema has
}

// Defining UserInfo interface for Mongoose model
interface IUserInfo extends Document {
  email: string;
  admin: boolean;
  // Add any other fields your UserInfo schema has
}

// Defining credentials structure for login
type Credentials = {
  email: string;
  password: string;
};

// Extending next-auth types for custom user session properties
declare module "next-auth" {
    // Extending Session type to include custom user fields
    interface Session {
      user?: {
        id: string;
        email: string;
        name?: string;
        image?: string;
        admin?: boolean;
      }
    }
  }
  

// Define a type for the props expected to pass to the page component that requires admin status
interface AdminProps {
  isAdmin: boolean;
}
type ApiResponse = {
  ok: boolean;
};
export { IUser, IUserInfo, Credentials, AdminProps, ApiResponse };
