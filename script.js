// 🎮 JuegosRapidos - Script Principal
// Funcionalidades interactivas del portfolio

// ==================== 1. ANIMACIÓN AL CARGAR ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 JuegosRapidos Portafolio Cargado');
  
  // Animar proyectos al cargar
  const projects = document.querySelectorAll('.project');
  projects.forEach((project, index) => {
    project.style.opacity = '0';
    project.style.transform = 'translateY(20px)';
    project.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    setTimeout(() => {
      project.style.opacity = '1';
      project.style.transform = 'translateY(0)';
    }, 50);
  });
  
  // Cargar contador de visitas
  loadVisitCounter();
  
  // Agregar efectos hover a los proyectos
  addProjectHoverEffects();
});

// ==================== 2. CONTADOR DE VISITAS ====================
function loadVisitCounter() {
  let visits = localStorage.getItem('juegosRapidosVisits') || 0;
  visits = parseInt(visits) + 1;
  localStorage.setItem('juegosRapidosVisits', visits);
  
  console.log(`📊 Visitantes: ${visits}`);
  
  // Opcional: mostrar contador en consola
  // console.log(`👤 Esta es tu visita número: ${visits}`);
}

// ==================== 3. EFECTOS HOVER EN PROYECTOS ====================
function addProjectHoverEffects() {
  const projects = document.querySelectorAll('.project');
  
  projects.forEach(project => {
    project.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
    });
    
    project.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 0 10px #ddd';
    });
  });
}

// ==================== 4. SCROLL SUAVE ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ==================== 5. ANIMACIÓN DE ENLACES ====================
function addLinkClickEffect() {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      // Si es un enlace externo
      if (this.target === '_blank') {
        console.log(`🔗 Abriendo: ${this.href}`);
      }
    });
  });
}

// ==================== 6. SCROLL REVEAL ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
  const projectsSection = document.querySelector('.projects');
  if (projectsSection) {
    observer.observe(projectsSection);
  }
});

// ==================== 7. EASTER EGG ====================
document.addEventListener('keydown', function(e) {
  // Presiona "G" para ver un mensaje especial
  if (e.key === 'g' || e.key === 'G') {
    console.log('%c¡Hola Desarrollador! 👋', 'font-size: 20px; color: #e67e22; font-weight: bold;');
    console.log('%c¡Gracias por visitar JuegosRapidos!', 'font-size: 16px; color: #f1c40f;');
    console.log('%c📧 Contacto: adrianorregorojas1998@gmail.com', 'font-size: 14px; color: #2ecc71;');
  }
});

// ==================== 8. INFORMACIÓN EN CONSOLA ====================
console.log('%c🎮 JuegosRapidos Portfolio', 'font-size: 24px; color: #e67e22; font-weight: bold;');
console.log('%cDesarrollador: Adrián Orrego Rojas', 'font-size: 14px; color: #f1c40f;');
console.log('%c💡 Tip: Presiona "G" para ver un mensaje especial', 'font-size: 12px; color: #3498db;');
