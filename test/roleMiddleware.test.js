const roleMiddleware = require("../src/middlewares/roleMiddleware");

describe("Role Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { cargo: "GERENTE" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("deve negar acesso se cargo não for permitido", () => {
    const middleware = roleMiddleware(["CEO"]);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ erro: "Acesso negado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve permitir acesso se cargo for permitido", () => {
    const middleware = roleMiddleware(["CEO", "GERENTE"]);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
