const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Load Profile Model
const Profile = require('../../models/Profile');

//Load User Model
const User = require('../../models/User');

const { check, validationResult } = require('express-validator/check');

//------------------------------------------------------------------------------------------------------------------------------------

// @route    GET api/profile/Me
//@desc      Get Current User Profile
//@Acess      Private


router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: (req.user.id) }).populate('user', ['name', 'avatar']);


        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this User' });

        }
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server eroor');
    }


});

//---------------------------------------------------------------------------------------------------------------------------------/

// @route    POST api/profile
//@desc      Create or Update User Profile
//@Acess      Private



router.post('/', [auth,
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skill', 'Skill is required').not().isEmpty()
    ]
],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }



        const { company, website, location, status, githubname, skill, youtube, facebook, twitter, linkedin } = req.body;

        //build profile object 

        const profileFields = {};
        profileFields.user = req.user.id;

        if (company)
            profileFields.company = company;
        if (website)
            profileFields.website = website;
        if (location)
            profileFields.location = location;
        if (status)
            profileFields.status = status;
        if (githubname)
            profileFields.githubname = githubname;

        if (skill) {
            profileFields.skill = skill.split(',').map(skill => skill.trim())
        }



        profileFields.social = {};

        if (youtube)
            profileFields.social.youtube = youtube;
        if (twitter)
            profileFields.social.twitter = twitter;
        if (youtube)
            profileFields.social.facebook = facebook;
        if (linkedin)
            profileFields.social.linkedin = linkedin;



        try {

            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);

            };

            //Create

            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);




        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
            return

        }





    }

);


//------------------------------------------------------------------------------------------------------------------------------------



//@route GET api/profile/user/
//@desc Get all profiles by user Id
//@Acess Public



router.get('/', async (req, res) => {
    try {

        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);



    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        return

    }

});

//----------------------------------------------------------------------------------------------------------------------------------



//@route GET api/profile/user/:user_id
//@desc Get all profiles by user Id
//@Acess Public


router.get('/user/:user_id', async (req, res) => {
    try {

        const profiles = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profiles)
            return res.status(400).json({ msg: 'No Profile for this user' });
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: ' Profile not found' });
        }
        res.status(500).send('server Eroor');
        return;


    }

});

//-----------------------------------------------------------------------------------------------------------------------------------

//@route  Delete api/profile
//@desc   DELETE profile,user,AND post
//@Acess  Private

router.delete('/', auth, async (req, res) => {
    try {

        //to do -remove profile
        //Remove Profiles
        await Profile.findOneAndRemove({ user: req.user_id });
        await User.findOneAndRemove({ _id: req.user_id });

    
        res.json({ msg: 'User  deleted' });



    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        return

    }

});
//--------------------------------------------------------------------------------------------------------------------------------------

//@route    PUT api/profile/exeperiance
//desc      Add Profile Experience
//@access   Private


router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }
    const { title, company, location, from, to, current, description } = req.body;

    const newExp = { title, company, location, from, to, current, description };



    try {
        const profile = await Profile.findOne({ user: req.user.id });



        profile.experience.push(newExp);




        await profile.save();
        res.json(profile);


    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }


}

);


//---------------------------------------------------------------------------------------------------------------------------------
//@route  Delete api/profile/Experience

//@Acess  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(Profile);


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        return

    }

});


//---------------------------------------------------------------------------------------------------------------------------


//@route    PUT api/profile/Education
//desc      Add Profile Education
//@access   Private


router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
   
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body;

    const newEducation = { school, degree, fieldofstudy, from, to, current, description };



    try {
        const profile = await Profile.findOne({ user: req.user.id });



        profile.education.unshift(newEducation);




        await profile.save();
        res.json(profile);


    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }


}

);






module.exports = router;