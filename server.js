require('./config/db')
const app =require('express')();
const port = 3000;

const UserRouter = require('./api/Register')
const DepartmentRouter = require('./api/Department')
const EmployeeRouter = require('./api/Employee')

const bodyParser =require('express').json;
app.use(bodyParser());

app.use('/user',UserRouter)
app.use('/department',DepartmentRouter)
app.use('/employee',EmployeeRouter)

app.listen(port,()=>{
    console.log(`Server is running on port${port}` );
})