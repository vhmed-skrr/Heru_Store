const fs = require('fs');
let ar = JSON.parse(fs.readFileSync('./assets/lang/ar.json', 'utf8'));
let en = JSON.parse(fs.readFileSync('./assets/lang/en.json', 'utf8'));

Object.assign(ar, {
  'cart.breadcrumb': 'سلة المشتريات',
  'cart.title': 'عناصر السلة',
  'cart.summary_title': 'ملخص الطلب الأساسي',
  'cart.subtotal': 'المجموع الفرعي:',
  'cart.discount': 'الخصم (كوبون):',
  'cart.shipping': 'رسوم الشحن التوصيل:',
  'cart.free_shipping': 'مجاني بالكامل!',
  'cart.total': 'الإجمالي:',
  'cart.coupon_placeholder': 'لديك كود خصم؟',
  'cart.coupon_apply': 'تطبيق',
  'cart.checkout_btn': 'بدء إتمام الطلب الآن',
  'cart.empty_title': 'سلتك فارغة، أضف السعادة فيها!',
  'cart.empty_desc': 'لم تقم بشراء أي منتجات حتى الآن.',
  'cart.shop_now': 'تسوّق أحدث المنتجات',
  'cart.cookie_btn': 'موافق'
});

Object.assign(en, {
  'cart.breadcrumb': 'Shopping Cart',
  'cart.title': 'Cart Items',
  'cart.summary_title': 'Order Summary',
  'cart.subtotal': 'Subtotal:',
  'cart.discount': 'Discount (Coupon):',
  'cart.shipping': 'Delivery & Shipping:',
  'cart.free_shipping': 'Completely Free!',
  'cart.total': 'Total:',
  'cart.coupon_placeholder': 'Have a coupon code?',
  'cart.coupon_apply': 'Apply',
  'cart.checkout_btn': 'Proceed to Checkout',
  'cart.empty_title': 'Your cart is empty, add some happiness!',
  'cart.empty_desc': "You haven't added any products yet.",
  'cart.shop_now': 'Shop Latest Products',
  'cart.cookie_btn': 'Accept'
});

fs.writeFileSync('./assets/lang/ar.json', JSON.stringify(ar, null, 2));
fs.writeFileSync('./assets/lang/en.json', JSON.stringify(en, null, 2));
console.log('Cart translations injected successfully!');
