import Fastify from "fastify";
import routes from "./routes";

const fastify = Fastify();

fastify.register(routes);

export default async (req: any, res: any) => {
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
