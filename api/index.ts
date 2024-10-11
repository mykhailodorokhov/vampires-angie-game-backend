import Fastify from "fastify";
import routes from "./routes";

const fastify = Fastify();

fastify.register(routes);

fastify.register(async () => {
  await fastify.route({
    method: "GET",
    url: "/",
    handler: async (request, reply) => {
      return reply.code(200).send("Welcome to Angie's Vampire game backend!");
    },
  });
});

// async function main() {
//   try {
//     await fastify.listen({ port: 3000, host: "0.0.0.0" });
//     console.log("server is running ✅");
//   } catch (e) {
//     console.log("error 🫡");
//     console.log((e as Error).message);
//   }
// }
// main();

export default async (req: any, res: any) => {
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
