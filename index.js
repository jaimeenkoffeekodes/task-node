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

app.delete('/user_delete', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const deletedUser = await prisma.users.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(500).json({ message: 'An error occurred while deleting the user', error });
    }
});


// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
