import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";

export default class FindProductUseCase {
	private productRepository: ProductRepositoryInterface;

	constructor(productRepository: ProductRepositoryInterface) {
			this.productRepository = productRepository;
	}

	async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
		if (input.id.length === 0) {
			throw new Error("Id is required");
		}
		const product = await this.productRepository.find(input.id);
		return {
				id: product.id,
				name: product.name,
				price: product.price
		};
	}
}