import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

const input = {};

const createInput1 = {
	name: 'Product 1',
	price: 10,
};
const createInput2 = {
	name: 'Product 2',
	price: 10,
};
const output = {
	products:
		[
			{
				id: expect.any(String),
				name: createInput1.name,
				price: createInput1.price,
			},
			{
				id: expect.any(String),
				name: createInput2.name,
				price: createInput2.price,
			}
		]
}

describe("Integration test for listing product use case", () => {

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

	it("should list all products", async () => {
		const productRepository = new ProductRepository();

		// create products to be listed
		const createProductUseCase = new CreateProductUseCase(productRepository);
		await createProductUseCase.execute(createInput1);
		await createProductUseCase.execute(createInput2);

		// list products
		const listProductUseCase = new ListProductUseCase(productRepository);
		const response = await listProductUseCase.execute(input);

		expect(response).toEqual(output);
	});
});