import db from '../models/index.js';

const { CorporateCalendar } = db
// ==================== Create Event ====================
export const HandleCreateEvent = async (req, res) => {
  try {
    const { eventtitle, eventdate, description, audience } = req.body;

    if (!eventtitle || !eventdate || !description || !audience) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if event already exists for the organization
    const event = await CorporateCalendar.findOne({
      where: { eventtitle, organizationId: req.ORGID },
    });

    if (event) {
      return res.status(409).json({ success: false, message: "Event already exists" });
    }

    const newEvent = await CorporateCalendar.create({
      eventtitle,
      eventdate,
      description,
      audience,
      organizationId: req.ORGID,
    });

    return res.status(200).json({ success: true, message: "Event created successfully", data: newEvent });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get All Events ====================
export const HandleAllEvents = async (req, res) => {
  try {
    const events = await CorporateCalendar.findAll({
      where: { organizationId: req.ORGID },
    });

    return res.status(200).json({ success: true, message: "All events retrieved successfully", data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get Single Event ====================
export const HandleEvent = async (req, res) => {
  try {
    const { eventID } = req.params;

    const event = await CorporateCalendar.findOne({
      where: { id: eventID, organizationId: req.ORGID },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, message: "Event retrieved successfully", data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Update Event ====================
export const HandleUpdateEvent = async (req, res) => {
  try {
    const { eventID, updatedData } = req.body;

    const [updatedRows, [updatedEvent]] = await CorporateCalendar.update(updatedData, {
      where: { id: eventID },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, message: "Event updated successfully", data: updatedEvent });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Delete Event ====================
export const HandleDeleteEvent = async (req, res) => {
  try {
    const { eventID } = req.params;

    const event = await CorporateCalendar.findOne({ where: { id: eventID } });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    await event.destroy();

    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
