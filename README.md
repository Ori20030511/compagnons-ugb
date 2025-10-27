# Com'pagnons - Assistant IA pour étudiants en Communication UGB

Com'pagnons est une application web progressive (PWA) conçue pour assister les étudiants en Sciences de l'Information et de la Communication de l'Université Gaston Berger de Saint-Louis, Sénégal.

## 🚀 Fonctionnalités

- Interface de chat intuitive
- Assistance pour les cours et concepts
- Aide à la rédaction professionnelle
- Conseils pour les stages
- Orientation professionnelle
- Mode hors ligne
- Support mobile (PWA)
- Export des conversations
- Mode sombre automatique

## 🛠️ Technologies utilisées

- HTML5 / CSS3 / JavaScript vanilla
- Bootstrap 5 pour l'interface
- API Gemini de Google
- Service Workers pour le mode hors ligne
- LocalStorage pour la sauvegarde

## ⚙️ Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/compagnons-ugb.git
cd compagnons-ugb
```

2. Configurez votre clé API :
- Obtenez une clé API gratuite sur https://ai.google.dev/
- Remplacez `VOTRE_CLE_API_ICI` dans `config.js` par votre clé

3. Lancez un serveur local :
```bash
python -m http.server 8000
# Ou utilisez Live Server dans VS Code
```

4. Ouvrez dans votre navigateur :
```
http://localhost:8000
```

## 📱 Installation PWA

Sur mobile ou desktop :
1. Ouvrez l'application dans Chrome
2. Cliquez sur "Ajouter à l'écran d'accueil"
3. L'app s'installera comme une application native

## 💡 Utilisation

- Posez vos questions dans la zone de texte
- Utilisez les suggestions pour des exemples
- Ctrl+Enter pour envoyer
- Exportez vos conversations
- Fonctionne hors ligne

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :
1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmeliorationSuggestions`)
3. Committez vos changements (`git commit -m 'Ajout de suggestions par matière'`)
4. Pushez vers la branche (`git push origin feature/AmeliorationSuggestions`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Crédits

Développé pour les étudiants en Communication de l'UGB - 2025

## 📞 Contact

Pour toute question ou suggestion, contactez-nous via :
- Email : [votre-email@ugb.edu.sn](mailto:votre-email@ugb.edu.sn)
- GitHub Issues