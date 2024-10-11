import { kv } from "@vercel/kv";
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

const KV_PLAYERS_KEY = "players-data";

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

      const playersData: playersDataType = [];

      for (let i = 0; i < numberOfPlayers; i++) {
        playersData.push({
          name: undefined,
          vampire: i < (numberOfVampires ?? 2) ? true : false,
          id: utils.generateIdentifier(10),
        });
      }

      await kv.set(KV_PLAYERS_KEY, playersData);
      reply.code(201).send(playersData);
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

      const playersData: playersDataType = (await await kv.get(
        KV_PLAYERS_KEY
      )) as playersDataType;

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

      reply.code(201).send(player);
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

      const playersData: playersDataType = (await await kv.get(
        KV_PLAYERS_KEY
      )) as playersDataType;

      const player = playersData.find((x) => x.id === id);
      if (!player)
        return reply.code(404).send({ message: "no players with this id" });

      player.name = name;

      await kv.set(KV_PLAYERS_KEY, playersData);
      reply.code(200);
    },
  };
}
