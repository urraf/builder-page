/* ========================================
   NAHRAF PACKERS & MOVERS — JAVASCRIPT
   ======================================== */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.hero-stat-num');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            counter.textContent = current.toLocaleString('en-IN');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Trigger counter animation when hero is in view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats-strip');
if (heroStats) {
    heroObserver.observe(heroStats);
}

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.service-card, .feature-card, .testimonial-card, .contact-item, .cta-card, .contact-form'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
}

initScrollReveal();

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PAYMENT MODAL =====
const paymentModal = document.getElementById('payment-modal');

function openPaymentModal() {
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.getElementById('payment-amount').focus();
    }, 300);
}

function closePaymentModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        closePaymentModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
        closePaymentModal();
    }
});

// ===== QUICK AMOUNT BUTTONS =====
function setAmount(amount) {
    document.getElementById('payment-amount').value = amount;

    // Highlight active button
    document.querySelectorAll('.quick-amt-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ===== PAYMENT CONFIGURATION =====
// Set DEMO_MODE to false and add your real Razorpay key to accept real payments
const DEMO_MODE = true;
const RAZORPAY_KEY = 'rzp_test_XXXXXXXXXXXX'; // ← Replace with your real Razorpay Key ID

// ===== RAZORPAY PAYMENT INTEGRATION =====
function initiatePayment() {
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const name = document.getElementById('payer-name').value.trim();
    const email = document.getElementById('payer-email').value.trim();
    const phone = document.getElementById('payer-phone').value.trim();

    // Validation
    if (!amount || amount < 1) {
        showToast('Please enter a valid amount (minimum ₹1)', 'error');
        document.getElementById('payment-amount').focus();
        return;
    }

    if (!name) {
        showToast('Please enter your name', 'error');
        document.getElementById('payer-name').focus();
        return;
    }

    if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        document.getElementById('payer-email').focus();
        return;
    }

    if (!phone || phone.length < 10) {
        showToast('Please enter a valid phone number', 'error');
        document.getElementById('payer-phone').focus();
        return;
    }

    if (DEMO_MODE) {
        openDemoCheckout(amount, name, email, phone);
    } else {
        openRazorpayCheckout(amount, name, email, phone);
    }
}

// ===== DEMO CHECKOUT (Simulated Razorpay) =====
function openDemoCheckout(amount, name, email, phone) {
    // Create the demo checkout overlay
    const overlay = document.createElement('div');
    overlay.id = 'demo-checkout-overlay';
    overlay.innerHTML = `
        <div class="demo-checkout">
            <div class="demo-checkout-header">
                <div class="demo-checkout-brand">
                    <div class="demo-brand-icon"><i class="fas fa-truck-moving"></i></div>
                    <div>
                        <div class="demo-brand-name">Nahraf Packers & Movers</div>
                        <div class="demo-brand-desc">Payment for Moving Services</div>
                    </div>
                </div>
                <button class="demo-checkout-close" onclick="closeDemoCheckout()">&times;</button>
            </div>
            <div class="demo-checkout-amount">
                <span>Amount</span>
                <span class="demo-amount-value">₹${amount.toLocaleString('en-IN')}</span>
            </div>
            <div class="demo-checkout-details">
                <div class="demo-detail-row"><i class="fas fa-user"></i> ${name}</div>
                <div class="demo-detail-row"><i class="fas fa-envelope"></i> ${email}</div>
                <div class="demo-detail-row"><i class="fas fa-phone"></i> ${phone}</div>
            </div>
            <div class="demo-payment-methods">
                <div class="demo-method active"><i class="fas fa-mobile-screen-button"></i> UPI</div>
                <div class="demo-method"><i class="fas fa-credit-card"></i> Card</div>
                <div class="demo-method"><i class="fas fa-building-columns"></i> Bank</div>
                <div class="demo-method"><i class="fas fa-wallet"></i> Wallet</div>
            </div>
            <div class="demo-upi-section">
                <input type="text" class="demo-upi-input" placeholder="Enter UPI ID (e.g. name@upi)" value="${phone}@upi">
            </div>
            <button class="demo-pay-button" id="demo-pay-now" onclick="processDemoPayment(${amount})">
                Pay ₹${amount.toLocaleString('en-IN')}
            </button>
            <div class="demo-secured">
                <i class="fas fa-lock"></i> Secured by <strong>Razorpay</strong> (Demo Mode)
            </div>
        </div>
    `;

    // Inject styles
    if (!document.getElementById('demo-checkout-styles')) {
        const style = document.createElement('style');
        style.id = 'demo-checkout-styles';
        style.textContent = `
            #demo-checkout-overlay {
                position: fixed; inset: 0; z-index: 5000;
                background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
                display: flex; align-items: center; justify-content: center;
                animation: demoFadeIn 0.3s ease;
                padding: 20px;
            }
            @keyframes demoFadeIn { from { opacity: 0; } to { opacity: 1; } }
            .demo-checkout {
                background: #fff; border-radius: 16px; width: 100%; max-width: 400px;
                box-shadow: 0 25px 60px rgba(0,0,0,0.3); overflow: hidden;
                animation: demoSlideUp 0.4s cubic-bezier(0.4,0,0.2,1);
                font-family: 'Inter', sans-serif; color: #1a1a2e;
            }
            @keyframes demoSlideUp { from { transform: translateY(30px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
            .demo-checkout-header {
                background: linear-gradient(135deg, #1e3a5f, #0f2440);
                padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;
            }
            .demo-checkout-brand { display: flex; align-items: center; gap: 12px; }
            .demo-brand-icon {
                width: 44px; height: 44px; background: linear-gradient(135deg, #f59e0b, #ef4444);
                border-radius: 10px; display: flex; align-items: center; justify-content: center;
                color: #fff; font-size: 1.1rem;
            }
            .demo-brand-name { color: #fff; font-weight: 700; font-size: 1rem; }
            .demo-brand-desc { color: rgba(255,255,255,0.6); font-size: 0.8rem; }
            .demo-checkout-close {
                background: rgba(255,255,255,0.1); border: none; color: #fff;
                width: 32px; height: 32px; border-radius: 50%; font-size: 1.3rem;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s;
            }
            .demo-checkout-close:hover { background: rgba(255,255,255,0.2); }
            .demo-checkout-amount {
                padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;
                background: #f8f9fa; border-bottom: 1px solid #e9ecef;
            }
            .demo-checkout-amount span:first-child { color: #666; font-size: 0.9rem; }
            .demo-amount-value { font-size: 1.6rem; font-weight: 800; color: #1a1a2e; font-family: 'Outfit', sans-serif; }
            .demo-checkout-details { padding: 16px 24px; border-bottom: 1px solid #e9ecef; }
            .demo-detail-row {
                padding: 6px 0; color: #555; font-size: 0.88rem;
                display: flex; align-items: center; gap: 10px;
            }
            .demo-detail-row i { color: #999; width: 16px; text-align: center; font-size: 0.85rem; }
            .demo-payment-methods {
                display: flex; gap: 8px; padding: 16px 24px; border-bottom: 1px solid #e9ecef;
            }
            .demo-method {
                flex: 1; padding: 10px 6px; border: 2px solid #e9ecef; border-radius: 10px;
                text-align: center; font-size: 0.75rem; font-weight: 600; color: #666;
                cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column;
                align-items: center; gap: 4px;
            }
            .demo-method i { font-size: 1.1rem; }
            .demo-method.active { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.05); }
            .demo-method:hover { border-color: #f59e0b; }
            .demo-upi-section { padding: 16px 24px; }
            .demo-upi-input {
                width: 100%; padding: 12px 16px; border: 2px solid #e9ecef; border-radius: 10px;
                font-size: 0.95rem; color: #1a1a2e; outline: none; font-family: 'Inter', sans-serif;
                transition: border-color 0.2s;
            }
            .demo-upi-input:focus { border-color: #f59e0b; }
            .demo-pay-button {
                width: calc(100% - 48px); margin: 0 24px 12px; padding: 15px;
                background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff;
                border: none; border-radius: 12px; font-size: 1.05rem; font-weight: 700;
                cursor: pointer; font-family: 'Outfit', sans-serif;
                transition: all 0.3s; box-shadow: 0 4px 15px rgba(245,158,11,0.3);
            }
            .demo-pay-button:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(245,158,11,0.4); }
            .demo-pay-button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
            .demo-secured {
                text-align: center; padding: 14px 24px 20px; color: #999; font-size: 0.78rem;
            }
            .demo-secured i { color: #22c55e; margin-right: 4px; }
            .demo-secured strong { color: #1e3a5f; }
            .demo-processing {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 50px 24px; text-align: center;
            }
            .demo-spinner {
                width: 50px; height: 50px; border: 4px solid #e9ecef;
                border-top-color: #f59e0b; border-radius: 50%;
                animation: demoSpin 0.8s linear infinite; margin-bottom: 20px;
            }
            @keyframes demoSpin { to { transform: rotate(360deg); } }
            .demo-processing p { color: #666; font-size: 0.95rem; }
            .demo-success {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 40px 24px; text-align: center;
            }
            .demo-success-icon {
                width: 70px; height: 70px; background: linear-gradient(135deg, #22c55e, #16a34a);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-size: 2rem; color: #fff; margin-bottom: 20px;
                animation: demoPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes demoPop { from { transform: scale(0); } to { transform: scale(1); } }
            .demo-success h3 { color: #1a1a2e; font-size: 1.3rem; margin-bottom: 8px; font-family: 'Outfit', sans-serif; }
            .demo-success p { color: #666; font-size: 0.9rem; margin-bottom: 4px; }
            .demo-success .demo-txn-id { color: #999; font-size: 0.82rem; font-family: monospace; margin-top: 12px; }
            .demo-success-btn {
                margin-top: 20px; padding: 12px 32px; background: #22c55e; color: #fff;
                border: none; border-radius: 10px; font-weight: 600; cursor: pointer;
                font-family: 'Outfit', sans-serif; font-size: 1rem; transition: all 0.2s;
            }
            .demo-success-btn:hover { background: #16a34a; }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Payment method switching
    overlay.querySelectorAll('.demo-method').forEach(method => {
        method.addEventListener('click', () => {
            overlay.querySelectorAll('.demo-method').forEach(m => m.classList.remove('active'));
            method.classList.add('active');
        });
    });
}

function closeDemoCheckout() {
    const overlay = document.getElementById('demo-checkout-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 300);
    }
}

function processDemoPayment(amount) {
    const overlay = document.getElementById('demo-checkout-overlay');
    const checkout = overlay.querySelector('.demo-checkout');
    const payBtn = document.getElementById('demo-pay-now');

    // Show processing state
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    setTimeout(() => {
        // Show processing spinner
        checkout.innerHTML = `
            <div class="demo-checkout-header">
                <div class="demo-checkout-brand">
                    <div class="demo-brand-icon"><i class="fas fa-truck-moving"></i></div>
                    <div>
                        <div class="demo-brand-name">Nahraf Packers & Movers</div>
                        <div class="demo-brand-desc">Processing Payment...</div>
                    </div>
                </div>
            </div>
            <div class="demo-processing">
                <div class="demo-spinner"></div>
                <p>Processing your payment of <strong>₹${amount.toLocaleString('en-IN')}</strong></p>
                <p style="color: #999; font-size: 0.82rem; margin-top: 8px;">Please do not close this window</p>
            </div>
        `;

        // Show success after processing
        setTimeout(() => {
            const txnId = 'pay_DEMO_' + Math.random().toString(36).substring(2, 15).toUpperCase();
            checkout.innerHTML = `
                <div class="demo-checkout-header" style="background: linear-gradient(135deg, #22c55e, #16a34a);">
                    <div class="demo-checkout-brand">
                        <div class="demo-brand-icon" style="background: rgba(255,255,255,0.2);"><i class="fas fa-check"></i></div>
                        <div>
                            <div class="demo-brand-name">Payment Successful!</div>
                            <div class="demo-brand-desc" style="color: rgba(255,255,255,0.8);">Nahraf Packers & Movers</div>
                        </div>
                    </div>
                </div>
                <div class="demo-success">
                    <div class="demo-success-icon"><i class="fas fa-check"></i></div>
                    <h3>₹${amount.toLocaleString('en-IN')} Paid Successfully</h3>
                    <p>Thank you for your payment!</p>
                    <p>A confirmation has been sent to your email.</p>
                    <div class="demo-txn-id">Transaction ID: ${txnId}</div>
                    <button class="demo-success-btn" onclick="closeDemoCheckout(); closePaymentModal();">Done</button>
                </div>
            `;

            showToast(`Payment successful! ID: ${txnId}`, 'success');
        }, 2000);
    }, 800);
}

// ===== REAL RAZORPAY CHECKOUT (when DEMO_MODE is false) =====
function openRazorpayCheckout(amount, name, email, phone) {
    const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Nahraf Packers & Movers',
        description: 'Payment for Moving Services',
        handler: function (response) {
            closePaymentModal();
            showToast(`Payment successful! ID: ${response.razorpay_payment_id}`, 'success');
        },
        prefill: { name, email, contact: phone },
        notes: { service: 'Packers and Movers', customer_name: name },
        theme: { color: '#f59e0b' },
        modal: {
            ondismiss: function () {
                showToast('Payment was cancelled', 'warning');
            }
        }
    };

    try {
        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function (response) {
            showToast(`Payment failed: ${response.error.description}`, 'error');
        });
        rzp.open();
    } catch (error) {
        showToast('Payment gateway error. Please try again.', 'error');
    }
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;

    // Toast styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: '3000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        borderRadius: '12px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.95rem',
        fontWeight: '500',
        color: '#fff',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        transform: 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '400px'
    });

    const bgColors = {
        success: 'rgba(34, 197, 94, 0.9)',
        error: 'rgba(239, 68, 68, 0.9)',
        warning: 'rgba(245, 158, 11, 0.9)',
        info: 'rgba(59, 130, 246, 0.9)'
    };
    toast.style.background = bgColors[type];

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });

    // Auto dismiss
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you! We will get back to you soon.', 'success');
        contactForm.reset();
    });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#f59e0b';
                navLink.style.background = 'rgba(245, 158, 11, 0.08)';
            } else {
                navLink.style.color = '';
                navLink.style.background = '';
            }
        }
    });
});
