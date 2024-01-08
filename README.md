
# NodeJS  EMS

Employee Management project based on  Node js as Backend service and MongoDB compass as database.

To Run this project, you need to run npm install from Terminal. 

Once it is installed you can go ahead and run npm start.

```
npm install // it will install all dependencies for this project
npm serve // it will launch your application in a live development server.
```
```
Please Note: You need to run Employee Management Backend service first before running this project.
Employee Management Backend Service (Express Js + MongoDB compass)

-To run this project need to use "nodemon server.js" command.
 ```

```
In this project I have following endpoints:

1. Login/signup route.

2. Create, read, update, and delete routes for the departments. (Only managers can do
that)

3. Create, read, update, and delete employees. (Update and delete only managers can do
that)

4. Two endpoints to filter employees. (Need to integrate at the task 5 in frontend)

a. Give employees an array according to employees' location in ascending order.
(employees whose locations start with A came at the top)

b. Give employees in ascending and descending order of their names according to
the selected filter.
```
## Installation

Install NodeJS_PMS with npm

```bash
  npm init
  cd NodeJS_PMS
```

## Install packages

Install packages with npm

```bash
  npm i nodemon express mongoose bcrypt dotenv
```
## Run Project 

```bash
  nodemon server.js
```

## API Reference

### 1. Register User

```http
  POST- http://localhost:3000/user/register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `firstName`      | `string` | **Required**.
| `lastName`      | `string` | **Required**. 
| `email`      | `string` | **Required**.
| `password`      | `string` | **Required**.
| `dateOfBirth`      | `Date` | **Required**.
| `phone`      | `string` | **Required**.
| `Role`      | `Number` | **Required**. 
| `DepartmentId`      | `string` | **NotRequired**. 
| `Location`      | `string` | **Required**. 


####  Json
```
{
    "firstName": "heet",
    "lastName" : "ramanuj",
    "email" : "heet@gmail.com",
    "password": "123456789",
    "dateOfBirth" : "2002-02-02",
    "phone":"7896541230",
    "Role": 1,
    "DepartmentId": "",
    "Location": "India"
}
```
### 2. Login User

```http
  POST- http://localhost:3000/user/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**.
| `password`      | `string` | **Required**.


####  Json 
```
{
    "email" : "heet1931@gmail.com",
    "password": "123456789"
}
```
### 3. Update Employee

```http
  PUT- http://localhost:3000/employee/updateEmployee/659bee012668c42ee27174df
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `managerId`      | `string` | **Required**.
| `firstName`      | `string` | **Required**.
| `lastName`      | `string` | **Required**. 
| `email`      | `string` | **Required**.
| `password`      | `string` | **Required**.
| `dateOfBirth`      | `Date` | **Required**.
| `phone`      | `string` | **Required**.
| `Role`      | `Number` | **Required**. 
| `DepartmentId`      | `string` | **NotRequired**. 
| `Location`      | `string` | **Required**. 


####  Json
```
{
   "managerId": "659b0986801adf827967ff67",
    "firstName": "heet",
    "lastName": "ramanuj",
    "email": "heet@gmail.com",
    "password": "12345678",
    "dateOfBirth": "2004-04-14",
    "phone": "7433933080",
    "Role": 2,
    "departmentId": "659b03ef1d892339b5c4938a"
}
```
### 4. Delete Employee

```http
 DELETE- http://localhost:3000/employee/deleteEmployee/659bee012668c42ee27174df
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**.

### 5. Search Employees by Location Employee

```http
 GET-  http://localhost:3000/employee/filterEmployeesbyLocation?page=1
```

### 6. Search Employees by Name by asc or desc

```http
GET-  http://localhost:3000/employee/sortByName?order=asc&page=1
                              OR
GET-  http://localhost:3000/employee/sortByName?order=desc&page=1
```

### 7. Get EmployeeData By Id

```http
GET- http://localhost:3000/employee/getEmployeeDataById/659b0bcc5ee7f7452e2a46b9
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**.


### 8. Create Department

```http
POST- http://localhost:3000/department/createDepartment
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `departmentName`      | `string` | **Required**.
| `description`      | `string` | **Required**.
| `managerId`      | `string` | **Required**. fk

####  Json
```
{
    "departmentName" : "HR",
    "description": "HR department is responsible for handling all tasks and management regarding company.",
    "managerId" : "659be88be282386f761570ca"
}
```

### 9. Update Department

```http
PUT- http://localhost:3000/department/updateDepartment/659bee012668c42ee27174df
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `departmentName`      | `string` | **Required**.
| `description`      | `string` | **Required**.
| `managerId`      | `string` | **Required**. fk

####  Json
```
{
    "departmentName" : "HR",
    "description": "HR department is responsible for handling all tasks and management regarding company.",
    "managerId" : "659be88be282386f761570ca"
}
```
### 10. Delete Department

```http
DELETE- http://localhost:3000/department/deleteDepartment/659bee012668c42ee27174df
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**.

### 11. Get Department By Id

```http
GET- http://localhost:3000/department/getDepartmentById/659bee012668c42ee27174df
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**.

### 12. Get All Departments

```http
GET- http://localhost:3000/department/getAllDepartments
```


## Tech Stack

**Server:** Node, Express, MongoDb

