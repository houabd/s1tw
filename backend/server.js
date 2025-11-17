import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); // autorise les requêtes depuis le frontend
app.use(express.json());
app.use(express.static('public'));

// Tableau de bouquets simulé
const bouquets = [
    {
        id: 1,
        nom: "Bouquet de Tunis",
        descr: "Un dosage parfait de jasmins et de tulipes...",
        image: "/images/b2.jpg",
        prix: 1500,
        liked: false
    },
    {
        id: 2,
        nom: "Bouquet dʼAlger",
        descr: "Un mélange merveilleux de jasmins...",
        image: "/images/bouquet1.jpg",
        prix: 2000,
        liked: false
    },
    {
        id: 3,
        nom: "Bouquet dʼOran",
        descr: "Un mélange de roses et de lys...",
        image: "/images/bouquet2.jpg",
        prix: 2000,
        liked: false
    }
];

// Route API pour obtenir tous les bouquets
app.get("/api/bouquets", (req, res) => {
    res.json(bouquets);
});

// Nouvelle route API pour obtenir un bouquet spécifique par son ID
app.get("/api/bouquets/:id", (req, res) => {
    // L'ID du paramètre de route est toujours une chaîne, on le convertit en nombre
    const id = parseInt(req.params.id);

    // Recherche du bouquet correspondant dans le tableau
    const bouquet = bouquets.find(b => b.id === id);

    if (bouquet) {
        // Renvoyer le bouquet trouvé
        res.json(bouquet);
    } else {
        // Renvoyer un statut 404 (Non trouvé) si l'ID n'existe pas
        res.status(404).send({ message: "Bouquet non trouvé." });
    }
});
app.get("/like", (req, res) => {
  const id = parseInt(req.query.id);
  const bouquet = bouquets.find(b => b.id === id);

  if (bouquet) {
    bouquet.liked = !bouquet.liked; // Inverse le like côté serveur

    // Message dans le terminal selon l’action
    if (bouquet.liked) {
      console.log(`💚 Le bouquet "${bouquet.nom}" (ID: ${bouquet.id}) vient d'être liké.`);
    } else {
      console.log(`💔 Le bouquet "${bouquet.nom}" (ID: ${bouquet.id}) vient d'être disliké.`);
    }

    // Réponse envoyée au frontend
    res.json({
      success: true,
      id: id,
      liked: bouquet.liked,
      message: bouquet.liked
        ? `Vous avez liké le bouquet "${bouquet.nom}"`
        : `Vous avez disliké le bouquet "${bouquet.nom}"`
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Bouquet non trouvé"
    });
  }
});

let requestCount = 0;
let lastResetTime = Date.now();

app.get("/api/poll", (req, res) => {
  requestCount++;

  // Réinitialiser chaque minute
  const now = Date.now();
  if (now - lastResetTime >= 60000) {
    console.log(`⏱️ Requêtes reçues la dernière minute : ${requestCount}`);
    requestCount = 0;
    lastResetTime = now;
  }

  res.json({ status: "ok" });
});


const PORT = 5000;
app.listen(PORT, () =>
    console.log(`✅ Serveur backend lancé sur le port ${PORT}`)
);