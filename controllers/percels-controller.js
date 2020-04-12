const express = require ("express");
// const bodyParser = require ("body-parser");
const { validationResult } = require("express-validator");
const app = express();

app.use(express.json());

// app.use(bodyParser.json());

//request for creating parcel for registered users only
module.exports.createParcel = (req, res) => {
    const { user_id, pickup_location, destination, recipient_name, recipient_phone_no } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else if (req.decoded.id === parseInt(user_id, 10)) {
        client.query('INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone_no) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, pickup_location, destination, recipient_name, recipient_phone_no], (err, result) => {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
                res.send({
                    success: true,
                    msg: 'Parcel created successfuly!',
                    id: result.rows[0].id
                });
            }
        });
    } else {
        res.status(401).send({err: 'Sorry you can not create Parcel Order for another User' });
    }
};


module.exports.getAllParcels = (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        const userId = parseInt(req.params.userId, 10);
        if (req.decoded.id === userId) {
            client.query(`SELECT * FROM parcels WHERE user_id = ${userId};`, (err, resp) => {
                if(err) {
                    res.send(err);
                } else {
                    res.send(resp.rows);
                }                
            });
        } else {
            res.status(401).send({ msg: 'Sorry you can not fetch Parcels for another User!' });
        }
    }
};

module.exports.cancelParcel = (req, res) => {
    const { parcelId, user_id } = req.body;

    if(req.decoded.id === parseInt(user_id, 10)) {
        client.query(`UPDATE parcels SET status = 'Cancelled' WHERE id = $1 AND user_id = $2 RETURNING *`, [parcelId, user_id], (err, results) => {
            if(err){
                res.send(err)
            } else if (!results.rows[0]) {
                res.send({
                    msg: "You can not cancel another user's parcel"
                })
            } else {
                res.send({
                    success: true,
                    msg: 'Parcel cancelled successfully',
                    details: results.rows[0]
                });
            }
        })
    } else {
        res.send("Sorry! You cant cancel parcel for another user")
    }
}

//request for changing destination for a parcel delivery. accessible only by the user that created that parcel
module.exports.changeDestination = (req, res) => {
    const {parcelId, destination, user_id } = req.body;
    
    if(req.decoded.id === parseInt(user_id, 10)){
        client.query(`UPDATE parcels SET destination = $2 WHERE id = $1 AND user_id = $3 RETURNING *`, [ parcelId, destination, user_id ], (err, results) => {
            if(err){
                res.send(err)
            } else if(!results.rows[0]){
                res.send({
                    msg: "you can not change Destination for another User!"
                })
            } else {
                res.send({
                    success: true,
                    msg: 'Destination changed succesfully!',
                    details: results.rows[0]
                });
            }
        })
    } else {
        res.send("Sorry! You cant change the destination for another user's parcel");
    }
}


//request for changing status. accessibility by the admins only
module.exports.changeStatus = (req, res) => {
    const { status, parcelId } = req.body;

    if(req.decoded.role !== 'admin'){
        res.send({
            msg: 'failed! only admins can access this endpoint'
        });
    } else {
        client.query('UPDATE Parcels SET status = $1 WHERE id = $2 RETRUNING *', [status, parcelId], (err, results) => {
            if(err){
                res.send(err)
            } else {
                res.send({
                    msg: 'status changed Successfully!',
                    details: results.rows[0]
                });
            }        
        });
    } 
}

module.exports.changePresentLocation = (req, res) => {
    const { presentLocation, parcelId } = req.body;
    
    if(req.decoded.role !== 'admin'){
        res.send({
            msg: 'failed! only admins can access this endpoint'
        });
    } else {
        client.query('UPDATE Parcels SET present_location = $1 WHERE id = $2 RETURNING *', [presentLocation, parcelId], (req, result) => {
            if(err) {
                res.send(err)
            } else {
                res.send({
                    msg: 'Present location changed successfully',
                    details: results.rows[0]
                });
            }
        });
    }
}