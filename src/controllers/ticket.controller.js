import ticket from "../models/ticket.model.js";
import logger from '../utils/logger.js';


// Crear un nuevo ticket
export async function createTicket(req, res) {
  try {
    const newTicket = new ticket({
      amount: req.body.amount,
      purchaser: req.body.purchaser,
    });

    const savedTicket = await newTicket.save();
    logger.info('Ticket creado exitosamente');
    return res.status(201).json(savedTicket);
  } catch (error) {
    logger.error(`Error al crear ticket: ${error.message}`);
    return res.status(500).json(error);
  }
}

// Obtener todos los tickets
export async function getTickets(req, res) {
  try {
    const tickets = await ticket.find();
    logger.info('Tickets obtenidos exitosamente');
    return res.status(200).json(tickets);
  } catch (error) {
    logger.error(`Error al obtener tickets: ${error.message}`);
    return res.status(500).json(error);
  }
}

// Obtener un ticket por ID
export async function getTicketById(req, res) {
  try {
    const ticketItem = await ticket.findById(req.params.id);
    if (ticketItem) {
      logger.info(`Ticket obtenido: ID ${req.params.id}`);
      return res.status(200).json(ticketItem);
    }
    logger.warning('Ticket no encontrado');
    return res.status(404).json({ message: 'Ticket not found' });
  } catch (error) {
    logger.error(`Error al obtener ticket por ID: ${error.message}`);
    return res.status(500).json(error);
  }
}

// Actualizar un ticket por ID
export async function updateTicket(req, res) {
  try {
    const updatedTicket = await ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    logger.info(`Ticket actualizado: ID ${req.params.id}`);
    return res.status(200).json(updatedTicket);
  } catch (error) {
    logger.error(`Error al actualizar ticket: ${error.message}`);
    return res.status(500).json(error);
  }
}

// Eliminar un ticket por ID
export async function deleteTicket(req, res) {
    try {
      await ticket.findByIdAndRemove(req.params.id);
      logger.info(`Ticket eliminado: ID ${req.params.id}`);
      return res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      logger.error(`Error al eliminar ticket: ${error.message}`);
      return res.status(500).json(error);
    }
}
