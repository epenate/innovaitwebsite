/**
 * InnovaBot - Agente Virtual Inteligente de InnovaIT
 * Asistente interactivo para atención al cliente, calificación de proyectos
 * y canalización directa a WhatsApp (+503 68315695)
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '50368315695';
  const EMAIL_CONTACT = 'info@innovait.com.sv';

  // Create widget DOM elements if not already present
  let widgetContainer = document.querySelector('.agent-widget-container');
  if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.className = 'agent-widget-container';
    widgetContainer.innerHTML = `
      <!-- Launcher Button -->
      <button class="agent-trigger-btn" id="agentTriggerBtn" aria-label="Abrir asistente virtual de InnovaIT">
        <i class="bi bi-robot"></i>
        <span class="agent-badge-pulse" title="Agente en línea"></span>
      </button>

      <!-- Chat Window -->
      <div class="agent-chat-window" id="agentChatWindow" role="dialog" aria-labelledby="chatAgentTitle" aria-hidden="true">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-title">
            <div class="chat-avatar">
              <i class="bi bi-robot"></i>
            </div>
            <div>
              <h6 class="mb-0 fw-bold text-white" id="chatAgentTitle">InnovaBot</h6>
              <small class="text-info d-flex align-items-center gap-1">
                <span class="spinner-grow spinner-grow-sm text-success" style="width: 8px; height: 8px;" role="status"></span>
                Agente IA • En línea
              </small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-link text-white-50 text-decoration-none p-1" id="chatRestartBtn" title="Reiniciar conversación">
              <i class="bi bi-arrow-counterclockwise fs-5"></i>
            </button>
            <button class="btn btn-sm btn-link text-white text-decoration-none p-1" id="chatCloseBtn" title="Cerrar chat">
              <i class="bi bi-x-lg fs-5"></i>
            </button>
          </div>
        </div>

        <!-- Chat Body -->
        <div class="chat-messages-body" id="chatMessagesBody">
          <!-- Messages will be injected dynamically -->
        </div>

        <!-- Footer / Input -->
        <div class="chat-footer">
          <form id="chatUserForm" class="d-flex gap-2 mb-2">
            <input type="text" id="chatUserInput" class="form-control form-control-sm" placeholder="Escribe tu consulta..." autocomplete="off">
            <button type="submit" class="btn btn-sm btn-primary px-3" style="background-color: #00a8e8; border: none;">
              <i class="bi bi-send-fill"></i>
            </button>
          </form>
          <a id="directWhatsAppBtn" href="https://wa.me/${WHATSAPP_PHONE}?text=Hola%20InnovaIT%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios." target="_blank" rel="noopener noreferrer" class="chat-whatsapp-btn">
            <i class="bi bi-whatsapp"></i> Hablar con asesor por WhatsApp
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(widgetContainer);
  }

  const triggerBtn = document.getElementById('agentTriggerBtn');
  const chatWindow = document.getElementById('agentChatWindow');
  const closeBtn = document.getElementById('chatCloseBtn');
  const restartBtn = document.getElementById('chatRestartBtn');
  const messagesBody = document.getElementById('chatMessagesBody');
  const userForm = document.getElementById('chatUserForm');
  const userInput = document.getElementById('chatUserInput');
  const directWhatsAppBtn = document.getElementById('directWhatsAppBtn');

  let isOpen = false;
  let hasInitialized = false;

  // Toggle chat window
  function toggleChat(open) {
    isOpen = typeof open === 'boolean' ? open : !isOpen;
    if (isOpen) {
      chatWindow.classList.add('active');
      chatWindow.setAttribute('aria-hidden', 'false');
      triggerBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
      if (!hasInitialized) {
        initGreeting();
        hasInitialized = true;
      }
      setTimeout(() => userInput.focus(), 300);
    } else {
      chatWindow.classList.remove('active');
      chatWindow.setAttribute('aria-hidden', 'true');
      triggerBtn.innerHTML = '<i class="bi bi-robot"></i><span class="agent-badge-pulse"></span>';
    }
  }

  triggerBtn.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => toggleChat(false));
  restartBtn.addEventListener('click', () => {
    messagesBody.innerHTML = '';
    initGreeting();
  });

  // Expose toggle globally for CTA buttons
  window.openInnovaBot = function(topic) {
    toggleChat(true);
    if (topic) {
      handleUserAction(topic);
    }
  };

  // Append message bubble
  function appendMessage(text, sender = 'agent', options = []) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble-${sender}`;
    bubble.innerHTML = text;

    messagesBody.appendChild(bubble);

    // If options provided, append them below
    if (options && options.length > 0) {
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'chat-options-group';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-option-pill';
        btn.innerHTML = opt.label;
        btn.addEventListener('click', () => {
          handleOptionClick(opt);
        });
        optionsContainer.appendChild(btn);
      });
      messagesBody.appendChild(optionsContainer);
    }

    // Scroll to bottom
    messagesBody.scrollTop = messagesBody.scrollHeight;
  }

  // Initial Bot Greeting
  function initGreeting() {
    appendMessage(
      `¡Hola! 👋 Te damos la bienvenida a <strong>InnovaIT Servicios y Soluciones</strong>.<br><br>
       Soy <strong>InnovaBot</strong>, tu asistente de tecnología. ¿En qué podemos apoyarte hoy?`,
      'agent',
      [
        { id: 'training', label: '🎓 Formaciones & Cursos' },
        { id: 'software', label: '💻 Desarrollo de Software' },
        { id: 'solutions', label: '🛡️ Soluciones TI & Ciberseguridad' },
        { id: 'agents', label: '🤖 Agentes de IA & Automatización' },
        { id: 'whatsapp', label: '💬 Hablar con un Asesor' }
      ]
    );
  }

  // Handle Option Click
  function handleOptionClick(opt) {
    // Show user choice
    appendMessage(opt.label, 'user');

    // Simulate agent typing
    setTimeout(() => {
      processAgentResponse(opt.id, opt.payload || opt.label);
    }, 450);
  }

  // Handle User Input Submission
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    appendMessage(query, 'user');
    userInput.value = '';

    setTimeout(() => {
      const qLower = query.toLowerCase();
      if (qLower.includes('curso') || qLower.includes('formacion') || qLower.includes('capacita') || qLower.includes('taller')) {
        processAgentResponse('training');
      } else if (qLower.includes('software') || qLower.includes('sistema') || qLower.includes('app') || qLower.includes('web') || qLower.includes('desarrollo')) {
        processAgentResponse('software');
      } else if (qLower.includes('seguridad') || qLower.includes('red') || qLower.includes('servidor') || qLower.includes('licencia') || qLower.includes('ti')) {
        processAgentResponse('solutions');
      } else if (qLower.includes('ia') || qLower.includes('inteligencia') || qLower.includes('agente') || qLower.includes('bot') || qLower.includes('rpa')) {
        processAgentResponse('agents');
      } else if (qLower.includes('contacto') || qLower.includes('telefono') || qLower.includes('correo') || qLower.includes('whatsapp') || qLower.includes('ubicacion')) {
        processAgentResponse('contact_info');
      } else {
        // Generic response with WhatsApp redirection
        const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hola InnovaIT, tengo una consulta: "${query}". ¿Podrían asesorarme?`)}`;
        appendMessage(
          `Comprendo tu consulta. Con gusto nuestro equipo de ingeniería y consultoría te dará atención personalizada e inmediata.<br><br>
           Puedes conectar directamente a nuestro WhatsApp oficial o consultar nuestras especialidades:`,
          'agent',
          [
            { id: 'custom_wa', label: `📲 Enviar consulta a WhatsApp`, url: waUrl },
            { id: 'training', label: '🎓 Ver Formaciones' },
            { id: 'software', label: '💻 Ver Desarrollo de Software' }
          ]
        );
      }
    }, 500);
  });

  // Decision Tree Logic
  function processAgentResponse(actionId, payload = '') {
    switch (actionId) {
      case 'training':
        appendMessage(
          `<strong>🎓 Formaciones Tecnológicas a la Medida</strong><br>
           Capacitamos a tus equipos técnicos y corporativos con metodologías prácticas. Contamos con áreas como:<br>
           • <strong>Desarrollo Web & Móvil</strong> (Fullstack, React, Python)<br>
           • <strong>Ciberseguridad Práctica</strong> y Protección de Datos<br>
           • <strong>Cloud & DevOps</strong> (AWS, Azure, Docker)<br>
           • <strong>IA & Automatización</strong> para Productividad<br><br>
           ¿Qué te gustaría hacer?`,
          'agent',
          [
            { id: 'training_syllabus', label: '📄 Solicitar Temario para Empresas' },
            { id: 'training_quote', label: '💰 Cotizar Capacitación Grupal' },
            { id: 'view_training_page', label: '🌐 Ver Catálogo Completo', action: 'goto_training' }
          ]
        );
        break;

      case 'training_syllabus': {
        const waText = encodeURIComponent('Hola InnovaIT, me gustaría solicitar los temarios y opciones de Formación Tecnológica para nuestra empresa.');
        appendMessage(
          `¡Perfecto! Te contactaremos con nuestra coordinación académica. Puedes escribirnos directo con un clic:`,
          'agent',
          [
            { id: 'wa_link', label: '📲 Solicitar Temario por WhatsApp', url: `https://wa.me/${WHATSAPP_PHONE}?text=${waText}` },
            { id: 'restart', label: '🔄 Consultar otro tema' }
          ]
        );
        break;
      }

      case 'training_quote': {
        const waText = encodeURIComponent('Hola InnovaIT, deseo cotizar un programa de capacitación para nuestro equipo de trabajo.');
        appendMessage(
          `Excelente decisión de impulsar el talento de tu empresa. Puedes coordinar la cotización inmediata aquí:`,
          'agent',
          [
            { id: 'wa_link', label: '💼 Cotizar por WhatsApp (+503 68315695)', url: `https://wa.me/${WHATSAPP_PHONE}?text=${waText}` }
          ]
        );
        break;
      }

      case 'view_training_page':
        window.location.href = 'formaciones.html';
        break;

      case 'software':
        appendMessage(
          `<strong>💻 Desarrollo de Software a la Medida</strong><br>
           Construimos aplicaciones de alto rendimiento adaptadas 100% a las operaciones de tu negocio.<br><br>
           ¿Qué tipo de solución requiere tu proyecto?`,
          'agent',
          [
            { id: 'soft_web', label: '🌐 Sistema Web / Plataforma SaaS' },
            { id: 'soft_mobile', label: '📱 Aplicación Móvil (iOS / Android)' },
            { id: 'soft_enterprise', label: '🏢 Sistema Empresarial (ERP / CRM)' },
            { id: 'soft_api', label: '⚡ Integración de APIs & Cloud' }
          ]
        );
        break;

      case 'soft_web':
      case 'soft_mobile':
      case 'soft_enterprise':
      case 'soft_api': {
        const typeLabels = {
          soft_web: 'Sistema Web / Plataforma SaaS',
          soft_mobile: 'Aplicación Móvil',
          soft_enterprise: 'Sistema Empresarial ERP/CRM',
          soft_api: 'Integración de APIs y Cloud'
        };
        const selected = typeLabels[actionId] || 'Software a la Medida';
        const waText = encodeURIComponent(`Hola InnovaIT, tengo interés en desarrollar un proyecto de: "${selected}". Me gustaría recibir asesoría y estimación.`);
        appendMessage(
          `¡Excelente elección! Nos especializamos en <strong>${selected}</strong> con arquitectura escalable y segura.<br><br>
           Haz clic a continuación para enviarle los detalles a nuestro equipo de desarrollo:`,
          'agent',
          [
            { id: 'wa_link', label: `🚀 Cotizar ${selected} por WhatsApp`, url: `https://wa.me/${WHATSAPP_PHONE}?text=${waText}` },
            { id: 'view_soft_page', label: '📋 Ver detalles y metodologías', action: 'goto_software' }
          ]
        );
        break;
      }

      case 'view_soft_page':
        window.location.href = 'desarrollo-software.html';
        break;

      case 'solutions':
        appendMessage(
          `<strong>🛡️ Soluciones TI Integrales</strong><br>
           Ofrecemos respaldo robusto para la continuidad operativa de tu empresa:<br>
           • <strong>Ciberseguridad:</strong> Firewalls, WAF, protección perimetral y auditorías.<br>
           • <strong>Infraestructura & Cloud:</strong> Servidores, redes, Microsoft 365, AWS.<br>
           • <strong>Outsourcing IT:</strong> Talento técnico calificado para tus operaciones.<br><br>
           ¿Sobre qué área deseas asesoría?`,
          'agent',
          [
            { id: 'sol_cyber', label: '🔒 Ciberseguridad & Protección' },
            { id: 'sol_cloud', label: '☁️ Cloud & Licenciamiento' },
            { id: 'sol_outsourcing', label: '👥 Outsourcing de Personal IT' },
            { id: 'view_sol_page', label: '📄 Ver todas las Soluciones TI', action: 'goto_solutions' }
          ]
        );
        break;

      case 'sol_cyber':
      case 'sol_cloud':
      case 'sol_outsourcing': {
        const solNames = {
          sol_cyber: 'Ciberseguridad y Protección de Datos',
          sol_cloud: 'Infraestructura Cloud y Licenciamiento',
          sol_outsourcing: 'Outsourcing de Talento IT'
        };
        const item = solNames[actionId];
        const waText = encodeURIComponent(`Hola InnovaIT, me interesa recibir asesoría técnica en: "${item}".`);
        appendMessage(
          `Contamos con especialistas certificados para asesorarte en <strong>${item}</strong>. Conéctate con un ingeniero:`,
          'agent',
          [
            { id: 'wa_link', label: '💬 Contactar Especialista TI', url: `https://wa.me/${WHATSAPP_PHONE}?text=${waText}` }
          ]
        );
        break;
      }

      case 'view_sol_page':
        window.location.href = 'soluciones-ti.html';
        break;

      case 'agents': {
        const waText = encodeURIComponent('Hola InnovaIT, quiero implementar Agentes de Inteligencia Artificial y Automatización de Procesos en mi empresa.');
        appendMessage(
          `<strong>🤖 Agentes de IA & Automatización</strong><br>
           Implementamos agentes inteligentes (como yo) y automatización robótica de procesos (RPA) para:<br>
           • Reducir tareas manuales repetitivas en un 70%.<br>
           • Atención inteligente a clientes 24/7 con integración CRM.<br>
           • Agentes autónomos para análisis de datos y reportes corporativos.<br><br>
           ¿Deseas una demostración para tu empresa?`,
          'agent',
          [
            { id: 'wa_link', label: '⚡ Agendar Demo de Agentes IA', url: `https://wa.me/${WHATSAPP_PHONE}?text=${waText}` },
            { id: 'restart', label: '🔄 Menú Principal' }
          ]
        );
        break;
      }

      case 'contact_info': {
        appendMessage(
          `<strong>📍 Contacto InnovaIT Servicios y Soluciones</strong><br>
           • <strong>WhatsApp Directo:</strong> +503 68315695<br>
           • <strong>Correo Electrónico:</strong> info@innovait.com.sv<br>
           • <strong>Cobertura:</strong> El Salvador y Centroamérica<br>
           • <strong>Horario de Atención:</strong> Lun - Vie: 8:00 AM - 6:00 PM`,
          'agent',
          [
            { id: 'wa_link', label: '📲 Abrir WhatsApp Oficial', url: `https://wa.me/${WHATSAPP_PHONE}` },
            { id: 'email_link', label: '✉️ Enviar Correo', url: `mailto:${EMAIL_CONTACT}` },
            { id: 'goto_contact', label: '📝 Ir al Formulario de Contacto', action: 'goto_contact' }
          ]
        );
        break;
      }

      case 'whatsapp': {
        const waText = encodeURIComponent('Hola InnovaIT, me gustaría comunicarme con un asesor.');
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${waText}`, '_blank');
        break;
      }

      case 'custom_wa':
      case 'wa_link':
        if (payload && payload.url) {
          window.open(payload.url, '_blank');
        }
        break;

      case 'email_link':
        window.location.href = `mailto:${EMAIL_CONTACT}`;
        break;

      case 'goto_contact':
        window.location.href = 'contacto.html';
        break;

      case 'restart':
        initGreeting();
        break;

      default:
        initGreeting();
    }

    // Handle button action redirect if present
    if (payload && payload.action) {
      if (payload.action === 'goto_training') window.location.href = 'formaciones.html';
      if (payload.action === 'goto_software') window.location.href = 'desarrollo-software.html';
      if (payload.action === 'goto_solutions') window.location.href = 'soluciones-ti.html';
      if (payload.action === 'goto_contact') window.location.href = 'contacto.html';
    }
  }
});
