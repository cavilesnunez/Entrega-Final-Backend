// ticket.controller.js

import ticket from "../models/ticket.model.js";

// Crear un nuevo ticket
export async function createTicket(req, res) {
  try {
    // Crear un nuevo ticket con los datos del cuerpo de la solicitud
    const newTicket = new ticket({
      amount: req.body.amount,
      purchaser: req.body.purchaser,
    });

    // Guardar el ticket en la base de datos
    const savedTicket = await newTicket.save();

    // Devolver el ticket guardado como respuesta
    return res.status(201).json(savedTicket);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export async function getTickets(req, res) {
    try {
      const tickets = await ticket.find();
      return res.status(200).json(tickets);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  
  // Obtener un ticket por ID
  export async function getTicketById(req, res) {
    try {
      const ticketItem = await ticket.findById(req.params.id);
      if (ticketItem) {
        return res.status(200).json(ticketItem);
      }
      return res.status(404).json({ message: 'Ticket not found' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  
  // Actualizar un ticket por ID
  export async function updateTicket(req, res) {
    try {
      const updatedTicket = await ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json(updatedTicket);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  
  // Eliminar un ticket por ID
  export async function deleteTicket(req, res) {
    try {
      await ticket.findByIdAndRemove(req.params.id);
      return res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  