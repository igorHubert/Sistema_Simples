const request = require("supertest");
const bcrypt = require("bcryptjs");

// 🔴 mock sempre no topo
jest.mock("../src/models/User", () => ({
  findOne: jest.fn(),
}));

const User = require("../src/models/User");
const app = require("../src/app");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Testando o login", () => {
  it("Deve retornar token para login válido", async () => {
    User.findOne.mockResolvedValue({
      _id: "507f191e810c19729de860ea",
      email: "admin@teste.com",
      senha: bcrypt.hashSync("123456", 8),
      cargo: "CEO",
    });

    const res = await request(app)
      .post("/login")
      .send({
        email: "admin@teste.com",
        senha: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Não deve logar com senha inválida", async () => {
    User.findOne.mockResolvedValue({
      _id: "507f191e810c19729de860ea",
      email: "admin@teste.com",
      senha: bcrypt.hashSync("123456", 8),
      cargo: "CEO",
    });

    const res = await request(app)
      .post("/login")
      .send({
        email: "admin@teste.com",
        senha: "senhaErrada",
      });

    expect(res.status).toBe(401);
  });

  it("Não deve logar usuário inexistente", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/login")
      .send({
        email: "inexistente@teste.com",
        senha: "123456",
      });

    expect(res.status).toBe(401);
  });
});
