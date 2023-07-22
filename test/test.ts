import { env, configuration } from "../src/index";

jest.spyOn(console, "warn").mockImplementation(() => {});

describe("magicenv", () => {
  describe("defaults", () => {
    test("should error onMissing", () => {
      expect(() => {
        env.MISSING;
      }).toThrowError(
        new Error('The environment variable "MISSING" is required!'),
      );
    });
    test("should warn onEmpty", () => {
      expect(() => {
        env.EMPTY;
      }).toThrowError(new Error('The environment variable "EMPTY" is empty!'));
    });
    test("should return value", () => {
      const result = env.VALID;
      expect(result).toBe("VALID");
    });
  });
  describe("error", () => {
    beforeAll(() => {
      configuration.set("onMissing", "error");
      configuration.set("onEmpty", "error");
    });
    test("should error onMissing", () => {
      expect(() => {
        env.MISSING;
      }).toThrowError(
        new Error('The environment variable "MISSING" is required!'),
      );
    });
    test("should error onEmpty", () => {
      expect(() => {
        env.EMPTY;
      }).toThrowError(new Error('The environment variable "EMPTY" is empty!'));
    });
  });
  describe("warn", () => {
    beforeAll(() => {
      configuration.set("onMissing", "warn");
      configuration.set("onEmpty", "warn");
    });
    test("should warn onMissing", () => {
      env.MISSING;
      expect(console.warn).toHaveBeenCalledWith(
        'The environment variable "MISSING" is required!',
      );
    });
    test("should warn onEmpty", () => {
      env.EMPTY;
      expect(console.warn).toHaveBeenCalledWith(
        'The environment variable "EMPTY" is empty!',
      );
    });
  });
  describe("null", () => {
    beforeAll(() => {
      configuration.set("onMissing", "null");
      configuration.set("onEmpty", "null");
    });
    test("should return null onMissing", () => {
      const result = env.MISSING;
      expect(result).toBe(null);
    });
    test("should return null onEmpty", () => {
      const result = env.EMPTY;
      expect(result).toBe(null);
    });
  });
  describe("undefined", () => {
    beforeAll(() => {
      configuration.set("onMissing", "undefined");
      configuration.set("onEmpty", "undefined");
    });
    test("should return undefined onMissing", () => {
      const result = env.MISSING;
      expect(result).toBe(undefined);
    });
    test("should return null onEmpty", () => {
      const result = env.EMPTY;
      expect(result).toBe(undefined);
    });
  });
  describe("validation", () => {
    test.each([
      ["onEmpty", "foo"],
      ["onMissing", "bar"],
    ])("%s", (action, invalidValue) => {
      expect(() => {
        configuration.set(action, invalidValue);
      }).toThrowError(new Error(`${invalidValue} is invalid for ${action}!`));
    });
  });
  describe("optional", () => {
    beforeAll(() => {
      configuration.set("optional", ["OPTIONAL", "EMPTY"]);
    });
    test("should return undefined onMissing", () => {
      const result = env.OPTIONAL;
      expect(result).toBe(undefined);
    });
    test("should return null onEmpty", () => {
      const result = env.EMPTY;
      expect(result).toBe(undefined);
    });
  });
});
