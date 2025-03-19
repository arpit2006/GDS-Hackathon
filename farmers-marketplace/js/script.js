// Main JavaScript for Farm Fresh website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && !nav.contains(event.target) && event.target !== mobileMenuBtn) {
            nav.classList.remove('active');
        }
    });
    
    // Dashboard Sidebar Toggle (if on dashboard page)
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle && dashboardSidebar) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('active');
        });
    }

    // Password visibility toggle
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Product quantity buttons
    const minusButtons = document.querySelectorAll('.qty-btn.minus');
    const plusButtons = document.querySelectorAll('.qty-btn.plus');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                value--;
                input.value = value;
            }
        });
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            const max = parseInt(input.getAttribute('max') || 10);
            if (value < max) {
                value++;
                input.value = value;
            }
        });
    });

    // Set default background images if missing
    function setDefaultImages() {
        const heroSection = document.querySelector('.hero');
        const marketplaceHero = document.querySelector('.marketplace-hero');
        
        if (heroSection && getComputedStyle(heroSection).backgroundImage === 'none') {
            heroSection.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1595664652035-3c78ea266afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")';
        }
        
        if (marketplaceHero && getComputedStyle(marketplaceHero).backgroundImage === 'none') {
            marketplaceHero.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1562041457-018985108d49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80")';
        }
        
        // Set placeholder images for product cards
        const productImages = document.querySelectorAll('.product-img img');
        const placeholders = [
            'images/tomatoes.jpg', // tomatoes'
            'images/basmati.webp', // tomatoes'
            'images/wheat.jpg', // tomatoes'
            'images/brinjal.webp', // tomatoes'
            'images/carrot.webp', // tomatoes'
            'images/ragi crop.webp', // tomatoes'
            'images/jowar.webp', // tomatoes'
            'images/wheat.jpg', // tomatoes'
        ];
        
        productImages.forEach((img, index) => {
            if (!img.getAttribute('src') || img.getAttribute('src').includes('placeholder')) {
                img.setAttribute('src', placeholders[index % placeholders.length]);
            }
        });

        // Set user avatar placeholders
        const userAvatars = document.querySelectorAll('.user-avatar, .testimonial-author img, .feedback-user img');
        userAvatars.forEach(avatar => {
            if (!avatar.getAttribute('src') || avatar.getAttribute('src').includes('user')) {
                avatar.setAttribute('src', 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 70) + '.jpg');
            }
        });
    }

    // Call the function to set default images
    setDefaultImages();

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.product-actions .primary-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const quantity = productCard.querySelector('.quantity-select input').value;
            
            // Simple cart implementation - in a real app this would interact with backend
            alert(`Added ${quantity} of ${productName} to your cart!`);
            
            // You could implement localStorage cart here
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity = parseInt(existingItem.quantity) + parseInt(quantity);
            } else {
                cart.push({
                    name: productName,
                    quantity: quantity,
                    price: productCard.querySelector('.price').textContent,
                    image: productCard.querySelector('.product-img img').getAttribute('src')
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            if (icon.classList.contains('fas')) {
                this.style.backgroundColor = '#ffe6e6';
                this.style.color = '#e74c3c';
                
                const productName = this.closest('.product-card').querySelector('h3').textContent;
                alert(`${productName} added to your wishlist!`);
            } else {
                this.style.backgroundColor = '#f5f5f5';
                this.style.color = '#666';
            }
        });
    });
}); 