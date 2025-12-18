class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordStrength();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.updatePasswordStrength(passwordInput.value);
            });
        }
    }

    // TELEFONNI TOZALASH (Rasmdagi bo'sh joylar muammosini hal qiladi)
    validatePhone(phone) {
        // Hamma bo'sh joylarni o'chiradi: "+998 94 409..." -> "+99894409..."
        const cleanPhone = phone.replace(/\s+/g, '');
        // Faqat +998 bilan boshlanadigan 13 ta belgini tekshiradi
        const phoneRegex = /^\+998\d{9}$/;
        return phoneRegex.test(cleanPhone);
    }

    handleRegister() {
        // Ma'lumotlarni yig'ish
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const terms = document.getElementById('terms');

        // 1. Gmail tekshiruvi
        if (!email.toLowerCase().endsWith('@gmail.com')) {
            showToast("Iltimos, faqat @gmail.com manzillarini kiriting!", "error");
            return;
        }

        // 2. Ism/Familiya tekshiruvi
        if (!firstName || !lastName) {
            showToast("Ism va familiyangizni to'liq kiriting!", "error");
            return;
        }

        // 3. Telefon tekshiruvi (Bo'sh joylar bilan ham ishlaydi)
        if (!this.validatePhone(phone)) {
            showToast("Telefon raqami noto'g'ri! Format: +998XXXXXXXXX", "error");
            return;
        }

        // 4. Parol tekshiruvi
        if (password.length < 8) {
            showToast("Parol kamida 8 ta belgidan iborat bo'lishi kerak!", "error");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Parollar bir-biriga mos kelmadi!", "error");
            return;
        }

        if (!terms.checked) {
            showToast("Foydalanish shartlariga rozilik bering!", "error");
            return;
        }

        // AGAR HAMMASI TO'G'RI BO'LSA:
        showToast("Tabriklaymiz! Muvaffaqiyatli ro'yxatdan o'tdingiz.", "success");
        
        // 2 sekunddan keyin bosh sahifaga o'tkazish
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    handleLogin() {
        const email = document.getElementById('email').value.trim();
        if (email.toLowerCase().endsWith('@gmail.com')) {
            showToast("Tizimga muvaffaqiyatli kirildi!", "success");
            setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        } else {
            showToast("Xato email yoki parol!", "error");
        }
    }

    setupPasswordStrength() { /* Parol kuchi vizual qismi */ }
    updatePasswordStrength(password) { /* Parol kuchi logikasi */ }
}

// CHIROYLI TOAST FUNKSIYASI (Alert o'rniga chiqadi)
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 10000;";
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#2ecc71' : '#e74c3c';

    toast.style.cssText = `
        background: ${bgColor}; color: white; padding: 15px 30px;
        border-radius: 12px; margin-bottom: 10px; font-weight: bold;
        box-shadow: 0 10px 20px rgba(0,0,0,0.2); transition: all 0.5s ease;
        transform: translateX(150%); opacity: 0; display: flex; align-items: center;
        min-width: 250px; font-family: sans-serif;
    `;

    toast.innerHTML = (type === 'success' ? '✅ ' : '❌ ') + message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        toast.style.transform = 'translateX(150%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => { new AuthManager(); 
    
});