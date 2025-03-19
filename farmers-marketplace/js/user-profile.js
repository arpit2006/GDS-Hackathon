// User Profile JavaScript for Kisan Bazar

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user is a buyer (not a farmer)
    if (currentUser.isFarmer) {
        // Redirect to farmer dashboard if logged in as farmer
        window.location.href = 'farmer-dashboard.html';
        return;
    }
    
    // Load user data
    loadUserData(currentUser);
    
    // Handle section navigation
    setupTabNavigation();
    
    // Load orders and other user data
    loadOrders();
    loadWishlist();
    loadCart();
    loadSavedFarmers();
    
    // Setup form submission handlers
    setupProfileForm();
    setupPasswordForm();
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});

// Load user profile data
function loadUserData(user) {
    // Update profile section
    document.getElementById('user-name').textContent = user.fullname || 'Buyer';
    document.getElementById('user-email').textContent = user.email || '';
    
    // Update profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        document.getElementById('profile-name').value = user.fullname || '';
        document.getElementById('profile-email').value = user.email || '';
        document.getElementById('profile-phone').value = user.mobile || '';
        
        // Set other profile fields if they exist
        if (user.address) document.getElementById('profile-address').value = user.address;
        if (user.city) document.getElementById('profile-city').value = user.city;
        if (user.state) document.getElementById('profile-state').value = user.state;
        if (user.pincode) document.getElementById('profile-pincode').value = user.pincode;
    }
}

// Set up tab navigation
function setupTabNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-menu li');
    const sections = document.querySelectorAll('.dashboard-section');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get target section ID from href attribute
            const targetId = this.querySelector('a').getAttribute('href');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            document.querySelector(targetId).classList.add('active');
            
            // Close mobile sidebar if open
            const sidebar = document.querySelector('.dashboard-sidebar');
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Set up order tabs
    const orderTabs = document.querySelectorAll('.order-tab');
    if (orderTabs.length > 0) {
        orderTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                orderTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Filter orders by status
                const status = this.getAttribute('data-status');
                filterOrders(status);
            });
        });
    }
}

// Load orders from localStorage
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Filter orders for current user
    const userOrders = orders.filter(order => order.userId === currentUser.email);
    
    // Update orders count
    document.getElementById('orders-count').textContent = userOrders.length;
    
    // Calculate total spent
    const totalSpent = userOrders.reduce((total, order) => total + order.total, 0);
    document.getElementById('total-spent').textContent = '₹' + totalSpent;
    
    // Update recent orders table
    updateOrdersTable(userOrders, 'recent-orders', 3);
    
    // Update all orders table
    updateOrdersTable(userOrders, 'orders-table');
}

// Update orders table with data
function updateOrdersTable(orders, tableId, limit) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    if (orders.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="no-data">No orders yet</td></tr>';
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Limit if specified
    const displayOrders = limit ? orders.slice(0, limit) : orders;
    
    // Clear table
    table.innerHTML = '';
    
    // Add order rows
    displayOrders.forEach(order => {
        const row = document.createElement('tr');
        
        // Format order date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('en-IN');
        
        // Create status badge
        const statusBadge = getStatusBadge(order.status);
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${formattedDate}</td>
            <td>${order.items.length} items</td>
            <td>₹${order.total}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn small-btn view-order" data-id="${order.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        
        table.appendChild(row);
    });
    
    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll('.view-order');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            // View order details functionality
            viewOrderDetails(orderId);
        });
    });
}

// Filter orders by status
function filterOrders(status) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Filter orders for current user
    let userOrders = orders.filter(order => order.userId === currentUser.email);
    
    // Filter by status if not "all"
    if (status !== 'all') {
        userOrders = userOrders.filter(order => order.status === status);
    }
    
    // Update orders table
    updateOrdersTable(userOrders, 'orders-table');
}

// Get appropriate status badge
function getStatusBadge(status) {
    const statusClasses = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered',
        'canceled': 'status-canceled'
    };
    
    const statusClass = statusClasses[status] || 'status-pending';
    
    return `<span class="status-badge ${statusClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

// View order details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Create modal for order details
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    // Format order date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-IN');
    
    // Create items list
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ${item.price}</p>
                </div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h3>Order #${order.id}</h3>
                <span class="status-badge ${getStatusBadge(order.status)}">${order.status}</span>
            </div>
            <div class="modal-body">
                <div class="order-info">
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Total:</strong> ₹${order.total}</p>
                    <p><strong>Shipping Address:</strong> ${order.address}</p>
                </div>
                <h4>Order Items</h4>
                <div class="order-items">
                    ${itemsHtml}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close modal when clicking X
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// Load wishlist
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Filter wishlist for current user
    const userWishlist = wishlist.filter(item => item.userId === currentUser.email);
    
    // Update wishlist count
    document.getElementById('wishlist-count').textContent = userWishlist.length;
    
    // Update wishlist grid
    const wishlistGrid = document.getElementById('wishlist-items');
    if (!wishlistGrid) return;
    
    if (userWishlist.length === 0) {
        wishlistGrid.innerHTML = '<div class="no-data">Your wishlist is empty</div>';
        return;
    }
    
    // Clear grid
    wishlistGrid.innerHTML = '';
    
    // Add wishlist items
    userWishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('product-card');
        
        wishlistItem.innerHTML = `
            <div class="product-img">
                <img src="${item.image}" alt="${item.name}">
                <span class="status available">Available</span>
            </div>
            <div class="product-info">
                <h3>${item.name}</h3>
                <p class="farmer-name">${item.farmerName}</p>
                <div class="product-price">
                    <span class="price">${item.price}</span>
                </div>
                <div class="product-actions">
                    <button class="btn primary-btn add-to-cart" data-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn remove-btn remove-wishlist" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        wishlistGrid.appendChild(wishlistItem);
    });
    
    // Add event listeners to buttons
    const addToCartButtons = wishlistGrid.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            addToCart(itemId);
        });
    });
    
    const removeButtons = wishlistGrid.querySelectorAll('.remove-wishlist');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeFromWishlist(itemId);
        });
    });
}

// Load shopping cart
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Update cart items
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="no-data">Your cart is empty</div>';
        document.getElementById('cart-subtotal').textContent = '₹0';
        document.getElementById('cart-shipping').textContent = '₹0';
        document.getElementById('cart-tax').textContent = '₹0';
        document.getElementById('cart-total').textContent = '₹0';
        return;
    }
    
    // Clear cart
    cartItems.innerHTML = '';
    
    // Calculate totals
    let subtotal = 0;
    
    // Add cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        // Extract price number from price string (e.g. ₹80/kg)
        const priceMatch = item.price.match(/₹(\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1]) : 0;
        const itemTotal = price * item.quantity;
        
        subtotal += itemTotal;
        
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">${item.price}</p>
            </div>
            <div class="item-quantity">
                <button class="qty-btn minus" data-id="${item.name}">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10" data-id="${item.name}">
                <button class="qty-btn plus" data-id="${item.name}">+</button>
            </div>
            <div class="item-total">
                <p>₹${itemTotal}</p>
            </div>
            <div class="item-actions">
                <button class="remove-btn" data-id="${item.name}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Calculate other costs
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;
    
    // Update summary
    document.getElementById('cart-subtotal').textContent = '₹' + subtotal;
    document.getElementById('cart-shipping').textContent = '₹' + shipping;
    document.getElementById('cart-tax').textContent = '₹' + tax;
    document.getElementById('cart-total').textContent = '₹' + total;
    
    // Add event listeners to buttons
    const minusButtons = cartItems.querySelectorAll('.qty-btn.minus');
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-id');
            updateCartItemQuantity(productName, -1);
        });
    });
    
    const plusButtons = cartItems.querySelectorAll('.qty-btn.plus');
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-id');
            updateCartItemQuantity(productName, 1);
        });
    });
    
    const quantityInputs = cartItems.querySelectorAll('.item-quantity input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productName = this.getAttribute('data-id');
            const newQuantity = parseInt(this.value);
            setCartItemQuantity(productName, newQuantity);
        });
    });
    
    const removeButtons = cartItems.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-id');
            removeFromCart(productName);
        });
    });
    
    // Add checkout button functionality
    const checkoutBtn = document.querySelector('.cart-summary .primary-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

// Update cart item quantity
function updateCartItemQuantity(productName, change) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(i => i.name === productName);
    
    if (item) {
        item.quantity = Math.max(1, Math.min(10, item.quantity + change));
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Set cart item quantity
function setCartItemQuantity(productName, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(i => i.name === productName);
    
    if (item) {
        item.quantity = Math.max(1, Math.min(10, quantity));
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Remove item from cart
function removeFromCart(productName) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCart();
}

// Add item to cart from wishlist
function addToCart(wishlistItemId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const wishlistItem = wishlist.find(item => item.id === wishlistItemId);
    
    if (wishlistItem) {
        // Check if item already in cart
        const existingItem = cart.find(item => item.name === wishlistItem.name);
        
        if (existingItem) {
            existingItem.quantity = Math.min(10, existingItem.quantity + 1);
        } else {
            cart.push({
                name: wishlistItem.name,
                price: wishlistItem.price,
                quantity: 1,
                image: wishlistItem.image
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${wishlistItem.name} added to cart!`);
    }
}

// Remove item from wishlist
function removeFromWishlist(wishlistItemId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter(item => item.id !== wishlistItemId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    loadWishlist();
}

// Checkout functionality
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        const priceMatch = item.price.match(/₹(\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1]) : 0;
        subtotal += price * item.quantity;
    });
    
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;
    
    // Create new order
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const newOrder = {
        id: 'ORD' + Date.now().toString().slice(-6),
        userId: currentUser.email,
        date: new Date().toISOString(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'pending',
        address: currentUser.address || 'Default Address'
    };
    
    // Add order to "database"
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Show success message
    alert('Order placed successfully! Your order ID is ' + newOrder.id);
    
    // Reload page to update all sections
    window.location.reload();
}

// Load saved farmers
function loadSavedFarmers() {
    const savedFarmers = JSON.parse(localStorage.getItem('savedFarmers') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Filter saved farmers for current user
    const userSavedFarmers = savedFarmers.filter(item => item.userId === currentUser.email);
    
    // Update saved farmers count
    document.getElementById('farmers-count').textContent = userSavedFarmers.length;
    
    // Update saved farmers grid
    const farmersGrid = document.getElementById('saved-farmers-list');
    if (!farmersGrid) return;
    
    if (userSavedFarmers.length === 0) {
        farmersGrid.innerHTML = '<div class="no-data">You haven\'t saved any farmers yet</div>';
        return;
    }
    
    // Clear grid
    farmersGrid.innerHTML = '';
    
    // Add farmer cards
    userSavedFarmers.forEach(farmer => {
        const farmerCard = document.createElement('div');
        farmerCard.classList.add('farmer-card');
        
        farmerCard.innerHTML = `
            <div class="farmer-avatar">
                <img src="${farmer.avatar || 'images/user-avatar.jpg'}" alt="${farmer.name}">
            </div>
            <div class="farmer-info">
                <h3>${farmer.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${farmer.location}</p>
                <p>${farmer.description}</p>
                <div class="farmer-actions">
                    <button class="btn primary-btn" data-id="${farmer.id}">View Products</button>
                    <button class="btn remove-btn" data-id="${farmer.id}">
                        <i class="fas fa-user-minus"></i> Unfollow
                    </button>
                </div>
            </div>
        `;
        
        farmersGrid.appendChild(farmerCard);
    });
    
    // Add event listeners
    const viewButtons = farmersGrid.querySelectorAll('.primary-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const farmerId = this.getAttribute('data-id');
            // Redirect to farmer products page
            window.location.href = `marketplace.html?farmer=${farmerId}`;
        });
    });
    
    const unfollowButtons = farmersGrid.querySelectorAll('.remove-btn');
    unfollowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const farmerId = this.getAttribute('data-id');
            unfollowFarmer(farmerId);
        });
    });
}

// Unfollow farmer
function unfollowFarmer(farmerId) {
    const savedFarmers = JSON.parse(localStorage.getItem('savedFarmers') || '[]');
    const updatedFarmers = savedFarmers.filter(farmer => farmer.id !== farmerId);
    localStorage.setItem('savedFarmers', JSON.stringify(updatedFarmers));
    loadSavedFarmers();
}

// Setup profile form
function setupProfileForm() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;
    
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user in "database"
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        if (userIndex === -1) {
            alert('Error updating profile. User not found.');
            return;
        }
        
        // Update user object
        currentUser.fullname = document.getElementById('profile-name').value;
        currentUser.mobile = document.getElementById('profile-phone').value;
        currentUser.address = document.getElementById('profile-address').value;
        currentUser.city = document.getElementById('profile-city').value;
        currentUser.state = document.getElementById('profile-state').value;
        currentUser.pincode = document.getElementById('profile-pincode').value;
        currentUser.country = document.getElementById('profile-country').value;
        
        // Update in database
        users[userIndex] = {
            ...users[userIndex],
            fullname: currentUser.fullname,
            mobile: currentUser.mobile,
            address: currentUser.address,
            city: currentUser.city,
            state: currentUser.state,
            pincode: currentUser.pincode,
            country: currentUser.country
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        document.getElementById('user-name').textContent = currentUser.fullname;
        
        alert('Profile updated successfully!');
    });
    
    // Handle avatar upload
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Update avatar preview
                    document.getElementById('profile-image').src = event.target.result;
                    
                    // Update user avatar in local storage
                    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    currentUser.avatar = event.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Update user avatar in "database"
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const userIndex = users.findIndex(user => user.email === currentUser.email);
                    
                    if (userIndex !== -1) {
                        users[userIndex].avatar = event.target.result;
                        localStorage.setItem('users', JSON.stringify(users));
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
}

// Setup password form
function setupPasswordForm() {
    const passwordForm = document.getElementById('password-form');
    if (!passwordForm) return;
    
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        // Basic validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            alert('Please fill in all password fields.');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }
        
        // Check current password
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser.password !== currentPassword) {
            alert('Current password is incorrect.');
            return;
        }
        
        // Update password
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update in database
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Clear form
        passwordForm.reset();
        
        alert('Password updated successfully!');
    });
} 