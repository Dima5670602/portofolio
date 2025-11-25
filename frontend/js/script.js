// Initialiser AOS (Animations On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Variables globales
let projectsData = [];

// Menu mobile
const mobileToggle = document.querySelector('.mobile-toggle');
const header = document.getElementById('header');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        header.classList.toggle('mobile-open');
    });
}

// Fermer le menu en cliquant sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        header.classList.remove('mobile-open');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// Charger les statistiques
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat" data-aos="zoom-in" data-aos-delay="100">
                    <div class="stat-number">${stats.projects}+</div>
                    <div class="stat-text">Projets Réalisés</div>
                </div>
                <div class="stat" data-aos="zoom-in" data-aos-delay="200">
                    <div class="stat-number">${stats.experience}+</div>
                    <div class="stat-text">Années d'Expérience</div>
                </div>
                <div class="stat" data-aos="zoom-in" data-aos-delay="300">
                    <div class="stat-number">${stats.technologies}+</div>
                    <div class="stat-text">Technologies Maîtrisées</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erreur chargement stats:', error);
        // Fallback si l'API échoue
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat" data-aos="zoom-in" data-aos-delay="100">
                    <div class="stat-number">12+</div>
                    <div class="stat-text">Projets Réalisés</div>
                </div>
                <div class="stat" data-aos="zoom-in" data-aos-delay="200">
                    <div class="stat-number">3+</div>
                    <div class="stat-text">Années d'Expérience</div>
                </div>
                <div class="stat" data-aos="zoom-in" data-aos-delay="300">
                    <div class="stat-number">15+</div>
                    <div class="stat-text">Technologies Maîtrisées</div>
                </div>
            `;
        }
    }
}

// Charger les projets depuis l'API
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        projectsData = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer) {
            projectsContainer.innerHTML = projectsData.map(project => `
                <div class="project-card" data-aos="fade-up" data-aos-delay="${project.id * 100}" onclick="openProjectModal(${project.id})">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" class="project-img" onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=${encodeURIComponent(project.title)}'">
                        <div class="project-overlay">
                            <div class="btn">Voir les détails</div>
                        </div>
                    </div>
                    <div class="project-content">
                        <span class="project-status status-${getStatusClass(project.status)}">${project.status}</span>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tech">
                            ${project.technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            ${project.technologies.length > 4 ? `<span class="tech-tag">+${project.technologies.length - 4}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur chargement projets:', error);
        // Fallback avec données statiques
        projectsData = [
            {
                id: 1,
                title: "Plateforme de gestion d'évènements communautaires",
                description: "Conception et développement d'une plateforme web pour la gestion d'évènements communautaires avec système de réservation.",
                technologies: ["Django", "React Native", "PostgreSQL"],
                status: "Terminé",
                category: "Full Stack",
                image: "https://via.placeholder.com/400x250/667eea/ffffff?text=Plateforme+Events",
                githubUrl: "https://github.com/Dima5670602/Sie_web.git",
                demoUrl: "#"
            },
            // ... autres projets avec images par défaut
        ];
        
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer) {
            projectsContainer.innerHTML = projectsData.map(project => `
                <div class="project-card" data-aos="fade-up" data-aos-delay="${project.id * 100}" onclick="openProjectModal(${project.id})">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" class="project-img">
                        <div class="project-overlay">
                            <div class="btn">Voir les détails</div>
                        </div>
                    </div>
                    <div class="project-content">
                        <span class="project-status status-${getStatusClass(project.status)}">${project.status}</span>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tech">
                            ${project.technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            ${project.technologies.length > 4 ? `<span class="tech-tag">+${project.technologies.length - 4}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Helper function pour les classes de statut
function getStatusClass(status) {
    const statusMap = {
        'Terminé': 'completed',
        'En développement': 'development', 
        'En finalisation': 'finalization',
        'En phase de test': 'testing'
    };
    return statusMap[status] || 'development';
}

// Fonction pour ouvrir le modal des projets
function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="project-modal-header">
            <img src="${project.image}" alt="${project.title}" class="project-modal-image" onerror="this.src='https://via.placeholder.com/800x400/667eea/ffffff?text=${encodeURIComponent(project.title)}'">
        </div>
        <div class="project-modal-content">
            <h2>${project.title}</h2>
            <div class="project-meta">
                <span class="project-status status-${getStatusClass(project.status)}">
                    ${project.status}
                </span>
                <span class="project-category">${project.category}</span>
            </div>
            
            <div class="project-details">
                <p>${project.description}</p>
                
                <div class="project-tech-modal">
                    <h4>Technologies utilisées :</h4>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-links-modal">
                    ${project.githubUrl && project.githubUrl !== '#' ? `
                        <a href="${project.githubUrl}" target="_blank" class="btn btn-outline">
                            <i class="fab fa-github"></i>
                            Code source
                        </a>
                    ` : ''}
                    
                    ${project.demoUrl && project.demoUrl !== '#' ? `
                        <a href="${project.demoUrl}" target="_blank" class="btn">
                            <i class="fas fa-external-link-alt"></i>
                            Voir la démo
                        </a>
                    ` : ''}
                    
                    <button class="btn btn-outline" onclick="closeProjectModal()">
                        <i class="fas fa-times"></i>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fermer le modal
function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Gestion des événements du modal
document.addEventListener('DOMContentLoaded', () => {
    const closeModal = document.querySelector('.close-modal');
    const modal = document.getElementById('projectModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeProjectModal);
    }
    
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
        
        // Fermer avec la touche Échap
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeProjectModal();
            }
        });
    }
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const loadingSpinner = document.getElementById('loadingSpinner');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Afficher le loading
        submitText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification(result.message, 'success');
                contactForm.reset();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
            console.error('Erreur formulaire:', error);
        } finally {
            submitText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    // Créer une notification toast
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadProjects();
    
    // Ajouter les styles pour les notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .project-modal-header {
            width: 100%;
            height: 300px;
            overflow: hidden;
            border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        }
        
        .project-modal-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .project-modal-content {
            padding: 30px;
        }
    `;
    document.head.appendChild(style);
});

// Gestion des erreurs d'images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0.7';
            this.style.filter = 'grayscale(100%)';
        });
    });
});