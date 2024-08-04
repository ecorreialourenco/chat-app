import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { server } from "./server";
import { PORT, app, httpServer } from "./app";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const { authorization } = req.headers;
        let authUser: JwtPayload | string = "";

        if (authorization) {
          let token = "";
          if (authorization.includes(" ")) {
            token = authorization.split(" ")[1];
          } else {
            token = authorization;
          }
          const userToken: any = jsonwebtoken.verify(
            token,
            JWT_SECRET,
            (err, decoded) => {
              if (err) {
                return "error";
              }

              return decoded;
            }
          );
          if (userToken) {
            authUser = userToken;
          }
        }
        return { authUser };
      },
    })
  );
  httpServer.listen(PORT, () => {});
};

startServer();
