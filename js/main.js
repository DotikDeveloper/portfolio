// Mobile Menu Toggle
const burgerButton = document.getElementById('burgerButton');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
const mobileHireButton = document.getElementById('mobileHireButton');

burgerButton?.addEventListener('click', () => {
  burgerButton.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when clicking on links
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    burgerButton?.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Contact Form Modal
const hireButton = document.getElementById('hireButton');
const contactModal = document.getElementById('contactModal');
const closeModal = document.getElementById('closeModal');
const contactForm = document.getElementById('contactForm');
const showMessageCheckbox = document.getElementById('showMessage');
const messageGroup = document.getElementById('messageGroup');

// Записываем время открытия формы для проверки скорости заполнения
contactModal?.addEventListener('click', (e) => {
  if (e.target === contactModal && contactForm) {
    contactForm.dataset.startTime = Date.now().toString();
  }
});

// Open modal
const openModal = () => {
  contactModal?.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Записываем время открытия формы для проверки скорости заполнения
  if (contactForm) {
    contactForm.dataset.startTime = Date.now().toString();
  }
};

// Close modal
const closeModalHandler = () => {
  contactModal?.classList.remove('open');
  document.body.style.overflow = '';
  contactForm?.reset();
  clearErrors();
};

hireButton?.addEventListener('click', openModal);
mobileHireButton?.addEventListener('click', () => {
  // Close mobile menu first
  burgerButton?.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  // Then open modal
  setTimeout(openModal, 300);
});

closeModal?.addEventListener('click', closeModalHandler);

// Close modal on overlay click
contactModal?.addEventListener('click', (e) => {
  if (e.target === contactModal) {
    closeModalHandler();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal?.classList.contains('open')) {
    closeModalHandler();
  }
});

// Toggle message field
showMessageCheckbox?.addEventListener('change', (e) => {
  if (messageGroup) {
    messageGroup.style.display = e.target.checked ? 'block' : 'none';
    const messageInput = document.getElementById('message');
    if (messageInput) {
      messageInput.required = e.target.checked;
      if (!e.target.checked) {
        messageInput.value = '';
        clearError('messageError');
      }
    }
  }
});

// Phone input formatting
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length < phoneInput.value.replace(/\D/g, '').length) {
    e.target.value = value;
    return;
  }
  
  let formattedValue = '+7 (';
  
  if (value.length > 0) {
    const digits = value.startsWith('8') || value.startsWith('7') ? value.slice(1) : value;
    formattedValue += digits.slice(0, 3);
  }
  if (value.length > 3) {
    const digits = value.startsWith('8') || value.startsWith('7') ? value.slice(1) : value;
    formattedValue += ') ' + digits.slice(3, 6);
  }
  if (value.length > 6) {
    const digits = value.startsWith('8') || value.startsWith('7') ? value.slice(1) : value;
    formattedValue += '-' + digits.slice(6, 8);
  }
  if (value.length > 8) {
    const digits = value.startsWith('8') || value.startsWith('7') ? value.slice(1) : value;
    formattedValue += '-' + digits.slice(8, 10);
  }
  
  e.target.value = formattedValue;
});

// Name input validation (only letters and spaces)
const nameInput = document.getElementById('name');
nameInput?.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-Zа-яА-Я\s]/g, '');
});

// Form validation
const validateForm = () => {
  let isValid = true;
  const name = nameInput?.value.trim();
  const phone = phoneInput?.value.trim();
  const message = document.getElementById('message')?.value.trim();
  const showMessage = showMessageCheckbox?.checked;

  // Clear previous errors
  clearErrors();

  // Validate name
  if (!name) {
    setError('nameError', 'Имя обязательно');
    isValid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s]+$/.test(name)) {
    setError('nameError', 'Имя должно содержать только буквы');
    isValid = false;
  }

  // Validate phone
  if (!phone) {
    setError('phoneError', 'Телефон обязателен');
    isValid = false;
  } else if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) {
    setError('phoneError', 'Пожалуйста, введите корректный номер телефона');
    isValid = false;
  }

  // Validate message if shown
  if (showMessage && !message) {
    setError('messageError', 'Сообщение обязательно');
    isValid = false;
  }

  return isValid;
};

const setError = (id, message) => {
  const errorElement = document.getElementById(id);
  if (errorElement) {
    errorElement.textContent = message;
  }
};

const clearError = (id) => {
  const errorElement = document.getElementById(id);
  if (errorElement) {
    errorElement.textContent = '';
  }
};

const clearErrors = () => {
  clearError('nameError');
  clearError('phoneError');
  clearError('messageError');
};

// Form submission
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Honeypot check - защита от ботов
  const honeypotFields = contactForm.querySelectorAll('.honeypot');
  let botDetected = false;
  
  honeypotFields.forEach(field => {
    if (field.type === 'text' && field.value) {
      botDetected = true; // Текстовое поле заполнено (боты часто заполняют все поля)
    }
    if (field.type === 'checkbox' && field.checked) {
      botDetected = true; // Чекбокс отмечен (боты могут отмечать скрытые чекбоксы)
    }
  });
  
  if (botDetected) {
    console.log('Bot detected, form submission blocked');
    return; // Бот обнаружен, блокируем отправку
  }
  
  // Дополнительная проверка времени заполнения формы (слишком быстро = бот)
  const formStartTime = contactForm.dataset.startTime || Date.now();
  const fillTime = Date.now() - parseInt(formStartTime);
  if (fillTime < 2000) { // Меньше 2 секунд - подозрительно
    console.log('Form filled too quickly, possible bot');
    // Можно добавить капчу или просто логировать
  }

  if (!validateForm()) {
    return;
  }

  const submitButton = document.getElementById('submitForm');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
  }

  try {
    const formData = {
      name: nameInput.value.trim().replace(/[<>]/g, ''),
      phone: phoneInput.value.trim().replace(/[<>]/g, ''),
      message: showMessageCheckbox?.checked 
        ? document.getElementById('message')?.value.trim().replace(/[<>]/g, '') 
        : undefined
    };

    // Отправка через mailto: ссылку
    const subject = encodeURIComponent('Новый запрос на сотрудничество');
    let body = `Имя: ${formData.name}\n`;
    body += `Телефон: ${formData.phone}\n`;
    if (formData.message) {
      body += `Сообщение: ${formData.message}\n`;
    }
    body += `Время: ${new Date().toLocaleString('ru-RU')}\n`;
    body += `Страница: ${window.location.href}`;
    
    const mailtoLink = `mailto:contact@dotdev.site?subject=${subject}&body=${encodeURIComponent(body)}`;
    
    // Открываем почтовый клиент
    window.location.href = mailtoLink;
    
    // Показываем сообщение об успехе
    alert('Откроется ваше почтовое приложение. Если оно не открылось, отправьте письмо на contact@dotdev.site с указанными данными.');
    closeModalHandler();
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить';
    }
  }
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Toggle current item
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#privacy' || href === '#terms') {
      return; // Don't scroll for empty or special anchors
    }

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Set current year in footer
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

// Active navigation link highlighting
const updateActiveNavLink = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');

  const scrollPosition = window.pageYOffset + 150;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink(); // Initial call

// Fade in animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe sections for fade-in animation
document.querySelectorAll('.section, .hero-section, .quote-section').forEach(section => {
  observer.observe(section);
});
