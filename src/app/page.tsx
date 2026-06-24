// @ts-nocheck
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {

    
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


  }, []);

  return (
    <>
      
    
    {/* Navigation */}
    <nav className="navbar">
        <div className="container nav-container">
            <div className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="logo-img">
                    <mask id="crossMask">
                        <rect width="24" height="24" fill="white" />
                        <path d="M13 14h-2v-2H9v-2h2V8h2v2h2v2h-2v2z" fill="black" />
                    </mask>
                    <path mask="url(#crossMask)" fill="var(--primary-light)" d="M12 2C6.477 2 2 6.029 2 11c0 2.849 1.438 5.394 3.665 7.027L4 22l4.316-1.92A10.825 10.825 0 0 0 12 20c5.523 0 10-4.029 10-9s-4.477-9-10-9z"/>
                </svg>
                <span className="logo-text">BizBot</span>
            </div>
            <div className="nav-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
            </div>
            <div className="nav-actions">
                <a href="#waitlist" className="btn btn-primary">Join Waitlist</a>
            </div>
            <button className="mobile-menu-toggle">
                <i data-lucide="menu"></i>
            </button>
        </div>
    </nav>

    {/* Hero Section */}
    <header className="hero">
        <div className="container hero-container">
            <div className="hero-content">
                <div className="badge">🚀 Built for Clinics & Healthcare</div>
                <h1 className="hero-title">Your Clinic's 24/7 AI Receptionist on <span className="text-gradient">WhatsApp</span></h1>
                <p className="hero-subtitle">Stop losing money to no-shows and missed inquiries. Automate appointment bookings, send smart reminders, and answer patient FAQs instantly. Live in 10 minutes.</p>
                <div className="hero-actions">
                    <a href="#waitlist" className="btn btn-primary btn-large">Get Early Access</a>
                    <a href="#how-it-works" className="btn btn-secondary btn-large">See How It Works</a>
                </div>
                <p className="hero-microcopy">🎉 First 100 clinics get 3 months free!</p>
            </div>
            
            <div className="hero-visual">
                <div className="phone-mockup">
                    <div className="phone-notch"></div>
                    <div className="chat-header">
                        <div className="chat-profile">
                            <div className="chat-avatar">C</div>
                            <div className="chat-info">
                                <span className="chat-name">City Care Clinic <i data-lucide="badge-check" className="verified-icon"></i></span>
                                <span className="chat-status">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="chat-body" id="chat-simulator">
                        {/* Messages injected via JS */}
                    </div>
                    <div className="chat-footer">
                        <div className="chat-input-placeholder">Type a message...</div>
                        <div className="chat-send-btn"><i data-lucide="send"></i></div>
                    </div>
                </div>
                <div className="floating-bubble bubble-1"><i data-lucide="calendar-check"></i> +40% Bookings</div>
                <div className="floating-bubble bubble-2"><i data-lucide="clock"></i> -60% No-Shows</div>
            </div>
        </div>
    </header>

    {/* Problem Section */}
    <section className="problem-section">
        <div className="container">
            <h2 className="section-title text-center">Your Patients Are Already On WhatsApp. <br />Are You?</h2>
            <div className="problem-grid">
                <div className="problem-card">
                    <div className="problem-icon"><i data-lucide="phone-missed"></i></div>
                    <h3>Missed Inquiries</h3>
                    <p>Receptionists are busy. 42% of patients who call and get no answer will book with a competitor.</p>
                </div>
                <div className="problem-card">
                    <div className="problem-icon"><i data-lucide="calendar-x"></i></div>
                    <h3>Costly No-Shows</h3>
                    <p>Missed appointments cost clinics thousands every month. Manual reminders are inconsistent.</p>
                </div>
                <div className="problem-card">
                    <div className="problem-icon"><i data-lucide="message-square-dashed"></i></div>
                    <h3>Repetitive Questions</h3>
                    <p>"What are your timings?", "Do you do blood tests?" - Answering these drains staff time.</p>
                </div>
            </div>
        </div>
    </section>

    {/* Features Section */}
    <section id="features" className="features-section light-section">
        <div className="container">
            <h2 className="section-title text-center dark-text">Everything You Need to Run Your Clinic on WhatsApp</h2>
            <p className="section-subtitle text-center dark-text">A complete suite of tools designed specifically for healthcare professionals.</p>
            
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon"><i data-lucide="bot"></i></div>
                    <h3>AI-Powered Chatbot</h3>
                    <p>Instantly answers FAQs about timings, doctors available, and services using your own clinic's data.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i data-lucide="calendar"></i></div>
                    <h3>Automated Booking</h3>
                    <p>Patients can view available slots and book appointments directly inside the WhatsApp chat.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i data-lucide="bell-ring"></i></div>
                    <h3>Smart Reminders</h3>
                    <p>Automatically send WhatsApp reminders 24hrs and 2hrs before the appointment to slash no-shows.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i data-lucide="users"></i></div>
                    <h3>Shared Team Inbox</h3>
                    <p>Multiple receptionists and doctors can manage chats from a single official WhatsApp number.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i data-lucide="megaphone"></i></div>
                    <h3>Broadcast Campaigns</h3>
                    <p>Send health checkup offers, vaccination camp alerts, or updates to thousands of patients instantly.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i data-lucide="credit-card"></i></div>
                    <h3>In-Chat Payments</h3>
                    <p>Collect consultation fees securely via UPI or Card links directly inside the WhatsApp conversation.</p>
                </div>
            </div>
        </div>
    </section>

    {/* How It Works */}
    <section id="how-it-works" className="how-it-works-section">
        <div className="container">
            <h2 className="section-title text-center">Live in 10 Minutes. Zero Coding Required.</h2>
            
            <div className="steps-container">
                <div className="step">
                    <div className="step-number">1</div>
                    <h3>Connect Number</h3>
                    <p>Link your official clinic phone number to the Meta Cloud API with our 1-click integration.</p>
                </div>
                <div className="step">
                    <div className="step-number">2</div>
                    <h3>Choose "Clinic" Template</h3>
                    <p>Select our pre-built healthcare template. Just fill in your doctors, timings, and services.</p>
                </div>
                <div className="step">
                    <div className="step-number">3</div>
                    <h3>Go Live</h3>
                    <p>Your AI receptionist is ready. Start handling patients, booking appointments, and reducing no-shows immediately.</p>
                </div>
            </div>
        </div>
    </section>

    {/* Pricing Section */}
    <section id="pricing" className="pricing-section">
        <div className="container">
            <h2 className="section-title text-center">Simple, Transparent Pricing</h2>
            <p className="section-subtitle text-center">No hidden fees. No markup on Meta message costs. Unbeatable value.</p>
            
            <div className="pricing-toggle-container">
                <span className="currency-label" id="label-inr">INR (₹)</span>
                <label className="switch">
                    <input type="checkbox" id="currency-toggle" />
                    <span className="slider round"></span>
                </label>
                <span className="currency-label" id="label-usd">USD ($)</span>
            </div>
            
            <div className="pricing-grid">
                {/* Starter Plan */}
                <div className="pricing-card">
                    <h3 className="plan-name">Starter</h3>
                    <div className="plan-desc">For small solo clinics</div>
                    <div className="plan-price">
                        <span className="currency-symbol">₹</span>
                        <span className="price-value" data-inr="999" data-usd="19">999</span>
                        <span className="price-period">/mo</span>
                    </div>
                    <ul className="plan-features">
                        <li><i data-lucide="check"></i> 1 Official WhatsApp Number</li>
                        <li><i data-lucide="check"></i> 2 Team Inbox Users</li>
                        <li><i data-lucide="check"></i> Basic FAQ Bot</li>
                        <li><i data-lucide="check"></i> Manual Appointment Booking</li>
                        <li><i data-lucide="check"></i> Up to 1,000 active contacts</li>
                    </ul>
                    <a href="#waitlist" className="btn btn-outline btn-full">Join Waitlist</a>
                </div>
                
                {/* Growth Plan */}
                <div className="pricing-card popular">
                    <div className="popular-badge">Most Popular</div>
                    <h3 className="plan-name">Growth</h3>
                    <div className="plan-desc">For busy polyclinics</div>
                    <div className="plan-price">
                        <span className="currency-symbol">₹</span>
                        <span className="price-value" data-inr="2499" data-usd="49">2499</span>
                        <span className="price-period">/mo</span>
                    </div>
                    <ul className="plan-features">
                        <li><i data-lucide="check"></i> 1 Official WhatsApp Number</li>
                        <li><i data-lucide="check"></i> 5 Team Inbox Users</li>
                        <li><i data-lucide="check"></i> <strong>AI Automated Booking</strong></li>
                        <li><i data-lucide="check"></i> Automated Reminders</li>
                        <li><i data-lucide="check"></i> Broadcast Messaging</li>
                        <li><i data-lucide="check"></i> Up to 5,000 active contacts</li>
                    </ul>
                    <a href="#waitlist" className="btn btn-primary btn-full">Join Waitlist</a>
                </div>
                
                {/* Pro Plan */}
                <div className="pricing-card">
                    <h3 className="plan-name">Pro</h3>
                    <div className="plan-desc">For hospital chains</div>
                    <div className="plan-price">
                        <span className="currency-symbol">₹</span>
                        <span className="price-value" data-inr="4999" data-usd="99">4999</span>
                        <span className="price-period">/mo</span>
                    </div>
                    <ul className="plan-features">
                        <li><i data-lucide="check"></i> 2 Official WhatsApp Numbers</li>
                        <li><i data-lucide="check"></i> 10 Team Inbox Users</li>
                        <li><i data-lucide="check"></i> Advanced AI Agent (Custom RAG)</li>
                        <li><i data-lucide="check"></i> Payment Links Integration</li>
                        <li><i data-lucide="check"></i> Custom CRM Integration</li>
                        <li><i data-lucide="check"></i> Up to 15,000 active contacts</li>
                    </ul>
                    <a href="#waitlist" className="btn btn-outline btn-full">Join Waitlist</a>
                </div>
            </div>
            
            <p className="pricing-note text-center">*Meta API conversation charges are billed separately at actual cost. We do not markup Meta's prices.</p>
        </div>
    </section>

    {/* FAQ Section */}
    <section id="faq" className="faq-section light-section">
        <div className="container">
            <h2 className="section-title text-center dark-text">Frequently Asked Questions</h2>
            
            <div className="faq-accordion">
                <div className="faq-item">
                    <div className="faq-question">Do I need to be technical to use BizBot?<i data-lucide="chevron-down"></i></div>
                    <div className="faq-answer">Not at all! We've built BizBot specifically for doctors and clinic managers. Our "Clinic-in-a-box" template comes pre-configured with everything you need. You just fill in your clinic's details in a simple form.</div>
                </div>
                <div className="faq-item">
                    <div className="faq-question">Can I keep my existing WhatsApp Business App number?<i data-lucide="chevron-down"></i></div>
                    <div className="faq-answer">To use the WhatsApp Cloud API with BizBot, you'll need to upgrade that number from the Business App to the API, or simply buy a new virtual number (which we recommend). Once on the API, your whole team can access it via our Shared Inbox.</div>
                </div>
                <div className="faq-item">
                    <div className="faq-question">Are there hidden charges on messages?<i data-lucide="chevron-down"></i></div>
                    <div className="faq-answer">No! Unlike our competitors who mark up Meta's message costs by 20% or more, we charge a flat software fee. You pay Meta directly for the messages you send at their official rates (Utility messages are ~₹0.11, Service replies within 24h are free).</div>
                </div>
                <div className="faq-item">
                    <div className="faq-question">Does the AI give medical advice?<i data-lucide="chevron-down"></i></div>
                    <div className="faq-answer">Absolutely not. The AI is strictly fenced to act as a receptionist. It handles bookings, operational FAQs (timings, location, services offered), and routes complex medical queries directly to a human staff member.</div>
                </div>
            </div>
        </div>
    </section>

    {/* Waitlist CTA Section */}
    <section id="waitlist" className="cta-section">
        <div className="container cta-container">
            <div className="cta-content">
                <h2>Ready to automate your clinic?</h2>
                <p>We are launching our private beta soon. Join the waitlist today to secure your spot and get <strong>3 months of the Growth Plan for free.</strong></p>
                
                <form id="waitlist-form" className="waitlist-form">
                    <div className="form-row">
                        <input type="text" id="name" placeholder="Your Name" required />
                        <input type="email" id="email" placeholder="Email Address" required />
                    </div>
                    <div className="form-row">
                        <input type="text" id="clinic" placeholder="Clinic Name" required />
                        <button type="submit" className="btn btn-primary" id="submit-btn">
                            <span>Join the Waitlist</span>
                            <i data-lucide="arrow-right"></i>
                        </button>
                    </div>
                    <div id="form-message" className="form-message hidden"></div>
                </form>
            </div>
        </div>
    </section>

    {/* Footer */}
    <footer className="footer">
        <div className="container footer-container">
            <div className="footer-brand">
                <div className="logo">
                    <span className="logo-text">BizBot</span>
                </div>
                <p>The AI receptionist for modern Indian healthcare.</p>
            </div>
            <div className="footer-links">
                <div className="link-column">
                    <h4>Product</h4>
                    <a href="index.html#features">Features</a>
                    <a href="index.html#pricing">Pricing</a>
                    <a href="integrations.html">Integrations</a>
                </div>
                <div className="link-column">
                    <h4>Resources</h4>
                    <a href="blog.html">Blog</a>
                    <a href="help.html">Help Center</a>
                    <a href="case-studies.html">Case Studies</a>
                </div>
                <div className="link-column">
                    <h4>Legal</h4>
                    <a href="privacy-policy.html">Privacy Policy</a>
                    <a href="terms.html">Terms of Service</a>
                    <a href="meta-policy.html">Meta API Policy</a>
                </div>
            </div>
        </div>
        <div className="container">
            <div className="footer-bottom">
                <p>&copy; 2026 BizBot. All rights reserved.</p>
            </div>
        </div>
    </footer>

    
    </>
  );
}
