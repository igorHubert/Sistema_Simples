const authMiddleware = require("../src/middleware/authMiddleware");
const AppError = require("../src/errors/AppError");

describe("Auth Middleware", () => {
  it("deve lançar erro se não houver token", () => {
    const req = { headers: {} };
    const res = {};
    const next = jest.fn();

    expect(() => authMiddleware(req, res, next)).toThrow(AppError);
  });

  it("deve lançar erro se token for inválido", () => {
    const req = {
      headers: { authorization: "Bearer token_invalido" },
    };
    const res = {};
    const next = jest.fn();

    expect(() => authMiddleware(req, res, next)).toThrow(AppError);
  });
});
