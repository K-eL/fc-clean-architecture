import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Integration test for finding product use case", () => {

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

	it("should find a product", async () => {
		const productRepository = new ProductRepository();
		const usecase = new FindProductUseCase(productRepository);

		// create a product to be found
		const product = ProductFactory.create("a", "Product 01", 123);
		await productRepository.create(product);

		// find the product
		const input = {
			id: product.id,
		};

		const output = {
			id: product.id,
			name: product.name,
			price: product.price,
		};

		const result = await usecase.execute(input);

		expect(result).toEqual(output);
	});

	it ("should throw an error when product id is missing", async () => {
		const productRepository = new ProductRepository();
		const usecase = new FindProductUseCase(productRepository);

		const input = {
			id: "",
		};

		await expect(() => {
			return usecase.execute(input);
		}).rejects.toThrow("Id is required");
	});

	it ("should throw an error when product is not found", async () => {
		const productRepository = new ProductRepository();
		const usecase = new FindProductUseCase(productRepository);

		const input = {
			id: "1",
		};

		await expect(() => {
			return usecase.execute(input);
		}).rejects.toThrow("Product not found");
	});
});