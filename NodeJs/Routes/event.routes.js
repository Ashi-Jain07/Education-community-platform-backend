import { createEvent, deleteEvent, getEventById, getEvents, rsvpEvent } from "../Controlller/event.controller.js";

export function eventRoutes(app) {
    app.get("/events", getEvents);
    app.get("/events/:id", getEventById);
    app.post("/events", createEvent);
    app.delete("/deleteEvent/:id", deleteEvent);
    app.post("/events/:id/rsvp", rsvpEvent);
};