import assert from "node:assert";

const { MAGIC_ENV_ON_MISSING, MAGIC_ENV_ON_EMPTY, MAGIC_ENV_OPTIONAL } =
  process.env;

const ACTION_THROW = "error";
const ACTION_WARN = "warn";
const ACTION_NULL = "null";
const ACTION_UNDEFINED = "undefined";

export const actions = [
  ACTION_THROW,
  ACTION_WARN,
  ACTION_NULL,
  ACTION_UNDEFINED,
] as const;

export type Events = "onMissing" | "onEmpty";

export type Action = (typeof actions)[number];

export type Logger = (...args: string[]) => void;

export interface ConfigurationInterface {
  onMissing?: Action;
  onEmpty?: Action;
  logger?: Logger;
  optional?: string[];
}

export class Configuration extends Map {
  constructor({
    onMissing = ACTION_THROW,
    onEmpty = ACTION_THROW,
    logger = (...args) => console.warn(...args),
    optional = [],
  }: ConfigurationInterface) {
    super();
    this.set("onMissing", onMissing);
    this.set("onEmpty", onEmpty);
    this.set("logger", logger);
    this.set("optional", optional);
  }

  schema: Record<string, (value: any) => void> = {
    onMissing: (value: any) => {
      assert(actions.includes(value), `${value} is invalid for onMissing!`);
    },
    onEmpty: (value: any) => {
      assert(actions.includes(value), `${value} is invalid for onEmpty!`);
    },
    logger: (value: any) => {
      assert(typeof value === "function", "logger is invalid!");
    },
    optional: (value: any) => {
      assert(Array.isArray(value), "optional is invalid!");
    },
  };

  set(name: string, value: unknown) {
    this.schema?.[name]?.(value);
    return super.set(name, value);
  }
}

export const configuration = new Configuration({
  onMissing: MAGIC_ENV_ON_MISSING as Action,
  onEmpty: MAGIC_ENV_ON_EMPTY as Action,
  optional: MAGIC_ENV_OPTIONAL?.split(",") as string[],
});

export function normalizeVariable(event: Events, message: string) {
  const action = configuration.get(event);
  switch (action) {
    case ACTION_THROW:
      throw new Error(message);
    case ACTION_WARN:
      configuration.get("logger")(message);
      break;
    case ACTION_NULL:
      return null;
    case ACTION_UNDEFINED:
      return undefined;
  }
}

export const env = new Proxy(process.env, {
  get(environment: Record<string, string>, name: string) {
    const value = Reflect.get(environment, name);
    if (
      typeof value !== "string" &&
      !configuration.get("optional")?.includes(name)
    ) {
      return normalizeVariable(
        "onMissing",
        `The environment variable "${name}" is required!`,
      );
    }
    if (typeof value === "string" && !value.length) {
      return normalizeVariable(
        "onEmpty",
        `The environment variable "${name}" is empty!`,
      );
    }
    return value;
  },
});
