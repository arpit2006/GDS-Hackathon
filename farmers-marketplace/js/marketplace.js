// Marketplace JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get filter elements
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    const priceRangeInput = document.getElementById('price-range');
    const minPriceDisplay = document.getElementById('min-price');
    const maxPriceDisplay = document.getElementById('max-price');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    // Get product elements
    const productCountElement = document.getElementById('product-count');
    const productGrid = document.querySelector('.product-grid');
    
    // Track applied filters
    const filters = {
        categories: [],
        priceRange: { min: 0, max: 1000 },
        availability: ['available'],
        rating: [],
        farming: [],
        searchQuery: ''
    };
    
    // Sample products data (in a real app, this would come from the database/backend)
    const products = [
        {
            id: 1,
            name: 'Organic Tomatoes',
            farmer: 'Farms',
            price: 80,
            priceUnit: 'kg',
            category: 'vegetables',
            rating: 4.5,
            reviews: 32,
            description: 'Fresh, organically grown tomatoes perfect for salads and cooking.',
            status: 'available',
            farming: 'organic'
        },
        {
            id: 2,
            name: 'Basmati Rice',
            farmer: 'Fields',
            price: 95,
            priceUnit: 'kg',
            category: 'grains',
            rating: 4.8,
            reviews: 42,
            description: 'Premium long-grain basmati rice with authentic aroma and flavor.',
            status: 'available',
            farming: 'organic'
        },
        {
            id: 3,
            name: 'Organic Wheat',
            farmer: 'Haryana Golden Farms',
            price: 45,
            priceUnit: 'kg',
            category: 'grains',
            rating: 4.6,
            reviews: 38,
            description: 'Stone-ground organic wheat perfect for making rotis and chapatis.',
            status: 'available',
            farming: 'organic'
        },
        {
            id: 4,
            name: 'Brinjal',
            farmer: 'Golden Fields Farm',
            price: 40,
            priceUnit: 'kg',
            category: 'vegetables',
            rating: 3.5,
            reviews: 12,
            description: 'Fresh, locally grown potatoes perfect for all your cooking needs.',
            status: 'available',
            farming: 'natural'
        },
        {
            id: 5,
            name: 'Carrot',
            farmer: 'Karnataka Traditional Farms',
            price: 70,
            priceUnit: 'kg',
            category: 'grains',
            rating: 4.7,
            reviews: 29,
            description: 'Nutritious millets grown using traditional farming methods. High in fiber and protein.',
            status: 'available',
            farming: 'organic'
        },
        {
            id: 6,
            name: 'Ragi',
            farmer: 'Sunshine Organics',
            price: 60,
            priceUnit: 'kg',
            category: 'vegetables',
            rating: 4.5,
            reviews: 38,
            description: 'Organic carrots grown without pesticides. Sweet and nutritious.',
            status: 'pre-book',
            farming: 'organic'
        },
        {
            id: 7,
            name: 'Jowar ',
            farmer: 'Green Leaf Farms',
            price: 35,
            priceUnit: 'bunch',
            category: 'vegetables',
            rating: 4.4,
            reviews: 22,
            description: 'Fresh, dark green spinach leaves. Rich in iron and antioxidants.',
            status: 'available',
            farming: 'natural'
        },
        {
            id: 8,
            name: 'Ragi',
            farmer: 'Maharashtra Dry Farms',
            price: 55,
            priceUnit: 'kg',
            category: 'grains',
            rating: 4.3,
            reviews: 18,
            description: 'Traditional sorghum grain rich in nutrients and perfect for rotis.',
            status: 'available',
            farming: 'organic'
        }
    ];
    
    // Filter products based on applied filters
    function filterProducts() {
        return products.filter(product => {
            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false;
            }
            
            // Price range filter
            if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
                return false;
            }
            
            // Availability filter
            if (filters.availability.length > 0 && !filters.availability.includes(product.status)) {
                return false;
            }
            
            // Rating filter
            if (filters.rating.length > 0) {
                const minRating = Math.min(...filters.rating);
                if (product.rating < minRating) {
                    return false;
                }
            }
            
            // Farming practice filter
            if (filters.farming.length > 0 && !filters.farming.includes(product.farming)) {
                return false;
            }
            
            // Search filter
            if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    }
    
    // Sort products based on selected sort option
    function sortProducts(products) {
        const sortOption = sortSelect ? sortSelect.value : 'recommended';
        
        switch (sortOption) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...products].sort((a, b) => b.rating - a.rating);
            case 'newest':
                // In a real app, this would sort by date added
                return [...products].reverse();
            default:
                // 'recommended' - no sorting for demo purposes
                return products;
        }
    }
    
    // Update the product display with filtered and sorted products
    function updateProductDisplay() {
        const filteredProducts = filterProducts();
        const sortedProducts = sortProducts(filteredProducts);
        
        // Update product count
        if (productCountElement) {
            productCountElement.textContent = sortedProducts.length;
        }
        
        // For this demo, we'll just show/hide existing cards
        
        // Get all product cards in the DOM
        const productCards = document.querySelectorAll('.product-card');
        
        // Hide all product cards first
        productCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show cards that match filtered products
        sortedProducts.forEach((product, index) => {
            if (index < productCards.length) {
                productCards[index].style.display = 'block';
            }
        });
        
        // If no products match filters
        if (sortedProducts.length === 0 && productGrid) {
            productGrid.innerHTML = '<div class="no-results"><p>No products match your filters. Please try different criteria.</p></div>';
        } else if (productGrid && productGrid.querySelector('.no-results')) {
            productGrid.querySelector('.no-results').remove();
        }
    }
    
    // Initialize event listeners
    
    // Price range slider
    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', function() {
            const value = this.value;
            filters.priceRange.max = parseInt(value);
            
            if (maxPriceDisplay) {
                maxPriceDisplay.textContent = `₹${value}`;
            }
            
            updateProductDisplay();
        });
    }
    
    // Filter checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterType = this.name;
            const filterValue = this.value;
            
            // Update filters based on checkbox type
            switch (filterType) {
                case 'category':
                    if (this.checked) {
                        filters.categories.push(filterValue);
                    } else {
                        filters.categories = filters.categories.filter(v => v !== filterValue);
                    }
                    break;
                case 'availability':
                    if (this.checked) {
                        filters.availability.push(filterValue);
                    } else {
                        filters.availability = filters.availability.filter(v => v !== filterValue);
                    }
                    break;
                case 'rating':
                    if (this.checked) {
                        filters.rating.push(parseInt(filterValue));
                    } else {
                        filters.rating = filters.rating.filter(v => v !== parseInt(filterValue));
                    }
                    break;
                case 'farming':
                    if (this.checked) {
                        filters.farming.push(filterValue);
                    } else {
                        filters.farming = filters.farming.filter(v => v !== filterValue);
                    }
                    break;
            }
            
            updateProductDisplay();
        });
    });
    
    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            updateProductDisplay();
        });
    }
    
    // Search
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            filters.searchQuery = searchInput.value.trim();
            updateProductDisplay();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filters.searchQuery = this.value.trim();
                updateProductDisplay();
            }
        });
    }
    
    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset filters
            filters.categories = [];
            filters.availability = ['available'];
            filters.rating = [];
            filters.farming = [];
            filters.searchQuery = '';
            
            // Reset UI
            filterCheckboxes.forEach(checkbox => {
                if (checkbox.name === 'availability' && checkbox.value === 'available') {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            });
            
            if (priceRangeInput) {
                priceRangeInput.value = 1000;
                filters.priceRange.max = 1000;
                if (maxPriceDisplay) {
                    maxPriceDisplay.textContent = '₹1000';
                }
            }
            
            if (searchInput) {
                searchInput.value = '';
            }
            
            updateProductDisplay();
        });
    }
    
    // Pagination
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, this would load a different page of products
            alert(`Page ${this.textContent || 'Next'} selected`);
        });
    });
    
    // Initial display update
    updateProductDisplay();
});
