const jwt = require ("jsonwebtoken");

//secret key used in the encoding process. can be anything

//using jwt to encode user information and returning it back as a token so they use it to make request
const tokenGenerator = (user, callback) => {
    jwt.sign(
        {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            password: user.password,
            role: user.role
        },
        process.env.SECRET,
        { expiresIn: "24h" },
        (err, res) => {
            callback(err, res);
        }
    );
};

//endpoint to decode token provided by the user and check if to authorize the request or not
const authorizeUser = (req, res, next) => {
    const token = req.headers.authorization || req.headers["x-access-token"] || req.body.token;
    if(token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                res.send(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({
            status: "failed",
            message: "Authentication required for this route"
        });
    }
};

module.exports = { tokenGenerator, authorizeUser };
