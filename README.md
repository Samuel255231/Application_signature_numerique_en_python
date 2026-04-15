#  Signature Numérique Web (FastAPI + React)

##  Description

Ce projet est une application web permettant de démontrer le fonctionnement de la **signature numérique**.

Elle permet de :

* ✔️ Signer un document (texte ou fichier)
* ✔️ Vérifier l’authenticité d’un document
* ✔️ Vérifier l’intégrité (détecter toute modification)

Le système repose sur les principes de la cryptographie moderne :

* Hash SHA256
* Clés RSA (clé privée / clé publique)

---

##  Objectif

L’objectif de ce projet est de :

* Comprendre le fonctionnement de la signature numérique
* Implémenter une solution complète (backend + frontend)
* Montrer concrètement comment vérifier l’authenticité d’un document

---

##  Principe de fonctionnement

```
Document → Hash → Signature (clé privée)
                     ↓
               Vérification (clé publique)
```

* Le document est transformé en **hash (empreinte)**
* Le hash est signé avec la **clé privée**
* La signature est vérifiée avec la **clé publique**

 Toute modification du document entraîne un changement du hash → signature invalide

---

##  Architecture du projet

```
sec_web_signature_numerique/
├── main.py                 # Backend FastAPI
├── requirements.txt        # Dépendances Python
└── frontend/               # Application React
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   ├── SignComponent.tsx
    │   └── VerifyComponent.tsx
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

---

##  Technologies utilisées

### Backend

* Python
* FastAPI
* Cryptography (RSA + SHA256)

### Frontend

* React (Vite)
* TypeScript
* CSS

### Concepts de sécurité

* Signature numérique
* Hash SHA256
* Cryptographie asymétrique (RSA)

---

##  Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Samuel255231/Application_signature_numerique_en_python.git
cd sec_web_signature_numerique
```

---

## 🖥️ Backend (FastAPI)

### Installer les dépendances

```bash
pip install -r requirements.txt
```

### Lancer le serveur

```bash
uvicorn main:app --reload
```

 Accès API :

```
http://127.0.0.1:8000/docs
```

---

##  Frontend (React)

### Aller dans le dossier frontend

```bash
cd frontend
```

### Installer les dépendances

```bash
npm install
```

### Lancer l’application

```bash
npm run dev
```

 Accès :

```
http://localhost:5173
```


##  Fonctionnalités

###  Signature de texte

* Saisie d’un message
* Génération de signature
* Vérification de signature

###  Signature de fichier

* Upload de fichier (PDF, image, etc.)
* Signature du fichier
* Vérification de l’intégrité

---

##  Scénarios de test

###  Cas valide

1. Saisir un message ou choisir un fichier
2. Générer la signature
3. Vérifier → Résultat : VALIDE

###  Cas invalide

1. Modifier le message ou le fichier
2. Vérifier → Résultat : INVALIDE

---

##  Sécurité

Le projet utilise :

* Algorithme RSA (2048 bits)
* Hash SHA256
* Clés privée et publique


##  Limites du projet

* Gestion des clés simplifiée
* Pas de certificat numérique
* Pas de gestion des utilisateurs
* Pas de stockage sécurisé



