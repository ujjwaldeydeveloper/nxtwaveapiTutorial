
// to start the application nodemon app.js  
const express = require('express');

// destructuring
const { connectToDb, getDb } = require('./db');

// Initialize the app
const app = express();

// Set up middleWare

// Parse incoming JSON

app.use(express.json());

let db;

connectToDb((err) => {
    if(!err) {
        app.listen(3001, () => {
            console.log('Server is running on port 3001');
        });
        db = getDb();
    }
})

// Creating Restful Api endpoints

// GET api implementation

app.get('/api/students', (req, res) => {
    // We have 200 records in our db
    // use pagination (limit and skip)

    // //localhost:3001/api/student = page 0
    // ://localhost:3001/api/students = :/localhost:3001/api/student?p=0
    const page = req.query.p || 0;

    //
    const studentsPerPage = 10;

    let students = [];
    db.collection('students')
    .find()
    .sort({id : 1 })
    .skip(page * studentsPerPage)
    .limit(studentsPerPage)
    .forEach(student => students.push(student))
    .then(() => {
        res.status(200).json(students)
    })
    .catch(() => {
        res.status(500).json({msg: 'Error getting users'});
    })
})

app.get('/api/students/:id', (req, res) => {
    const studentID = parseInt(req.params.id);
    if(!isNaN(studentID)) {
        // show the student info
        db.collection('students')
        .findOne({id: studentID})
        .then((student) => {
            if (student) {
                res.status(200).json(student);
            } else {
                res.status(404).json({msg: 'Student not found'});
            }

        })
        .catch(() => {
            res.status(500).json({msg: 'Error getting student info'});
        })
    } else {
        // show error
        res.status(400).json({Error: 'Err: Student ID must be a number'});
    }
})

// Creating a student

app.post('/api/students', (req, res) => {
    const student = req.body;
    db.collection('students')
    .insertOne(student)
    .then((result) => {
        res.status(200).json({result}); //json({msg: 'Student created', student: result.ops[0]});
    })
    .catch(() => {
        res.status(500).json({msg: 'Error creating student'});
    })
})

// Updating a student 

app.patch('/api/student/:id', (req, res) => {
    let updates = req.body;
    const studentID = parseInt(req.params.id);

    if(!isNaN(studentID)) {
        // update the student
        db.collection('students')
            .updateOne(
                {id: studentID},
                {$set: updates}
            )
            .then((result) => {
                res.status(201).json({result})
            })
            .catch( () => {
                res.status(500).json({msg: 'Error in updating student details'});
        })
    } else {
        // show error
        res.status(400).json({msg: 'Err: Student ID must be a number'});
    }
})


// delete 

app.delete('/api/student/:id', (req, res) => {
    const studentID = parseInt(req.params.id);
    if(!isNaN(studentID)) {
        //delete a student 
        db.collection('students')
        .deleteOne({id: studentID})
        .then((result) => {
            res.status(200).json({result}); // 204 delete successful with out acknowlegement msg
        })
        .catch(() => {
            res.status(500).json({msg: 'Error deleting student'});
        })
    } else {
        res.status(400).json({Error: 'Err: student ID must be a number'});
    }
})


