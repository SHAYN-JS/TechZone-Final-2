class TechZoneApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartCount();
        this.showToast(`${product.name} savatga qo'shildi!`);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById('cartCount');
        if (badge) badge.textContent = count;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const card = e.target.closest('.product-card');
                const name = card.querySelector('.product-title').innerText;
                const image = card.querySelector('.product-image').getAttribute('src');
                
                // Faqat klassi 'current-price' bo'lgan narxni raqam qilib olamiz
                const priceText = card.querySelector('.current-price').innerText;
                const price = parseInt(priceText.replace(/\D/g, ''));

                this.addToCart({ name, price, image });
            }
        });
    }

    showToast(message) {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.style.cssText = "background: #2ecc71; color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: 0.5s;";
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
    }
}

// Toast uchun kerakli stil (hech narsa o'chmasligi uchun)
const style = document.createElement('style');
style.innerHTML = "#toastContainer { position: fixed; top: 20px; right: 20px; z-index: 10000; }";
document.head.appendChild(style);

const app = new TechZoneApp();

// index.html dagi qidiruv inputini qidiruv sahifasiga yo'naltirish
const homeSearchInput = document.getElementById('searchInput');

if (homeSearchInput) {
    homeSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim(); // Bo'sh joylarni olib tashlaymiz
            if (query) {
                // Qidiruv sahifasiga qidiruv so'zi bilan o'tkazamiz
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}