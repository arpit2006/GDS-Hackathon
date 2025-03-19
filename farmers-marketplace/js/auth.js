// Authentication JavaScript for Farm Fresh website

document.addEventListener('DOMContentLoaded', function() {
    // User type toggle functionality
    const buyerToggle = document.getElementById('buyer-toggle');
    const farmerToggle = document.getElementById('farmer-toggle');
    const farmerFields = document.querySelector('.farmer-fields');
    
    if (buyerToggle && farmerToggle) {
        buyerToggle.addEventListener('click', function() {
            buyerToggle.classList.add('active');
            farmerToggle.classList.remove('active');
            if (farmerFields) {
                farmerFields.style.display = 'none';
            }
        });
        
        farmerToggle.addEventListener('click', function() {
            farmerToggle.classList.add('active');
            buyerToggle.classList.remove('active');
            if (farmerFields) {
                farmerFields.style.display = 'block';
            }
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const isFarmer = farmerToggle && farmerToggle.classList.contains('active');
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, this would be a server call to authenticate
            // For demo purposes, we'll just simulate login with localStorage
            
            // Check if user exists in localStorage (simulating DB check)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);
            
            if (!user) {
                alert('User not found. Please sign up first.');
                return;
            }
            
            if (user.password !== password) {
                alert('Incorrect password. Please try again.');
                return;
            }
            
            if (user.isFarmer !== isFarmer) {
                alert(`Please select the correct user type. You are registered as a ${user.isFarmer ? 'Farmer' : 'Buyer'}.`);
                return;
            }
            
            // Store current user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect based on user type
            if (isFarmer) {
                window.location.href = 'farmer-dashboard.html';
            } else {
                window.location.href = 'marketplace.html';
            }
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const mobile = document.getElementById('mobile').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            const isFarmer = farmerToggle && farmerToggle.classList.contains('active');
            
            // Basic validation
            if (!fullname || !email || !mobile || !password || !confirmPassword) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            if (!terms) {
                alert('Please agree to the Terms and Conditions.');
                return;
            }
            
            // Farmer-specific validation
            if (isFarmer) {
                const farmName = document.getElementById('farm-name').value;
                const farmAddress = document.getElementById('farm-address').value;
                const farmType = document.getElementById('farm-type').value;
                
                if (!farmName || !farmAddress || !farmType) {
                    alert('Please fill in all farm details.');
                    return;
                }
            }
            
            // In a real application, this would be a server call to register
            // For demo purposes, we'll just store in localStorage
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(user => user.email === email)) {
                alert('This email is already registered. Please log in instead.');
                return;
            }
            
            // Create new user object
            const newUser = {
                fullname,
                email,
                mobile,
                password,
                isFarmer
            };
            
            // Add farmer-specific fields if farmer
            if (isFarmer) {
                newUser.farmName = document.getElementById('farm-name').value;
                newUser.farmAddress = document.getElementById('farm-address').value;
                newUser.farmType = document.getElementById('farm-type').value;
            }
            
            // Add user to "database"
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set as current user
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Show success message and redirect
            alert('Account created successfully!');
            
            // Redirect based on user type
            if (isFarmer) {
                window.location.href = 'farmer-dashboard.html';
            } else {
                window.location.href = 'marketplace.html';
            }
        });
    }
    
    // Check if user is already logged in
    function checkLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser) {
            // Add login status indicator to header
            const header = document.querySelector('header');
            
            if (header) {
                const loginBtn = header.querySelector('.login-btn');
                const signupBtn = header.querySelector('.signup-btn');
                
                if (loginBtn && signupBtn) {
                    // Replace login/signup with user info and logout
                    loginBtn.innerHTML = `<a href="${currentUser.isFarmer ? 'farmer-dashboard.html' : 'user-profile.html'}">${currentUser.fullname}</a>`;
                    signupBtn.innerHTML = `<a href="#" id="logout-btn">Logout</a>`;
                    
                    // Add logout functionality
                    const logoutBtn = document.getElementById('logout-btn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            localStorage.removeItem('currentUser');
                            window.location.reload();
                        });
                    }
                }
            }
        }
    }
    
    // Run auth check on page load
    checkLoggedInUser();
}); 