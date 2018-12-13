const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Helper
const {ensureAuthenticated} = require('../helpers/auth')

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res) => {
    //use the mongo model to find the document
    Idea.find({})
        .sort({date: 'desc'})
    //find the ideas
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
})

router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        //match
        _id: req.params.id
    })
    .then(idea => {
        
        res.render('ideas/edit', {
            idea: idea
        });
    })
    
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    //if there is no title
    if(!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details) {
        errors.push({text: 'Please add some detail'});
    }
    if(errors.length > 0) {
        //we want to keep the content in the form after we submit it
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        //create an object
        const newIdea = {
            title: req.body.title,
            detail: req.body.details
        }

        new Idea(newIdea)
            .save()
            .then(idea => {
                res.redirect('./ideas');
            })
    }
});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    //res.send('PUT')
    Idea.findOne({
        //match
    _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title,
        idea.detail = req.body.details
        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            })

    })
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        });
})

module.exports = router;