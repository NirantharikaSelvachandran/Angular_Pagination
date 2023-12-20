const express = require('express');
const bodyparser = require ('body-parser');
const mysql = require ('mysql');
const server = express();

const cors = require('cors');
server.use(cors());

server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: true }));

//database
const db = mysql.createConnection(
    {
        haost: "localhost",
        user: "root",
        password: "niru2000**",
        database: "nodejs_crud"
    }
);

db.connect(function (error){
    if (error){
        console.log("error")
    } else{
        console.log("Successfully connected to db")
    }
});

server.listen(5000, function check (error){
    if (error){
        console.log("Error")
    } else{
        console.log("Connected")
    }
});

//add
server.post("/api/student/add" , (req,res)=>{
    let details = {
        Stname : req.body.Stname,
        Course : req.body.Course,
        Fee : req.body.Fee
    };
    let sql = "insert into students SET ?";
    db.query(sql, details, (error)=>{
        if (error){
            res.send({status: false, message: "Student created failed"})
        }
        else{
            res.send({status: true, message: "Student Created Successfully"})
        }
    })
});

//view
server.get("/api/student" , (req,res)=>{
    let sql = "select * from students";
    db.query(sql, function(error , result){
        if(error){
            console.log("Error connecting")
        }else{
            res.send({status:true, data:result});
        }
    })
})

//search
server.get("/api/student/:Id" , (req,res)=>{
    var Id = req.params.Id;
    let sql = "select * from students where Id=" + Id;
    db.query(sql, function(error , result){
        if(error){
            console.log("Error connecting")
        }else{
            res.send({status:true, data:result});
        }
    })
})

//update
server.put("/api/student/update/:Id", (req, res) => {
    let Id = req.params.Id;
    let updatedDetails = {
        Stname: req.body.Stname,
        Course: req.body.Course,
        Fee: req.body.Fee
    };
    let sql = "UPDATE students SET ? WHERE Id = ?";    
    db.query(sql, [updatedDetails, Id], (error) => {
        if (error) {
            res.send({ status: false, message: "Student update failed" });
        } else {
            res.send({ status: true, message: "Student updated successfully" });
        }
    });
});

//Delete
server.delete("/api/student/delete/:Id" , (req,res) =>{
    let sql = "Delete from students where Id ="+ req.params.Id +"";
    db.query(sql, (error) => {
        if(error){
            res.send({ status: false, message: "Student delete failed" });
        }else{
            res.send({ status: true, message: "Student deleted successfully" });
        }
    })
})
