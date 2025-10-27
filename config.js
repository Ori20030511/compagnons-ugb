// Configuration de Com'pagnons - Configuration sécurisée
const CONFIG = (function() {
    'use strict';
    
    // Configuration de base
    const config = {
        // Environnement
        ENV: window.location.hostname === 'localhost' ? 'development' : 'production',
        
        // URLs d'API sécurisées
        API_URLS: {
            development: 'http://localhost:3000/api/chat',
            production: 'https://compagnons-api.herokuapp.com/api/chat'
        },
        
        // Getter sécurisé pour l'URL de l'API
        get API_URL() {
            return this.API_URLS[this.ENV];
        },

        // Configuration de génération avancée
        GENERATION_CONFIG: {
            base: {
                temperature: 0.7,
                maxOutputTokens: 2048,
                topP: 0.8,
                topK: 40
            },
            
            // Configurations spécifiques par type de requête
            types: {
                creative: { temperature: 0.9, maxOutputTokens: 1024 },
                technical: { temperature: 0.3, maxOutputTokens: 3096 },
                explanation: { temperature: 0.5, maxOutputTokens: 2048 },
                correction: { temperature: 0.4, maxOutputTokens: 1024 }
            },
            
            // Méthode pour obtenir la configuration selon le type
            getConfigForType(queryType) {
                return {
                    ...this.base,
                    ...(this.types[queryType] || {})
                };
            }
        },
        
        // Timeouts et limites
        TIMEOUTS: {
            api: 30000,        // 30 secondes pour l'API
            typing: 1000,      // Délai de simulation de frappe
            reconnect: 5000    // Délai avant reconnexion
        },

    // Prompt système définissant la personnalité de Com'pagnons
    SYSTEM_PROMPT: `Tu es Com'pagnons, l'assistant IA spécialisé pour les étudiants en Communication de l'Université Gaston Berger (UGB) au Sénégal.

RÔLE ET PERSONNALITÉ :
- Assistant pédagogique professionnel et bienveillant
- Expertise en Sciences de l'Information et de la Communication
- Connaissance du contexte universitaire sénégalais
- Ton amical mais respectueux, adapté aux étudiants

DOMAINES D'EXPERTISE :
1. Communication des organisations
2. Médias traditionnels et numériques
3. Communication événementielle
4. Relations publiques et presse
5. Marketing et publicité
6. Production audiovisuelle
7. Communication digitale

CAPACITÉS :
- Expliquer les concepts théoriques de la communication
- Aider à la rédaction professionnelle
- Conseiller sur les méthodologies
- Guider sur les outils et logiciels
- Préparer aux stages et à l'insertion professionnelle
- Informer sur les débouchés au Sénégal et en Afrique

LIMITES :
- Ne pas faire le travail à la place des étudiants
- Ne pas donner de réponses toutes faites aux examens
- Toujours encourager la réflexion personnelle
- Respecter l'éthique académique

APPROCHE PÉDAGOGIQUE :
1. Poser des questions pour mieux comprendre le besoin
2. Expliquer de manière claire et structurée
3. Donner des exemples concrets adaptés au contexte local
4. Encourager la pratique et l'apprentissage actif
5. Fournir des ressources complémentaires`,

        // Messages de l'interface améliorés
        UI_MESSAGES: {
            welcome: "Bonjour ! Je suis Com'pagnons, votre assistant pour vos études en Communication à l'UGB. Comment puis-je vous aider ?",
            errors: {
                api: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.",
                network: "La connexion semble instable. Vérifiez votre accès internet.",
                timeout: "La requête a pris trop de temps. Veuillez réessayer.",
                quota: "Service temporairement indisponible. Réessayez plus tard.",
                validation: "Votre message contient des caractères non autorisés.",
                generic: "Une erreur inattendue s'est produite. Veuillez réessayer."
            },
            hints: {
                empty: "Veuillez saisir votre question...",
                tooShort: "Votre question semble un peu courte. Pouvez-vous la développer ?",
                tooLong: "Votre message est trop long. Essayez de le raccourcir.",
                processing: "Je réfléchis à votre question...",
                clearConfirm: "Voulez-vous vraiment effacer toute la conversation ?"
            }
        },

        // Suggestions thématiques
        SUGGESTIONS: {
            cours: [
                "Expliquez les théories de la communication",
                "Différence entre communication interne et externe",
                "Comment analyser un discours médiatique ?"
            ],
            methodologie: [
                "Comment structurer un mémoire de communication ?",
                "Méthodologie d'analyse de contenu",
                "Conduire une enquête en SIC"
            ],
            metiers: [
                "Débouchés en communication au Sénégal",
                "Compétences requises pour travailler en agence",
                "Métiers de la communication digitale"
            ],
            pratique: [
                "Comment rédiger un communiqué de presse ?",
                "Concevoir une stratégie de communication",
                "Gérer une crise communicationnelle"
            ]
        },

        // Validation des entrées
        VALIDATION: {
            minLength: 2,
            maxLength: 1000,
            allowedChars: /^[\\p{L}\\p{N}\\p{P}\\p{Z}\\p{S}]*$/u
        },

        // Méthodes utilitaires
        validateInput(text) {
            if (!text || text.trim().length === 0) {
                return { valid: false, error: 'empty' };
            }
            if (text.length < this.VALIDATION.minLength) {
                return { valid: false, error: 'tooShort' };
            }
            if (text.length > this.VALIDATION.maxLength) {
                return { valid: false, error: 'tooLong' };
            }
            if (!this.VALIDATION.allowedChars.test(text)) {
                return { valid: false, error: 'validation' };
            }
            return { valid: true };
        }
    };

    // Empêcher la modification de la configuration
    Object.freeze(config);
    Object.freeze(config.GENERATION_CONFIG);
    Object.freeze(config.UI_MESSAGES);
    Object.freeze(config.SUGGESTIONS);
    
    return config;
})();

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}