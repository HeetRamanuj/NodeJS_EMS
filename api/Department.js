const express = require('express');
const router = express.Router();
const Department = require('./../models/Department');
const User = require('../models/User');

//check if user is manager or not for access
const checkManager = (req, res, next) => {
    const managerId = req.body.managerId; 
   
    if (!managerId) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide a managerId in the request body.'
        });
    }

    User.findOne({ _id: managerId })
    .exec()
        .then(manager => {
            if (!manager) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Manager not found. Please provide a valid managerId.'
                });
            } 
            else if (manager.Role !== 1) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'Access denied. Only managers with roleId 1 can create departments.'
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

// POST- http://localhost:3000/department/createDepartment
router.post('/createDepartment', checkManager, (req, res) => {
    const { departmentName, description } = req.body;
    const managerId = req.body.managerId; // Assuming "_id" is the manager's ID field in the request body

    const newDepartment = new Department({
        departmentName,
        description,
        managerId 
    });

    newDepartment.save()
        .then(savedDepartment => {
            res.status(201).json({
                status: 'success',
                message: 'Department created successfully',
                department: savedDepartment
            });
        })
        .catch(err => {
            console.error('Error creating department:', err);
            res.status(500).json({ message: 'Error while creating department' });
        });
});

// PUT- http://localhost:3000/department/updateDepartment/659bee012668c42ee27174df
router.put('/updateDepartment/:_id', checkManager, (req, res) => {
    const { departmentName, description } = req.body;
    const managerId = req.body.managerId; 
    const departmentId = req.params._id; 

    Department.findByIdAndUpdate(
        { _id: departmentId, managerId },
        { $set: { departmentName, description } },
        { new: true }
    )
    .then(updatedDepartment => {
        if (!updatedDepartment) {
            return res.status(404).json({
                status: 'failed',
                message: 'Department not found.'
            });
        }
        if (updatedDepartment.managerId.toString() !== managerId) {
            return res.status(403).json({
                status: 'failed',
                message: 'You cannot update this data as you have not created it.'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Department updated successfully',
            department: updatedDepartment
        });
    })
    .catch(err => {
        console.error('Error updating department:', err);
        res.status(500).json({ message: 'Error while updating department' });
    });
});

// DELETE- http://localhost:3000/department/deleteDepartment/659bee012668c42ee27174df
router.delete('/deleteDepartment/:_id', checkManager, (req, res) => {
    const managerId = req.body.managerId; 
    const departmentId = req.params._id; // Retrieve departmentId from URL params

    Department.findOneAndDelete({ _id: departmentId, managerId }) 
        .then(deletedDepartment => {
            if (!deletedDepartment) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Department not found or you are not authorized to delete.'
                });
            }
            res.status(200).json({
                status: 'success',
                message: 'Department deleted successfully',
                department: deletedDepartment
            });
        })
        .catch(err => {
            console.error('Error deleting department:', err);
            res.status(500).json({ message: 'Error while deleting department' });
        });
});

// GET http://localhost:3000/department/getDepartmentById/659bee012668c42ee27174df
router.get('/getDepartmentById/:_id', (req, res) => {
    const departmentId = req.params._id; 

    Department.findById(departmentId)
        .then(department => {
            if (!department) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Department not found.'
                });
            }
           
            res.status(200).json({
                status: 'success',
                message: 'Department retrieved successfully',
                department
            });
        })
        .catch(err => {
            console.error('Error fetching department:', err);
            res.status(500).json({ message: 'Error while fetching department' });
        });
});

// GET http://localhost:3000/department/getAllDepartments
router.get('/getAllDepartments', async (req, res) => {
    try {
        // Pagination for fast search
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate skip value
        const skip = (page - 1) * limit;

        const departments = await Department.find({})
            .skip(skip)
            .limit(limit);

        // Count total departments for pagination information
        const totalDepartments = await Department.countDocuments({});

        res.status(200).json({
            status: 'success',
            message: 'Departments retrieved successfully',
            total: departments.length,
            totalPages: Math.ceil(totalDepartments / limit),
            departments
        });
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ message: 'Error while fetching departments' });
    }
});

module.exports = router;

