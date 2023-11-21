import Product from '../models/products.model.js';
import CustomError from '../utils/customError.js';
import { errorMessages } from '../utils/messageErrors.js';
import logger from '../utils/logger.js';


export const createProduct = async (req, res, next) => {
    try {
        // Extraer la información del producto del cuerpo de la solicitud
        const { title, description, price, stock, category, status, code, thumbnails } = req.body;

        // Crear un nuevo documento de producto
        const newProduct = new productModel({
            title,
            description,
            price,
            stock,
            category,
            status,
            code,
            thumbnails
        });

        // Guardar el producto en la base de datos
        await newProduct.save();

        // Registrar en el logger y enviar respuesta
        logger.info('Producto creado exitosamente');
        res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        logger.error(`Error al crear producto: ${error.message}`);
        next(new CustomError(400, errorMessages.PRODUCT_CREATION_ERROR));
    }
};



export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
        };
        const filter = {};

        if (query && query === 'category') {
            const categoryName = req.query.categoryName;
            if (categoryName) {
                filter.category = categoryName;
            }
        }

        const result = await Product.paginate(filter, options);

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        });
        logger.info('Productos obtenidos exitosamente');
    } catch (error) {
        logger.error(`Error al obtener productos: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
        logger.info(`Producto obtenido: ID ${req.params.pid}`);
    } catch (error) {
        logger.error(`Error al obtener producto por ID: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await Product.create(productData);
        res.json(newProduct);
        logger.info('Nuevo producto agregado');
    } catch (error) {
        logger.error(`Error al agregar producto: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updatedFields,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProduct);
        logger.info(`Producto actualizado: ID ${req.params.pid}`);
    } catch (error) {
        logger.error(`Error al actualizar producto: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).send("Producto eliminado correctamente.");
        logger.info(`Producto eliminado: ID ${req.params.pid}`);
    } catch (error) {
        logger.error(`Error al eliminar producto: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const renderProducts = async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };
        const result = await Product.paginate({}, options);

        res.render('index', {
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });
        logger.info('Productos renderizados en la vista');
    } catch (error) {
        logger.error(`Error al renderizar productos: ${error.message}`);
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
};