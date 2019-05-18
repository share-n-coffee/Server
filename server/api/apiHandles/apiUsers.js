const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('./../../database/dbController');
const jwtAuth = require('../../middleware/jwtAuth');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('../../middleware/objectIdValidation');

const router = express.Router();

router.route('/').get((req, res) => {
  const DBController = new ClassDBController('user');
  let fields = null;

  if (req.query.getFields) {
    fields = req.query.getFields.replace(/,/g, ' ');
    delete req.query.getFields;
  }

  DBController.querySearch(req.query, fields)
    .then(results => res.status(200).json(results))
    .catch(error => res.status(404));
});

router
  .route('/:userId', objectIdValidation)
  .get((req, res) => {
    const DBController = new ClassDBController('user');
    let fields = null;

    if (Object.keys(req.query).length && req.query.getFields) {
      fields = req.query.getFields.replace(/,/g, ' ');
    }

    DBController.getUserById(req.params.userId, fields)
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).send(error));
  })
  .put((req, res) => {
    if (ObjectId.isValid(req.body.newDepartment)) {
      const DBController = new ClassDBController('user');
      DBController.putUserDepartment(req.params.userId, req.body.newDepartment)
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).send(error));
    } else {
      res.status(404).send("New Department's id is not valid ObjectId!");
    }
  });

router.route('/ban/:userId', objectIdValidation).put(adminAuth, (req, res) => {
  const searchId = req.params.userId;
  const { ban } = req.body;

  if (ban) {
    const DBController = new ClassDBController('user');
    const userQuery = { _id: searchId };

    DBController.putUserBan(userQuery, {
      expired: ban.status ? 4102389828505 : 0,
      ...ban
    })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).send(error));
  }
});

module.exports = router;
