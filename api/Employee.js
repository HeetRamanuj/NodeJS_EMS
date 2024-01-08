const express = require('express');
const router = express.Router();
const User = require('../models/User');


const checkManager = (req, res, next) => {
    const managerId = req.body.managerId;
   
    if (!managerId) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide a managerId in the request body.'
        });
    }

    User.findOne({ _id: managerId, Role: 1 }) // Find manager by ID and Role = 1 (manager)
        .exec()
        .then(manager => {
            if (!manager) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'Access denied. Only managers with roleId 1 can update employee details.'
                });
            }
            req.manager = manager; 
            next();
        })
        .catch(err => {
            console.error('Error checking manager role:', err);
            res.status(500).json({ message: 'Error checking manager role' });
        });
};

// PUT- http://localhost:3000/employee/updateEmployee/659bee012668c42ee27174df
router.put('/updateEmployee/:_id', checkManager, (req, res) => {
    const employeeId = req.params._id;

    const { firstName, lastName, email, password, dateOfBirth, phone, Role, DepartmentId } = req.body;

    User.findByIdAndUpdate(
        { _id: employeeId },
        { $set: { firstName, lastName, email,password,dateOfBirth,phone,Role,DepartmentId} },
        { new: true }
    )
        .then(employee => {
            if (!employee) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Employee not found'
                });
            }

            // Update employee fields
            // employee.firstName = firstName;
            // employee.lastName = lastName;
            // employee.email = email;
            // employee.password = password;
            // employee.dateOfBirth = dateOfBirth;
            // employee.phone = phone;
            // employee.Role = Role;
            // employee.DepartmentId = DepartmentId;

            // Save the updated employee
            employee.save()
                .then(updatedEmployee => {
                    res.status(200).json({
                        status: 'success',
                        message: 'Employee updated successfully',
                        employee: updatedEmployee
                    });
                })
                .catch(err => {
                    console.error('Error while updating employee:', err);
                    res.status(500).json({ message: 'Error while updating employee' });
                });
        })
        .catch(err => {
            console.error('Error finding employee:', err);
            res.status(500).json({ message: 'Error finding employee' });
        });
});

//DELETE- http://localhost:3000/employee/deleteEmployee/659bee012668c42ee27174df
router.delete('/deleteEmployee/:_id', checkManager, (req, res) => {
    const employeeId = req.params._id;

    User.findOneAndDelete({ _id: employeeId }) 
        .then(deleteEmployee => {
            if (!deleteEmployee) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'employee not found or you are not authorized to delete.'
                });
            }
            res.status(200).json({
                status: 'success',
                message: 'employee deleted successfully',
                employee: deleteEmployee
            });
        })
        .catch(err => {
            console.error('Error deleting employee:', err);
            res.status(500).json({ message: 'Error while deleting employee' });
        });
});

// GET-  http://localhost:3000/employee/filterEmployeesbyLocation?page=1
router.get('/filterEmployeesbyLocation', async (req, res) => {
//pagination for fast search
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
    
    try {
        
     const skip = (page - 1) * limit;

      const employees = await User.find().sort({ Location: 1 }) // Ascending order by location
      .skip(skip)
      .limit(limit)
      .sort({ firstName: 1 });
      
 // Count total departments for pagination information
 const totalUsers = await User.countDocuments({});

      res.status(200).json({
        status: 'success',
        message: 'Employees fetched successfully',
        total: employees.length,
        totalPages: Math.ceil(totalUsers / limit),
        data: employees
        
      });
    } catch (err) {
      console.error('Error fetching employees', err);
      res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
      });
    }
  });

// GET-  http://localhost:3000/employee/sortByName?order=asc&page=1
// GET-  http://localhost:3000/employee/sortByName?order=desc&page=1
router.get('/sortByName', async (req, res) => {
    const order = req.query.order;
    const page = parseInt(req.query.page) || 1;
    const defaultLimit = 10;

    try {
        let sortDirection = 1; // Default to ascending order

        if (order === 'desc') {
            sortDirection = -1; // Set to descending order if order parameter is 'desc'
        }

        const skip = (page - 1) * defaultLimit;

        const employees = await User.find().collation({ locale: 'en', strength: 2 }).sort({
            firstName: sortDirection,
            lastName: sortDirection,
        })
            .skip(skip)
            .limit(defaultLimit);


             // Count total departments for pagination information
        const totalUsers = await User.countDocuments({});
        res.status(200).json({
            status: 'success',
            message: 'Employees fetched successfully',
            total: employees.length,
            totalPages: Math.ceil(totalUsers / limit),
            data: employees
        });
    } catch (err) {
        console.error('Error fetching employees', err);
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
        });
    }
});

//GET- http://localhost:3000/employee/getEmployeeDataById/659b0bcc5ee7f7452e2a46b9
router.get('/getEmployeeDataById/:_id', async (req, res) => {
    const employeeId = req.params._id; 

    User.findById(employeeId)
        .then(employee => {
            if (!employee) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Employee not found.'
                });
            }
           
            res.status(200).json({
                status: 'success',
                message: 'Employee retrieved successfully',
                employee
            });
        })
        .catch(err => {
            console.error('Error fetching department:', err);
            res.status(500).json({ message: 'Error while fetching department' });
        });
});

module.exports = router;
