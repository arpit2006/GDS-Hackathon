document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');

    if (!isLoggedIn || userType !== 'farmer') {
        // Redirect to login if not logged in as a farmer
        window.location.href = 'login.html';
        return;
    }

    // Get DOM elements
    const companyRequestForm = document.getElementById('company-request-form');
    const companyTypeSelect = document.getElementById('company-type');
    const productCategorySelect = document.getElementById('product-category');
    const companyItems = document.querySelectorAll('.company-item');
    
    // Handle form submission
    if (companyRequestForm) {
        companyRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(companyRequestForm);
            const requestData = {
                requestId: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
                companyType: formData.get('company-type'),
                companyName: formData.get('company-name'),
                productCategory: formData.get('product-category'),
                productName: formData.get('product-name'),
                quantity: formData.get('quantity'),
                unit: formData.get('unit'),
                priceExpected: formData.get('price-expected'),
                availableFrom: formData.get('available-from'),
                productDescription: formData.get('product-description'),
                canNegotiate: formData.get('can-negotiate') === 'on',
                canDeliver: formData.get('can-deliver') === 'on',
                status: 'pending',
                dateSubmitted: new Date().toISOString().slice(0, 10)
            };
            
            // Save request to local storage
            saveRequest(requestData);
            
            // Show success message
            showNotification('Request submitted successfully!', 'success');
            
            // Add to the table of previous requests
            addRequestToTable(requestData);
            
            // Reset form
            companyRequestForm.reset();
        });
    }
    
    // Handle company directory "Send Request" buttons
    companyItems.forEach(item => {
        const sendButton = item.querySelector('button');
        const companyName = item.querySelector('h4').textContent;
        
        if (sendButton) {
            sendButton.addEventListener('click', function() {
                // Pre-fill the form with company info
                document.getElementById('company-name').value = companyName;
                
                // Scroll to form
                document.getElementById('company-request-form').scrollIntoView({ behavior: 'smooth' });
                
                // Focus the product category field
                document.getElementById('product-category').focus();
            });
        }
    });
    
    // Function to save request to local storage
    function saveRequest(requestData) {
        let requests = JSON.parse(localStorage.getItem('companyRequests')) || [];
        requests.push(requestData);
        localStorage.setItem('companyRequests', JSON.stringify(requests));
    }
    
    // Function to add request to the table
    function addRequestToTable(request) {
        const tableBody = document.querySelector('.table tbody');
        if (!tableBody) return;
        
        const row = document.createElement('tr');
        
        // Create status badge with appropriate class
        const statusClass = request.status === 'pending' ? 'pending' : 
                          request.status === 'accepted' ? 'complete' : 'cancelled';
        
        row.innerHTML = `
            <td>${request.requestId}</td>
            <td>${request.companyName}</td>
            <td>${request.productName}</td>
            <td>${request.quantity} ${request.unit}</td>
            <td>${request.dateSubmitted}</td>
            <td><span class="status-badge ${statusClass}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></td>
            <td>
                <button class="btn-icon sm view-request" data-id="${request.requestId}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon sm edit-request" data-id="${request.requestId}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        // Insert at the beginning of the table
        tableBody.insertBefore(row, tableBody.firstChild);
        
        // Add event listeners to the new buttons
        const viewButton = row.querySelector('.view-request');
        const editButton = row.querySelector('.edit-request');
        
        viewButton.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            viewRequestDetails(requestId);
        });
        
        editButton.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            editRequest(requestId);
        });
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Add event listener to close button
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Function to view request details (placeholder - would display a modal in a real app)
    function viewRequestDetails(requestId) {
        const requests = JSON.parse(localStorage.getItem('companyRequests')) || [];
        const request = requests.find(req => req.requestId === requestId);
        
        if (request) {
            alert(`Request Details for ${requestId}:\n\nCompany: ${request.companyName}\nProduct: ${request.productName}\nQuantity: ${request.quantity} ${request.unit}\nPrice Expected: ₹${request.priceExpected}\nStatus: ${request.status}`);
        }
    }
    
    // Function to edit request (placeholder - would populate form in a real app)
    function editRequest(requestId) {
        const requests = JSON.parse(localStorage.getItem('companyRequests')) || [];
        const request = requests.find(req => req.requestId === requestId);
        
        if (request && request.status === 'pending') {
            // In a real app, you would populate the form with this data
            // For now, just let the user know it's editable
            alert(`You can edit request ${requestId}. In a complete app, the form would be populated with the request data.`);
        } else {
            showNotification('Only pending requests can be edited.', 'info');
        }
    }
    
    // Load and display existing requests from local storage
    function loadExistingRequests() {
        const requests = JSON.parse(localStorage.getItem('companyRequests')) || [];
        const tableBody = document.querySelector('.table tbody');
        
        if (tableBody) {
            // Clear existing sample rows
            tableBody.innerHTML = '';
            
            // Add saved requests
            requests.forEach(request => {
                addRequestToTable(request);
            });
            
            // If no requests exist, add sample data
            if (requests.length === 0) {
                const sampleRequests = [
                    {
                        requestId: 'REQ-001',
                        companyName: 'ABC Food Processing',
                        productName: 'Organic Wheat',
                        quantity: '500',
                        unit: 'kg',
                        dateSubmitted: '15 Mar 2023',
                        status: 'pending'
                    },
                    {
                        requestId: 'REQ-002',
                        companyName: 'XYZ Retail',
                        productName: 'Basmati Rice',
                        quantity: '1',
                        unit: 'ton',
                        dateSubmitted: '10 Mar 2023',
                        status: 'accepted'
                    },
                    {
                        requestId: 'REQ-003',
                        companyName: 'Fresh Mart',
                        productName: 'Organic Potatoes',
                        quantity: '200',
                        unit: 'kg',
                        dateSubmitted: '05 Mar 2023',
                        status: 'rejected'
                    }
                ];
                
                // Add sample requests to table
                sampleRequests.forEach(request => {
                    addRequestToTable(request);
                });
            }
        }
    }
    
    // Call function to load existing requests
    loadExistingRequests();
}); 