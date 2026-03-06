require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS requerida para que el Frontend (puerto 3000) pueda conectarse
app.use(cors());

// Endpoint Proxy para buscar películas
app.get('/api/movies/search', async (req, res) => {
  const searchQuery = req.query.q; 

  if (!searchQuery) {
    return res.status(400).json({ error: "Debes proporcionar un término de búsqueda." });
  }

  try {
    const response = await axios.get(process.env.OMDB_BASE_URL, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        s: searchQuery,
        type: 'movie'
      }
    });

    if (response.data.Response === "False") {
        return res.status(404).json({ error: "No se encontraron películas con ese nombre." });
    }

    res.json(response.data.Search); 
  } catch (error) {
    console.error("Error al consumir OMDb:", error.message);
    res.status(500).json({ error: "Error interno: No se pudo conectar con el servicio OMDb." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Backend ejecutándose en http://localhost:${PORT}`);
});