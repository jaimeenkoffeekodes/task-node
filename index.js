const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());


app.get('/', async (req, res) => {
    const users = await prisma.registrationSchema.findMany();
    console.log('users::: ', users);
    res.json(users);
});

app.post('/register', async (req, res) => {
    console.log('req::: ', req.body);
    try {
        const { name, email, phone_number, password } = req.body;

        const newUser = await prisma.registrationSchema.create({
            data: {
                name: name,
                email: email,
                phone_number: phone_number,
                password: password
            }
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.log('error::: ', error);
        // if (error.code === 'P2002') {
        //     return res.status(400).json({ error: 'Email or phone number already exists' })
        // }
        res.status(500).json({ error: "Something went wrong" })
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = await prisma.registrationSchema.findFirst({
            where: {
                email: email,
                password: password
            }
        });

        if (newUser) {
            res.status(201).json({ message: 'User login successfully', });

        } else {
            res.status(401).json({ message: 'User invalid', });
        }

    } catch (error) {
        console.log('error::: ', error);
        res.status(500).json({ error: "Something went wrong" })
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
