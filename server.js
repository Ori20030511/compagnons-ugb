// Serveur proxy pour l'API Gemini
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'https://ori20030511.github.io',
        'http://localhost:8000'
    ]
}));
app.use(express.json());

// Configuration Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Route principale pour les requêtes à l'API
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        // Créer une nouvelle conversation
        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.8,
                maxOutputTokens: 2048,
            }
        });

        // Envoyer le message et obtenir la réponse
        const result = await chat.sendMessage(message);
        const response = await result.response;

        res.json({ text: response.text() });
    } catch (error) {
        console.error('Erreur API:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la communication avec l\'API Gemini',
            details: error.message 
        });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur proxy démarré sur le port ${port}`);
});