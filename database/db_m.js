var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// var ObjectId = require('mongodb').ObjectID
mongoose.connect('mongodb://localhost/dinotask');


// Routine document. Completed/end_time can be used for history purposes.
var routineSchema = new mongoose.Schema({
  name: String,
  description: String,
  start_time: Date,
  end_time: Date,
  repeat: Object,
  tasks: Array,
  userId: String,
  completed: Boolean,
  _creator: { type: Number, ref: 'User'}
});

// User document. Should hash password. Avatar just html link atm.
var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  avatar: String
});


var Routine = mongoose.model('routine', routineSchema);
var User = mongoose.model('user', userSchema);

User.prototype.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(error, isMatch) {
    if (error) {
      callback(error);
    } else {
      callback(null, isMatch);
    }
  });
};

userSchema.pre('save' , function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      //assume that this is async
      next();
    });
});
// routineSchema.post('save', function() {

//     var doc = this;
//     console.log('testId',ObjectId(doc._id+''))
//     Routine.findOneAndUpdate({'_id':ObjectId(doc._id)}, {$inc: { seq: 10} },{new:true}, function(error, counter)   {
//         if(error)
//             return next(error);
//         console.log("and",doc.seq, counter);
//     });
// });

//var testguy = new User({_id: 1, name: "Testy McTest", password: "pwd", avatar:"picture"});

module.exports.Routine = Routine;
module.exports.User = User;
