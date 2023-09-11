// Web Dev Simplified -- JWT Authentication Tutorial - Node.js

require('dotenv').config()

const express = require('express')
const cors = require('cors');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const app = express()

const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');

app.use(cors({
    origin: '*'
}));

app.use(express.json())

const users = []

const posts = [
    {
        username: 'Kyle',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    },
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
    // res.json(posts)
})

app.post('/login', async (req, res) => {
    //Authentication User
    const username = req.body.username
    const user = users.find(user => user.username === username)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            const user = { name: username }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.json({ access_token: accessToken })
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }

    // const username = req.body.username
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/register', async (req, res) => {
    //Authentication User
    try {
        // const salt = await bcrypt.genSalt()
        // const hashedPassword = await bcrypt.hash(req.body.password, salt)
        // console.log(salt)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        console.log(hashedPassword)
        const user = { username : req.body.username, password: hashedPassword }
        users.push(user)
        res.status(201).send(user)
    } catch {
        res.status(500).send("Something bad happened")
    }
    // const user = { username : req.body.username, password: req.body.password }
    // users.push(user)
    // res.status(201).send(user)

    // const username = req.body.username
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.senStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.senStatus(403)
        req.user = user
        next()
    })

}

app.listen(5000)