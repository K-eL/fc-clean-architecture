import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

const input = {
	name: 'Product',
	price: 10,
};

describe("Integration test for creating product use case", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

	it("should create a product", async () => {
		const productRepository = new ProductRepository();
		const usecase = new CreateProductUseCase(productRepository);
		
		const output = await usecase.execute(input);

		expect(output).toEqual({
			id: expect.any(String),
			name: input.name,
			price: input.price,
		});
	});

	it ("should throw an error when product name is missing", async () => {
		const productRepository = new ProductRepository();
		const usecase = new CreateProductUseCase(productRepository);

		input.name = "";
		input.price = 10;

		await expect(() => {
			return usecase.execute(input);
		}).rejects.toThrow("Name is required");
	});

	it ("should throw an error when product price is zero", async () => {
		const productRepository = new ProductRepository();
		const usecase = new CreateProductUseCase(productRepository);

		input.name = "Product"
		input.price = 0;

		await expect(() => {
			return usecase.execute(input);
		}).rejects.toThrow("Price must be greater than zero");
	});

});