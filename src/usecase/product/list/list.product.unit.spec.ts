import ListProductUseCase from "./list.product.usecase";

const MockRepository = jest.fn(() => ({
	find: jest.fn(),
	findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
	create: jest.fn(),
	update: jest.fn(),
}));

const input = {};
const product1 = {
		id: '1',
		name: 'Product 1',
		price: 10,
	}
	const product2 = {
		id: '2',
		name: 'Product 2',
		price: 20,
	}
const output = {
		products: 
		[
			product1,
			product2
		]
	}

describe("Unit Test list product use case", () => {

	it("should list all products", async () => {
		const productRepository = MockRepository();
		const usecase = new ListProductUseCase(productRepository);

		const response = await usecase.execute(input);

		expect(response).toEqual(output);
	});

});