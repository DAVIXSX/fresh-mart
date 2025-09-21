# 🛒 FreshMart - Online Supermarket Platform

A modern, responsive Flask web application for online grocery shopping with a playful yet professional design.

## ✨ Features

### 🏠 Homepage
- Dynamic hero banner with promotional sliders
- Featured products showcase
- Hot deals section with discount badges
- Category grid with colorful icons
- Newsletter subscription

### 🗂️ Categories
- 9 main categories: Vegetables, Fruits, Legumes, Dairy Products, Bakery, Beverages, Household Items, Snacks, Frozen Foods
- Advanced filtering by price, brand, and discount status
- Real-time search within categories
- Sorting options (name, price, deals)
- Mobile-responsive product grid

### 📦 Product Pages
- Detailed product information with descriptions
- Nutritional information for food items
- Stock availability indicators
- Quantity selector with validation
- Related product recommendations
- Add to cart functionality

### 🛒 Shopping Cart
- Session-based persistent cart
- Real-time quantity updates
- Price calculations with discounts
- Free shipping threshold indicator
- Remove/update item functionality
- Order summary with tax calculations

### 💳 Checkout Process
- Step-by-step checkout flow
- Contact and delivery information forms
- Multiple delivery options (standard, express, same-day)
- Payment method selection
- Form validation with real-time feedback
- Order confirmation page

### 🔍 Search & Navigation
- Global search across all products
- Category-based navigation
- Breadcrumb navigation
- Mobile-friendly hamburger menu
- Responsive design for all devices

## 🛠️ Technical Stack

- **Backend**: Flask (Python)
- **Templates**: Jinja2
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Mobile-first responsive design
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Unicode emojis for playful design

## 📁 Project Structure

```
freshmart/
├── app.py                          # Main Flask application
├── requirements.txt                # Python dependencies
├── README.md                      # This file
├── templates/                     # Jinja2 templates
│   ├── base.html                 # Base template with navigation
│   ├── index.html                # Homepage
│   ├── category.html             # Category listing page
│   ├── product.html              # Product detail page
│   ├── cart.html                 # Shopping cart
│   ├── checkout.html             # Checkout process
│   ├── order_confirmation.html   # Order confirmation
│   └── search_results.html       # Search results
└── static/                       # Static assets
    ├── css/
    │   └── style.css             # Main stylesheet
    ├── js/
    │   └── main.js               # JavaScript functionality
    └── img/                      # Image directories
        ├── icons/                # Category icons (placeholder)
        └── products/             # Product images (placeholder)
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd freshmart
   
   # Or download and extract the ZIP file
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://127.0.0.1:5000` or `http://localhost:5000`

### Alternative Flask Run Method
```bash
# Set environment variables (optional)
set FLASK_APP=app.py
set FLASK_ENV=development

# Run with flask command
flask run
```

## 🎨 Design Features

### Color Palette
- **Primary Green**: #4CAF50 (buttons, accents)
- **Secondary Orange**: #FF9800 (deals, highlights)
- **Error Red**: #F44336 (validation, alerts)
- **Warning Orange**: #FF9800 (low stock)
- **Background**: Clean whites and light grays

### Typography
- **Font Family**: Poppins (rounded, modern)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive sizing**: Scales appropriately on mobile

### Animations
- Smooth hover effects on cards and buttons
- Cart icon bounce animation on item addition
- Scroll-triggered animations for product cards
- Loading states and micro-interactions

## 📱 Responsive Design

### Mobile (768px and below)
- Collapsible navigation menu
- Single-column layout for hero section
- 2-column product grid
- Touch-friendly buttons and inputs
- Optimized forms for mobile input

### Tablet (768px - 1024px)
- Adapted grid layouts
- Optimized spacing and typography

### Desktop (1024px and above)
- Full multi-column layouts
- Hover effects and tooltips
- Large hero sections with graphics

## 🛍️ Sample Data

The application includes 32 sample products across all categories:
- **Vegetables**: Carrots, Bell Peppers, Spinach, Cherry Tomatoes, Broccoli
- **Fruits**: Apples, Bananas, Strawberries, Oranges, Blueberries
- **Dairy**: Milk, Greek Yogurt, Cheese, Butter
- **Bakery**: Bread, Croissants, Bagels
- **Beverages**: Orange Juice, Coffee, Tea
- **Legumes**: Black Beans, Chickpeas, Lentils
- **Household**: Dish Soap, Paper Towels, Detergent
- **Snacks**: Potato Chips, Mixed Nuts, Granola Bars
- **Frozen**: Pizza, Ice Cream, Vegetables

Each product includes:
- Name, brand, and description
- Price and discount information
- Stock levels
- Nutritional information (for food items)
- Category classification

## ⚙️ Configuration

### Customization Options

1. **Add your own products**: Edit the `PRODUCTS` list in `app.py`
2. **Modify categories**: Update the `CATEGORIES` dictionary
3. **Change styling**: Edit `static/css/style.css`
4. **Add functionality**: Extend `static/js/main.js`

### Product Image Setup
Replace emoji placeholders with actual images:
1. Add product images to `static/img/products/`
2. Update image references in the template files
3. Recommended image size: 400x400px for product cards

### Category Icon Setup
Replace emoji icons with custom icons:
1. Add icon files to `static/img/icons/`
2. Update icon references in templates and `app.py`
3. Recommended formats: SVG or PNG (64x64px)

## 🔧 Development Notes

### Session Management
- Cart data is stored in Flask sessions
- Sessions are permanent for better user experience
- Cart persists across browser sessions

### Security Considerations
- Form validation on both client and server side
- CSRF protection recommended for production
- Input sanitization for search queries

### Performance Optimizations
- Lazy loading for product images
- Debounced search functionality
- Optimized CSS and JavaScript delivery

## 🚀 Production Deployment

### Environment Setup
```bash
# Set production environment
export FLASK_ENV=production

# Use a proper secret key
export SECRET_KEY="your-super-secret-key-here"
```

### Recommended Enhancements for Production
1. **Database Integration**: Replace in-memory data with SQLite/PostgreSQL
2. **User Authentication**: Add login/registration system
3. **Payment Processing**: Integrate Stripe, PayPal, or similar
4. **Image Handling**: Add proper image upload and optimization
5. **Email Notifications**: Send order confirmations and updates
6. **Inventory Management**: Real-time stock tracking
7. **Admin Panel**: Product and order management interface

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in app.py or use:
   flask run --port 5001
   ```

2. **Missing Dependencies**
   ```bash
   pip install --upgrade -r requirements.txt
   ```

3. **Template Not Found**
   - Ensure templates are in the `templates/` directory
   - Check file names match exactly (case-sensitive)

4. **Static Files Not Loading**
   - Verify files are in the `static/` directory
   - Clear browser cache
   - Check file paths in templates

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Flask documentation: https://flask.palletsprojects.com/
3. Validate HTML/CSS using browser developer tools

## 📄 License

This project is provided as-is for educational and development purposes.

---

**Built with ❤️ using Flask, HTML5, CSS3, and JavaScript**

*Ready to shop fresh! 🥕🍎🥛*