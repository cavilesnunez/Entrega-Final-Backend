import { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

//Definicion de mi schema de datos
const productSchema = new Schema({
	title: {
		type: String,
		required: true
	},

	description: {
		type: String,
		required: true
	},

	category: {
		type: String,
		required: true,
		index: true
	},

	price: {
		type: Number,
		required: true
	},

	stock: {
		type: Number,
		required: true
	},

	code: {
		type: String,
		required: true,
		unique: true
	},

	status: {
		type: Boolean,
		default: true
	},

	thumbnail: [String]
})

productSchema.plugin(paginate)

const ProductModel = model('products', productSchema) //Defino mi modelo con un nombre y un schema

export default ProductModel