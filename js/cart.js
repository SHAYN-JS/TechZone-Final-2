class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartCount();
    }

    renderCart() {
        const container = document.getElementById('cart-container');
        const totalQtyEl = document.getElementById('total-qty');
        const totalPriceEl = document.getElementById('total-price');
        const navCartCount = document.getElementById('nav-cart-count');
        
        if (!container) return;

        container.innerHTML = '';
        let totalPrice = 0;
        let totalQty = 0;

        if (this.cart.length === 0) {
            container.innerHTML = '<div class="text-center py-10 text-zinc-500">Savatchangiz bo\'sh 😕</div>';
            if(totalQtyEl) totalQtyEl.innerText = '0';
            if(totalPriceEl) totalPriceEl.innerText = '0 so\'m';
            if(navCartCount) navCartCount.innerText = '0';
            return;
        }

        this.cart.forEach((item, index) => {
            // Xatolarni oldini olish: raqamga aylantirish
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            const itemTotal = price * qty;

            totalPrice += itemTotal;
            totalQty += qty;

            container.innerHTML += `
                <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 mb-4">
                    <img src="${item.image}" class="w-16 h-16 rounded-lg bg-zinc-800 object-cover" onerror="this.src='https://via.placeholder.com/100'">
                    <div class="flex-1">
                        <h3 class="font-bold text-white">${item.name}</h3>
                        <p class="text-blue-500 text-sm font-bold">${this.formatPrice(price)} so'm</p>
                    </div>
                    <div class="flex items-center bg-black rounded-lg border border-zinc-700">
                        <button onclick="cartManager.changeQty(${index}, -1)" class="px-3 py-1 hover:bg-zinc-800 text-white">-</button>
                        <span class="px-3 font-bold text-blue-500">${qty}</span>
                        <button onclick="cartManager.changeQty(${index}, 1)" class="px-3 py-1 hover:bg-zinc-800 text-white">+</button>
                    </div>
                    <button onclick="cartManager.removeItem(${index})" class="text-zinc-500 hover:text-red-500 ml-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });

        if(totalQtyEl) totalQtyEl.innerText = totalQty;
        if(navCartCount) navCartCount.innerText = totalQty;
        if(totalPriceEl) totalPriceEl.innerText = this.formatPrice(totalPrice) + " so'm";
    }

    changeQty(index, delta) {
        if (this.cart[index]) {
            let currentQty = Number(this.cart[index].quantity) || 1;
            let newQty = currentQty + delta;
            
            if (newQty > 0) {
                this.cart[index].quantity = newQty;
                this.save();
                this.renderCart();
                this.updateCartCount();
            } else {
                this.removeItem(index);
            }
        }
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.save();
        this.renderCart();
        this.updateCartCount();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        const badge = document.getElementById('cartCount') || document.getElementById('nav-cart-count');
        if (badge) badge.textContent = count;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

const cartManager = new CartManager();

// Savatni tozalash global funksiyasi
window.clearCart = () => {
    if (confirm("Savatchani tozalamoqchimisiz?")) {
        localStorage.removeItem('cart');
        location.reload();
    }
};