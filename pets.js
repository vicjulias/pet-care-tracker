const express = require('express');
const router = express.Router();
const Pet = require('../models/pet'); 
const { isAuthenticated } = require('../middleware/auth');

// add a new pet:
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newPet = new Pet({
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      careInstructions: req.body.careInstructions,
      feedingSchedule: req.body.feedingSchedule,
      medicalNeeds: req.body.medicalNeeds,
      image: req.body.image,
      user: req.session.userId,
    });
    await newPet.save();
    res.redirect('/pets');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating pet');
  }
});

// update a particular pet - for now just cats:
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.redirect('/pets');
    if (!pet.user.equals(req.session.userId)) return res.redirect('/pets');

    pet.name = req.body.name;
    pet.breed = req.body.breed;
    pet.age = req.body.age;
    pet.careInstructions = req.body.careInstructions;
    pet.feedingSchedule = req.body.feedingSchedule;
    pet.medicalNeeds = req.body.medicalNeeds;
    pet.image = req.body.image;

    await pet.save();
    res.redirect(`/pets/${pet._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating pet');
  }
});

// Show pets when loggin:
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.session.userId });
    res.render('pets/index', { pets });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching pets');
  }
});

// GET /new route right here:
router.get('/new', isAuthenticated, (req, res) => {
  res.render('pets/new');
});

// Show pets details:
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.redirect('/pets');
    if (!pet.user.equals(req.session.userId)) return res.redirect('/pets');
    res.render('pets/show', { pet });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching pet');
  }
});

module.exports = router;