import faker from 'faker';

export const getMockingProducts = (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      image: faker.image.imageUrl(),
      category: faker.commerce.department()
    });
  }
  res.json(products);
};
