import { FastifyInstance, RouteOptions } from "fastify";
import {
  generateQuerySchema,
  generateQueryType,
  idParamsSchema,
  idParamsType,
  namePlayerBodySchema,
  namePlayerBodyType,
  playersDataType,
} from "./types";
import * as utils from "./utils";

export default async function (fastify: FastifyInstance) {
  fastify.route(getPlayersGenerate(fastify));
  fastify.route(getPlayersId(fastify));
  fastify.route(patchPlayersId(fastify));
}

function getPlayersGenerate(fastify: FastifyInstance): RouteOptions {
  return {
    method: "GET",
    url: "/api/players/generate",
    schema: {
      querystring: generateQuerySchema,
    },
    handler: async (request, reply) => {
      const { n: numberOfPlayers, v: numberOfVampires } =
        request.query as generateQueryType;

      const errors = [];
      if (numberOfPlayers < 5)
        errors.push("game should have at least 5 players");
      if (numberOfVampires && numberOfVampires < 2)
        errors.push("game should have at least 2 vampires");
      if (
        numberOfVampires &&
        numberOfVampires >= numberOfPlayers - numberOfVampires
      )
        errors.push("game should have more vampires than players");

      if (errors.length > 0) {
        return reply.code(400).send({ errors });
      }

      const players: playersDataType = [];

      for (let i = 0; i < numberOfPlayers; i++) {
        players.push({
          name: undefined,
          vampire: i < (numberOfVampires ?? 2) ? true : false,
          id: utils.generateIdentifier(10),
        });
      }

      await utils.saveData(players);
      return reply.code(201).send(players);
    },
  };
}

function getPlayersId(fastify: FastifyInstance): RouteOptions {
  return {
    method: "GET",
    url: "/api/players/:id",
    schema: {
      params: idParamsSchema,
    },
    handler: async (request, reply) => {
      const { id } = request.params as idParamsType;

      const playersData: playersDataType = await utils.loadData();

      const player = playersData.find((x) => x.id === id);
      if (!player)
        return reply.code(404).send({ message: "no players with this id" });

      if (player.vampire) {
        const fellowVampires = playersData
          .filter((x) => x.vampire && x.id !== id)
          .map((x) => x.name ?? "Anonymous vampire");
        return reply.code(200).send({
          ...player,
          fellowVampires,
        });
      }

      return reply.code(201).send(player);
    },
  };
}

function patchPlayersId(fastify: FastifyInstance): RouteOptions {
  return {
    method: "PATCH",
    url: "/api/players/:id",
    schema: {
      params: idParamsSchema,
      body: namePlayerBodySchema,
    },
    handler: async (request, reply) => {
      const { id } = request.params as idParamsType;
      const { name } = request.body as namePlayerBodyType;

      const playersData: playersDataType = await utils.loadData();

      const player = playersData.find((x) => x.id === id);
      if (!player)
        return reply.code(404).send({ message: "no players with this id" });

      player.name = name;
      utils.saveData(playersData);
      return reply.code(200);
    },
  };
}
