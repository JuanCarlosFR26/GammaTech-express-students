// Creamos nuestra base de datos:
const students = [
  {
    student_id: 1,
    first_name: "Del",
    last_name: "Preddle",
    age: 24,
    email: "dpreddle0@ning.com",
    major: "Mongo",
    gpa: 2.45,
  },
  {
    student_id: 2,
    first_name: "Selie",
    last_name: "Grove",
    age: 20,
    email: "sgrove1@cbsnews.com",
    major: "JavaScript",
    gpa: 0.02,
  },
  {
    student_id: 3,
    first_name: "Wendie",
    last_name: "Stollery",
    age: 24,
    email: "wstollery2@psu.edu",
    major: "CSS",
    gpa: 0.79,
  },
  {
    student_id: 4,
    first_name: "Dag",
    last_name: "Mangham",
    age: 20,
    email: "dmangham3@gov.uk",
    major: "CSS",
    gpa: 1.38,
  },
  {
    student_id: 5,
    first_name: "Cordelia",
    last_name: "Cluley",
    age: 19,
    email: "ccluley4@weather.com",
    major: "React",
    gpa: 3.26,
  },
];

// API endpoints para el ejercicio:
// GET "/" Traer todos los estudiantes
// POST "/" Añadir un estudiante con sus 7 campos
// GET "/user/:id" Traer estudiante con dicho id
// GET "/users?lastname=lastname&major=major"
// Put "/users/replace/:id" Recibe todos los campos en el body y sustituye el usuario
// PATCH "/users/update/:id" Recibe un campo y modifica el student
// DELETE "users/delete/:id" Recibe el id por params y elimina el student

const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

// Para usar JSON:
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ response: true, data: students });
  console.log("Usuarios cargados");
});

app.post("/", (req, res) => {
  const { first_name, last_name, age, email, major } = req.body;
  const gpa = parseFloat(req.body.gpa).toFixed(1);
  if (
    !first_name ||
    !last_name ||
    !age ||
    !email ||
    !major ||
    !gpa ||
    gpa < 0 ||
    gpa > 4
  ) {
    res.status(400).send({ response: false, error: "Missing student data" });
  } else {
    const newUser = {
      student_id: uuidv4(),
      first_name: first_name,
      last_name: last_name,
      age: age,
      email: email,
      major: major,
      gpa: gpa,
    };
    students.push(newUser);
    console.log("Usuario añadido");
    res.status(201).send({ response: true, data: newUser });
  }
});

// Poner == en lugar de === string/number
app.get("/user/:id", (req, res) => {
  const requiredID = req.params.id;
  const requiredIDNumber = parseInt(req.params.id);
  let studentId = students.find((student) => student.student_id === requiredID);
  let studentIdNumber = students.find(
    (student) => student.student_id === requiredIDNumber
  );
  if (studentId) {
    res.status(200).send({ response: true, data: studentId });
  } else if (studentIdNumber) {
    res.status(200).send({ response: true, data: studentIdNumber });
  } else {
    res.status(400).send({ response: false, error: "No student with such id" });
  }
});

app.get('/users', (req, res) => {
  const lastname = req.query.lastname;
  const major = req.query.major;

  if(!lastname && !major) {
    return res.status(400).send({response: true, message: 'No student with such parameters'})
  };

  const filteredStudents = students.filter(student => {
    if(lastname && major) {
      return student.last_name.toLowerCase() === lastname.toLowerCase() && student.major.toLowerCase() === major.toLocaleLowerCase();
    } else if(lastname) {
      return student.last_name.toLowerCase() === lastname.toLowerCase();
    } else if(major) {
      return student.major.toLowerCase() === major.toLowerCase();
    }
  });

  if(filteredStudents.length === 0) {
    return res.status(400).send({response: true, message: 'No student with such parameters'})
  }

  res.status(200).send({response:true, data: filteredStudents})

})

app.put('/users/replace/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { student_id, first_name, last_name, age, major, email, gpa} = req.body;

    const studentIndex = students.findIndex(student => student.student_id === id);

    if(studentIndex !== -1) {
      students[studentIndex] = {
        id: students[studentIndex].student_id,
        student_id,
        first_name,
        last_name,
        age,
        major,
        email,
        gpa
      }

      res.status(200).send({ response: true, data: students[studentIndex]})
    } else {
      res.status(404).send('No student with such id')
    }
})

app.patch('/users/update/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedFields = req.body;

  const studentIndex = students.findIndex(student => student.student_id === id);

  if(studentIndex !== -1) {
    Object.assign(students[studentIndex], updatedFields);
    res.status(200).send({ response: true, data: students[studentIndex]})
  } else {
    res.status(404).send('No student with such id')
  }
})

app.delete('/users/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(student => student.student_id === id);

  if(studentIndex !== -1) {
    const deletedStudent = students.splice(studentIndex, 1)[0];
    res.status(200).send(deletedStudent);
  } else {
    res.status(404).send('No student with such id')
  }
})

app.listen(8000, () => {
  console.log(`Server listening on port ${PORT}`);
});
