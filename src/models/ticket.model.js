import { Schema as _Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'; // Asegúrate de instalar esta dependencia

const Schema = _Schema;

// Crear un esquema para los tickets
const ticketSchema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  purchase_datetime: { 
    type: Date, 
    default: Date.now // Actúa como un campo created_at
  },
  amount: { 
    type: Number, 
    required: true 
  },
  purchaser: { 
    type: String, 
    required: true 
  }
}, { timestamps: true }); // Los timestamps agregan automáticamente createdAt y updatedAt al esquema

// Usar el plugin uniqueValidator para asegurar que el código sea único
ticketSchema.plugin(uniqueValidator);

// Antes de guardar, generar código único para el ticket
ticketSchema.pre('save', function(next) {
  if (this.isNew) {
    // Genera un código único aquí. Asegúrate de que el método que uses produzca un código que no choque con otros.
    // El código siguiente es solo un ejemplo y puede no ser suficiente para garantizar la unicidad en todas las circunstancias.
    this.code = `TCKT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

// Crear el modelo
const Ticket = model('Ticket', ticketSchema);

export default Ticket;
