const express = require('express');
const router = express.Router();
const bcyrypt = require('bcryptjs');
const auth = require("../../middleware/auth");
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');


const { check, validationResult } = require('express-validator/check')


// @route GET api/auth
//@desc Test route

router.get('/', auth, async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server errror');

    }
});


///POST API/Auth
//AUTH User
//public



//console.log(User.name);
router.post('/', [

    check('email', 'please include a valid email').isEmail(),
    check('password', 'password is require').exists()
    //check('password', 'please enter a valid password ')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    //See if User Exists


    const { email, password } = req.body;



    try {

        //See if user exist

        let user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'INvalid Creaditential' }] });
        }


        const isMatch = await bcyrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: [{ msg: "Invalid Credential" }] });
        }










        //res.send('user Register');
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }






});



module.exports = router;