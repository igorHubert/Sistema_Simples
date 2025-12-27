const errorMiddleware = require("../src/middlewares/errorMiddleware");
const AppError = require("../src/errors/AppError");

describe("Error Middleware", () => {
  it("deve retornar erro customizado", () => {
    const err = new AppError("Erro teste", 400);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorMiddleware(err, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: "Erro teste" });
  });
});
