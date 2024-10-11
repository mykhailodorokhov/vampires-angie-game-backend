import { Static, Type } from "@sinclair/typebox";

export type playerDataType = {
  name: string | undefined;
  vampire: boolean;
  id: string;
};

export type playersDataType = Array<playerDataType>;

export const generateQuerySchema = Type.Object({
  n: Type.Number(),
  v: Type.Optional(Type.Number()),
});

export const idParamsSchema = Type.Object({
  id: Type.String(),
});

export const namePlayerBodySchema = Type.Object({
  name: Type.String(),
});

export type generateQueryType = Static<typeof generateQuerySchema>;
export type idParamsType = Static<typeof idParamsSchema>;
export type namePlayerBodyType = Static<typeof namePlayerBodySchema>;
