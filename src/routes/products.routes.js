import { Router } from 'express'
import { ProductManager } from '../controllers/productManager.js'
import { productModel } from '../models/product.model.js'

const productManager = new ProductManager('./src/models/productos.json');

const productRouter = Router()

//Ruta GET para obtener productos
productRouter.get('/', async (req, res) => {
    
    try {
        const products = await productModel.find()
        res.status(200).send(products)
    } catch (error) {
        res.status(400).send("Error al consultar productos", error)
        
    }
    
    
    
    
    
    
    
    
    
    
    
    // const { limit } = req.query

    // const prods = await productManager.getProducts()
    // const products = prods.slice(0, limit)
    // res.status(200).send(products)

})

//Ruta GET para obtener un producto por ID
productsRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const prod = await productManager.getProductById(parseInt(id))

    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("Producto no existente")
})

//Ruta POST para crear un nuevo producto
productsRouter.post('/', async (req, res) => {
    const confirmacion = await productManager.addProduct(req.body)

    if (confirmacion)
        res.status(200).send("Producto creado correctamente")
    else
        res.status(400).send("Producto ya existente")
})

//Ruta PUT para actualizar un producto existente
productsRouter.put('/:id', async (req, res) => {

    const confirmacion = await productManager.updateProduct(req.params.id, req.body)

    if (confirmacion)
        res.status(200).send("Producto actualizado correctamente")
    else
        res.status(404).send("Producto no encontrado")

})

//Ruta DELETE para eliminar un producto por ID
productsRouter.delete('/:id', async (req, res) => {

    const confirmacion = await productManager.deleteProduct(req.params.id)

    if (confirmacion)
        res.status(200).send("Producto eliminado correctamente")
    else
        res.status(404).send("Producto no encontrado")
})

export default productsRouter