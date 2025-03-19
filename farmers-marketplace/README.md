# Kisan Bazar - किसान बाज़ार

A platform connecting farmers directly with buyers to sell their fresh produce, with a focus on traditional Indian crops and farming practices. This project was created for the GDG Hackathon.

## Features

- **User Authentication**: Separate login systems for Farmers (किसान) and Buyers (ग्राहक)
- **Product Listing**: Farmers can list their products with details and availability status
- **Marketplace**: Buyers can browse products, filter by category, and place orders
- **Farmer Dashboard**: Farmers can manage products, track orders, and generate reports
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Indian-Focused**: Specialized in traditional Indian grains and vegetables

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Storage**: JSON file-based storage (simulated database)
- **UI Components**: Font Awesome, Chart.js

## Project Structure

```
farmers-marketplace/
├── css/                       # CSS stylesheets
│   ├── style.css              # Main stylesheet
│   └── dashboard.css          # Dashboard-specific styles
├── js/                        # JavaScript files
│   ├── script.js              # Main JS file
│   ├── auth.js                # Authentication logic
│   ├── marketplace.js         # Marketplace functionality
│   └── dashboard.js           # Farmer dashboard functionality
├── images/                    # Image assets
├── backend/                   # Backend server
│   ├── server.js              # Express server
│   ├── package.json           # Backend dependencies
│   └── data/                  # JSON data storage
├── index.html                 # Home page
├── marketplace.html           # Product listing page
├── login.html                 # Login page
├── signup.html                # Registration page
├── farmer-dashboard.html      # Farmer dashboard
└── README.md                  # Project documentation
```

## How to Run

### Prerequisites

- Node.js and npm installed

### Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd farmers-marketplace
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Usage Guide

### For Farmers (किसान):

1. Register as a Farmer (select "Farmer" during signup)
2. Login to access the Farmer Dashboard
3. Add products using the Products section
4. View and manage orders in the Orders section
5. Track sales performance in the Dashboard
6. Generate reports in the Reports section

### For Buyers (ग्राहक):

1. Register as a Buyer (select "Buyer" during signup)
2. Browse products in the Marketplace
3. Filter products by category, price, and availability
4. Add products to cart and checkout
5. Track order status

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- GDG Hackathon Team 