const express = require("express");
const router = express.Router();
const Deck = require("../models/Deck");
const auth = require("../middleware/auth"); // Assume you'll create this middleware

// Create a new deck
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, cards } = req.body;
    const newDeck = new Deck({
      name,
      description,
      cards,
      owner: req.user.id,
    });
    const deck = await newDeck.save();
    res.json(deck);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all decks for a user
router.get("/", auth, async (req, res) => {
  try {
    const decks = await Deck.find({ owner: req.user.id });
    res.json(decks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Additional routes for updating and deleting decks can be added here

module.exports = router;
