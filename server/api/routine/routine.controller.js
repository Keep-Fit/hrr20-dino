const Promise = require('bluebird');
// const Models = require('../../../database/database_config');
const db = require('../../../database/db_m.js');

module.exports = {
  //Adds a user's routine to the Routine table
  addARoutine: function (req, res, next) {
    console.log('routine adding, req', req.body);
    let routine = {
        name: req.body.name,
        description: req.body.description,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        repeat: req.body.repeat,
        completed: req.body.completed,
        _creator: req.body.userId,
        tasks: req.body.tasks
    }
    console.log("The thing is being made")
    db.Routine.create(routine, (err, resp) => {
      if (err) console.log(err);
      console.log('DB updated with: ', resp);
      res.status(201).send(resp);
    });
    // Models.Routine.build({
    //   name: req.body.name,
    //   description: req.body.description,
    //   start_time: req.body.start_time,
    //   end_time: req.body.end_time,
    //   repeat: req.body.repeat,
    //   completed: req.body.completed
    // }).save()
    // .then(function(){
    //   res.status(201).send('Successfully created routine!')
    // })
    // .catch(function(error){
    //   res.status(404).send(error);
    // })
  },

  //Gets the routines for the current user
  getMyRoutines: function(req, res, next) {

    db.Routine.find((err, data)=>{
      if (err) console.log(err);
      console.log('sending data back', data);
      res.send(data);
    });
    // Models.Routine.findAll({
    //   where: {
    //     userId: req.params.userId
    //   }
    // })
    // .then(function(routines){
    //   res.status(200).json(routines);
    // })
    // .catch(function(error) {
    //   res.send(error);
    // });
  },

  //Gets a single routine for a user
  getARoutine: function(req, res, next) {
    Models.Routine.findAll({
      where: {
        id: req.params.routineId,
        userId: req.params.userId
      }
    })
    .then(function(routine){
      console.log(routine);
      res.status(200).json(routine);
    })
    .catch(function(error) {
      res.send(error);
    });
  },

  //Deletes a user's routine from the Routine table
  deleteARoutine: function(req, res, next) {
    Models.Routine.destroy({
      where: {
        id: req.params.routineId,
        userId: req.params.userId
      }
    })
    .then(function() {
      res.status(200).send('Routine successfully deleted!')
    })
    .catch(function(error){
      res.send(error);
    });
  },

  updateARoutine: function(req, res, next) {
    //Syntax for this might be tricky, as we have to dynamically
    //update a user-specified routine property.
  },
}
