    import { promises as fs } from 'fs';
    import { v4 as uuidv4 } from 'uuid';

    export class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = [];
    }

    async createCart() {
        await this.readCartsFromFile();

        const newCart = {
        id: uuidv4(),
        products: [],
        };

        this.carts.push(newCart);

        await this.saveCartsToFile();

        return newCart;
    }

    async getCartById(id) {
        await this.readCartsFromFile();
        return this.carts.find(cart => cart.id === id);
    }

    async addProductToCart(cart, product) {
        cart.products.push({
        id: product.id,
        quantity: 1, // Inicializamos la cantidad en 1
        });

        await this.updateCart(cart);
    }

    async updateCart(updatedCart) {
        const existingIndex = this.carts.findIndex(cart => cart.id === updatedCart.id);

        if (existingIndex !== -1) {
        this.carts[existingIndex] = updatedCart;
        await this.saveCartsToFile();
        }
    }

    async readCartsFromFile() {
        try {
        const cartsFromTxt = await fs.readFile(this.filePath, 'utf-8');
        this.carts = JSON.parse(cartsFromTxt);
        } catch (error) {
        console.error('Error al leer los carritos del archivo:', error.message);
        this.carts = [];
        }
    }

    async saveCartsToFile() {
        try {
        await fs.writeFile(this.filePath, JSON.stringify(this.carts));
        } catch (error) {
        console.error('Error al guardar carritos:', error.message);
        }
    }
    }