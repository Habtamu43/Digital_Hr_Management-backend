import db from "../config/db.js";

const { CorporateCalendar } = db;

// ==================== Create Event ====================
export const HandleCreateEvent = async (req, res) => {

  console.log("req.organizationId:", req.organizationId); // ✅ Add this

  try {
    
  console.log("req.organizationId:", req.organizationId); // ✅ Add this
  
    const { eventTitle, eventDate, description, audience } = req.body;

    if (!eventTitle || !eventDate || !description || !audience) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const event = await CorporateCalendar.findOne({
      where: { eventTitle, organizationId: req.organizationId }, // ✅ use middleware value
    });

    if (event) {
      return res
        .status(409)
        .json({ success: false, message: "Event already exists" });
    }

    const newEvent = await CorporateCalendar.create({
      eventTitle,
      eventDate: new Date(eventDate),
      description,
      audience,
      organizationId: req.organizationId, // ✅ use middleware value
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Get All Events ====================
export const HandleAllEvents = async (req, res) => {
  try {
    const events = await CorporateCalendar.findAll({
      where: { organizationId: req.organizationId }, // ✅ use middleware value
    });

    return res.status(200).json({
      success: true,
      message: "All events retrieved successfully",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Get Single Event ====================
export const HandleEvent = async (req, res) => {
  try {
    const { eventID } = req.params;

    const event = await CorporateCalendar.findOne({
      where: { id: eventID, organizationId: req.organizationId }, // ✅ use middleware value
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Update Event ====================
export const HandleUpdateEvent = async (req, res) => {
  try {
    const { eventID, ...updatedData } = req.body;

    const [updatedRows, [updatedEvent]] = await CorporateCalendar.update(
      updatedData,
      {
        where: { id: eventID, organizationId: req.organizationId }, // ✅ use middleware value
        returning: true,
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Delete Event ====================
export const HandleDeleteEvent = async (req, res) => {
  try {
    const { eventID } = req.params;

    const event = await CorporateCalendar.findOne({
      where: { id: eventID, organizationId: req.organizationId }, // ✅ use middleware value
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    await event.destroy();

    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
