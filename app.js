//Importation des modules
const express = require('express');//framework pour créer des applications web
const bodyParser = require('body-parser');//middleware pour parser les corps des requêtes HTTP
var cors=require('cors');
var path=require('path');
const mysql = require('mysql2');//module pour interagir avec une base de données MySQL
const app = express();
const multer = require('multer');

//Configuration de l'application
app.use(bodyParser.json());// Utilisation de body-parser pour analyser les requêtes JSON
app.use(bodyParser.urlencoded({ extended: true }));// Middleware pour parser les données du formulaire
app.use(cors());

app.use(express.static(path.join(__dirname,'')));// Servir les fichiers statiques depuis le répertoire courant

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs');

app.get('/',function(request, response){
  response.render('index');
});


// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'Ycode@2021',
database: 'agro'
});
//Établir la connexion à la base de données et afficher un message de confirmation
db.connect((err) => {
if (err) throw err;
console.log('Connected to database');
});


// Configurer multer pour gérer les téléchargements de fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Route pour gérer la soumission du formulaire d'inscription
// app.post('/register', (req, res) => {
//   const { nom, email, password, role } = req.body;
//   console.log('Données reçues :', req.body);

//   // Vérifier si l'email existe déjà en base de données
//   const sql = 'SELECT * FROM users WHERE email = ?';
//   db.query(sql, [email], (err, results) => {
//     if (err) {
//       console.error('Erreur lors de la vérification de l\'email :', err);
//       return res.status(500).send('Erreur lors de la vérification de l\'email');
//     }

//     if (results.length > 0) {
//       // L'email existe déjà en base de données
//       return res.send('E-mail déjà enregistré.');
//     } else {
//       // L'email n'existe pas en base de données, procéder à l'inscription
//       const insertSql = 'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)';
//       db.query(insertSql, [nom, email, password, role], (err, result) => {
//         if (err) {
//           console.error('Erreur lors de l\'inscription de l\'utilisateur :', err);
//           return res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
//         }
//         console.log('Utilisateur inscrit avec succès.');
//         res.send('Inscription réussie !');
//       });
//     }
//   });
// });

// Route GET pour récupérer tous les emails
/*app.get('/emails', (req, res) => {
  const sql = 'SELECT email FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des emails :', err);
      return res.status(500).send('Erreur lors de la récupération des emails');
    }
    res.send(results.map(row => row.email));
  });
});

// Route POST pour le formulaire d'inscription
app.post('/register', (req, res) => {
  const { nom, email, password, role } = req.body;
  console.log('Données reçues :', req.body);

  // Vérifier si l'email existe déjà en base de données
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'email :', err);
      return res.status(500).send('Erreur lors de la vérification de l\'email');
    }

    if (results.length > 0) {
      // L'email existe déjà en base de données
      return res.send('E-mail déjà enregistré.');
    } else {
      // L'email n'existe pas en base de données, procéder à l'inscription
      const insertSql = 'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [nom, email, password, role], (err, result) => {
        if (err) {
          console.error('Erreur lors de l\'inscription de l\'utilisateur :', err);
          return res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
        }
        console.log('Utilisateur inscrit avec succès.');
        res.send('Inscription réussie !');
      });
    }
  });
});*/



//pour login 

app.post('/login', (req, res) => {
  const { mail, password } = req.body;
  const sql = 'SELECT role FROM users WHERE email = ? AND password = ?';
  db.query(sql, [mail, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête de connexion :', err);
      return res.status(500).send('Erreur lors de la connexion : ' + err.message);
    }
    if (results.length > 0) {
      const role = results[0].role;
      if (role === 'admin') {
        res.redirect('/agenda'); // Redirection vers agenda.ejs pour les admins
      } else {
        res.redirect('/acceuil'); // Redirection vers accueil.ejs pour les utilisateurs normaux
      }
    } else {
      res.send('Identifiants incorrects'); // Gérer le cas où aucun utilisateur correspondant n'est trouvé
    }
  });
});

app.post('/register', (req, res) => {
  const { nom, email, password } = req.body;

  // Vérifier si l'email existe déjà en base de données
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'email :', err);
      return res.status(500).send('Erreur lors de la vérification de l\'email');
    }

    if (results.length > 0) {
      // L'email existe déjà en base de données
      return res.send('E-mail déjà enregistré.');
    } else {
    var role = 'user';
      // L'email n'existe pas en base de données, procéder à l'inscription
      const insertSql = 'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [nom, email, password, role], (err, result) => {
        if (err) {
          console.error('Erreur lors de l\'inscription de l\'utilisateur :', err);
          return res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
        }
        console.log('Utilisateur inscrit avec succès.');
        res.send('Inscription réussie !');
      });
    }
  });
});


// Route pour gérer les téléchargements de fichiers
app.post('/upload', upload.single('image'), (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const image = req.file.buffer;

  const query = 'INSERT INTO phenological_stages (name, description, image) VALUES (?, ?, ?)';
  db.query(query, [title, description, image], (err, results) => {
    if (err) throw err;
    res.send('Image uploaded successfully');
  });
});

// Route pour afficher la page avec les images
app.get('/images', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'stade'));
});

// Route pour récupérer une image spécifique
app.get('/image/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT image FROM phenological_stages WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(results[0].data);
    } else {
      res.status(404).send('Image not found');
    }
  });
});

// Route pour obtenir les IDs des images
app.get('/get-image-ids', (req, res) => {
  db.query('SELECT id FROM phenological_stages', (err, results) => {
    if (err) throw err;
    res.json(results.map(row => row.id));
  });
});

// Route pour afficher l'agenda (pour les admins)



app.get('/agenda', (req, res) => {
  res.render('agenda');
});

// Route pour afficher l'accueil (pour les utilisateurs normaux)
app.get('/acceuil', (req, res) => {
  res.render('acceuil');
});


app.get('/update', (req, res) => {
  res.render('update');
});

app.get('/stade', (req, res) => {
  const query = 'SELECT  name, description, image FROM phenological_stages';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render('stade', { images: results });
  });
});


// Route pour récupérer et afficher la liste des utilisateurs inscrits
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(8000,function(){
  console.log("heard en 8000");
});





