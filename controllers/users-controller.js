const express = require ("express");
const { validationResult } = require ("express-validator");
const { tokenGenerator } = require ("../middlewares/middleware");

const app = express();

app.use(express.json());

//request for creating user account(registration)
const createUser = (req, res) => {
    const { first_name, last_name, email, phone_no, password } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    } else {
        client.query(
            "INSERT INTO users (first_name, last_name, email, phone_no, password) VALUES ($1, $2, $3, $4, $5) RETURNING * ", [ first_name, last_name, email, phone_no, password ], (err, user) => {
            console.log("error:", err, "user:", user); 
            if(err) {
                res.send({
                    msg: "Email Already exist, please login", //err.detail
                });
            } else {
                tokenGenerator(user.rows[0], (err, token) => {
                    if(err) {
                        res.send({ msg: "Unable to encode token" });
                    } else {
                        res.status(201).send({
                            success: true,
                            msg: "Registered Successfully!",
                            userId: user.rows[0].id,
                            token,
                            expiresIn: "1hour",
                        });
                    }
                });
            }
        });
    }
};

//request for logging in
const userLogin = (req, res) => {
    const { email, password } = req.body;
    
    client.query(
        `SELECT * FROM users WHERE email = $1 AND password = $2`, 
        [email, password], 
        (err, user) => {
            if (err) {
                res.send(err);
            } else if (user.rows.length) {
                tokenGenerator(user.rows[0], (err, token) => {
                    // console.log(token)
                    if(err){
                        res.send({ msg: "unable to encode token" });
                    } else {
                        res.send({
                            msg: "Login successful",
                            userId: user.rows[0].id,
                            token,
                            expiresIn: "24hours"
                        });
                    }
                });
            } else {
                res.send({
                    success: false,
                    msg: "Incorrect email or password"
                });
            }
        }
    );
};


//request for logging in
const getUser = (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }    
    else {
        client.query(
            `SELECT * FROM users WHERE id = ${req.decoded.id}`,
            (err, resp) => {
                if(err) {
                    res.status(500).send(err);
                } else {
                    console.log(resp.rows[0]);
                    res.status(200).send(resp.rows[0]);
                }
            }
        );
    }
};

module.exports = { getUser, userLogin, createUser } ;
