# RepuSense: Projet de Suivi Automatisé de la Réputation Numérique

## Équipe du Projet
- **Mouad Ennasiry**
- **Kamal Saalaoui**
- **Hicham Ennami**

## Table des Matières

1. [Introduction](#1-introduction)
   - [Contexte du projet](#contexte-du-projet)
   - [Objectifs de la digitalisation](#objectifs-de-la-digitalisation)
   - [Présentation de l'entreprise](#présentation-de-lentreprise)

2. [Problématique identifiée](#2-problématique-identifiée)
   - [Défis liés à la gestion de la réputation d'entreprise](#défis-liés-à-la-gestion-de-la-réputation-dentreprise)
   - [Limites des approches traditionnelles](#limites-des-approches-traditionnelles)
   - [Opportunités offertes par la digitalisation](#opportunités-offertes-par-la-digitalisation)

3. [Présentation de la solution RepuSense](#3-présentation-de-la-solution-repusense)
   - [Objectifs fonctionnels et techniques](#objectifs-fonctionnels-et-techniques)
   - [Vue d'ensemble de l'architecture](#vue-densemble-de-larchitecture)
   - [Sources de données exploitées](#sources-de-données-exploitées)

4. [Axes de digitalisation ciblés](#4-axes-de-digitalisation-ciblés)
   - [Automatisation de la veille réputationnelle](#automatisation-de-la-veille-réputationnelle)
   - [Analyse sémantique via NLP](#analyse-sémantique-via-nlp)
   - [Visualisation des indicateurs clés](#visualisation-des-indicateurs-clés)

5. [Stratégie de mise en œuvre](#5-stratégie-de-mise-en-œuvre)
   - [Choix technologiques](#choix-technologiques)
   - [Méthodologie de développement](#méthodologie-de-développement)
   - [Gestion des données et respect de la confidentialité](#gestion-des-données-et-respect-de-la-confidentialité)

6. [Déploiement technique](#6-déploiement-technique)
   - [Structure du pipeline](#structure-du-pipeline)
   - [Organisation du traitement](#organisation-du-traitement)
   - [Stockage et intégration des résultats](#stockage-et-intégration-des-résultats)

7. [Résultats et démonstration](#7-résultats-et-démonstration)
   - [Exemples d'analyses de sentiment](#exemples-danalyses-de-sentiment)
   - [Thèmes identifiés par topic modeling](#thèmes-identifiés-par-topic-modeling)
   - [Distribution des sources](#distribution-des-sources)
   - [Analyse des tendances](#analyse-des-tendances)
   - [Interface du dashboard](#interface-du-dashboard)
   - [Résumé des problématiques détectées](#résumé-des-problématiques-détectées)

8. [Limites et perspectives](#8-limites-et-perspectives)
   - [Contraintes techniques rencontrées](#contraintes-techniques-rencontrées)
   - [Améliorations envisagées](#améliorations-envisagées)
   - [Scalabilité et adaptation à d'autres secteurs](#scalabilité-et-adaptation-à-dautres-secteurs)

9. [Conclusion](#9-conclusion)
   - [Bilan de la digitalisation apportée](#bilan-de-la-digitalisation-apportée)
   - [Apports pour l'entreprise et les parties prenantes](#apports-pour-lentreprise-et-les-parties-prenantes)

10. [Annexes](#10-annexes)
    - [Schéma d'architecture du pipeline](#schéma-darchitecture-du-pipeline)
    - [Structure du projet](#structure-du-projet)
    - [Principales bibliothèques utilisées](#principales-bibliothèques-utilisées)
    - [Références bibliographiques et techniques](#références-bibliographiques-et-techniques)

## 1. Introduction

### Contexte du projet
Dans l'ère numérique actuelle, la réputation en ligne est devenue un actif stratégique pour toute organisation. Les commentaires, avis et discussions sur les plateformes digitales façonnent la perception publique et influencent directement les décisions des consommateurs et partenaires.

### Objectifs de la digitalisation
Notre projet vise à transformer le processus traditionnellement manuel de surveillance de la réputation en un système automatisé, intelligent et centralisé. Cette digitalisation permet d'extraire des insights précieux à partir de grandes quantités de données textuelles dispersées sur différentes plateformes.

### Présentation de l'entreprise
Le projet RepuSense a été conçu pour répondre aux besoins de PMEs marocaines, particulièrement dans le secteur des télécommunications et des services, qui cherchent à mieux comprendre leur image de marque sans disposer des ressources nécessaires pour déployer des équipes complètes dédiées à cette tâche.

## 2. Problématique identifiée

### Défis liés à la gestion de la réputation d'entreprise
La réputation numérique influence significativement la confiance accordée à une entreprise. Cependant, les informations concernant la perception publique sont dispersées à travers un vaste écosystème digital : réseaux sociaux, forums, avis clients, médias en ligne. Cette fragmentation rend la surveillance exhaustive pratiquement impossible avec des méthodes manuelles.

### Limites des approches traditionnelles
Les méthodes traditionnelles de veille d'e-réputation présentent plusieurs limitations :
- Processus chronophage nécessitant une surveillance constante
- Couverture limitée à quelques canaux spécifiques
- Difficulté à analyser systématiquement de grands volumes de textes
- Approche principalement réactive plutôt que proactive
- Absence d'analyse qualitative approfondie

### Opportunités offertes par la digitalisation
La digitalisation offre des opportunités significatives pour surmonter ces défis :
- Automatisation de la collecte et du traitement des données
- Application de techniques d'analyse textuelle à grande échelle
- Centralisation et structuration des informations
- Visualisation claire des tendances et thématiques émergentes

## 3. Présentation de la solution RepuSense

### Objectifs fonctionnels et techniques
RepuSense a été développé avec les objectifs spécifiques suivants :

1. **Centralisation des données** : Créer un point unique de collecte et d'analyse pour les mentions d'une entreprise.
2. **Analyse textuelle** : Appliquer des techniques de NLP pour évaluer le sentiment, identifier les thèmes dominants et extraire des mots-clés pertinents.
3. **Visualisation intuitive** : Développer une interface utilisateur permettant de comprendre rapidement les tendances et insights.
4. **Organisation structurée** : Mettre en place un système pour stocker et organiser les données d'analyse.
5. **Automatisation de base** : Réduire le temps et les ressources nécessaires à la veille d'e-réputation.

### Vue d'ensemble de l'architecture
L'architecture de RepuSense est conçue pour être modulaire et fonctionnelle :

![Architecture RepuSense](schema.png)

Cette architecture permet de traiter les données depuis leur collecte jusqu'à leur visualisation dans le dashboard, en passant par des étapes d'analyse NLP.

### Sources de données exploitées
RepuSense collecte actuellement des données à partir de :
- Reddit (via PRAW - Python Reddit API Wrapper)
- Données pré-collectées pour la démonstration

Le système est conçu pour être extensible et pourrait intégrer d'autres sources à l'avenir.

## 4. Axes de digitalisation ciblés

### Automatisation de la veille réputationnelle
RepuSense digitalise le processus de veille réputationnelle en remplaçant les tâches manuelles par des processus automatisés :
- Collecte régulière des données via des scripts programmés
- Traitement systématique des nouvelles mentions
- Organisation automatique des résultats d'analyse

### Analyse sémantique via NLP
L'utilisation des techniques de traitement du langage naturel (NLP) permet d'extraire du sens à partir de grandes quantités de texte :
- Analyse de sentiment pour déterminer la tonalité des mentions
- Modélisation de sujets pour identifier les thématiques récurrentes
- Extraction de mots-clés pour comprendre les termes associés à la marque

### Visualisation des indicateurs clés
La transformation des données brutes en visualisations compréhensibles représente un axe clé de la digitalisation :
- Tableaux de bord interactifs pour explorer les données
- Graphiques et visualisations pour faciliter la compréhension
- Organisation visuelle des thématiques et sentiments

## 5. Stratégie de mise en œuvre

### Choix technologiques
Notre stratégie d'implémentation repose sur l'utilisation de technologies modernes et adaptées :
- **Python** comme langage principal pour le traitement des données et l'analyse NLP
- **Bibliothèques NLP** spécialisées pour l'analyse de texte
- **Next.js et React** pour le développement du dashboard
- **Tailwind CSS** pour l'interface utilisateur

### Méthodologie de développement
Le projet a été développé selon une approche itérative :
1. Développement initial du pipeline de collecte de données
2. Implémentation des algorithmes d'analyse NLP de base
3. Création d'une structure de stockage organisée
4. Développement du dashboard de visualisation
5. Intégration des différents composants

### Gestion des données et respect de la confidentialité
La solution a été conçue en tenant compte des aspects éthiques et de confidentialité :
- Collecte uniquement de données publiques
- Anonymisation des données sensibles
- Stockage sécurisé des informations traitées
- Respect des conditions d'utilisation des APIs

## 6. Déploiement technique

### Structure du pipeline
Le pipeline de traitement RepuSense comprend plusieurs étapes séquentielles :
1. **Collecte** : Acquisition des données via des scripts de scraping
2. **Prétraitement** : Nettoyage et normalisation des textes
3. **Analyse NLP** : Application des algorithmes d'analyse textuelle
4. **Stockage** : Organisation des résultats dans une structure cohérente
5. **Visualisation** : Présentation des insights via le dashboard

### Organisation du traitement
Le pipeline est implémenté dans le module `nlp_pipeline` et peut être exécuté via `run_pipeline.py`, qui offre diverses options de configuration :
- Sélection de l'entreprise à analyser
- Utilisation de données existantes
- Choix des analyses à effectuer (sentiment, sujets, mots-clés)

### Stockage et intégration des résultats
Les résultats des analyses sont stockés dans une structure de dossiers organisée :
- Structure par entreprise et type d'analyse
- Formats standardisés pour les résultats d'analyse
- Accessibilité pour le dashboard de visualisation

## 7. Résultats et démonstration

### Exemples d'analyses de sentiment

![Analyse de Sentiment](placeholder_sentiment_analysis.png)

*Suggestion pour cette image : Capture d'écran du composant sentiment-chart.tsx montrant la distribution des sentiments (positif, neutre, négatif) pour une entreprise spécifique, idéalement avec un graphique circulaire ou en barres. Cette visualisation devrait montrer clairement la répartition des sentiments et potentiellement leur évolution dans le temps.*

### Thèmes identifiés par topic modeling

![Modélisation des Sujets](placeholder_topic_modeling.png)

*Suggestion pour cette image : Capture d'écran du composant topic-cluster-map.tsx présentant une visualisation des clusters thématiques découverts par l'algorithme. Idéalement, cette visualisation montrerait des groupes de sujets connexes avec les mots-clés associés à chaque cluster et leur importance relative.*

### Distribution des sources

![Distribution des Sources](placeholder_source_distribution.png)

*Suggestion pour cette image : Capture d'écran du composant source-distribution.tsx affichant la répartition des mentions par plateforme source. Un graphique en secteurs ou en barres montrant d'où proviennent les données analysées (Reddit, autres sources) et leur proportion relative.*

### Analyse des tendances

![Analyse des Tendances](placeholder_trend_analysis.png)

*Suggestion pour cette image : Capture d'écran du composant trend-analysis.tsx présentant l'évolution temporelle des mentions et de leur sentiment. Un graphique linéaire montrant les variations du volume de mentions et du sentiment global sur une période donnée, permettant d'identifier les pics d'activité.*

### Interface du dashboard

![Dashboard Complet](placeholder_dashboard_overview.png)

*Suggestion pour cette image : Capture d'écran complète du dashboard montrant l'interface principale avec tous les composants visuels intégrés. Cette vue d'ensemble permettrait de comprendre comment les différentes analyses sont présentées de manière cohérente dans l'interface utilisateur.*

### Résumé des problématiques détectées

![Résumé des Problèmes](placeholder_problem_summary.png)

*Suggestion pour cette image : Capture d'écran du composant problem-summary.tsx affichant un résumé des principaux problèmes ou sujets négatifs détectés. Idéalement, cette visualisation présenterait une liste ordonnée des thématiques problématiques avec leur importance et impact potentiel.*

## 8. Limites et perspectives

### Contraintes techniques rencontrées
Le développement de RepuSense a permis d'identifier plusieurs défis techniques :

**Données Bruitées**
- **Défi** : Les données issues du web contiennent beaucoup de bruit et d'informations non pertinentes.
- **Solution actuelle** : Mise en place d'étapes de nettoyage et de filtrage des données.

**Hétérogénéité des Formats**
- **Défi** : Chaque source présente ses données dans un format différent.
- **Solution actuelle** : Développement d'une structure commune pour normaliser les données.

**Complexité de l'Analyse NLP**
- **Défi** : L'analyse de texte naturel présente de nombreux défis techniques.
- **Solution actuelle** : Utilisation de bibliothèques spécialisées et limitation du champ d'analyse.

**Performance du Traitement**
- **Défi** : Traiter efficacement des volumes importants de texte.
- **Solution actuelle** : Traitement par lots et optimisation des algorithmes les plus coûteux.

### Améliorations envisagées
Plusieurs pistes d'amélioration ont été identifiées pour les versions futures :

1. **Intégration de sources supplémentaires** :
   - Élargir la collecte à d'autres plateformes sociales
   - Intégrer des sources d'avis clients et forums spécialisés

2. **Enrichissement des analyses** :
   - Affiner les modèles de sentiment pour une meilleure précision
   - Développer des analyses comparatives entre concurrents

3. **Évolutions techniques** :
   - Optimiser les performances de traitement pour des volumes plus importants
   - Améliorer l'interface utilisateur avec plus d'interactivité

### Scalabilité et adaptation à d'autres secteurs
La solution RepuSense présente un potentiel d'adaptation à divers secteurs :
- Application au domaine de la santé pour l'analyse des retours patients
- Adaptation pour le secteur financier et l'analyse des opinions sur les produits bancaires
- Utilisation dans le secteur public pour le suivi de l'image des institutions

## 9. Conclusion

### Bilan de la digitalisation apportée
RepuSense représente une solution pratique au défi de la surveillance de réputation numérique en combinant :
- Des techniques d'analyse de texte accessibles
- Une architecture structurée et modulaire
- Une interface utilisateur intuitive

Cette digitalisation permet de transformer un processus manuel, fragmenté et chronophage en un système structuré, centralisé et semi-automatisé.

### Apports pour l'entreprise et les parties prenantes
Cette solution permet aux organisations de :
- Mieux comprendre leur présence en ligne
- Identifier les tendances importantes dans les discussions
- Visualiser les données de réputation de manière claire
- Prendre des décisions basées sur des données objectives

En transformant des données textuelles en visualisations compréhensibles, RepuSense facilite la gestion de la réputation numérique, un élément désormais essentiel dans l'environnement digital contemporain.

## 10. Annexes

### Schéma d'architecture du pipeline
![Architecture détaillée](schema.png)

### Structure du projet
```
RepuSense/
├── config.json                   # Configuration du projet
├── run_pipeline.py               # Script principal
├── nlp_pipeline/                 # Core NLP pipeline code
│   ├── main.py                   # Implémentation du pipeline
│   ├── data_processing/          # Traitement des données
│   └── spark_nlp/                # Composants d'analyse NLP
├── scrapping script/             # Scripts de collecte de données
├── dashboard/                    # Interface utilisateur Next.js
│   ├── app/                      # Pages de l'application
│   ├── components/               # Composants React
│   └── styles/                   # Styles CSS
└── data/                         # Stockage des données
```

### Principales bibliothèques utilisées
- PRAW pour l'accès à l'API Reddit
- Bibliothèques NLP pour l'analyse textuelle
- Next.js et React pour le frontend
- Tailwind CSS pour le design de l'interface

### Références bibliographiques et techniques
- Documentation de Reddit API
- Documentation des bibliothèques NLP utilisées
- Ressources sur l'analyse de sentiment et le topic modeling
- Documentation de Next.js et React

---

*Ce rapport a été préparé dans le cadre d'un projet scolaire et représente une description du système RepuSense, sa conception, son architecture et ses capacités réellement implémentées.* 