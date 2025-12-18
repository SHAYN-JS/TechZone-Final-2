// js/theme.js
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Sahifa yuklanganda holatni tekshirish
if (localStorage.getItem('dark-mode') === 'active') {
    body.classList.add('dark-mode');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Tugma bosilganda rejimni o'zgartirish
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isActive = body.classList.contains('dark-mode');
        
        if (themeIcon) {
            themeIcon.classList.replace(isActive ? 'fa-moon' : 'fa-sun', isActive ? 'fa-sun' : 'fa-moon');
        }
        localStorage.setItem('dark-mode', isActive ? 'active' : 'inactive');
    });
}