import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { userTypeDefs } from "./src/graphql/userTypeDefs.js";
import { userResolvers } from "./src/resolvers/userResolver.js";
import { requireAuth } from "./src/middlewares/auth.js";
import User from "./src/models/User.js";
import authRoutes from "./src/routes/authRoutes.js";
import policyRoutes from "./src/routes/policyRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Apollo Server (GraphQL for Users only)
const server = new ApolloServer({
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
});

const startServer = async () => {
  await server.start();

  // REST APIs
  app.use("/api/auth", authRoutes);
  app.use("/api/policies", policyRoutes);
  app.use("/api/payments", paymentRoutes);
  // GraphQL endpoint with auth context
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        if (authHeader.startsWith("Bearer ")) {
          try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return { currentUser: decoded };
          } catch (err) {
            console.warn("GraphQL JWT verification failed:", err.message);
            return { currentUser: null };
          }
        }
        return { currentUser: null };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();
