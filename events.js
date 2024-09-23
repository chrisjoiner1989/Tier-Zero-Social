const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// Create a new event
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user.id,
    });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Additional routes for updating and deleting events can be added here

module.exports = router;
