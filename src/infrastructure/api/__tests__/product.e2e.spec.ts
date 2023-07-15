import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {

	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it("should create a product", async () => {
		const response = await request(app)
			.post("/product")
			.send({
				name: "Product 1",
				price: 100
			});

		expect(response.status).toBe(200);
		expect(response.body.name).toBe("Product 1");
		expect(response.body.price).toBe(100);
	});

	it("should not create a product", async () => {
		const response = await request(app).post("/product").send({
			name: "Product 1",
		});
		expect(response.status).toBe(500);
	});

	it("should list all products", async () => {
		const response = await request(app)
			.post("/product")
			.send({
				name: "Product 1",
				price: 100
			});
		expect(response.status).toBe(200);
		const response2 = await request(app)
			.post("/product")
			.send({
				name: "Product 2",
				price: 200
			});
		expect(response2.status).toBe(200);
		const response3 = await request(app).get("/product");
		expect(response3.status).toBe(200);
		expect(response3.body.products.length).toBe(2);
		expect(response3.body.products[0].name).toBe("Product 1");
		expect(response3.body.products[0].price).toBe(100);
		expect(response3.body.products[1].name).toBe("Product 2");
		expect(response3.body.products[1].price).toBe(200);


		const listResponseXML = await request(app)
			.get("/product")
			.set("Accept", "application/xml")
			.send();

		expect(listResponseXML.status).toBe(200);
		expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
		expect(listResponseXML.text).toContain("<products>");
		expect(listResponseXML.text).toContain("<product>");
		expect(listResponseXML.text).toContain("<name>Product 1</name>");
		expect(listResponseXML.text).toContain("<price>100</price>");
		expect(listResponseXML.text).toContain("<name>Product 2</name>");
		expect(listResponseXML.text).toContain("<price>200</price>");
		expect(listResponseXML.text).toContain("</product>");
		expect(listResponseXML.text).toContain("</products>");
	});

	it("should get a product", async () => {
		const response = await request(app)
			.post("/product")
			.send({
				name: "Product 1",
				price: 100
			});
		expect(response.status).toBe(200);
		const response2 = await request(app).get(`/product/${response.body.id}`);
		expect(response2.status).toBe(200);
		expect(response2.body.name).toBe("Product 1");
		expect(response2.body.price).toBe(100);

		const responseXML = await request(app)
			.get(`/product/${response.body.id}`)
			.set("Accept", "application/xml")
			.send();

		expect(responseXML.status).toBe(200);
		expect(responseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
		expect(responseXML.text).toContain("<product>");
		expect(responseXML.text).toContain("<name>Product 1</name>");
		expect(responseXML.text).toContain("<price>100</price>");
		expect(responseXML.text).toContain("</product>");
	});

	it("should not get a product", async () => {
		const response = await request(app).get(`/product/1`);
		expect(response.status).toBe(500);
	});

	it("should update a product", async () => {
		// creating
		const response = await request(app)
			.post("/product")
			.send({
				name: "Product 1",
				price: 100
			});
		expect(response.status).toBe(200);
		// updating
		const response2 = await request(app)
			.put(`/product/${response.body.id}`)
			.send({
				name: "Product 2",
				price: 200
			});
		expect(response2.status).toBe(200);
		// checking
		const response3 = await request(app).get(`/product/${response.body.id}`);
		expect(response3.status).toBe(200);
		expect(response3.body.name).toBe("Product 2");
		expect(response3.body.price).toBe(200);
	});

});