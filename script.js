document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // --- 3. Pricing Toggle (INR / USD) ---
    const currencyToggle = document.getElementById('currency-toggle');
    const labelInr = document.getElementById('label-inr');
    const labelUsd = document.getElementById('label-usd');
    const priceValues = document.querySelectorAll('.price-value');
    const currencySymbols = document.querySelectorAll('.currency-symbol');

    // Initial state
    labelInr.classList.add('active');

    currencyToggle.addEventListener('change', (e) => {
        const isUsd = e.target.checked;
        
        if (isUsd) {
            labelUsd.classList.add('active');
            labelInr.classList.remove('active');
            
            priceValues.forEach(el => {
                el.textContent = el.getAttribute('data-usd');
            });
            currencySymbols.forEach(el => {
                el.textContent = '$';
            });
        } else {
            labelInr.classList.add('active');
            labelUsd.classList.remove('active');
            
            priceValues.forEach(el => {
                el.textContent = el.getAttribute('data-inr');
            });
            currencySymbols.forEach(el => {
                el.textContent = '₹';
            });
        }
    });

    // --- 4. Waitlist Form Submission ---
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const clinic = document.getElementById('clinic').value;
        
        // Basic validation
        if (!name || !email || !clinic) {
            showMessage('Please fill all fields', 'error');
            return;
        }

        // Simulate API call
        submitBtn.innerHTML = '<span>Joining...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Store in localStorage for demo purposes
            const leads = JSON.parse(localStorage.getItem('bizbot_leads') || '[]');
            leads.push({ name, email, clinic, date: new Date().toISOString() });
            localStorage.setItem('bizbot_leads', JSON.stringify(leads));

            showMessage('Success! You are on the waitlist. We will contact you soon.', 'success');
            waitlistForm.reset();
            
            submitBtn.innerHTML = '<span>Join the Waitlist</span><i data-lucide="arrow-right"></i>';
            lucide.createIcons(); // Re-render icon
            submitBtn.disabled = false;
            
        }, 1500);
    });

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.classList.remove('hidden');
        
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }

    // --- 5. WhatsApp Chat Simulator ---
    const chatContainer = document.getElementById('chat-simulator');
    
    const script = [
        { type: 'in', text: 'Hi, I need to book an appointment with Dr. Sharma for tomorrow.', delay: 1000 },
        { type: 'typing', delay: 1000 },
        { type: 'out', text: 'Hello! I am the City Care Clinic assistant. Dr. Sharma is available tomorrow. Please select a time slot:', buttons: ['10:00 AM', '02:30 PM', '05:00 PM'], delay: 2000 },
        { type: 'in', text: '02:30 PM', delay: 4000 },
        { type: 'typing', delay: 1000 },
        { type: 'out', text: 'Great! I have tentatively booked 02:30 PM for you tomorrow. To confirm, please pay the consultation fee of ₹500.', buttons: ['Pay via UPI'], delay: 1500 },
        { type: 'in', text: 'Done', delay: 3500 },
        { type: 'typing', delay: 1000 },
        { type: 'out', text: 'Payment received! ✅ Your appointment with Dr. Sharma is confirmed for tomorrow at 02:30 PM. See you then!', delay: 1000 }
    ];

    let currentStep = 0;

    function renderMessage(msg) {
        if (msg.type === 'typing') {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.id = 'typing';
            typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            chatContainer.appendChild(typingDiv);
        } else {
            // Remove typing indicator if exists
            const existingTyping = document.getElementById('typing');
            if (existingTyping) existingTyping.remove();

            const msgDiv = document.createElement('div');
            msgDiv.className = `msg msg-${msg.type}`;
            
            let content = `<span>${msg.text}</span>`;
            
            // Add buttons if present
            if (msg.buttons) {
                content += '<div class="msg-buttons">';
                msg.buttons.forEach(btn => {
                    content += `<button class="msg-btn">${btn}</button>`;
                });
                content += '</div>';
            }
            
            // Add time
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            content += `<span class="msg-time">${timeStr}</span>`;
            
            msgDiv.innerHTML = content;
            chatContainer.appendChild(msgDiv);
        }
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function runChatSimulator() {
        if (currentStep < script.length) {
            const step = script[currentStep];
            setTimeout(() => {
                renderMessage(step);
                currentStep++;
                runChatSimulator();
            }, step.delay);
        } else {
            // Loop simulator after 5 seconds
            setTimeout(() => {
                chatContainer.innerHTML = '';
                currentStep = 0;
                runChatSimulator();
            }, 5000);
        }
    }

    // Start simulator when in view (simple intersection observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (currentStep === 0) runChatSimulator();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.phone-mockup'));

    // --- 6. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

});
