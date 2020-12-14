const express = require('express')
const bcrypt = require('bcryptjs')
const User = require("../users/user-modal")
const router = express.Router()

const checkCredentials = (req, res, next) => {
    if(!req.body.username || req.body.password){
        res.status(401).json('goodtrybuddy put in a valid user/pass')
    } else{
        next()
    }
}

const uniqueUsernameChecker = async (req, res, next) => {
    try{
        const rows = await User.findBy({username: req.body.username})
        if(!rows.length){
            next()
        } else{
            res.status(401).json('username taken')
        }
    }
    catch(er){
        res.status(500).json(er.message)
    }
}

const usernameExistsChecker = async (req, res, next) => {
    try{
        const rows = await User.findBy({username:req.body.username})
        if(rows.length){
            req.userData = rows[0]
            next()
        } else{
            res.status(401).json("what tf")
        }
    }
    catch(er){
        res.status(500).json(er.message)
    }
}



router.post('/register', async (req, res) => {
    try{
        const hash = bcrypt.hashSync(req.body.password, 9)
        const newUser = await User.add({username: req.body.username, password:hash})

        res.status(201).json(newUser)

    }
    catch(err){
        res.status(500).json(err.message)
    }
})

router.post("/login", (req, res) => {
    try{
      const verifies = bcrypt.compareSync(req.body.password, req.userData.password)
      if(verifies){
          req.session.user = req.userData
          res.json(`hey ${req.userData.username}`)
      } else{
        res.status(401).json('bad credentials')
      }
    }
    catch(err){
        res.status(500).json(err.message)
    }
})

module.exports = router