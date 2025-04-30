const User = require('../models/Users');
const bcrypt = require('bcrypt');
const { objectTrim } = require('../Utils/utils');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const UserRegister = async (req,res) =>{

        try {

            req.body=objectTrim(req.body)
            const { name, email, password } = req.body;
            if (name && email && password) {
                console.log(email)
                const data = await User.findOne({ email })
                if (data) {
                    res.status(409).json({ error: 'Email Already Exists!' });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10)
                    console.log('hashedPassword')
                    const newUser = new User({
                        name: name, 
                        email: email,
                        password: hashedPassword,
                    })
                    await newUser.save()
                    res.status(200).json({ message: 'User is Registered'})
                }
            } else {
                res.status(400).json({ error: 'Invalid parameters!' })
            }
        } catch (error) {
            res.status(500).json({error:error.message})
        }
}


const UserLogin = async (req, res) => {
    try {

        req.body = objectTrim(req.body);
        const {email,password} = req.body;

        if (email && password) {
            const {email ,password } = req.body;
            let userdata = await User.findOne({ email });

            if(userdata){
                const isMatch = await bcrypt.compare(password, userdata.password);
                if(isMatch){
                    let data = await User.findOneAndUpdate({ email }, { status: true }, { new: true });
                    const token = jwt.sign({ userid: data._id , name : data.name , email : data.email }, secretKey, { expiresIn: '7d' });
                    return res.status(200).json({ message:'Login Success' , data:{name : data.name , email : data.email,token}})
                }else{
                    return res.status(400).json({error:'Invalid Credentials'})
                }

            }else{
                return res.status(404).json({error:'Email not found'})
            }

        } else {
           return res.status(400).json({ error: 'Invalid parameters!' })
        }

    } catch (error) {
       return res.status(500).json({error:error.message})
    }
}


const UserLogout = async (req, res) => {
    try {
        const { user } = req;
        const data = await User.findOneAndUpdate({ _id: user.userid }, { status: false }, { new: true })
        return res.status(200).json({ data: { status: data.status }, message: "Logout Successfully" })
        
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}


module.exports = {UserRegister ,UserLogout ,UserLogin}