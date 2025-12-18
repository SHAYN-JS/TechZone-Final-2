// Mahsulotlar "Bazasi" (O'zgartirmang)
const products = [
    { id: 1, name: "Acer Predator Helios 300", price: 12500000, category: "noutbuk", image: "images/aksiya_laptop.jpg", tags: ["rtx", "gaming", "i7"] },
    { id: 2, name: "Samsung Odyssey G7", price: 5800000, category: "monitor", image: "images/aksiya_monitor.jpg", tags: ["240hz", "gaming", "qhd"] },
    { id: 3, name: "RTX 4070 Founders Edition", price: 9999000, category: "videokarta", image: "images/3060.jfif", tags: ["gpu", "nvidia", "rtx"] },
    { id: 4, name: "Gaming PC Mid-Range", price: 11000000, category: "kompyuter", image: "images/gamingz.jfif", tags: ["rtx", "i5", "pc"] },
    { id: 5, name: "Samsung 980 Pro SSD 1TB", price: 1600000, category: "storage", image: "images/ssd3.jfif", tags: ["ssd", "m2", "nvme"] },
    { id: 6, name: "Asus ROG Strix G15", price: 14850000, category: "noutbuk", image: "images/asus rog.jfif", tags: ["gaming", "rtx", "asus"] }
];

// Elementlarni ushlash
const searchInput = document.getElementById('mainSearchInput');
const resultsContainer = document.getElementById('searchResults');
const noResults = document.getElementById('noResults');
const searchTermDisplay = document.getElementById('searchTerm');
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');

// --- DARK MODE LOGIKASI ---
function initTheme() {
    if (localStorage.getItem('dark-mode') === 'active') {
        document.documentElement.classList.add('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('dark-mode', 'active');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('dark-mode', 'inactive');
    }
});

// --- QIDIRUV LOGIKASI ---
function performSearch(query) {
    const q = query.toLowerCase().trim();
    searchTermDisplay.innerText = q || "...";

    const filtered = products.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.includes(q))
    );

    renderResults(filtered);
}

function renderResults(list) {
    resultsContainer.innerHTML = '';
    
    if (list.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    list.forEach(product => {
        resultsContainer.innerHTML += `
            <div class="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-200 dark:border-zinc-700">
                <img src="${product.image}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">${product.name}</h3>
                <p class="text-blue-600 dark:text-blue-400 font-bold text-xl mb-4">${product.price.toLocaleString()} so'm</p>
                <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')" 
                    class="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition active:scale-95">
                    Savatga qo'shish
                </button>
            </div>
        `;
    });
}

// --- SAVAT VA TOAST ---
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.name === name);
    if(existing) existing.quantity++; else cart.push({name, price, image, quantity: 1});
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${name} savatga qo'shildi!`);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((a, b) => a + b.quantity, 0);
    document.getElementById('cartCount').innerText = count;
}

function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 flex items-center gap-3 border-l-4 border-green-500';
    toast.innerHTML = `<span>✅</span><span class="font-medium">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- INITIALIZE ---
window.onload = () => {
    initTheme();
    updateCartBadge();
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        searchInput.value = query;
        performSearch(query);
    }
};

searchInput.addEventListener('input', (e) => performSearch(e.target.value));