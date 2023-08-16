import { Router } from 'express'
import { ProductManager } from '../controllers/productManager.js'

const productManager = new ProductManager('src/models/productos.txt')

const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
    const { limit } = req.query

    const prods = await productManager.getProducts()
    const products = prods.slice(0, limit)
    res.status(200).send(products)

})

productsRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const prod = await productManager.getProductById(parseInt(id))

    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("Producto no existente")
})

productsRouter.post('/', async (req, res) => {
    const confirmacion = await productManager.addProduct(req.body)

    if (confirmacion)
        res.status(200).send("Producto creado correctamente")
    else
        res.status(400).send("Producto ya existente")
})

productsRouter.put('/:id', async (req, res) => {

    const confirmacion = await productManager.updateProduct(req.params.id, req.body)

    if (confirmacion)
        res.status(200).send("Producto actualizado correctamente")
    else
        res.status(404).send("Producto no encontrado")

})

productsRouter.delete('/:id', async (req, res) => {

    const confirmacion = await productManager.deleteProduct(req.params.id)

    if (confirmacion)
        res.status(200).send("Producto eliminado correctamente")
    else
        res.status(404).send("Producto no encontrado")
})

export default productsRouter