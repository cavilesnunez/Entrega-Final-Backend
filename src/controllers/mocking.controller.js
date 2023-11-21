import faker from 'faker';
import {logger}  from '../utils/logger.js';

export const getMockingProducts = (req, res) => {
  try {
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
    logger.info('Generados 100 productos mock exitosamente');
    res.json(products);
  } catch (error) {
    logger.error(`Error al generar productos mock: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
