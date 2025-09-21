from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'supermarket_secret_key_2023')

# بيانات المنتجات النموذجية
CATEGORIES = {
    'vegetables': {'name': 'الخضروات', 'icon': '🥕'},
    'fruits': {'name': 'الفواكه', 'icon': '🍎'},
    'legumes': {'name': 'البقوليات', 'icon': '🫘'},
    'dairy': {'name': 'منتجات الألبان', 'icon': '🥛'},
    'bakery': {'name': 'المخبوزات', 'icon': '🍞'},
    'beverages': {'name': 'المشروبات', 'icon': '🥤'},
    'household': {'name': 'المنظفات المنزلية', 'icon': '🧽'},
    'snacks': {'name': 'الوجبات الخفيفة', 'icon': '🍿'},
    'frozen': {'name': 'الأطعمة المجمدة', 'icon': '🧊'}
}

PRODUCTS = [
    # الخضروات
    {'id': 1, 'name': 'جزر طازج', 'category': 'vegetables', 'price': 2.99, 'image': 'carrots.jpg', 'description': 'جزر عضوي طازج مثالي للطبخ أو كوجبة خفيفة', 'stock': 50, 'brand': 'وادي الأخضر', 'nutritional_info': 'غني بفيتامين أ والألياف', 'featured': True, 'discount': 0},
    {'id': 2, 'name': 'فلفل رومي', 'category': 'vegetables', 'price': 3.49, 'image': 'bell_peppers.jpg', 'description': 'فلفل رومي ملون مثالي للسلطات والطبخ', 'stock': 30, 'brand': 'مزرعة طازجة', 'nutritional_info': 'غني بفيتامين ج', 'featured': False, 'discount': 10},
    {'id': 3, 'name': 'أوراق السبانخ', 'category': 'vegetables', 'price': 2.79, 'image': 'spinach.jpg', 'description': 'أوراق سبانخ طازجة مثالية للسلطات', 'stock': 25, 'brand': 'أوراق خضراء', 'nutritional_info': 'غني بالحديد وحمض الفوليك', 'featured': False, 'discount': 0},
    {'id': 4, 'name': 'طماطم كرزية', 'category': 'vegetables', 'price': 4.29, 'image': 'cherry_tomatoes.jpg', 'description': 'طماطم كرزية حلوة مثالية للوجبات الخفيفة', 'stock': 40, 'brand': 'حديقة طازجة', 'nutritional_info': 'غني بالليكوبين', 'featured': True, 'discount': 15},
    {'id': 5, 'name': 'بروكلي', 'category': 'vegetables', 'price': 3.99, 'image': 'broccoli.jpg', 'description': 'بروكلي طازج مثالي للسلق أو الشوي', 'stock': 20, 'brand': 'وادي الأخضر', 'nutritional_info': 'غني بفيتامين ك وج', 'featured': False, 'discount': 0},
    
    # الفواكه
    {'id': 6, 'name': 'تفاح جالا', 'category': 'fruits', 'price': 3.99, 'image': 'apples.jpg', 'description': 'تفاح جالا حلو ومقرمش', 'stock': 60, 'brand': 'بستان طازج', 'nutritional_info': 'مصدر جيد للألياف', 'featured': True, 'discount': 0},
    {'id': 7, 'name': 'موز', 'category': 'fruits', 'price': 1.99, 'image': 'bananas.jpg', 'description': 'موز أصفر طازج مثالي للعصائر', 'stock': 80, 'brand': 'مزارع استوائية', 'nutritional_info': 'غني بالبوتاسيوم', 'featured': True, 'discount': 0},
    {'id': 8, 'name': 'فراولة', 'category': 'fruits', 'price': 5.49, 'image': 'strawberries.jpg', 'description': 'فراولة حلوة وعصيرية', 'stock': 35, 'brand': 'أفضل توت', 'nutritional_info': 'غني بفيتامين ج', 'featured': False, 'discount': 20},
    {'id': 9, 'name': 'عبوة برتقال', 'category': 'fruits', 'price': 4.99, 'image': 'oranges.jpg', 'description': 'برتقال طازج مليء بفيتامين ج', 'stock': 45, 'brand': 'بساتين حمضيات', 'nutritional_info': 'مصدر ممتاز لفيتامين ج', 'featured': False, 'discount': 0},
    {'id': 10, 'name': 'توت أزرق', 'category': 'fruits', 'price': 6.99, 'image': 'blueberries.jpg', 'description': 'توت أزرق طازج مثالي للخبز', 'stock': 25, 'brand': 'أفضل توت', 'nutritional_info': 'غني بمضادات الأكسدة', 'featured': True, 'discount': 10},
    
    # منتجات الألبان
    {'id': 11, 'name': 'حليب كامل الدسم', 'category': 'dairy', 'price': 3.49, 'image': 'milk.jpg', 'description': 'جالون من الحليب الطازج كامل الدسم', 'stock': 50, 'brand': 'ألبان طازجة', 'nutritional_info': 'مصدر جيد للكالسيوم والبروتين', 'featured': False, 'discount': 0},
    {'id': 12, 'name': 'زبادي يوناني', 'category': 'dairy', 'price': 1.99, 'image': 'yogurt.jpg', 'description': 'زبادي يوناني كريمي بالمزارع الحية', 'stock': 40, 'brand': 'جبل عالي', 'nutritional_info': 'غني بالبروتين وبروبيوتيك', 'featured': True, 'discount': 15},
    {'id': 13, 'name': 'جبنة شيدر', 'category': 'dairy', 'price': 4.99, 'image': 'cheese.jpg', 'description': 'قالب جبنة شيدر حادة', 'stock': 30, 'brand': 'مزرعة', 'nutritional_info': 'غني بالكالسيوم', 'featured': False, 'discount': 0},
    {'id': 14, 'name': 'زبدة', 'category': 'dairy', 'price': 3.79, 'image': 'butter.jpg', 'description': 'زبدة غير مملحة للطبخ والخبز', 'stock': 35, 'brand': 'أفضل كريمة', 'nutritional_info': 'مصدر فيتامين أ', 'featured': False, 'discount': 0},
    
    # المخبوزات
    {'id': 15, 'name': 'خبز قمح كامل', 'category': 'bakery', 'price': 2.49, 'image': 'bread.jpg', 'description': 'خبز قمح كامل طازج مخبوز', 'stock': 20, 'brand': 'مخبز حرفي', 'nutritional_info': 'مصدر جيد للألياف', 'featured': False, 'discount': 0},
    {'id': 16, 'name': 'كرواسون', 'category': 'bakery', 'price': 4.99, 'image': 'croissants.jpg', 'description': 'كرواسون فرنسي بالزبدة (6 قطع)', 'stock': 15, 'brand': 'لذائذ فرنسية', 'nutritional_info': 'يحتوي على جلوتين', 'featured': True, 'discount': 25},
    {'id': 17, 'name': 'بيجل', 'category': 'bakery', 'price': 3.99, 'image': 'bagels.jpg', 'description': 'بيجل بالخلطة (6 قطع)', 'stock': 25, 'brand': 'تازج الصباح', 'nutritional_info': 'مصدر جيد للكربوهيدرات', 'featured': False, 'discount': 0},
    
    # المشروبات
    {'id': 18, 'name': 'عصير برتقال', 'category': 'beverages', 'price': 3.99, 'image': 'orange_juice.jpg', 'description': 'عصير برتقال طازج معصور', 'stock': 30, 'brand': 'حمضيات مشمسة', 'nutritional_info': 'غني بفيتامين ج', 'featured': False, 'discount': 0},
    {'id': 19, 'name': 'حبوب قهوة', 'category': 'beverages', 'price': 8.99, 'image': 'coffee.jpg', 'description': 'حبوب قهوة عربية ممتازة', 'stock': 40, 'brand': 'محمصة الجبل', 'nutritional_info': 'يحتوي على كافيين', 'featured': True, 'discount': 20},
    {'id': 20, 'name': 'شاي أخضر', 'category': 'beverages', 'price': 4.49, 'image': 'tea.jpg', 'description': 'أكياس شاي أخضر عضوي (20 عدد)', 'stock': 50, 'brand': 'حديقة زين', 'nutritional_info': 'غني بمضادات الأكسدة', 'featured': False, 'discount': 0},
    
    # Legumes
    {'id': 21, 'name': 'فاصوليا سوداء', 'category': 'legumes', 'price': 1.99, 'image': 'black_beans.jpg', 'description': 'فاصوليا سوداء عضوية (معلبة)', 'stock': 60, 'brand': 'اختيار طبيعي', 'nutritional_info': 'غني بالبروتين والألياف', 'featured': False, 'discount': 0},
    {'id': 22, 'name': 'حمص', 'category': 'legumes', 'price': 1.79, 'image': 'chickpeas.jpg', 'description': 'حمص مثالي لعمل الحمص', 'stock': 45, 'brand': 'متوسطي', 'nutritional_info': 'مصدر جيد للبروتين', 'featured': True, 'discount': 10},
    {'id': 23, 'name': 'عدس أحمر', 'category': 'legumes', 'price': 2.49, 'image': 'lentils.jpg', 'description': 'عدس أحمر للشوربة واليخاني', 'stock': 35, 'brand': 'بقول ممتازة', 'nutritional_info': 'غني بالحديد والبروتين', 'featured': False, 'discount': 0},
    
    # المنظفات المنزلية
    {'id': 24, 'name': 'سائل جلي الصحون', 'category': 'household', 'price': 2.99, 'image': 'dish_soap.jpg', 'description': 'سائل جلي مركز برائحة الليمون', 'stock': 40, 'brand': 'نظافة مشرقة', 'nutritional_info': 'غير صالح للاستهلاك', 'featured': False, 'discount': 0},
    {'id': 25, 'name': 'مناديل ورقية', 'category': 'household', 'price': 6.99, 'image': 'paper_towels.jpg', 'description': 'مناديل ورقية فائقة الامتصاص (6 لفافات)', 'stock': 25, 'brand': 'فائق نعومة', 'nutritional_info': 'غير صالح للاستهلاك', 'featured': False, 'discount': 15},
    {'id': 26, 'name': 'منظف غسيل', 'category': 'household', 'price': 9.99, 'image': 'detergent.jpg', 'description': 'منظف غسيل برائحة منعشة', 'stock': 20, 'brand': 'ماستر الغسيل', 'nutritional_info': 'غير صالح للاستهلاك', 'featured': True, 'discount': 0},
    
    # الوجبات الخفيفة
    {'id': 27, 'name': 'رقائق بطاطس', 'category': 'snacks', 'price': 3.49, 'image': 'chips.jpg', 'description': 'رقائق بطاطس مقرمشة بملح البحر', 'stock': 50, 'brand': 'وقت القرمشة', 'nutritional_info': 'يحتوي على صوديوم', 'featured': False, 'discount': 0},
    {'id': 28, 'name': 'مكسرات مخلوطة', 'category': 'snacks', 'price': 7.99, 'image': 'nuts.jpg', 'description': 'مجموعة مكسرات ممتازة', 'stock': 30, 'brand': 'لذائذ مكسرات', 'nutritional_info': 'غني بالدهون الصحية', 'featured': True, 'discount': 20},
    {'id': 29, 'name': 'عصي جرانولا', 'category': 'snacks', 'price': 4.99, 'image': 'granola.jpg', 'description': 'عصي جرانولا لزجة (12 قطعة)', 'stock': 40, 'brand': 'بلاس طاقة', 'nutritional_info': 'مصدر جيد للألياف', 'featured': False, 'discount': 0},
    
    # الأطعمة المجمدة
    {'id': 30, 'name': 'بيتزا مجمدة', 'category': 'frozen', 'price': 5.99, 'image': 'pizza.jpg', 'description': 'بيتزا مجمدة مارجريتا', 'stock': 25, 'brand': 'طراز إيطالي', 'nutritional_info': 'يحتوي على جلوتين وألبان', 'featured': False, 'discount': 10},
    {'id': 31, 'name': 'آيس كريم', 'category': 'frozen', 'price': 4.49, 'image': 'ice_cream.jpg', 'description': 'آيس كريم فانيلا (1 باينت)', 'stock': 35, 'brand': 'أحلام كريمية', 'nutritional_info': 'يحتوي على ألبان', 'featured': True, 'discount': 25},
    {'id': 32, 'name': 'خضروات مجمدة', 'category': 'frozen', 'price': 2.99, 'image': 'frozen_veggies.jpg', 'description': 'خضروات مجمدة مخلوطة', 'stock': 45, 'brand': 'تجميد الحديقة', 'nutritional_info': 'مصدر جيد للفيتامينات', 'featured': False, 'discount': 0}
]

def get_cart():
    """Get cart from session or create empty cart"""
    if 'cart' not in session:
        session['cart'] = {}
    return session['cart']

def get_cart_total():
    """Calculate total cart value"""
    cart = get_cart()
    total = 0
    for product_id, quantity in cart.items():
        product = next((p for p in PRODUCTS if p['id'] == int(product_id)), None)
        if product:
            discounted_price = product['price'] * (1 - product['discount'] / 100)
            total += discounted_price * quantity
    return round(total, 2)

def get_cart_count():
    """Get total number of items in cart"""
    cart = get_cart()
    return sum(cart.values())

@app.route('/')
def index():
    """Homepage with featured products and categories"""
    featured_products = [p for p in PRODUCTS if p['featured']][:6]
    discounted_products = [p for p in PRODUCTS if p['discount'] > 0][:4]
    return render_template('index.html', 
                         categories=CATEGORIES, 
                         featured_products=featured_products,
                         discounted_products=discounted_products,
                         cart_count=get_cart_count())

@app.route('/category/<category_name>')
def category(category_name):
    """Category page with products, filters, and search"""
    if category_name not in CATEGORIES:
        return redirect(url_for('index'))
    
    category_products = [p for p in PRODUCTS if p['category'] == category_name]
    
    # Handle search
    search_query = request.args.get('search', '').lower()
    if search_query:
        category_products = [p for p in category_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Handle filters
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    brand_filter = request.args.get('brand', '')
    discount_only = request.args.get('discount_only', '') == 'on'
    
    if min_price is not None:
        category_products = [p for p in category_products if p['price'] >= min_price]
    if max_price is not None:
        category_products = [p for p in category_products if p['price'] <= max_price]
    if brand_filter:
        category_products = [p for p in category_products if p['brand'].lower() == brand_filter.lower()]
    if discount_only:
        category_products = [p for p in category_products if p['discount'] > 0]
    
    # Handle sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        category_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        category_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'discount':
        category_products.sort(key=lambda x: x['discount'], reverse=True)
    else:
        category_products.sort(key=lambda x: x['name'])
    
    # Get unique brands for filter dropdown
    brands = sorted(list(set(p['brand'] for p in PRODUCTS if p['category'] == category_name)))
    
    return render_template('category.html', 
                         category=CATEGORIES[category_name], 
                         products=category_products,
                         brands=brands,
                         current_filters={
                             'search': search_query,
                             'min_price': min_price,
                             'max_price': max_price,
                             'brand': brand_filter,
                             'discount_only': discount_only,
                             'sort': sort_by
                         },
                         cart_count=get_cart_count())

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    """Product detail page with category-specific design"""
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if not product:
        return redirect(url_for('index'))
    
    # Get similar products (same category, different product)
    similar_products = [p for p in PRODUCTS 
                       if p['category'] == product['category'] and p['id'] != product_id][:4]
    
    # Determine template based on category
    category = product['category']
    template_mapping = {
        'vegetables': 'product_vegetables.html',
        'fruits': 'product_fruits.html',
        'dairy': 'product_dairy.html',
        'bakery': 'product_bakery.html',
        'beverages': 'product_beverages.html',
        'household': 'product_household.html',
        'snacks': 'product_snacks.html',
        'legumes': 'product_legumes.html',
        'frozen': 'product_frozen.html'
    }
    
    template = template_mapping.get(category, 'product.html')
    
    return render_template(template, 
                         product=product, 
                         similar_products=similar_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/cart')
def cart():
    """Shopping cart page"""
    cart = get_cart()
    cart_items = []
    
    for product_id, quantity in cart.items():
        product = next((p for p in PRODUCTS if p['id'] == int(product_id)), None)
        if product:
            discounted_price = product['price'] * (1 - product['discount'] / 100)
            cart_items.append({
                'product': product,
                'quantity': quantity,
                'discounted_price': round(discounted_price, 2),
                'total_price': round(discounted_price * quantity, 2)
            })
    
    total = get_cart_total()
    return render_template('cart.html', 
                         cart_items=cart_items, 
                         total=total,
                         cart_count=get_cart_count())

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    """Add product to cart"""
    product_id = request.form.get('product_id')
    quantity = int(request.form.get('quantity', 1))
    
    if product_id:
        cart = get_cart()
        cart[product_id] = cart.get(product_id, 0) + quantity
        session['cart'] = cart
        session.permanent = True
        
        # Return JSON for AJAX requests
        if request.headers.get('Content-Type') == 'application/x-www-form-urlencoded' or request.is_json:
            return jsonify({
                'success': True,
                'message': 'تم إضافة المنتج إلى عربة التسوق',
                'cart_count': get_cart_count()
            })
    
    return redirect(request.referrer or url_for('index'))

@app.route('/update_cart', methods=['POST'])
def update_cart():
    """Update cart quantities"""
    cart = get_cart()
    
    for product_id in cart.keys():
        quantity = request.form.get(f'quantity_{product_id}', type=int)
        if quantity is not None:
            if quantity <= 0:
                del cart[product_id]
            else:
                cart[product_id] = quantity
    
    session['cart'] = cart
    return redirect(url_for('cart'))

@app.route('/remove_from_cart/<product_id>')
def remove_from_cart(product_id):
    """Remove product from cart"""
    cart = get_cart()
    if product_id in cart:
        del cart[product_id]
        session['cart'] = cart
    return redirect(url_for('cart'))

@app.route('/checkout')
def checkout():
    """Checkout page"""
    cart = get_cart()
    if not cart:
        return redirect(url_for('cart'))
    
    cart_items = []
    for product_id, quantity in cart.items():
        product = next((p for p in PRODUCTS if p['id'] == int(product_id)), None)
        if product:
            discounted_price = product['price'] * (1 - product['discount'] / 100)
            cart_items.append({
                'product': product,
                'quantity': quantity,
                'discounted_price': round(discounted_price, 2),
                'total_price': round(discounted_price * quantity, 2)
            })
    
    total = get_cart_total()
    return render_template('checkout.html', 
                         cart_items=cart_items, 
                         total=total,
                         cart_count=get_cart_count())

@app.route('/place_order', methods=['POST'])
def place_order():
    """Process order and clear cart"""
    # In a real app, you would process payment here
    session['cart'] = {}
    return render_template('order_confirmation.html')

@app.route('/dairy')
def dairy():
    """Dairy page with enhanced filtering and high-quality design"""
    # Get all dairy products
    dairy_products = [p for p in PRODUCTS if p['category'] == 'dairy']
    
    # Add dairy-specific data for enhanced display
    for product in dairy_products:
        # Add nutrients information based on dairy type
        if 'حليب' in product['name']:
            product['nutrients'] = ['كالسيوم', 'بروتين', 'فيتامين د']
        elif 'زبادي' in product['name']:
            product['nutrients'] = ['بروبيوتيك', 'بروتين', 'كالسيوم']
        elif 'جبنة' in product['name']:
            product['nutrients'] = ['كالسيوم', 'بروتين', 'فوسفور']
        elif 'زبدة' in product['name']:
            product['nutrients'] = ['فيتامين أ', 'دهون صحية', 'طاقة']
        else:
            product['nutrients'] = ['كالسيوم', 'بروتين', 'فيتامينات']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        dairy_products = [p for p in dairy_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        dairy_products = [p for p in dairy_products if p['price'] <= 5]
    elif price_range == '5-10':
        dairy_products = [p for p in dairy_products if 5 < p['price'] <= 10]
    elif price_range == '10+':
        dairy_products = [p for p in dairy_products if p['price'] > 10]
    
    # Dairy type filter
    dairy_type = request.args.get('dairy_type', '')
    if dairy_type == 'milk':
        dairy_products = [p for p in dairy_products if 'حليب' in p['name']]
    elif dairy_type == 'cheese':
        dairy_products = [p for p in dairy_products if 'جبنة' in p['name']]
    elif dairy_type == 'yogurt':
        dairy_products = [p for p in dairy_products if 'زبادي' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        dairy_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        dairy_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        dairy_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        dairy_products.sort(key=lambda x: x['name'])
    
    return render_template('dairy.html', 
                         dairies=dairy_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/legumes')
def legumes():
    """Legumes page with enhanced filtering and high-quality design"""
    # Get all legume products
    legume_products = [p for p in PRODUCTS if p['category'] == 'legumes']
    
    # Add legume-specific data for enhanced display
    for product in legume_products:
        # Add nutrients information based on legume type
        if 'فاصوليا' in product['name']:
            product['nutrients'] = ['بروتين', 'ألياف', 'حديد']
        elif 'حمص' in product['name']:
            product['nutrients'] = ['بروتين', 'فولات', 'ماغنيزيوم']
        elif 'عدس' in product['name']:
            product['nutrients'] = ['بروتين', 'حديد', 'فولات']
        else:
            product['nutrients'] = ['بروتين', 'ألياف', 'معادن']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        legume_products = [p for p in legume_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        legume_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        legume_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        legume_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        legume_products.sort(key=lambda x: x['name'])
    
    return render_template('legumes.html', 
                         legumes=legume_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/fruits')
def fruits():
    """Fruits page with enhanced filtering and high-quality design"""
    # Get all fruit products
    fruit_products = [p for p in PRODUCTS if p['category'] == 'fruits']
    
    # Add fruit-specific data for enhanced display
    for product in fruit_products:
        # Add nutrients information based on fruit type
        if 'تفاح' in product['name']:
            product['nutrients'] = ['فيتامين ج', 'ألياف', 'بوتاسيوم']
        elif 'موز' in product['name']:
            product['nutrients'] = ['بوتاسيوم', 'فيتامين ب١', 'ماغنيزيوم']
        elif 'فراولة' in product['name']:
            product['nutrients'] = ['فيتامين ج', 'مضادات أكسدة', 'حمض الفوليك']
        elif 'برتقال' in product['name']:
            product['nutrients'] = ['فيتامين ج', 'كالسيوم', 'ألياف']
        elif 'توت' in product['name']:
            product['nutrients'] = ['مضادات أكسدة', 'فيتامين هـ', 'أنثوسيانين']
        else:
            product['nutrients'] = ['فيتامينات', 'معادن', 'ألياف']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        fruit_products = [p for p in fruit_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        fruit_products = [p for p in fruit_products if p['price'] <= 5]
    elif price_range == '5-10':
        fruit_products = [p for p in fruit_products if 5 < p['price'] <= 10]
    elif price_range == '10+':
        fruit_products = [p for p in fruit_products if p['price'] > 10]
    
    # Fruit type filter
    fruit_type = request.args.get('fruit_type', '')
    if fruit_type == 'citrus':
        fruit_products = [p for p in fruit_products if 'برتقال' in p['name'] or 'ليمون' in p['name']]
    elif fruit_type == 'tropical':
        fruit_products = [p for p in fruit_products if 'موز' in p['name'] or 'مانجو' in p['name']]
    elif fruit_type == 'berries':
        fruit_products = [p for p in fruit_products if 'توت' in p['name'] or 'فراولة' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        fruit_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        fruit_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        fruit_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        fruit_products.sort(key=lambda x: x['name'])
    
    # Count fruits for stats
    fruits_count = len([p for p in PRODUCTS if p['category'] == 'fruits'])
    
    return render_template('fruits.html', 
                         fruits=fruit_products,
                         fruits_count=fruits_count,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/vegetables')
def vegetables():
    """Vegetables page with enhanced filtering and high-quality design"""
    # Get all vegetable products
    vegetable_products = [p for p in PRODUCTS if p['category'] == 'vegetables']
    
    # Add vegetable-specific data for enhanced display
    for product in vegetable_products:
        # Add emoji based on product name
        if 'جزر' in product['name']:
            product['emoji'] = '🥕'
        elif 'فلفل' in product['name']:
            product['emoji'] = '🌶️'
        elif 'سبانخ' in product['name']:
            product['emoji'] = '🥬'
        elif 'طماطم' in product['name']:
            product['emoji'] = '🍅'
        elif 'بروكلي' in product['name']:
            product['emoji'] = '🥦'
        else:
            product['emoji'] = '🥬'
        
        # Add nutrients information
        if 'جزر' in product['name']:
            product['nutrients'] = ['فيتامين أ', 'ألياف', 'بيتا كاروتين']
        elif 'فلفل' in product['name']:
            product['nutrients'] = ['فيتامين ج', 'مضادات أكسدة', 'كابسايسين']
        elif 'سبانخ' in product['name']:
            product['nutrients'] = ['حديد', 'حمض فوليك', 'فيتامين ك']
        elif 'طماطم' in product['name']:
            product['nutrients'] = ['ليكوبين', 'فيتامين ج', 'بوتاسيوم']
        elif 'بروكلي' in product['name']:
            product['nutrients'] = ['فيتامين ك', 'فيتامين ج', 'ألياف']
        else:
            product['nutrients'] = ['فيتامينات', 'معادن', 'ألياف']
        
        # Set organic status based on brand
        product['organic'] = 'عضوي' in product.get('description', '') or product.get('brand', '') == 'وادي الأخضر'
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        vegetable_products = [p for p in vegetable_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        vegetable_products = [p for p in vegetable_products if p['price'] <= 5]
    elif price_range == '5-10':
        vegetable_products = [p for p in vegetable_products if 5 < p['price'] <= 10]
    elif price_range == '10+':
        vegetable_products = [p for p in vegetable_products if p['price'] > 10]
    
    # Vegetable type filter
    vegetable_type = request.args.get('vegetable_type', '')
    if vegetable_type == 'leafy':
        vegetable_products = [p for p in vegetable_products if 'سبانخ' in p['name'] or 'خس' in p['name']]
    elif vegetable_type == 'root':
        vegetable_products = [p for p in vegetable_products if 'جزر' in p['name'] or 'فجل' in p['name']]
    elif vegetable_type == 'fruit':
        vegetable_products = [p for p in vegetable_products if 'طماطم' in p['name'] or 'فلفل' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        vegetable_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        vegetable_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        vegetable_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        vegetable_products.sort(key=lambda x: x['name'])
    
    # Count vegetables for stats
    vegetables_count = len([p for p in PRODUCTS if p['category'] == 'vegetables'])
    
    return render_template('vegetables.html', 
                         vegetables=vegetable_products,
                         vegetables_count=vegetables_count,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/bakery')
def bakery():
    """Bakery page with enhanced filtering and high-quality design"""
    # Get all bakery products
    bakery_products = [p for p in PRODUCTS if p['category'] == 'bakery']
    
    # Add bakery-specific data for enhanced display
    for product in bakery_products:
        # Add nutrients information based on bakery type
        if 'خبز' in product['name']:
            product['nutrients'] = ['ألياف', 'كربوهيدرات', 'فيتامين ب']
        elif 'كرواسون' in product['name']:
            product['nutrients'] = ['دهون صحية', 'طاقة', 'فيتامين أ']
        elif 'بيجل' in product['name']:
            product['nutrients'] = ['كربوهيدرات', 'بروتين', 'طاقة']
        else:
            product['nutrients'] = ['كربوهيدرات', 'طاقة', 'ألياف']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        bakery_products = [p for p in bakery_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        bakery_products = [p for p in bakery_products if p['price'] <= 5]
    elif price_range == '5-10':
        bakery_products = [p for p in bakery_products if 5 < p['price'] <= 10]
    elif price_range == '10+':
        bakery_products = [p for p in bakery_products if p['price'] > 10]
    
    # Bakery type filter
    bakery_type = request.args.get('bakery_type', '')
    if bakery_type == 'bread':
        bakery_products = [p for p in bakery_products if 'خبز' in p['name']]
    elif bakery_type == 'pastry':
        bakery_products = [p for p in bakery_products if 'كرواسون' in p['name'] or 'بيجل' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        bakery_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        bakery_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        bakery_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        bakery_products.sort(key=lambda x: x['name'])
    
    return render_template('bakery.html', 
                         bakeries=bakery_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/beverages')
def beverages():
    """Beverages page with enhanced filtering and high-quality design"""
    # Get all beverage products
    beverage_products = [p for p in PRODUCTS if p['category'] == 'beverages']
    
    # Add beverage-specific data for enhanced display
    for product in beverage_products:
        # Add nutrients information based on beverage type
        if 'عصير' in product['name']:
            product['nutrients'] = ['فيتامين ج', 'مضادات أكسدة', 'ألياف']
        elif 'قهوة' in product['name']:
            product['nutrients'] = ['كافيين', 'مضادات أكسدة', 'طاقة']
        elif 'شاي' in product['name']:
            product['nutrients'] = ['مضادات أكسدة', 'تهدئة', 'فيتامينات']
        else:
            product['nutrients'] = ['منعش', 'طاقة', 'فيتامينات']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        beverage_products = [p for p in beverage_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        beverage_products = [p for p in beverage_products if p['price'] <= 5]
    elif price_range == '5-15':
        beverage_products = [p for p in beverage_products if 5 < p['price'] <= 15]
    elif price_range == '15+':
        beverage_products = [p for p in beverage_products if p['price'] > 15]
    
    # Beverage type filter
    beverage_type = request.args.get('beverage_type', '')
    if beverage_type == 'juice':
        beverage_products = [p for p in beverage_products if 'عصير' in p['name']]
    elif beverage_type == 'coffee':
        beverage_products = [p for p in beverage_products if 'قهوة' in p['name']]
    elif beverage_type == 'tea':
        beverage_products = [p for p in beverage_products if 'شاي' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        beverage_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        beverage_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        beverage_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        beverage_products.sort(key=lambda x: x['name'])
    
    return render_template('beverages.html', 
                         beverages=beverage_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/household')
def household():
    """Household page with enhanced filtering and high-quality design"""
    # Get all household products
    household_products = [p for p in PRODUCTS if p['category'] == 'household']
    
    # Add household-specific data for enhanced display
    for product in household_products:
        # Add features information based on household type
        if 'جلي' in product['name']:
            product['features'] = ['مضاد للبكتيريا', 'رائحة منعشة', 'لطيف على اليدين']
        elif 'مناديل' in product['name']:
            product['features'] = ['فائق الامتصاص', 'ناعم', 'متين']
        elif 'منظف' in product['name']:
            product['features'] = ['إزالة البقع', 'حماية الألوان', 'رائحة طازجة']
        else:
            product['features'] = ['عالي الجودة', 'فعال', 'آمن للاستخدام']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        household_products = [p for p in household_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        household_products = [p for p in household_products if p['price'] <= 5]
    elif price_range == '5-15':
        household_products = [p for p in household_products if 5 < p['price'] <= 15]
    elif price_range == '15+':
        household_products = [p for p in household_products if p['price'] > 15]
    
    # Household type filter
    household_type = request.args.get('household_type', '')
    if household_type == 'cleaning':
        household_products = [p for p in household_products if 'جلي' in p['name'] or 'منظف' in p['name']]
    elif household_type == 'paper':
        household_products = [p for p in household_products if 'مناديل' in p['name']]
    elif household_type == 'detergent':
        household_products = [p for p in household_products if 'منظف غسيل' in p['name'] or 'مسحوق' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        household_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        household_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        household_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        household_products.sort(key=lambda x: x['name'])
    
    return render_template('household.html', 
                         household_products=household_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/snacks')
def snacks():
    """Snacks page with enhanced filtering and high-quality design"""
    # Get all snack products
    snack_products = [p for p in PRODUCTS if p['category'] == 'snacks']
    
    # Add snack-specific data for enhanced display
    for product in snack_products:
        # Add characteristics information based on snack type
        if 'رقائق' in product['name']:
            product['characteristics'] = ['مقرمش', 'مملح', 'طبيعي']
        elif 'مكسرات' in product['name']:
            product['characteristics'] = ['دهون صحية', 'بروتين', 'طاقة']
        elif 'جرانولا' in product['name']:
            product['characteristics'] = ['ألياف', 'طاقة', 'إفطار صحي']
        else:
            product['characteristics'] = ['لذيذ', 'مقرمش', 'مغذي']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        snack_products = [p for p in snack_products 
                           if search_query in p['name'].lower() or 
                              search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        snack_products = [p for p in snack_products if p['price'] <= 5]
    elif price_range == '5-10':
        snack_products = [p for p in snack_products if 5 < p['price'] <= 10]
    elif price_range == '10+':
        snack_products = [p for p in snack_products if p['price'] > 10]
    
    # Snack type filter
    snack_type = request.args.get('snack_type', '')
    if snack_type == 'chips':
        snack_products = [p for p in snack_products if 'رقائق' in p['name']]
    elif snack_type == 'nuts':
        snack_products = [p for p in snack_products if 'مكسرات' in p['name']]
    elif snack_type == 'granola':
        snack_products = [p for p in snack_products if 'جرانولا' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        snack_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        snack_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        snack_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        snack_products.sort(key=lambda x: x['name'])
    
    return render_template('snacks.html', 
                         snacks=snack_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/frozen')
def frozen():
    """Frozen products page with enhanced filtering and high-quality design"""
    # Get all frozen products
    frozen_products = [p for p in PRODUCTS if p['category'] == 'frozen']
    
    # Add frozen-specific data for enhanced display
    for product in frozen_products:
        # Add characteristics information based on frozen type
        if 'بيتزا' in product['name']:
            product['characteristics'] = ['سهل التحضير', 'لذيذ', 'مكونات طازجة']
        elif 'آيس كريم' in product['name']:
            product['characteristics'] = ['كريمي', 'منعش', 'طبيعي']
        elif 'خضروات' in product['name']:
            product['characteristics'] = ['مجمد طازج', 'غني بالفيتامينات', 'سهل الطبخ']
        else:
            product['characteristics'] = ['مجمد طازج', 'جودة عالية', 'محفوظ بعناية']
    
    # Handle search and filters
    search_query = request.args.get('search', '').lower()
    if search_query:
        frozen_products = [p for p in frozen_products 
                          if search_query in p['name'].lower() or 
                             search_query in p['description'].lower()]
    
    # Price range filter
    price_range = request.args.get('price_range', '')
    if price_range == '0-5':
        frozen_products = [p for p in frozen_products if p['price'] <= 5]
    elif price_range == '5-10':
        frozen_products = [p for p in frozen_products if 5 < p['price'] <= 10]
    elif price_range == '10+':
        frozen_products = [p for p in frozen_products if p['price'] > 10]
    
    # Frozen type filter
    frozen_type = request.args.get('frozen_type', '')
    if frozen_type == 'meals':
        frozen_products = [p for p in frozen_products if 'بيتزا' in p['name']]
    elif frozen_type == 'desserts':
        frozen_products = [p for p in frozen_products if 'آيس كريم' in p['name']]
    elif frozen_type == 'vegetables':
        frozen_products = [p for p in frozen_products if 'خضروات' in p['name']]
    
    # Sorting
    sort_by = request.args.get('sort', 'name')
    if sort_by == 'price_low':
        frozen_products.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high':
        frozen_products.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'popularity':
        frozen_products.sort(key=lambda x: (x['featured'], -x['stock']), reverse=True)
    else:
        frozen_products.sort(key=lambda x: x['name'])
    
    return render_template('frozen.html', 
                         frozen_products=frozen_products,
                         categories=CATEGORIES,
                         cart_count=get_cart_count())

@app.route('/search')
def search():
    """Global search functionality"""
    query = request.args.get('q', '').lower()
    if not query:
        return redirect(url_for('index'))
    
    results = [p for p in PRODUCTS 
               if query in p['name'].lower() or 
                  query in p['description'].lower() or
                  query in p['brand'].lower()]
    
    return render_template('search_results.html', 
                         query=query, 
                         results=results,
                         cart_count=get_cart_count())

# API endpoint for AJAX requests
@app.route('/api/cart/count')
def api_cart_count():
    """API endpoint to get cart count"""
    return jsonify({'count': get_cart_count()})

@app.context_processor
def inject_cart_count():
    """Make cart count available in all templates"""
    return {'cart_count': get_cart_count()}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
