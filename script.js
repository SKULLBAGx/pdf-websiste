// Initialize Telegram Web App
let tg = window.Telegram.WebApp;

// Expand the web app to full height
tg.expand();

// Set theme colors
tg.setHeaderColor('#0f0f1e');
tg.setBackgroundColor('#0f0f1e');

// Adapt to Telegram theme
function adaptTheme() {
    const isDark = tg.colorScheme === 'dark';

    if (!isDark) {
        // Light theme adjustments
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f5f5f5');
        document.documentElement.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.8)');
        document.documentElement.style.setProperty('--text-primary', '#000000');
        document.documentElement.style.setProperty('--text-secondary', '#666666');
        document.documentElement.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
    }
}

// Call theme adaptation on load
adaptTheme();

// Handle theme changes
tg.onEvent('themeChanged', adaptTheme);

// Open bot button
const openBotButton = document.getElementById('openBot');
if (openBotButton) {
    openBotButton.addEventListener('click', () => {
        tg.close();
    });
}

// Pricing buttons
const buyLifetimeButton = document.getElementById('buyLifetime');
const buyMonthlyButton = document.getElementById('buyMonthly');

if (buyLifetimeButton) {
    buyLifetimeButton.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('medium');
        // You can integrate Telegram Stars payment or external payment here
        tg.showAlert('Lifetime access: $30 one-time payment. Contact support to complete purchase.');
    });
}

if (buyMonthlyButton) {
    buyMonthlyButton.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('medium');
        // You can integrate Telegram Stars payment or external payment here
        tg.showAlert('Monthly subscription: $1/month. Contact support to complete purchase.');
    });
}

// Add haptic feedback on interactions
document.querySelectorAll('.feature-card, .upcoming-card, .cta-button, .pricing-button').forEach(element => {
    element.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
    });
});

// Smooth scroll behavior
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

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.feature-card, .upcoming-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Log that the web app is ready
console.log('PDF Reader Bot Web App loaded');
console.log('Telegram Web App version:', tg.version);
console.log('Platform:', tg.platform);
console.log('Color scheme:', tg.colorScheme);

// ===== EXPANDABLE FEATURE CARDS =====

// Get all feature cards
const featureCards = document.querySelectorAll('.feature-card[data-feature]');

// Add click event to toggle expansion
featureCards.forEach(card => {
    card.addEventListener('click', () => {
        // Toggle expanded class
        card.classList.toggle('expanded');

        // Haptic feedback
        tg.HapticFeedback.impactOccurred('light');
    });
});

// ===== MATRIX THEME FUNCTIONALITY =====

// Matrix toggle button
const matrixToggle = document.getElementById('matrixToggle');
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix rain configuration
const fontSize = 16;
let columns = canvas.width / fontSize;
const drops = [];

// Initialize drops
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

// Matrix characters
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Draw matrix rain
function drawMatrix() {
    // Semi-transparent black background for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];

        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
    }
}

// Animation loop
let matrixInterval = null;

// Toggle Matrix mode
let isMatrixMode = false;

matrixToggle.addEventListener('click', () => {
    isMatrixMode = !isMatrixMode;
    document.body.classList.toggle('matrix-mode');

    // Haptic feedback
    tg.HapticFeedback.impactOccurred('medium');

    if (isMatrixMode) {
        // Start matrix rain animation
        matrixInterval = setInterval(drawMatrix, 50);
        matrixToggle.querySelector('.toggle-text').textContent = 'Normal Mode';
    } else {
        // Stop matrix rain animation
        clearInterval(matrixInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        matrixToggle.querySelector('.toggle-text').textContent = 'Matrix Mode';
    }
});

// Update columns on resize
window.addEventListener('resize', () => {
    columns = canvas.width / fontSize;
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
});
