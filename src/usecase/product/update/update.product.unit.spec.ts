import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create('a','Product', 10);
const input = {
	id: product.id,
	name: 'Product Updated',
	price: 20,
};

const MockRepository = jest.fn(() => ({
	find: jest.fn().mockReturnValue(Promise.resolve(product)),
	findAll: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
}));

describe('Unit Testing Update Product Use Case', () => {

	it('should update a product', async () => {
		const productRepository = MockRepository();
		const productUpdateUseCase = new UpdateProductUseCase(productRepository);

		const response = await productUpdateUseCase.execute(input);

		expect(response).toEqual(input);
	});

	it('should throw an error when id is missing', async () => {
		const productRepository = MockRepository();
		productRepository.find.mockImplementation(() => {
			throw new Error('Id is required');
		});
		const productUpdateUseCase = new UpdateProductUseCase(productRepository);

		input.id = '';

		await expect(productUpdateUseCase.execute(input)).rejects.toThrowError('Id is required');
	});

	it('should throw an error when product does not exist', async () => {
		const productRepository = MockRepository();
		productRepository.update.mockImplementation(() => {
			throw new Error('Product not found');
		});

		const productUpdateUseCase = new UpdateProductUseCase(productRepository);

		input.id = '1';
		await expect(productUpdateUseCase.execute(input)).rejects.toThrowError('Product not found');
	});


});