# Env Magic

![Automated Tests](https://github.com/imaustink/envmagic/actions/workflows/build.yml/badge.svg)
<span class="badge-npmversion"><a href="https://npmjs.org/package/envmagic" title="View this project on NPM"><img src="https://img.shields.io/npm/v/envmagic.svg" alt="NPM version" /></a></span>

Manage your environment variables like magic. Just import `env` from `envmagic` and use it like you would [`process.env`](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_env). By default, accessing `undefined` or empty environment variables throws an error.

```javascript
import { env } from "envmagic";

// Throws an error if NODE_ENV is undefined or ""
const { NODE_ENV } = env;
```

# Motivation

I think we've all seen and written code that looks a lot like this.

```javascript
import assert from "node:assert";

const { FOO } = process.env;

assert(FOO, "FOO is required!");
```

This is error prone, ugly, and can easily become outdated. It's time to automate your environment variable access.

# Customization

Env Magic aims to be highly customizable. You may import the `configuration` object and change setting in your application code, or you can set most setting via environment variables.

| Property    | Env                    | Default        | Description                                                  |
| ----------- | ---------------------- | -------------- | ------------------------------------------------------------ |
| `onMissing` | `MAGIC_ENV_ON_MISSING` | `error`        | [Action](#actions) taken for missing (`undefined`) variables |
| `onEmpty`   | `MAGIC_ENV_ON_EMPTY`   | `error`        | [Action](#actions) taken for missing (`""`) variables        |
| `optional`  | `MAGIC_ENV_OPTIONAL`   | `[]`           | Variables for which no [action](#actions) should be taken    |
| `logger`    | n/a                    | `console.warn` | Custom logger function                                       |

```javascript
import { configuration } from "envmagic";

configuration.set("onMissing", "warn");
configuration.set("onEmpty", "warn");
configuration.set("logger", (message) => {
  // implement custom logger here
});
configuration.set("optional", ["OPTIONAL_VARIABLE"]);
```

# Actions

Actions are the things that Env Magic can do in response to missing or empty environment variables.

- `error`: Throws an error indicating a given variable is missing or empty
- `warn`: Logs a warning indicating a given variable is missing or empty
- `null`: Returns `null` when the given environment variable is missing or empty
- `undefined`: Returns `undefined` when the given environment variable is missing or
