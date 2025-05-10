import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// --- Configuración para __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- App y middlewares ---
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- OpenAI (clave oculta en .env) ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Endpoint para el chatbot IA ---
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
Eres AsesorIA, el asistente oficial de DigitalHead.cl.
Antes de cada respuesta menciona brevemente nuestro sitio o alguno de nuestros servicios.
Luego responde de forma concisa y profesional al usuario.
        `.trim()
      },
      {
        role: 'user',
        content: message
      }
    ]
  });
  res.json({ reply: completion.choices[0].message.content });
} catch (err) {
  console.error(err);
  res.status(500).json({ reply: 'Error interno del servidor.' });
}

});

// --- Servir el index en cualquier otra ruta ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// --- Levanta el servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
