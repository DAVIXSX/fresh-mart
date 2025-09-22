// Fresh Mart Product Data
const CATEGORIES = {
    'vegetables': { name: 'الخضروات', icon: '🥕' },
    'fruits': { name: 'الفواكه', icon: '🍎' },
    'legumes': { name: 'البقوليات', icon: '🫘' },
    'dairy': { name: 'منتجات الألبان', icon: '🥛' },
    'bakery': { name: 'المخبوزات', icon: '🍞' },
    'beverages': { name: 'المشروبات', icon: '🥤' },
    'household': { name: 'المنظفات المنزلية', icon: '🧽' },
    'snacks': { name: 'الوجبات الخفيفة', icon: '🍿' },
    'frozen': { name: 'الأطعمة المجمدة', icon: '🧊' }
};

const PRODUCTS = [
    // الخضروات
    { id: 1, name: 'جزر طازج', category: 'vegetables', price: 2.99, image: 'carrots.jpg', description: 'جزر عضوي طازج مثالي للطبخ أو كوجبة خفيفة', stock: 50, brand: 'وادي الأخضر', nutritional_info: 'غني بفيتامين أ والألياف', featured: true, discount: 0 },
    { id: 2, name: 'فلفل رومي', category: 'vegetables', price: 3.49, image: 'bell_peppers.jpg', description: 'فلفل رومي ملون مثالي للسلطات والطبخ', stock: 30, brand: 'مزرعة طازجة', nutritional_info: 'غني بفيتامين ج', featured: false, discount: 10 },
    { id: 3, name: 'أوراق السبانخ', category: 'vegetables', price: 2.79, image: 'spinach.jpg', description: 'أوراق سبانخ طازجة مثالية للسلطات', stock: 25, brand: 'أوراق خضراء', nutritional_info: 'غني بالحديد وحمض الفوليك', featured: false, discount: 0 },
    { id: 4, name: 'طماطم كرزية', category: 'vegetables', price: 4.29, image: 'cherry_tomatoes.jpg', description: 'طماطم كرزية حلوة مثالية للوجبات الخفيفة', stock: 40, brand: 'حديقة طازجة', nutritional_info: 'غني بالليكوبين', featured: true, discount: 15 },
    { id: 5, name: 'بروكلي', category: 'vegetables', price: 3.99, image: 'broccoli.jpg', description: 'بروكلي طازج مثالي للسلق أو الشوي', stock: 20, brand: 'وادي الأخضر', nutritional_info: 'غني بفيتامين ك وج', featured: false, discount: 0 },
    
    // الفواكه
    { id: 6, name: 'تفاح جالا', category: 'fruits', price: 3.99, image: 'apples.jpg', description: 'تفاح جالا حلو ومقرمش', stock: 60, brand: 'بستان طازج', nutritional_info: 'مصدر جيد للألياف', featured: true, discount: 0 },
    { id: 7, name: 'موز', category: 'fruits', price: 1.99, image: 'bananas.jpg', description: 'موز أصفر طازج مثالي للعصائر', stock: 80, brand: 'مزارع استوائية', nutritional_info: 'غني بالبوتاسيوم', featured: true, discount: 0 },
    { id: 8, name: 'فراولة', category: 'fruits', price: 5.49, image: 'strawberries.jpg', description: 'فراولة حلوة وعصيرية', stock: 35, brand: 'أفضل توت', nutritional_info: 'غني بفيتامين ج', featured: false, discount: 20 },
    { id: 9, name: 'عبوة برتقال', category: 'fruits', price: 4.99, image: 'oranges.jpg', description: 'برتقال طازج مليء بفيتامين ج', stock: 45, brand: 'بساتين حمضيات', nutritional_info: 'مصدر ممتاز لفيتامين ج', featured: false, discount: 0 },
    { id: 10, name: 'توت أزرق', category: 'fruits', price: 6.99, image: 'blueberries.jpg', description: 'توت أزرق طازج مثالي للخبز', stock: 25, brand: 'أفضل توت', nutritional_info: 'غني بمضادات الأكسدة', featured: true, discount: 10 },
    
    // منتجات الألبان
    { id: 11, name: 'حليب كامل الدسم', category: 'dairy', price: 3.49, image: 'milk.jpg', description: 'جالون من الحليب الطازج كامل الدسم', stock: 50, brand: 'ألبان طازجة', nutritional_info: 'مصدر جيد للكالسيوم والبروتين', featured: false, discount: 0 },
    { id: 12, name: 'زبادي يوناني', category: 'dairy', price: 1.99, image: 'yogurt.jpg', description: 'زبادي يوناني كريمي بالمزارع الحية', stock: 40, brand: 'جبل عالي', nutritional_info: 'غني بالبروتين وبروبيوتيك', featured: true, discount: 15 },
    { id: 13, name: 'جبنة شيدر', category: 'dairy', price: 4.99, image: 'cheese.jpg', description: 'قالب جبنة شيدر حادة', stock: 30, brand: 'مزرعة', nutritional_info: 'غني بالكالسيوم', featured: false, discount: 0 },
    { id: 14, name: 'زبدة', category: 'dairy', price: 3.79, image: 'butter.jpg', description: 'زبدة غير مملحة للطبخ والخبز', stock: 35, brand: 'أفضل كريمة', nutritional_info: 'مصدر فيتامين أ', featured: false, discount: 0 },
    
    // المخبوزات
    { id: 15, name: 'خبز قمح كامل', category: 'bakery', price: 2.49, image: 'bread.jpg', description: 'خبز قمح كامل طازج مخبوز', stock: 20, brand: 'مخبز حرفي', nutritional_info: 'مصدر جيد للألياف', featured: false, discount: 0 },
    { id: 16, name: 'كرواسون', category: 'bakery', price: 4.99, image: 'croissants.jpg', description: 'كرواسون فرنسي بالزبدة (6 قطع)', stock: 15, brand: 'لذائذ فرنسية', nutritional_info: 'يحتوي على جلوتين', featured: true, discount: 25 },
    { id: 17, name: 'بيجل', category: 'bakery', price: 3.99, image: 'bagels.jpg', description: 'بيجل بالخلطة (6 قطع)', stock: 25, brand: 'تازج الصباح', nutritional_info: 'مصدر جيد للكربوهيدرات', featured: false, discount: 0 },
    
    // المشروبات
    { id: 18, name: 'عصير برتقال', category: 'beverages', price: 3.99, image: 'orange_juice.jpg', description: 'عصير برتقال طازج معصور', stock: 30, brand: 'حمضيات مشمسة', nutritional_info: 'غني بفيتامين ج', featured: false, discount: 0 },
    { id: 19, name: 'حبوب قهوة', category: 'beverages', price: 8.99, image: 'coffee.jpg', description: 'حبوب قهوة عربية ممتازة', stock: 40, brand: 'محمصة الجبل', nutritional_info: 'يحتوي على كافيين', featured: true, discount: 20 },
    { id: 20, name: 'شاي أخضر', category: 'beverages', price: 4.49, image: 'tea.jpg', description: 'أكياس شاي أخضر عضوي (20 عدد)', stock: 50, brand: 'حديقة زين', nutritional_info: 'غني بمضادات الأكسدة', featured: false, discount: 0 },
    
    // البقوليات
    { id: 21, name: 'فاصوليا سوداء', category: 'legumes', price: 1.99, image: 'black_beans.jpg', description: 'فاصوليا سوداء عضوية (معلبة)', stock: 60, brand: 'اختيار طبيعي', nutritional_info: 'غني بالبروتين والألياف', featured: false, discount: 0 },
    { id: 22, name: 'حمص', category: 'legumes', price: 1.79, image: 'chickpeas.jpg', description: 'حمص مثالي لعمل الحمص', stock: 45, brand: 'متوسطي', nutritional_info: 'مصدر جيد للبروتين', featured: true, discount: 10 },
    { id: 23, name: 'عدس أحمر', category: 'legumes', price: 2.49, image: 'lentils.jpg', description: 'عدس أحمر للشوربة واليخاني', stock: 35, brand: 'بقول ممتازة', nutritional_info: 'غني بالحديد والبروتين', featured: false, discount: 0 },
    
    // المنظفات المنزلية
    { id: 24, name: 'سائل جلي الصحون', category: 'household', price: 2.99, image: 'dish_soap.jpg', description: 'سائل جلي مركز برائحة الليمون', stock: 40, brand: 'نظافة مشرقة', nutritional_info: 'غير صالح للاستهلاك', featured: false, discount: 0 },
    { id: 25, name: 'مناديل ورقية', category: 'household', price: 6.99, image: 'paper_towels.jpg', description: 'مناديل ورقية فائقة الامتصاص (6 لفافات)', stock: 25, brand: 'فائق نعومة', nutritional_info: 'غير صالح للاستهلاك', featured: false, discount: 15 },
    { id: 26, name: 'منظف غسيل', category: 'household', price: 9.99, image: 'detergent.jpg', description: 'منظف غسيل برائحة منعشة', stock: 20, brand: 'ماستر الغسيل', nutritional_info: 'غير صالح للاستهلاك', featured: true, discount: 0 },
    
    // الوجبات الخفيفة
    { id: 27, name: 'رقائق بطاطس', category: 'snacks', price: 3.49, image: 'chips.jpg', description: 'رقائق بطاطس مقرمشة بملح البحر', stock: 50, brand: 'وقت القرمشة', nutritional_info: 'يحتوي على صوديوم', featured: false, discount: 0 },
    { id: 28, name: 'مكسرات مخلوطة', category: 'snacks', price: 7.99, image: 'nuts.jpg', description: 'مجموعة مكسرات ممتازة', stock: 30, brand: 'لذائذ مكسرات', nutritional_info: 'غني بالدهون الصحية', featured: true, discount: 20 },
    { id: 29, name: 'عصي جرانولا', category: 'snacks', price: 4.99, image: 'granola.jpg', description: 'عصي جرانولا لزجة (12 قطعة)', stock: 40, brand: 'بلاس طاقة', nutritional_info: 'مصدر جيد للألياف', featured: false, discount: 0 },
    
    // الأطعمة المجمدة
    { id: 30, name: 'بيتزا مجمدة', category: 'frozen', price: 5.99, image: 'pizza.jpg', description: 'بيتزا مجمدة مارجريتا', stock: 25, brand: 'طراز إيطالي', nutritional_info: 'يحتوي على جلوتين وألبان', featured: false, discount: 10 },
    { id: 31, name: 'آيس كريم', category: 'frozen', price: 4.49, image: 'ice_cream.jpg', description: 'آيس كريم فانيلا (1 باينت)', stock: 35, brand: 'أحلام كريمية', nutritional_info: 'يحتوي على ألبان', featured: true, discount: 25 },
    { id: 32, name: 'خضروات مجمدة', category: 'frozen', price: 2.99, image: 'frozen_veggies.jpg', description: 'خضروات مجمدة مخلوطة', stock: 45, brand: 'تجميد الحديقة', nutritional_info: 'مصدر جيد للفيتامينات', featured: false, discount: 0 }
];

// Utility functions
function getProductById(id) {
    return PRODUCTS.find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
    return PRODUCTS.filter(product => product.category === category);
}

function getFeaturedProducts(limit = 6) {
    return PRODUCTS.filter(product => product.featured).slice(0, limit);
}

function getDiscountedProducts(limit = 4) {
    return PRODUCTS.filter(product => product.discount > 0).slice(0, limit);
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
}
