# 🎥 Plateforme de Streaming – Frontend (React + Vite)

Ce projet est une application web moderne développée avec **React** et **Vite**, dédiée à la consultation, à la lecture et à la gestion de vidéos en streaming. Il se compose de trois grandes interfaces, chacune ayant un rôle fonctionnel bien défini.

---

## 1. 🗂 Interface de visualisation de la liste des streamings

Cette interface permet à l’utilisateur de parcourir tous les contenus disponibles sur la plateforme.

### Fonctionnalités principales :
- **Affichage des vidéos** sous forme de cartes ou de lignes, incluant :
  - Titre
  - Miniature
  - Courte description
  - Nombre de vues
  - Date de publication
- **Barre de recherche** pour trouver une vidéo spécifique.
- **Filtres** disponibles :
  - Par popularité (nombre de vues)
  - Par type de vidéo (musique, tutoriel, direct, etc.)
  - Par date de publication
- **Organisation en playlists** pour regrouper les vidéos.
- **Responsive design** adapté à tous les types d’écrans.
- **Incrémentation automatique du nombre de vues** lors de la lecture.

---

## 2. 🎬 Interface de visualisation d’une vidéo

Centrée sur la lecture d’un contenu vidéo spécifique.

### Fonctionnalités du lecteur :
- Lecture / Pause
- Contrôle du volume
- Sélection de la qualité vidéo
- Vitesse de lecture
- Mode plein écran
- Sélection de la langue audio ou des sous-titres

### Interactions utilisateur :
- Boutons **Like / Dislike**
- Système de **commentaires** avec :
  - Nom de l’auteur
  - Date du commentaire

### Suggestions :
- Liste de **vidéos similaires** ou issues de la même playlist affichée à côté du lecteur.

---

## 3. 👤 Interface de gestion utilisateur

Cette section permet aux utilisateurs authentifiés de gérer leurs contenus.

### Espace personnel :
- **Publication de vidéos** avec formulaire :
  - Titre
  - Description
  - Type de contenu
- **Upload vidéo** avec :
  - Indicateur de progression
  - Affichage de la vitesse d’envoi

### Gestion des vidéos publiées :
- Liste des vidéos personnelles
- **Modification** des titres et descriptions
- **Suppression** de vidéos

### Sécurité :
- Authentification par **jeton (token)**
- Stockage des informations essentielles (ID utilisateur, nom, etc.) dans le **localStorage** pour une navigation fluide et personnalisée.

---

## ⚙️ Technologies utilisées

- **React.js**
- **Vite**
- **JavaScript**
- **LocalStorage** (pour la gestion du token et de la session)
- **CSS/SCSS/Tailwind** *(selon tes choix d’implémentation)*

---

## 📁 Structure du projet

```powershell
D:\...\frontend> ls


    Répertoire : D:\TOKY\PROJET\PROG RES\frontend


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         7/21/2025   9:49 AM                node_modules
d-----         7/21/2025   9:47 AM                public
d-----         7/21/2025   9:47 AM                src
-a----         7/21/2025   9:46 AM            253 .gitignore
-a----         7/21/2025   9:46 AM            763 eslint.config.js
-a----         7/21/2025   9:46 AM            361 index.html
-a----         7/21/2025   9:49 AM         110165 package-lock.json
-a----         7/21/2025   9:49 AM            719 package.json
-a----         7/21/2025   9:53 AM           2616 README.md
-a----         7/21/2025   9:46 AM            161 vite.config.js


D:\...\frontend> tree /F .\src\
Structure du dossier pour le volume Stockage
Le numéro de série du volume est 0616-3CC8
D:\TOKY\PROJET\PROG RES\FRONTEND\SRC
│   App.css
│   App.jsx
│   index.css
│   main.jsx
│
├───assets
│       react.svg
│
├───components
└───styles
D:\...\frontend> 
```

## 🚀 Lancer le projet en local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 👥 Collaborations
Voici la liste des branches pour chaque collaborateurs

```powershell
D:\...\frontend> git branch
  lady
  landry
  laureat
* main
D:\...\frontend> 
```
