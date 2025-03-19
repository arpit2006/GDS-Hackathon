// Dashboard JavaScript for Farm Fresh website

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is a farmer
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    if (!currentUser.isFarmer) {
        // Redirect to marketplace if not a farmer
        alert('This area is for farmers only. Redirecting to marketplace...');
        window.location.href = 'marketplace.html';
        return;
    }
    
    // Update farmer name in dashboard
    const farmerNameElements = document.querySelectorAll('.user-details h4');
    farmerNameElements.forEach(element => {
        element.textContent = currentUser.farmName || currentUser.fullname;
    });
    
    // Initialize Charts
    function initializeCharts() {
        // Monthly Sales Chart
        const salesChartCanvas = document.getElementById('salesChart');
        if (salesChartCanvas) {
            const salesChart = new Chart(salesChartCanvas, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Monthly Sales (₹)',
                        data: [3500, 4200, 5100, 4800, 5600, 6200, 5900, 6500, 7100, 7800, 8400, 9200],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '₹' + context.raw.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
            
            // Sales period change handler
            const salesPeriodSelect = document.getElementById('sales-period');
            if (salesPeriodSelect) {
                salesPeriodSelect.addEventListener('change', function() {
                    let data = [];
                    let labels = [];
                    
                    switch (this.value) {
                        case '3months':
                            labels = ['Oct', 'Nov', 'Dec'];
                            data = [7800, 8400, 9200];
                            break;
                        case '6months':
                            labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            data = [5900, 6500, 7100, 7800, 8400, 9200];
                            break;
                        default:
                            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            data = [3500, 4200, 5100, 4800, 5600, 6200, 5900, 6500, 7100, 7800, 8400, 9200];
                    }
                    
                    salesChart.data.labels = labels;
                    salesChart.data.datasets[0].data = data;
                    salesChart.update();
                });
            }
        }
        
        // Top Products Chart
        const topProductsCanvas = document.getElementById('topProductsChart');
        if (topProductsCanvas) {
            const topProductsChart = new Chart(topProductsCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Organic Tomatoes', 'Fresh Apples', 'Potatoes', 'Carrots', 'Free-Range Eggs'],
                    datasets: [{
                        data: [25, 20, 18, 15, 22],
                        backgroundColor: [
                            '#e74c3c',
                            '#2ecc71',
                            '#f39c12',
                            '#9b59b6',
                            '#3498db'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }
    
    // Initialize charts if on dashboard page
    if (document.getElementById('salesChart') || document.getElementById('topProductsChart')) {
        initializeCharts();
    }
    
    // Add Product functionality (would be on product management page)
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productName = document.getElementById('product-name').value;
            const productCategory = document.getElementById('product-category').value;
            const productPrice = document.getElementById('product-price').value;
            const productQuantity = document.getElementById('product-quantity').value;
            const productUnit = document.getElementById('product-unit').value;
            const productDescription = document.getElementById('product-description').value;
            const productStatus = document.getElementById('product-status').value;
            
            // Basic validation
            if (!productName || !productCategory || !productPrice || !productQuantity || !productUnit) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Get existing products or initialize empty array
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            
            // Create new product
            const newProduct = {
                id: 'PROD-' + Date.now(),
                name: productName,
                category: productCategory,
                price: productPrice,
                quantity: productQuantity,
                unit: productUnit,
                description: productDescription,
                status: productStatus,
                farmerId: currentUser.email,
                farmerName: currentUser.farmName || currentUser.fullname,
                createdAt: new Date().toISOString()
            };
            
            // Add to products array
            products.push(newProduct);
            
            // Save to localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Show success message
            alert('Product added successfully!');
            
            // Reset form
            addProductForm.reset();
            
            // Reload product list if it exists
            if (document.getElementById('product-list')) {
                loadProducts();
            }
        });
    }
    
    // Load Products function (for product management page)
    function loadProducts() {
        const productList = document.getElementById('product-list');
        if (!productList) return;
        
        // Get all products
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Filter products for current farmer
        const farmerProducts = products.filter(product => product.farmerId === currentUser.email);
        
        // Clear product list
        productList.innerHTML = '';
        
        if (farmerProducts.length === 0) {
            productList.innerHTML = '<tr><td colspan="7" class="text-center">No products found. Add your first product!</td></tr>';
            return;
        }
        
        // Add products to table
        farmerProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>₹${product.price}/${product.unit}</td>
                <td>${product.quantity} ${product.unit}</td>
                <td><span class="status-badge ${product.status === 'available' ? 'complete' : 'pending'}">${product.status === 'available' ? 'Available' : 'Pre-book'}</span></td>
                <td>
                    <button class="btn-icon sm edit-product" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon sm delete-product" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productList.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        const editButtons = document.querySelectorAll('.edit-product');
        const deleteButtons = document.querySelectorAll('.delete-product');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    // Populate edit form (would be a modal or separate page)
                    document.getElementById('edit-product-id').value = product.id;
                    document.getElementById('edit-product-name').value = product.name;
                    document.getElementById('edit-product-category').value = product.category;
                    document.getElementById('edit-product-price').value = product.price;
                    document.getElementById('edit-product-quantity').value = product.quantity;
                    document.getElementById('edit-product-unit').value = product.unit;
                    document.getElementById('edit-product-description').value = product.description;
                    document.getElementById('edit-product-status').value = product.status;
                    
                    // Show edit modal
                    document.getElementById('edit-product-modal').style.display = 'block';
                }
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                
                if (confirm('Are you sure you want to delete this product?')) {
                    // Remove product from array
                    const filteredProducts = products.filter(p => p.id !== productId);
                    
                    // Save updated products
                    localStorage.setItem('products', JSON.stringify(filteredProducts));
                    
                    // Reload product list
                    loadProducts();
                }
            });
        });
    }
    
    // Load products if on product management page
    if (document.getElementById('product-list')) {
        loadProducts();
    }
    
    // Additional dashboard functionality can be added here
});

// Function to generate monthly reports
function generateMonthlyReport() {
    // Get sales data (in a real app, this would come from a database)
    const salesData = {
        totalSales: 42580,
        totalOrders: 156,
        totalCustomers: 89,
        productsData: [
            { name: 'Organic Tomatoes', quantity: 325, revenue: 12500 },
            { name: 'Fresh Apples', quantity: 210, revenue: 9800 },
            { name: 'Potatoes', quantity: 420, revenue: 7200 },
            { name: 'Carrots', quantity: 180, revenue: 5400 },
            { name: 'Free-Range Eggs', quantity: 85, revenue: 7650 }
        ]
    };
    
    // Create CSV content
    let csvContent = 'Monthly Sales Report\n\n';
    csvContent += 'Total Sales,₹' + salesData.totalSales + '\n';
    csvContent += 'Total Orders,' + salesData.totalOrders + '\n';
    csvContent += 'Total Customers,' + salesData.totalCustomers + '\n\n';
    
    csvContent += 'Product,Quantity Sold,Revenue\n';
    salesData.productsData.forEach(product => {
        csvContent += `${product.name},${product.quantity},₹${product.revenue}\n`;
    });
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monthly_report.csv';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}