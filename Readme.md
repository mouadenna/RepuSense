## 🌐🧠 **Nom du projet : RepuSense – Système IA d'Analyse et de Gestion de l'E-Réputation**

---

### 🎯 **Objectif**

Créer une **plateforme intelligente** qui surveille en continu l'e-réputation d'une entreprise, l'analyse via des algorithmes NLP, et génère des **alertes et recommandations stratégiques** pour améliorer l'image de marque.

---

### 🧩 **Modules Fonctionnels**

#### 📥 1. **Collecte de Données Multicanales (en continu)**

* **Sources** :

  * Avis clients (Google, Trustpilot, App Stores…)
  * Réseaux sociaux (X/Twitter, Instagram, Facebook)
  * Articles de blogs, forums (Reddit, Quora)
* **Techno** : Scrapy + APIs + Scheduler (Airflow ou Cron)

##### 🔴 Module Reddit (Implémenté)

Nous avons développé un module de collecte avancé pour Reddit, qui permet de :
* Rechercher des posts par mot-clé dans une période précise
* Récupérer le contenu complet des discussions (posts + commentaires)
* Structurer les données pour l'analyse NLP
* Respecter les limitations de l'API Reddit

[Voir la documentation complète du module Reddit](./REDDIT_DATA_COLLECTION.md)

---

#### 🧠 2. **Analyse de Sentiment et Classification**

* Analyse en **temps réel** des mentions :

  * **Sentiment** : positif / neutre / négatif
  * **Tonalité émotionnelle** : colère, satisfaction, déception…
  * **Catégorie** : service client, produit, livraison, etc.
* **Modèles** :

  * `CamemBERT` fine-tuné pour les sentiments (Français)
  * `BERTopic` ou `LDA` pour extraire les thématiques dominantes

---

#### 📊 3. **Tableau de Bord d'Analyse de Réputation**

* Évolution du **sentiment** au fil du temps
* Nuages de mots des plaintes récurrentes
* Analyse par **canal** (X, Google, Facebook…)
* Comparaison avec les **concurrents**
* Alertes en cas de pic de mentions négatives

---

#### 💡 4. **Générateur de Recommandations Automatisées**

* Suggestions d'actions basées sur l'analyse :

  * Réponse aux avis négatifs
  * Changement de politique produit
  * Campagnes de communication ciblées
* **Approche** :

  * Règles métier + scoring
  * Ou GPT (prompt engineering) pour des recommandations textuelles

---

#### 🔔 5. **Système d'Alerte Proactif**

* Notifications mail/Slack si :

  * Sentiment global < seuil
  * Trop de mentions négatives sur un sujet
  * Nouvelle tendance critique détectée

---

### 🧠 **Composants IA**

| Composant          | Modèle / Techno           |
| ------------------ | ------------------------- |
| Sentiment Analysis | CamemBERT, TextBlob-Fr    |
| Topic Modeling     | BERTopic, LDA             |
| Recommandations IA | GPT-3.5 / Règles          |
| Extraction avis    | NLP + Regex               |
| Visualisation      | Streamlit, Dash, Power BI |

---

### ⚙️ **Architecture Technique (simplifiée)**

```
[Web/API Scraper] ─→ [Data Lake / NoSQL]
                           │
        ┌──────────────────┼──────────────────┐
        ↓                                      ↓
[NLP Sentiment Model]                [Topic Modeling / Trends]
        ↓                                      ↓
   [Reputation Score Engine]      [Recommendation Engine]
                      ↓
            [Streamlit Dashboard + Alert System]
```

---

### 📈 **État d'avancement**

| Module | État | Description |
|--------|------|-------------|
| Collecte Reddit | ✅ Terminé | Script Python pour collecter des posts et commentaires Reddit sur un sujet ([documentation](./REDDIT_DATA_COLLECTION.md)) |
| Autres sources | 🔄 En cours | Développement des connecteurs pour autres plateformes |
| Sentiment Analysis | 🔄 En cours | Adaptation des modèles aux données collectées |
| Dashboard | 🔜 À venir | Définition des maquettes |
| Alertes | 🔜 À venir | Conception du système |

---

### ✅ **Livrables pour ton projet**

* Présentation PowerPoint complète (Objectif, Problématique, Modules, Stack, Démo)
* Démo fonctionnelle d'une partie du système (ex: scraping + NLP + dashboard)
* Rapport PDF (démarche, architecture, choix techniques, cas d'usage)

---

### 🚀 **Installation et utilisation**

#### Prérequis

- Python 3.9+
- Packages: voir `requirements.txt`

#### Installation

```bash
git clone https://github.com/votre-user/RepuSense.git
cd RepuSense
pip install -r requirements.txt
```

#### Utilisation du module Reddit

```bash
python reddit_nlp_scraper.py "mot-clé" "date-début" "date-fin"
```

Par exemple, pour analyser la réputation d'une marque de télécommunications:
```bash
python reddit_nlp_scraper.py "inwi" "2023-01-01" "2023-12-31"
```
