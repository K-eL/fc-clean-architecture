import e from "express";
import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../entity/product";
import * as yup from "yup";
import NotificationError from "../../@shared/notification/notification.error";

export default class ProductYupValidator implements ValidatorInterface<Product> {

	validate(entity: Product): void {
		try {
			yup.object()
				.shape({
					id: yup.string().required("Id is required"),
					name: yup.string().required("Name is required"),
					price: yup.number().required("Price is required").min(0.01, "Price must be greater than zero"),
				})
				.validateSync({
					id: entity.id,
					name: entity.name,
					price: entity.price,
				}, {
					abortEarly: false,
				});
		} catch (errors) {
			const e = errors as yup.ValidationError;
			e.errors.forEach((error) => {
				entity.notification.addError({
					context: "Product",
					message: error,
				});
			});
		}
		if (entity.notification.hasErrors()) {
			throw new NotificationError(entity.notification.getErrors());
		}
	}

}