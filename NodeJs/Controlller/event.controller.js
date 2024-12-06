import eventModel from "../Model/event.model.js";

// Fetch all events with optional filtering
export async function getEvents(req, res) {
    const { location, date } = req.query;
    let filter = {};
    if (location) filter.location = location;
    if (date) filter.date = { $gte: new Date(date) }; // Show future events only

    try {
        const events = await eventModel.find(filter);
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch events" });
    }
};

// Fetch event details by ID
export async function getEventById(req, res) {
    try {
        const event = await eventModel.findById(req.params.id);
        res.json(event);
    } catch (err) {
        res.status(404).json({ error: "Event not found" });
    }
};

// Create a new event
export async function createEvent(req, res) {
    try {
        const newEvent = new eventModel(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: "Unable to create event" });
    }
};

//Delete a event
export function deleteEvent(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(404).json({ message: "Send id of a event" })
    }

    eventModel.findByIdAndDelete(id).then(data => {
        if (!data) {
            return res.status(400).json({ message: "Event not deleted" })
        }
        res.status(200).send(data)
    }).catch(err => res.status(500).json({ message: err }))
};

// RSVP for an event
export async function rsvpEvent(req, res) {
    const { id } = req.params;
    const { user } = req.body;

    try {
        const event = await eventModel.findById(id);
        if (event.attendees.length >= event.capacity) {
            return res.status(400).json({ error: "Event is full" });
        }

        if (!event.attendees.includes(user)) {
            event.attendees.push(user);
            await event.save();
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: "Unable to RSVP" });
    }
};