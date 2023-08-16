    import { promises as fs } from 'fs';
    import { v4 as uuidv4 } from 'uuid';

    export class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.productIdCounter = 1;
    }

    async addProduct(product) {
        if (!this.products.length) {
        await this.readProducts();
        }

        if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock
        ) {
        throw new Error('Faltan campos obligatorios');
        }

        const codigo = product.code;
        const productoExistente = this.products.find((producto) => producto.code === codigo);
        if (productoExistente) {
        throw new Error('El código del producto ya existe');
        }

        const productoConId = {
        ...product,
        id: uuidv4(),
        };

        this.products.push(productoConId);

        await this.saveProductsToFile();
    }

    async getProducts(limit = 0) {
        await this.readProducts();
        return limit ? this.products.slice(0, limit) : this.products;
    }

    async getProductById(id) {
        await this.readProducts();
        const producto = this.products.find((producto) => producto.id === id);
        if (!producto) {
        console.error('No encontrado');
        return null;
        }
        return producto;
    }

    async updateProduct(id, updatedData) {

        await this.readProducts();
        const productoExistente = this.products.find((producto) => producto.id === id);
        if (!productoExistente) {
        console.log('Producto no encontrado');
        return;
        }

        const productoActualizado = {
        ...productoExistente,
        ...updatedData,
        id,
        };

        this.products = this.products.map((producto) =>
        producto.id === id ? productoActualizado : producto
        );

        await this.saveProductsToFile();
        console.log('Producto actualizado');
    }

    async readProducts() {
        try {
        const productsFromTxt = await fs.readFile(this.filePath, 'utf-8');
        this.products = JSON.parse(productsFromTxt);
        } catch (error) {
        console.error('Error al leer archivo:', error.message);
        this.products = [];
        }
    }

    async deleteProduct(id) {

        await this.readProducts();
        const index = this.products.findIndex((producto) => producto.id === id);

        if (index === -1) {
        console.log('Producto no encontrado');
        return;
        }

        this.products.splice(index, 1);
        await this.saveProductsToFile();
        console.log('Producto eliminado');
    }

    async saveProductsToFile() {
        try {
        await fs.writeFile(this.filePath, JSON.stringify(this.products));
        } catch (error) {
        console.error('Error al guardar el archivo:', error.message);
        }
    }
    }