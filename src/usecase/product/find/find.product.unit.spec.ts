import FindProductUseCase from "./find.product.usecase";

const MockRepository = jest.fn(() => ({
	find: jest.fn().mockReturnValue(Promise.resolve(output)),
	findAll: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
}));

const input = {
	id: '1'
};

const output = {
	id: '1',
	name: 'Product',
	price: 10,
};

describe('Unit Testing Find Product Use Case', () => {

	it('should find a product', async () => {
		const productRepository = MockRepository();
		const productFindUseCase = new FindProductUseCase(productRepository);

		const response = await productFindUseCase.execute(input);

		expect(response).toEqual(output);
	});

	it('should thrown an error when id is missing', async () => {
		const productRepository = MockRepository();
		const productFindUseCase = new FindProductUseCase(productRepository);

		input.id = '';

		await expect(productFindUseCase.execute(input)).rejects.toThrow(
			'Id is required',
		);
	});

	it('should thrown an error when product is not found', async () => {
		const productRepository = MockRepository();
		const productFindUseCase = new FindProductUseCase(productRepository);

		productRepository.find.mockImplementation(() => {
			throw new Error('Product not found');
		});

		input.id = '123';

		await expect(productFindUseCase.execute(input)).rejects.toThrow(
			'Product not found',
		);
	});

});