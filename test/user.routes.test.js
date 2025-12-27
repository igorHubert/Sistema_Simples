const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../src/models/User", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const User = require("../src/models/User");
const app = require("../src/app");

const tokenCEO = jwt.sign({ id: "1", cargo: "CEO" }, "SEGREDO_SUPER_SECRETO");
const tokenGerente = jwt.sign({ id: "2", cargo: "GERENTE" }, "SEGREDO_SUPER_SECRETO");
const tokenFuncionario = jwt.sign({ id: "3", cargo: "FUNCIONARIO" }, "SEGREDO_SUPER_SECRETO");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Rotas de Usuários (CRUD)", () => {
  it("CEO deve criar usuário", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "507f191e810c19729de860ec",
      nome: "João",
      cargo: "FUNCIONARIO",
    });

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${tokenCEO}`)
      .send({
        nome: "João",
        email: "joao@teste.com",
        senha: "123456",
        cargo: "FUNCIONARIO",
      });

    expect(res.status).toBe(201);
    expect(res.body.cargo).toBe("FUNCIONARIO");
  });

  it("Gerente deve listar usuários", async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([
        { nome: "User 1", cargo: "FUNCIONARIO" },
      ]),
    });

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${tokenGerente}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Funcionário pode buscar seu próprio usuário", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "3",
        nome: "Funcionário",
        cargo: "FUNCIONARIO",
      }),
    });

    const res = await request(app)
      .get("/users/3")
      .set("Authorization", `Bearer ${tokenFuncionario}`);

    expect([200, 404]).toContain(res.status);
  });
});
