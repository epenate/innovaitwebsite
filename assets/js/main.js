/**
 * InnovaIT Servicios y Soluciones - Main JavaScript
 * Manejo de interacciones, cotizador en vivo, validaciones y navbar
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '50368315695';

  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.site-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 2. Interactive Software Estimator / Calculator (if present on page)
  const calcForm = document.getElementById('projectEstimatorForm');
  if (calcForm) {
    calcForm.addEventListener('change', calculateEstimate);
    const sendEstimateBtn = document.getElementById('sendEstimateWhatsAppBtn');

    function calculateEstimate() {
      let baseTimeWeeks = 0;
      let complexityMultiplier = 1;
      let selectedFeatures = [];

      // Project Type
      const projectTypeEl = document.querySelector('input[name="projectType"]:checked');
      if (projectTypeEl) {
        if (projectTypeEl.value === 'web_landing') {
          baseTimeWeeks += 2;
        } else if (projectTypeEl.value === 'web_system') {
          baseTimeWeeks += 6;
        } else if (projectTypeEl.value === 'mobile_app') {
          baseTimeWeeks += 8;
        } else if (projectTypeEl.value === 'enterprise_erp') {
          baseTimeWeeks += 12;
        }
      }

      // Add-on Features
      document.querySelectorAll('input[name="projectFeature"]:checked').forEach(cb => {
        baseTimeWeeks += parseFloat(cb.dataset.weeks || 1);
        selectedFeatures.push(cb.value);
      });

      // Target timeline delivery
      const timelineDelivery = document.getElementById('calcTimelineDelivery');
      if (timelineDelivery) {
        const minWeeks = Math.max(2, Math.round(baseTimeWeeks * 0.85));
        const maxWeeks = Math.max(3, Math.round(baseTimeWeeks * 1.25));
        timelineDelivery.textContent = `${minWeeks} a ${maxWeeks} semanas aprox.`;
      }

      // Update WhatsApp link
      if (sendEstimateBtn) {
        const typeName = projectTypeEl ? projectTypeEl.parentElement.textContent.trim() : 'Software';
        const featuresText = selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'Estándar';
        const msg = `Hola InnovaIT, utilicé el cotizador en su sitio web para un proyecto de: *${typeName}*. Módulos de interés: ${featuresText}. Me gustaría recibir una propuesta formal.`;
        sendEstimateBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
      }
    }

    calculateEstimate();
  }

  // 3. Contact Form Handler with WhatsApp & Mailto fallback
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName')?.value.trim() || 'Cliente';
      const company = document.getElementById('contactCompany')?.value.trim() || 'Particular';
      const email = document.getElementById('contactEmail')?.value.trim() || '';
      const phone = document.getElementById('contactPhone')?.value.trim() || '';
      const service = document.getElementById('contactService')?.value || 'Consulta General';
      const message = document.getElementById('contactMessage')?.value.trim() || '';

      const alertBox = document.getElementById('contactSuccessAlert');

      // Construct WhatsApp message
      const waMsg = `*Nuevo Contacto desde Web InnovaIT*\n` +
        `👤 *Nombre:* ${name}\n` +
        `🏢 *Empresa:* ${company}\n` +
        `📧 *Correo:* ${email}\n` +
        `📞 *Teléfono:* ${phone}\n` +
        `💼 *Interés:* ${service}\n` +
        `📝 *Mensaje:* ${message}`;

      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waMsg)}`;

      if (alertBox) {
        alertBox.classList.remove('d-none');
        alertBox.innerHTML = `
          <div class="alert alert-success d-flex align-items-center justify-content-between p-3" role="alert">
            <div>
              <strong>¡Gracias ${name}!</strong> Tu mensaje ha sido estructurado con éxito.
              <p class="mb-0 text-muted small mt-1">Conéctate directamente ahora mismo a nuestro WhatsApp para atención inmediata:</p>
            </div>
            <a href="${waUrl}" target="_blank" class="btn btn-success btn-sm ms-3 d-inline-flex align-items-center gap-1">
              <i class="bi bi-whatsapp"></i> Continuar en WhatsApp
            </a>
          </div>
        `;
      }

      // Auto open WhatsApp in new tab
      window.open(waUrl, '_blank');
      contactForm.reset();
    });
  }

  // 4. Modal Course Syllabus Request Handler
  const syllabusForm = document.getElementById('syllabusRequestForm');
  if (syllabusForm) {
    syllabusForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const courseName = document.getElementById('syllabusCourseName')?.value || 'Formación';
      const company = document.getElementById('syllabusCompany')?.value || 'Empresa';
      const attendees = document.getElementById('syllabusAttendees')?.value || '1';

      const waText = `Hola InnovaIT, deseo recibir el temario y propuesta económica para la capacitación en: *${courseName}* para un grupo de aprox. ${attendees} personas de la empresa *${company}*.`;
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;

      window.open(waUrl, '_blank');
      
      const modalEl = document.getElementById('syllabusModal');
      if (modalEl && window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
    });
  }
});
