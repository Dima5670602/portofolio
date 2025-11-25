const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Fonction pour sauvegarder les messages dans un fichier
async function saveMessageToFile(messageData) {
    try {
        const messagesDir = path.join(__dirname, 'messages');
        
        // Créer le dossier s'il n'existe pas
        await fs.mkdir(messagesDir, { recursive: true });
        
        // Créer un nom de fichier sécurisé
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeName = messageData.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        const filename = `message_${timestamp}_${safeName}.json`;
        const filepath = path.join(messagesDir, filename);
        
        // Sauvegarder le message avec des métadonnées supplémentaires
        const messageWithMetadata = {
            ...messageData,
            savedAt: new Date().toISOString(),
            id: Date.now()
        };
        
        await fs.writeFile(filepath, JSON.stringify(messageWithMetadata, null, 2));
        console.log(' Message sauvegardé:', filename);
        return true;
    } catch (error) {
        console.error(' Erreur lors de la sauvegarde du message:', error);
        return false;
    }
}

// Fonction pour logger les messages dans la console
function logMessageToConsole(messageData, req) {
    console.log('\n' + '='.repeat(50));
    console.log(' NOUVEAU MESSAGE REÇU DEPUIS LE PORTFOLIO');
    console.log('='.repeat(50));
    console.log(`👤 Nom: ${messageData.name}`);
    console.log(`📧 Email: ${messageData.email}`);
    console.log(`📋 Sujet: ${messageData.subject}`);
    console.log(`💬 Message: ${messageData.message}`);
    console.log(`⏰ Date: ${new Date().toLocaleString('fr-FR')}`);
    console.log(`🌐 IP: ${req.ip || req.connection.remoteAddress}`);
    console.log(`🔗 User Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
    console.log('='.repeat(50) + '\n');
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// API Route pour les projets avec images
app.get('/api/projects', (req, res) => {
    const projects = [
        {
            id: 1,
            title: "Plateforme de gestion d'évènements communautaires",
            description: "Conception et développement d'une plateforme web pour la gestion d'évènements communautaires avec système de réservation.",
            technologies: ["Django", "React Native", "PostgreSQL"],
            status: "Terminé",
            category: "Full Stack",
            image: "/images/projects/event-platform.jpg",
            githubUrl: "https://github.com/Dima5670602/Sie_web.git",
            demoUrl: "#"
        },
        {
            id: 2,
            title: "Application de e-commerce",
            description: "Application mobile de e-commerce avec panier, paiement et suivi de commandes.",
            technologies: ["Flutter", "Firebase"],
            status: "Terminé",
            category: "Mobile",
            image: "/images/projects/ecommerce-app.jpg",
            githubUrl: "#",
            demoUrl: "#"
        },
        {
            id: 3,
            title: "Micro-Épargne Communautaire Intelligente",
            description: "Plateforme web de gestion de tontines et cauri d'or avec système de suivi et rapports.",
            technologies: ["Node.js", "Express.js", "HTML", "CSS", "JavaScript", "PostgreSQL"],
            status: "En phase de test",
            category: "Full Stack",
            image: "/images/projects/micro-epargne.jpg",
            githubUrl: "https://github.com/Dima5670602/Micro-Epargne-Communautaire-Intelligente.git",
            demoUrl: "#"
        },
        {
            id: 4,
            title: "Application de gestion de supporters",
            description: "Application mobile pour gérer les supporters d'un club national.",
            technologies: ["Laravel", "Flutter", "PostgreSQL"],
            status: "En phase de test",
            category: "Mobile",
            image: "/images/projects/supporters-app.jpg",
            githubUrl: "https://github.com/AwesomeDevStudio/Efo-Mobile-Client-UI.git",
            demoUrl: "#"
        },
        {
            id: 5,
            title: "Plateforme de gestion de cours",
            description: "Plateforme web pour faciliter le suivi des cours et le partage de documents.",
            technologies: ["Django", "React JS"],
            status: "En finalisation",
            category: "Web",
            image: "/images/projects/course-platform.jpg",
            githubUrl: "#",
            demoUrl: "#"
        },
        {
            id: 6,
            title: "Application de dons",
            description: "Application mobile pour faciliter les dons (argent, nature, sang).",
            technologies: ["React JS", "Django", "PostgreSQL"],
            status: "En développement",
            category: "Full Stack",
            image: "/images/projects/donation-app.jpg",
            githubUrl: "#",
            demoUrl: "#"
        },
        {
            id: 7,
            title: "Site web vitrine Digispace",
            description: "Site web pour présenter les produits et services de Digispace",
            technologies: ["Node.js", "HTML", "CSS", "JavaScript"],
            status: "Terminé",
            category: "Web",
            image: "/images/projects/digispace.jpg",
            githubUrl: "https://github.com/Dima5670602/Sie_web.git",
            demoUrl: "#"
        },
    ];
    res.json(projects);
});

// API Route pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation basique
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tous les champs sont obligatoires' 
            });
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Adresse email invalide' 
            });
        }

        // Préparer les données du message
        const messageData = {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
            ip: req.ip || req.connection.remoteAddress
        };

        // 1. Logger le message dans la console
        logMessageToConsole(messageData, req);

        // 2. Sauvegarder le message dans un fichier
        const savedToFile = await saveMessageToFile(messageData);

        // 3. Envoyer par email si configuré
        let emailSent = false;
        let emailError = null;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransporter({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    replyTo: email,
                    subject: `📧 Portfolio: ${subject}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f7fafc; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #667eea; text-align: center;">Nouveau message depuis votre portfolio</h2>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <div style="margin-bottom: 15px;">
                                    <strong style="color: #667eea;">👤 Nom:</strong>
                                    <span style="margin-left: 10px;">${name}</span>
                                </div>
                                
                                <div style="margin-bottom: 15px;">
                                    <strong style="color: #667eea;">📧 Email:</strong>
                                    <span style="margin-left: 10px;">
                                        <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">
                                            ${email}
                                        </a>
                                    </span>
                                </div>
                                
                                <div style="margin-bottom: 15px;">
                                    <strong style="color: #667eea;">📋 Sujet:</strong>
                                    <span style="margin-left: 10px;">${subject}</span>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <strong style="color: #667eea;">💬 Message:</strong>
                                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #667eea;">
                                        ${message.replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 5px; text-align: center;">
                                <p style="color: #2d3748; margin: 0; font-size: 14px;">
                                    <strong>📊 Statistiques de réception:</strong><br>
                                    ✅ Message loggé dans la console<br>
                                    ${savedToFile ? '✅ Message sauvegardé dans un fichier' : ' Erreur sauvegarde fichier'}<br>
                                    ⏰ Reçu le: ${new Date().toLocaleString('fr-FR')}
                                </p>
                            </div>
                            
                            <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 20px;">
                                Ce message a été envoyé depuis le formulaire de contact de votre portfolio
                            </p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                emailSent = true;
                console.log(' Email envoyé avec succès à:', process.env.EMAIL_USER);
                
            } catch (error) {
                emailError = error.message;
                console.error(' Erreur lors de l\'envoi de l\'email:', error);
            }
        } else {
            console.log(' Configuration email manquante - Message seulement loggé et sauvegardé');
        }

        // Réponse détaillée
        const response = {
            success: true,
            message: 'Message envoyé avec succès! Je vous répondrai rapidement.',
            details: {
                logged: true,
                savedToFile: savedToFile,
                emailSent: emailSent,
                emailError: emailError
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error(' Erreur critique lors du traitement du message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur lors du traitement de votre message' 
        });
    }
});

// Route pour les statistiques
app.get('/api/stats', (req, res) => {
    const stats = {
        projects: 12,
        experience: 3,
        technologies: 15,
        clients: 5
    };
    res.json(stats);
});

// Route pour voir les messages sauvegardés (protégée en développement)
app.get('/api/messages', async (req, res) => {
    try {
        const messagesDir = path.join(__dirname, 'messages');
        
        // Vérifier si le dossier existe
        try {
            await fs.access(messagesDir);
        } catch {
            return res.json({ messages: [], count: 0 });
        }

        const files = await fs.readdir(messagesDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        const messages = [];
        for (const file of jsonFiles) {
            try {
                const content = await fs.readFile(path.join(messagesDir, file), 'utf8');
                const message = JSON.parse(content);
                messages.push({
                    ...message,
                    filename: file
                });
            } catch (error) {
                console.error(`Erreur lecture fichier ${file}:`, error);
            }
        }

        // Trier par date (plus récent en premier)
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({
            success: true,
            count: messages.length,
            messages: messages
        });

    } catch (error) {
        console.error('Erreur récupération messages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des messages' 
        });
    }
});

// Gestion des routes 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Route non trouvée' 
    });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
    console.error(' Erreur serveur:', error);
    res.status(500).json({ 
        success: false,
        message: 'Erreur interne du serveur' 
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Port: http://localhost:${PORT}`);
});