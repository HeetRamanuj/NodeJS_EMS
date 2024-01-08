const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');


//POST- http://localhost:3000/user/register
router.post('/register', (req, res) => {
  let { firstName,lastName, email, password, dateOfBirth,phone,Role,DepartmentId,Location } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();
  phone = phone.trim();
  Location = Location.trim();
  let department = (DepartmentId == null || DepartmentId === "") ? null : DepartmentId;

  if (firstName == "" ||lastName == "" || phone == ""|| email == "" 
            || password == "" || dateOfBirth == ""
            ||  Role === undefined || Location =="") {
      res.json({
          status: "failed",
          message: "Empty input fields!"
      });
  } else if (!/^[a-zA-Z]*$/.test(firstName)) {
      res.json({
          status: "failed",
          message: "Invalid firstName entered"
      });
    }else if (!/^[a-zA-Z]*$/.test(lastName)) {
      res.json({
          status: "failed",
          message: "Invalid lastName entered"
      });
    } else if (!/^\d{10}$/.test(phone)) {
      res.json({
          status: "failed",
          message: "Invalid phone number. Please enter a 10-digit number."
      });
    }
    else if (Role !== 1 && Role !== 2) {
        res.json({
            status: "failed",
            message: "Invalid user role. Please enter either 1 or 2!"
        });    
 } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.json({
          status: "failed",
          message: "Invalid Email format"
      });
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      res.json({
          status: 'failed',
          message: "Invalid DOB format. Please use YYYY-MM-DD"
      });
  } else if (password.length < 8) {
      res.json({
          status: "failed",
          message: "Password is too short"
      });
  } 
else {
      User.find({ email }).then(result => {
          if (result.length) {
              res.json({
                  status: "failed",
                  message: "User with the email already exists"
              });
          } else {
              const saltRounds = 10;
              bcrypt.hash(password, saltRounds).then(hashedPassword => {
                const newUser = new User({
                  firstName,
                  lastName,
                  email,
                  password: hashedPassword,
                  dateOfBirth,
                  phone,
                  Role,
                  DepartmentId:department,
                  Location
              });
                  newUser.save().then(result => {
                      res.json({
                          status: "success",
                          message: "User created successfully",
                          data: result,
                      });
                  }).catch(err => {
                      res.json({
                          status: "failed",
                          message: "Error while saving user",
                      });
                  });
              }).catch(err => {
                  res.json({
                      status: "failed",
                      message: "Error in password hashing"
                  });
              });
          }
      }).catch(err => {
          console.log(err);
          res.json({
              status: "failed",
              message: "An error occurred while checking for existing user"
          });
      });
  }
});

//POST- http://localhost:3000/user/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({
          status: 'failed',
          message: 'Please provide both email and password'
      });
  }

  User.findOne({ email }).then(user => {
      if (!user) {
          return res.status(404).json({
              status: 'failed',
              message: 'User not found'
          });
      }

      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, user.password).then(match => {
          if (!match) {
              return res.status(401).json({
                  status: 'failed',
                  message: 'Invalid Password!'
              });
          }

          // Passwords match - login successful
          res.status(200).json({
              status: 'success',
              message: 'Login successful',
              user: {
                  id: user._id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  Role: user.Role,
                  Location: user.Location
              }
          });
      }).catch(err => {
          console.error('Error comparing passwords', err);
          res.status(500).json({
              status: 'failed',
              message: 'Internal server error'
          });
      });
  }).catch(err => {
      console.error('Error finding user', err);
      res.status(500).json({
          status: 'failed',
          message: 'Internal server error'
      });
  });
});


module.exports = router;