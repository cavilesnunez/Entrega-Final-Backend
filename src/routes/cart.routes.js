
    import { Router } from 'express';
    import { CartManager } from '../controllers/cartManager.js';

    const cartRouter = Router();
    const cartManager = new CartManager('./src/models/carts.json', './src/models/products.json');

    // Obtiene todos los carritos
    cartRouter.get('/', async (req, res) => {
        const { limit } = req.query

        try {
            const foundCarts = await cartManager.find().limit(limit)

            res.status(200).send({ result: "OK", message: foundCarts })
        }
    
        catch (error) {
            res.status(400).send({ error: `Error consulting the carts: ${error}` })
        }
    })

    // Obtiene un carrito por su id
    cartRouter.get('/:cid', async (req, res) => {
        const { cid } = req.params

        try {
            const foundCart = await cartManager.findById(cid)

            if (foundCart)
                res.status(200).send({ result: 'OK', message: foundCart })
            else
                res.status(404).send({ result: 'Cart Not Found', message: foundCart })
            }

        catch (error) {
            res.status(400).send({ error: `Error consulting the cart: ${error}` })
        }
    })

    // Crea un nuevo carrito
    cartRouter.post('/', async (req, res) => {
        try {
            const newCart = await cartManager.create({
                products: []
            })

            res.status(200).send({ result: 'OK', message: newCart })
        }

        catch (error) {
            res.status(400).send({ error: `Error creating the cart: ${error}` })
        }
    })

    // Agrega un producto a un carrito
    cartRouter.post('/:cid/products/:pid', async (req, res) => {
        const { cid, pid } = req.params
        const { quantity } = req.body
        
            try {
            const foundCart = await cartManager.findById(cid)
        
            if (foundCart) {
                foundCart.products.push({ id_prod: pid, quantity: quantity })
        
                const updatedCart = await foundCart.save()
        
                res.status(200).send({ result: 'OK', message: 'Product added to cart', cart: updatedCart })
            } else {
                res.status(404).send({ error: 'Cart not found' })
            }
            }
        
            catch (error) {
            res.status(400).send({ error: `Error adding a product to cart: ${error}` })
            }
        })

    // Actualiza la cantidad de un producto en un carrito
    cartRouter.put('/:cid', async (req, res) => {
        const { cid } = req.params
        const { products } = req.body
        
            try {
            const foundCart = await cartManager.findById(cid)
        
            if (foundCart) {
                foundCart.products = products
        
                const updatedCart = await foundCart.save()
        
                res.status(200).send({ result: 'OK', message: 'Cart updated', cart: updatedCart })
            } else {
                res.status(404).send({ error: 'Cart Nout Found' })
            }
            }
        
            catch (error) {
            res.status(400).send({ error: `Error updating the cart: ${error}` })
            }
        })



    // Actualiza un producto de un carrito solo por cantidad
    cartRouter.put('/:cid/products/:pid', async (req, res) => {
        const { cid, pid } = req.params
        const { quantity } = req.body
        
            try {
            const foundCart = await cartManager.findById(cid)
        
            if (foundCart) {
                const productIndex = foundCart.products.findIndex(product => product.id_prod.toString() === pid)
        
                if (productIndex !== -1) {
                foundCart.products[productIndex].quantity = quantity
        
                const updatedCart = await foundCart.save()
        
                res.status(200).send({ result: 'OK', message: 'Cart quantity of the product updated', cart: updatedCart })
                } else {
                res.status(404).send({ error: 'Product Not Found on cart' })
                }
            } else {
                res.status(404).send({ error: 'Cart Not Found' })
            }
            }
        
            catch (error) {
            res.status(400).send({ error: `Error updating the product quantity on the cart: ${error}` })
            }
        })



    // Elimina un producto de un carrito
    cartRouter.delete('/:cid/products/:pid', async (req, res) => {
        const { cid, pid } = req.params
        
            try {
            const foundCart = await cartManager.findById(cid)
        
            if (foundCart) {
                const productIndex = foundCart.products.findIndex(product => product.id_prod === pid)
        
                if (productIndex !== -1) {
                foundCart.products.splice(productIndex, 1)
        
                const updatedCart = await foundCart.save()
        
                res.status(200).send({ result: 'OK', message: 'Product deleted from the cart', cart: updatedCart })
                } else {
                res.status(404).send({ error: 'Product Not Found in Cart' })
                }
            } else {
                res.status(404).send({ error: 'Cart Not Found' })
            }
            }
        
            catch (error) {
            res.status(400).send({ error: `Error deleting the product from the cart: ${error}` })
            }
        })





    // Elimina un producto de un carrito:_______________________________
    // cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    // const cid = parseInt(req.params.cid, 10);
    // const pid = parseInt(req.params.pid, 10);
    // const cart = await cartManager.getCartById(cid);
    // if (!cart) {
    //     res.status(404).json({ error: 'Cart not found' });
    //     return;
    // }
    // const productIndex = cart.products.findIndex(
    //     cart => cart.id === pid
    // );
    // if (productIndex === -1) {
    //     res.status(404).json({ error: 'Producto not found carrito' });
    //     return;
    // }
    // cart.products.splice(productIndex, 1);
    // await cartManager.updateCart(cart);
    // res.json(cart);
    // });


    // Elimina todos los productos de un carrito
    cartRouter.delete('/:cid', async (req, res) => {
        const { cid } = req.params
        
            try {
            const foundCart = await cartManager.findById(cid)
        
            if (foundCart) {
                foundCart.products = []
        
                const updatedCart = await foundCart.save()
        
                res.status(200).send({ result: 'OK', message: 'All the products were deleted from the cart', cart: updatedCart })
            } else {
                res.status(404).send({ error: 'Cart Not Found' })
            }
            }
        
            catch (error) {
            res.status(400).send({ error: `Error deleting all the products from the cart: ${error}` })
            }
        })




    export default cartRouter;