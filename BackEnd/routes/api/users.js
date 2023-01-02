const { application } = require('express');
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');


const { check, validationResult } = require('express-validator/check')

const User = require('../../models/User');


console.log(User.name);
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'please include a valid email').isEmail(),
    check('password','please enter a password with six more character ').isLength({min:6})
    //check('password', 'please enter a valid password ')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    //See if User Exists
    

    const { name, email, password } = req.body;



    try {

        //See if user exist

        let user = await User.findOne({email});


        if (user) {
            res.status(400).json({ errors: [{ msg: 'User already Exists' }] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });


        user = new User({
            name,
            email,
            avatar,
            password
        });

        
        //Encrypt gravatar

        const salt = await bcrypt.genSalt(10);

        const Hashpassword =await bcrypt.hash(password, salt);
        user.password=Hashpassword;



        await user.save();






        //res.send('user Register');
        const  payload={
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn:360000 },(err,token)=>{
                if(err) throw err;
                res.json({token});
            }
            );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }






});
module.exports = router;