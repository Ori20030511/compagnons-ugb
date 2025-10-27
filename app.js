// Classe principale de l'application
class Compagnons {
    constructor() {
        // Éléments DOM
        this.messagesContainer = document.getElementById('messagesContainer');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearButton = document.getElementById('clearButton');
        this.exportButton = document.getElementById('exportButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.suggestionButtons = document.querySelectorAll('.suggestion-btn');

        // État de l'application
        this.conversation = [];
        this.isProcessing = false;

        // Initialisation
        this.init();
    }

    // Initialisation de l'application
    init() {
        // Vérification de la clé API
        if (!this.verifyApiKey()) {
            alert(CONFIG.UI_MESSAGES.noApiKey);
            return;
        }

        // Chargement de l'historique
        this.loadConversation();

        // Événements
        this.attachEventListeners();

        // Message de bienvenue
        if (this.conversation.length === 0) {
            this.addMessage('assistant', CONFIG.UI_MESSAGES.welcome);
        }
    }

    // Attache les écouteurs d'événements
    attachEventListeners() {
        // Envoi du message
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.handleSend();
            }
        });

        // Bouton d'effacement
        this.clearButton.addEventListener('click', () => this.clearConversation());

        // Bouton d'export
        this.exportButton.addEventListener('click', () => this.exportConversation());

        // Suggestions
        this.suggestionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.userInput.value = btn.textContent;
                this.handleSend();
            });
        });
    }

    // Gestion de l'envoi de message
    async handleSend() {
        const message = this.userInput.value.trim();
        if (!message || this.isProcessing) return;

        // Ajout du message utilisateur
        this.addMessage('user', message);
        this.userInput.value = '';
        this.isProcessing = true;

        // Affichage de l'indicateur de frappe
        this.typingIndicator.classList.remove('d-none');

        try {
            // Appel à l'API Gemini
            const response = await this.callGeminiApi(message);
            // Ajout de la réponse
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('Erreur:', error);
            const errorMessage = error.response ? 
                await error.response.json().then(data => data.error.message) : 
                error.message;
            this.addMessage('assistant', CONFIG.UI_MESSAGES.error + errorMessage);
        } finally {
            this.isProcessing = false;
            this.typingIndicator.classList.add('d-none');
        }
    }

    // Appel à l'API Gemini
    async callGeminiApi(message) {
        try {
            // Attendre que le SDK soit chargé (avec timeout pour éviter blocage infini)
            if (!window.GoogleGenerativeAI) {
                const waitForSDK = new Promise((resolve, reject) => {
                    const start = Date.now();
                    const checkSDK = setInterval(() => {
                        if (window.GoogleGenerativeAI) {
                            clearInterval(checkSDK);
                            resolve();
                        } else if (Date.now() - start > 5000) { // 5s timeout
                            clearInterval(checkSDK);
                            reject(new Error('Le SDK Google Generative AI ne s\'est pas chargé. Vérifiez l\'inclusion du script dans index.html.'));
                        }
                    }, 100);
                });

                await waitForSDK;
            }

            // Initialisation du client Gemini
            if (typeof window.GoogleGenerativeAI !== 'function' && typeof window.GoogleGenerativeAI !== 'object') {
                throw new Error('Le SDK Google AI n\'est pas correctement chargé. Veuillez rafraîchir la page.');
            }

            if (!CONFIG.GEMINI_API_KEY) {
                throw new Error('La clé API Gemini n\'est pas configurée.');
            }

            const genAI = new window.GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
            console.log('Initialisation de l\'API Gemini réussie');

            // Obtention du modèle
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            
            // Création du chat
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: CONFIG.SYSTEM_PROMPT,
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.8,
                    maxOutputTokens: 2048,
                }
            });

            // Envoi du message et attente de la réponse
            console.log('Envoi du message:', message);
            const result = await chat.sendMessage(message);
            const response = await result.response;
            
            console.log('Réponse reçue:', response);
            return response.text();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    // Ajout d'un message dans la conversation
    addMessage(role, content) {
        const message = { role, content, timestamp: new Date().toISOString() };
        this.conversation.push(message);
        
        // Création de l'élément HTML
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `message-${role}`);
        messageElement.innerHTML = this.formatMessage(content);
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        this.saveConversation();
    }

    // Formatage du message (support Markdown basique)
    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/^- (.*)$/gm, '• $1');
    }

    // Sauvegarde de la conversation
    saveConversation() {
        localStorage.setItem('conversation', JSON.stringify(this.conversation));
    }

    // Chargement de la conversation
    loadConversation() {
        try {
            const saved = localStorage.getItem('conversation');
            if (saved) {
                this.conversation = JSON.parse(saved);
                // Nettoyer le conteneur avant de recharger les messages
                this.messagesContainer.innerHTML = '';
                this.conversation.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message', `message-${msg.role}`);
                    messageElement.innerHTML = this.formatMessage(msg.content);
                    this.messagesContainer.appendChild(messageElement);
                });
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la conversation:', error);
            // En cas d'erreur, réinitialiser la conversation
            this.conversation = [];
            localStorage.removeItem('conversation');
            this.addMessage('assistant', CONFIG.UI_MESSAGES.welcome);
        }
    }

    // Effacement de la conversation
    clearConversation() {
        if (confirm(CONFIG.UI_MESSAGES.clearConfirm)) {
            this.conversation = [];
            this.messagesContainer.innerHTML = '';
            localStorage.removeItem('conversation');
            this.addMessage('assistant', CONFIG.UI_MESSAGES.welcome);
        }
    }

    // Export de la conversation
    exportConversation() {
        const text = this.conversation
            .map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role}: ${msg.content}`)
            .join('\n\n');
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversation-compagnons.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Scroll vers le bas de la conversation
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // Vérification de la clé API
    verifyApiKey() {
        return CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY !== 'VOTRE_CLE_API_ICI';
    }
}

// Initialisation de l'application au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.compagnons = new Compagnons();
});