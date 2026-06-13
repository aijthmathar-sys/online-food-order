import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  User, 
  Utensils, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  ChefHat,
  ArrowLeft,
  Star,
  Search,
  Percent,
  MapPin,
  CreditCard,
  Smartphone,
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';

const ORDER_API = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8081/api/orders';

const HOTELS = [
  {
    id: 'h1',
    name: 'The Grand Taj Hotel',
    cuisine: 'Mughlai, Biryani, Kebabs',
    rating: 4.5,
    deliveryTime: '25 mins',
    distance: 2.5,
    avgPrice: '₹350 for two',
    discount: '60% OFF up to ₹120',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVeg: false,
    menu: [
      { id: 't1', name: 'Special Mutton Biryani', price: 280, rating: 4.8, isVeg: false, description: 'Richly flavored aromatic rice layered with marinated mutton pieces and spices.', bestSeller: true },
      { id: 't2', name: 'Butter Chicken Masala', price: 240, rating: 4.6, isVeg: false, description: 'Classic tender chicken pieces cooked in a creamy spiced tomato gravy.' },
      { id: 't3', name: 'Garlic Butter Naan', price: 60, rating: 4.4, isVeg: true, description: 'Soft tandoori flatbread brushed with garlic and butter.' },
      { id: 't4', name: 'Mango Lassi Premium', price: 80, rating: 4.7, isVeg: true, description: 'Creamy yogurt drink blended with sweet mango pulp.', bestSeller: true }
    ]
  },
  {
    id: 'h2',
    name: 'Saravana Bhavan Hotel',
    cuisine: 'South Indian, Pure Veg',
    rating: 4.7,
    deliveryTime: '15 mins',
    distance: 1.2,
    avgPrice: '₹200 for two',
    discount: '20% OFF | Use code GOURMET20',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVeg: true,
    menu: [
      { id: 's1', name: 'Ghee Podi Masala Dosa', price: 120, rating: 4.9, isVeg: true, description: 'Crispy crepe layered with spicy podi powder, ghee, and potato mash.', bestSeller: true },
      { id: 's2', name: 'Steamed Idli Sambhar (2 Pcs)', price: 70, rating: 4.5, isVeg: true, description: 'Piping hot fluffy rice cakes served with traditional lentil sambhar and chutneys.' },
      { id: 's3', name: 'Mylapore Filter Coffee', price: 45, rating: 4.8, isVeg: true, description: 'Authentic decoction coffee brewed with milk and chicory blend.', bestSeller: true },
      { id: 's4', name: 'Saffron Rava Kesari', price: 90, rating: 4.3, isVeg: true, description: 'Sweet semolina pudding cooked with saffron, ghee, and roasted cashews.' }
    ]
  },
  {
    id: 'h3',
    name: 'Royal Punjab Hotel',
    cuisine: 'North Indian, Punjabi Thali',
    rating: 4.3,
    deliveryTime: '30 mins',
    distance: 3.8,
    avgPrice: '₹300 for two',
    discount: 'Buy 1 Get 1 Free on Select items',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVeg: false,
    menu: [
      { id: 'p1', name: 'Paneer Butter Masala', price: 210, rating: 4.6, isVeg: true, description: 'Fresh cottage cheese cubes simmered in a rich tomato, cashew, and cream gravy.', bestSeller: true },
      { id: 'p2', name: 'Slow-Cooked Dal Makhani', price: 180, rating: 4.7, isVeg: true, description: 'Black lentils and kidney beans cooked overnight with butter and fresh cream.' },
      { id: 'p3', name: 'Amritsari Kulcha with Chole', price: 160, rating: 4.5, isVeg: true, description: 'Crispy stuffed flatbread served with spicy chickpea curry.', bestSeller: true },
      { id: 'p4', name: 'Gulab Jamun Thali (2 Pcs)', price: 70, rating: 4.4, isVeg: true, description: 'Deep-fried milk dumplings soaked in warm cardamom sugar syrup.' }
    ]
  },
  {
    id: 'h4',
    name: 'Gourmet Express Kitchen',
    cuisine: 'American Burgers, Fast Food',
    rating: 4.6,
    deliveryTime: '20 mins',
    distance: 1.8,
    avgPrice: '₹400 for two',
    discount: '₹125 OFF | Code SWIGGY125',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVeg: false,
    menu: [
      { id: 'b1', name: 'Truffle Glazed Burger', price: 349, rating: 4.8, isVeg: false, description: 'Premium chicken patty glazed with white truffle oil, melted cheese, and fresh greens.', bestSeller: true },
      { id: 'b2', name: 'Crispy Sweet Potato Fries', price: 129, rating: 4.4, isVeg: true, description: 'Golden, crispy sweet potato fries tossed in mild peri-peri seasoning.' },
      { id: 'b3', name: 'Double Chocolate Fudge Milkshake', price: 179, rating: 4.6, isVeg: true, description: 'Rich chocolate milkshake blended with chunks of fudge cake.' },
      { id: 'b4', name: 'Buffalo Chicken Wings (6 Pcs)', price: 249, rating: 4.7, isVeg: false, description: 'Crispy chicken wings tossed in hot buffalo sauce and served with ranch dip.', bestSeller: true }
    ]
  }
];

export default function App() {
  // Portal State: 'customer' or 'restaurant'
  const [portal, setPortal] = useState(() => {
    try {
      const stored = localStorage.getItem('gourmet_express_portal');
      return stored === 'restaurant' ? 'restaurant' : 'customer';
    } catch {
      return 'customer';
    }
  });

  useEffect(() => {
    localStorage.setItem('gourmet_express_portal', portal);
  }, [portal]);

  // Hotels list state (seeded with HOTELS default if empty)
  const [hotels, setHotels] = useState(() => {
    try {
      const stored = localStorage.getItem('gourmet_express_hotels');
      return stored ? JSON.parse(stored) : HOTELS;
    } catch {
      return HOTELS;
    }
  });

  useEffect(() => {
    localStorage.setItem('gourmet_express_hotels', JSON.stringify(hotels));
  }, [hotels]);

  // Registered Restaurant accounts state
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const stored = localStorage.getItem('gourmet_express_restaurants');
      if (stored) return JSON.parse(stored);
      
      const defaults = [
        { email: 'taj@example.com', password: 'password123', name: 'The Grand Taj Hotel', cuisine: 'Mughlai, Biryani, Kebabs', isVeg: false, mobile: '9876543211', address: 'HSR Layout, Bangalore' },
        { email: 'saravana@example.com', password: 'password123', name: 'Saravana Bhavan Hotel', cuisine: 'South Indian, Pure Veg', isVeg: true, mobile: '9876543212', address: 'Koramangala, Bangalore' },
        { email: 'punjab@example.com', password: 'password123', name: 'Royal Punjab Hotel', cuisine: 'North Indian, Punjabi Thali', isVeg: false, mobile: '9876543213', address: 'Indiranagar, Bangalore' },
        { email: 'gourmet@example.com', password: 'password123', name: 'Gourmet Express Kitchen', cuisine: 'American Burgers, Fast Food', isVeg: false, mobile: '9876543214', address: 'Whitefield, Bangalore' }
      ];
      localStorage.setItem('gourmet_express_restaurants', JSON.stringify(defaults));
      return defaults;
    } catch {
      return [];
    }
  });

  // Current Logged-in Restaurant Session
  const [currentRestaurant, setCurrentRestaurant] = useState(() => {
    try {
      const stored = localStorage.getItem('gourmet_express_currentRestaurant');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Restaurant Authentication input fields
  const [resAuthTab, setResAuthTab] = useState('login'); // 'login' or 'signup'
  const [resEmail, setResEmail] = useState('');
  const [resPassword, setResPassword] = useState('');
  const [resName, setResName] = useState('');
  const [resMobile, setResMobile] = useState('');
  const [resCuisine, setResCuisine] = useState('');
  const [resAddress, setResAddress] = useState('');
  const [resIsVeg, setResIsVeg] = useState(false);
  const [resImage, setResImage] = useState('');

  // Restaurant Dashboard sub-view states
  const [resDashboardTab, setResDashboardTab] = useState('live'); // 'live' or 'history'
  const [resSearchQuery, setResSearchQuery] = useState('');

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'orders'
  const [currentView, setCurrentView] = useState('hotel-list'); // 'hotel-list', 'menu', 'tracking'
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState(false);
  const [vegFilter, setVegFilter] = useState(false);
  
  // Shopping Cart state
  const [cart, setCart] = useState({}); // { [itemId]: { item, quantity } }
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');

  // Authentication States
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gourmet_express_currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMobile, setAuthMobile] = useState('');
  
  // GPS Location states
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);

  // Customer Details Form (pre-populated by GPS)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);

  // Seed default member user in localStorage
  useEffect(() => {
    const defaultUser = {
      email: 'member@example.com',
      password: 'password123',
      mobile: '9876543210',
      name: 'Member'
    };
    try {
      const users = JSON.parse(localStorage.getItem('gourmet_express_users') || '[]');
      if (!users.some(u => u.email.toLowerCase() === defaultUser.email.toLowerCase())) {
        users.push(defaultUser);
        localStorage.setItem('gourmet_express_users', JSON.stringify(users));
      }
    } catch (err) {
      console.error('Error seeding default user:', err);
    }
  }, []);

  // Handle User Log In / Sign Up Form Submission
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const email = authEmail.trim();
    const password = authPassword.trim();
    const mobile = authMobile.trim();

    if (!email || !password || (authTab === 'signup' && !mobile)) {
      addCustomNotification('Form Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('gourmet_express_users') || '[]');

      if (authTab === 'login') {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
          // Find or generate capitalized prefix name
          const namePrefix = email.split('@')[0];
          const name = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
          const loggedInUser = { email, mobile: user.mobile, name };
          
          setCurrentUser(loggedInUser);
          localStorage.setItem('gourmet_express_currentUser', JSON.stringify(loggedInUser));
          setShowAuthModal(false);
          // Clear inputs
          setAuthEmail('');
          setAuthPassword('');
          
          addCustomNotification('Welcome Back!', `Logged in successfully as ${name}.`);
          triggerGpsDetection(loggedInUser);
        } else {
          addCustomNotification('Login Failed', 'Invalid email or password.');
        }
      } else {
        // Sign Up
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          addCustomNotification('Sign Up Failed', 'Email is already registered. Please log in.');
          return;
        }

        const namePrefix = email.split('@')[0];
        const name = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
        const newUser = { email, password, mobile, name };
        
        users.push(newUser);
        localStorage.setItem('gourmet_express_users', JSON.stringify(users));

        const loggedInUser = { email, mobile, name };
        setCurrentUser(loggedInUser);
        localStorage.setItem('gourmet_express_currentUser', JSON.stringify(loggedInUser));
        setShowAuthModal(false);
        // Clear inputs
        setAuthEmail('');
        setAuthPassword('');
        setAuthMobile('');

        addCustomNotification('Welcome to Member Club!', `Registration successful, ${name}!`);
        triggerGpsDetection(loggedInUser);
      }
    } catch (err) {
      console.error('Auth error:', err);
      addCustomNotification('Auth Error', 'An error occurred during authentication.');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gourmet_express_currentUser');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setGpsDetected(false);
    addCustomNotification('Logged Out', 'You have been successfully logged out.');
  };

  // Restaurant Portal Auth Submit
  const handleRestaurantAuthSubmit = (e) => {
    e.preventDefault();
    const email = resEmail.trim();
    const password = resPassword.trim();

    if (resAuthTab === 'login') {
      const matched = restaurants.find(r => r.email.toLowerCase() === email.toLowerCase() && r.password === password);
      if (matched) {
        setCurrentRestaurant(matched);
        localStorage.setItem('gourmet_express_currentRestaurant', JSON.stringify(matched));
        
        // Clear inputs
        setResEmail('');
        setResPassword('');
        addCustomNotification('Welcome Back!', `Logged in successfully to ${matched.name}.`);
      } else {
        addCustomNotification('Login Failed', 'Invalid email or password for restaurant.');
      }
    } else {
      // Sign Up
      const name = resName.trim();
      const mobile = resMobile.trim();
      const cuisine = resCuisine.trim();
      const address = resAddress.trim();
      const image = resImage.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';

      if (!name || !email || !password || !mobile || !cuisine || !address) {
        addCustomNotification('Error', 'Please fill in all required fields.');
        return;
      }

      if (restaurants.some(r => r.email.toLowerCase() === email.toLowerCase())) {
        addCustomNotification('Registration Failed', 'Email is already registered as a restaurant.');
        return;
      }

      if (restaurants.some(r => r.name.toLowerCase() === name.toLowerCase())) {
        addCustomNotification('Registration Failed', 'Restaurant name is already registered.');
        return;
      }

      const newRes = {
        email,
        password,
        name,
        mobile,
        cuisine,
        address,
        isVeg: resIsVeg,
        image
      };

      const updatedRestaurants = [...restaurants, newRes];
      setRestaurants(updatedRestaurants);
      localStorage.setItem('gourmet_express_restaurants', JSON.stringify(updatedRestaurants));

      // Create a mock hotel item so customers can order from it
      const newHotelId = 'h_' + Date.now();
      const newHotel = {
        id: newHotelId,
        name,
        cuisine,
        rating: 5.0,
        deliveryTime: '20 mins',
        distance: Math.round((Math.random() * 3 + 1) * 10) / 10,
        avgPrice: '₹300 for two',
        discount: '10% OFF | Use code WELCOME10',
        image,
        isVeg: resIsVeg,
        menu: [
          { 
            id: 'm1_' + Date.now(), 
            name: resIsVeg ? 'Signature Paneer Tikka' : 'Signature Tandoori Chicken', 
            price: 249, 
            rating: 5.0, 
            isVeg: resIsVeg, 
            description: 'Tender marinated chunks roasted in tandoor with aromatic spices.',
            bestSeller: true 
          },
          { 
            id: 'm2_' + Date.now(), 
            name: resIsVeg ? 'Chef\'s Special Veg Handi' : 'Chef\'s Special Butter Chicken', 
            price: 299, 
            rating: 4.9, 
            isVeg: resIsVeg, 
            description: 'Our head chef\'s signature curry cooked in a rich, slow-simmered gravy.' 
          },
          { 
            id: 'm3_' + Date.now(), 
            name: 'Gourmet Saffron Phirni', 
            price: 119, 
            rating: 4.8, 
            isVeg: true, 
            description: 'Creamy sweet rice pudding flavored with saffron, cardamom, and nuts.' 
          }
        ]
      };

      const updatedHotels = [...hotels, newHotel];
      setHotels(updatedHotels);

      setCurrentRestaurant(newRes);
      localStorage.setItem('gourmet_express_currentRestaurant', JSON.stringify(newRes));

      // Clear inputs
      setResEmail('');
      setResPassword('');
      setResName('');
      setResMobile('');
      setResCuisine('');
      setResAddress('');
      setResIsVeg(false);
      setResImage('');

      addCustomNotification('Welcome!', `${name} is registered & active in our marketplace.`);
    }
  };

  // Restaurant Logout Handler
  const handleRestaurantLogout = () => {
    setCurrentRestaurant(null);
    localStorage.removeItem('gourmet_express_currentRestaurant');
    addCustomNotification('Logged Out', 'Successfully logged out of Restaurant portal.');
  };

  // GPS Auto-Location Simulation
  const triggerGpsDetection = (userObj) => {
    const user = userObj || currentUser;
    if (!user) return;
    
    setIsLocatingGps(true);
    setGpsDetected(false);
    
    setTimeout(() => {
      setIsLocatingGps(false);
      setGpsDetected(true);
      setCustomerName(user.name);
      setCustomerPhone(user.mobile);
      setCustomerAddress('Gourmet Hub, 24th Main, HSR Layout, Sector 2, Bangalore - 560102');
      addCustomNotification('GPS Auto-Located', 'Address set to Sector 2, HSR Layout, Bangalore.');
    }, 1500);
  };

  // Trigger GPS detection when user adds item to cart & is logged in
  useEffect(() => {
    if (currentUser && Object.keys(cart).length > 0 && !gpsDetected && !isLocatingGps) {
      triggerGpsDetection();
    }
  }, [currentUser, cart, gpsDetected]);

  // Razorpay Simulation State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayActiveTab, setRazorpayActiveTab] = useState('card');
  const [cardNumber, setCardNumber] = useState('4319 8276 4398 1120');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('123');
  const [upiId, setUpiId] = useState('janedoe@okaxis');

  // Tracking & Dashboard state
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  
  // Customer notifications (Toast/SMS alerts)
  const [notifications, setNotifications] = useState([]);

  // Auto-calculated prices based on cart
  const [pricing, setPricing] = useState({
    subtotal: 0,
    deliveryFee: 0,
    cgst: 0,
    sgst: 0,
    discount: 0,
    grandTotal: 0
  });

  // Calculate pricing whenever cart or appliedCoupon changes
  useEffect(() => {
    let subtotal = 0;
    Object.values(cart).forEach(({ item, quantity }) => {
      subtotal += item.price * quantity;
    });

    let deliveryFee = 0;
    if (subtotal > 0 && selectedHotel) {
      deliveryFee = Math.max(20, Math.round(selectedHotel.distance * 15)); // ₹15 per km, min ₹20
    }

    let discount = 0;
    if (appliedCoupon && subtotal > 0) {
      if (appliedCoupon.type === 'percent') {
        discount = Math.min(appliedCoupon.maxDiscount, (subtotal * appliedCoupon.val) / 100);
      } else if (appliedCoupon.type === 'flat') {
        discount = Math.min(subtotal, appliedCoupon.val);
      }
    }

    const cgst = Math.round((subtotal - discount) * 0.025 * 100) / 100; // 2.5% CGST
    const sgst = Math.round((subtotal - discount) * 0.025 * 100) / 100; // 2.5% SGST
    const grandTotal = Math.max(0, Math.round(subtotal + deliveryFee + cgst + sgst - discount));

    setPricing({
      subtotal,
      deliveryFee,
      cgst,
      sgst,
      discount,
      grandTotal
    });
  }, [cart, appliedCoupon, selectedHotel]);

  // Periodic polling for orders list and active order status (2 seconds)
  useEffect(() => {
    fetchOrdersList();
    const interval = setInterval(() => {
      fetchOrdersList();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeOrderId) return;

    fetchActiveOrder();
    const interval = setInterval(() => {
      fetchActiveOrder();
    }, 2000);
    return () => clearInterval(interval);
  }, [activeOrderId]);

  const fetchOrdersList = async () => {
    try {
      const response = await axios.get(ORDER_API);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders list:', err);
      setError('Could not connect to Order Service.');
    }
  };

  const fetchActiveOrder = async () => {
    if (!activeOrderId) return;
    try {
      const response = await axios.get(`${ORDER_API}/${activeOrderId}`);
      const updatedOrder = response.data;
      
      // Check if status changed to trigger a notification
      if (activeOrder && activeOrder.status !== updatedOrder.status) {
        triggerStatusNotification(updatedOrder.status, updatedOrder.id);
      } else if (!activeOrder) {
        // Initial notification
        triggerStatusNotification(updatedOrder.status, updatedOrder.id);
      }
      
      setActiveOrder(updatedOrder);
    } catch (err) {
      console.error('Error fetching active order:', err);
    }
  };

  // Trigger simulated push notification / SMS
  const triggerStatusNotification = (status, orderId) => {
    let title = `Order #${orderId} Update`;
    let body = '';
    
    switch (status) {
      case 'PLACED':
        body = 'Order placed successfully! Awaiting payment approval.';
        break;
      case 'PAYMENT_SUCCESS':
        body = 'Payment Authorized! The hotel has started preparing your delicious food.';
        break;
      case 'PAYMENT_FAILED':
        body = 'Alert: Payment failed. Please try check out again.';
        break;
      case 'READY':
        body = 'Yum! Your food is ready in the kitchen and packed for dispatch.';
        break;
      case 'OUT_FOR_DELIVERY':
        body = 'Rider John Doe has picked up your food and is riding to your address!';
        break;
      case 'DELIVERED':
        body = 'Delivered! Your hot meal has been delivered by Rider John Doe. Enjoy!';
        break;
      case 'CANCELLED':
        body = 'Order was cancelled. Please check details or retry.';
        break;
      default:
        body = `Status update: ${status}`;
    }

    const newNotif = {
      id: Date.now(),
      title,
      body,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Auto dismiss notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 5000);
  };

  // Helper to trigger custom text notification
  const addCustomNotification = (title, body) => {
    const newNotif = {
      id: Date.now(),
      title,
      body,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 4000);
  };

  const handleOpenHotelMenu = (hotel) => {
    setSelectedHotel(hotel);
    setCart({}); // Reset cart for the new hotel
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage('');
    setCurrentView('menu');
    setCurrentTab('home');
  };

  const handleAddToCart = (item) => {
    setCart(prev => {
      const current = prev[item.id] || { item, quantity: 0 };
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: current.quantity + 1
        }
      };
    });
  };

  const handleRemoveFromCart = (item) => {
    setCart(prev => {
      const current = prev[item.id];
      if (!current) return prev;
      
      const updated = { ...prev };
      if (current.quantity <= 1) {
        delete updated[item.id];
      } else {
        updated[item.id] = {
          item,
          quantity: current.quantity - 1
        };
      }
      return updated;
    });
  };

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'WELCOME60' || code === 'SWIGGY50') {
      setAppliedCoupon({ type: 'percent', val: 50, maxDiscount: 120, code });
      setCouponMessage('Coupon applied successfully! 50% discount added.');
    } else if (code === 'GOURMET20') {
      setAppliedCoupon({ type: 'percent', val: 20, maxDiscount: 100, code });
      setCouponMessage('Coupon applied successfully! 20% discount added.');
    } else if (code === 'SWIGGY125') {
      setAppliedCoupon({ type: 'flat', val: 125, code });
      setCouponMessage('Coupon applied successfully! Flat ₹125 discount.');
    } else {
      setCouponMessage('Invalid Coupon Code. Try GOURMET20 or SWIGGY125.');
    }
  };

  const handleOpenPayment = () => {
    if (!currentUser) {
      setAuthTab('login');
      setShowAuthModal(true);
      addCustomNotification('Auth Required', 'Please sign in or register to complete checkout.');
      return;
    }
    if (isLocatingGps) {
      addCustomNotification('GPS Locating', 'Please wait for GPS to detect your address.');
      return;
    }
    if (!gpsDetected || !customerAddress) {
      triggerGpsDetection();
      return;
    }
    setShowRazorpayModal(true);
  };

  const handleRazorpayPayment = async (simulateSuccess) => {
    setShowRazorpayModal(false);
    setIsCheckoutSubmitting(true);

    try {
      // Map cart items description
      const itemDescriptions = Object.values(cart)
        .map(({ item, quantity }) => `${item.name} x${quantity}`)
        .join(', ');

      const hotelNamePrefix = selectedHotel ? `[${selectedHotel.name}] ` : '';

      const payload = {
        customerName: customerName.trim(),
        item: `${hotelNamePrefix}${itemDescriptions}`,
        amount: pricing.grandTotal
      };

      // Place order in backend
      const response = await axios.post(ORDER_API, payload);
      const placedOrder = response.data;
      
      // If user simulated payment success, we let the backend proceed normally
      // If user simulated payment failure, wait! The backend payment-service randomly simulates success (80%) or failure (20%).
      // We can let the user see the backend workflow result. If they selected simulated success, they'll see how it updates.
      if (simulateSuccess) {
        addCustomNotification('Payment Verified', 'Razorpay transaction authorized. Forwarding to kitchen.');
      } else {
        addCustomNotification('Payment Cancelled', 'Razorpay transaction failed by user.');
        // Wait, if they simulate payment failure on the UI, we can still post the order, but the payment service might roll success or failure.
        // Actually, to simulate payment failure properly, we could just alert them. But let's let the backend handle the order workflow.
      }

      // Reset cart and checkout states
      setCart({});
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponMessage('');
      
      // Set active order to track
      setActiveOrderId(placedOrder.id);
      setActiveOrder(placedOrder);
      setCurrentView('tracking');
    } catch (err) {
      console.error('Error checking out:', err);
      addCustomNotification('Checkout Failed', 'Failed to communicate with Order Service.');
    } finally {
      setIsCheckoutSubmitting(false);
    }
  };

  const handleTrackPastOrder = (orderId) => {
    setActiveOrderId(orderId);
    setActiveOrder(null); // Force reload
    setCurrentView('tracking');
  };

  // Helper to extract orders for current logged in restaurant
  const getOrdersForRestaurant = () => {
    if (!currentRestaurant) return [];
    return orders.filter(ord => {
      if (!ord.item) return false;
      return ord.item.includes(`[${currentRestaurant.name}]`);
    });
  };

  const cleanItemDescription = (itemStr) => {
    if (!itemStr) return '';
    if (currentRestaurant) {
      return itemStr.replace(`[${currentRestaurant.name}] `, '');
    }
    return itemStr.replace(/^\[.*?\]\s*/, '');
  };

  const restaurantOrders = getOrdersForRestaurant();
  
  const activeResOrders = restaurantOrders.filter(ord => 
    ['PLACED', 'PAYMENT_SUCCESS', 'READY', 'OUT_FOR_DELIVERY'].includes(ord.status)
  );
  
  const completedResOrders = restaurantOrders.filter(ord => 
    ord.status === 'DELIVERED'
  );

  const resRevenue = completedResOrders.reduce((sum, ord) => sum + ord.amount, 0);

  // Filters restaurant grid
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          hotel.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = !ratingFilter || hotel.rating >= 4.5;
    const matchesVeg = !vegFilter || hotel.isVeg;
    return matchesSearch && matchesRating && matchesVeg;
  });

  const cartItemsArray = Object.values(cart);

  return (
    <div className="app-container">
      {/* Notifications overlay tray */}
      <div className="notifications-tray">
        {notifications.map(n => (
          <div key={n.id} className="sms-notif">
            <div className="notif-header">
              <span className="flex items-center gap-1"><Smartphone size={10} /> SMS Update</span>
              <span>{n.time}</span>
            </div>
            <div className="notif-title">{n.title}</div>
            <div className="notif-body">{n.body}</div>
          </div>
        ))}
      </div>

      {/* Header Navbar */}
      <header className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => { if (portal === 'customer') { setCurrentView('hotel-list'); setCurrentTab('home'); } }}>
            <Utensils size={24} style={{ fill: '#fc8019', stroke: '#fc8019' }} />
            <span>GOURMET EXPRESS</span>
          </div>
          {portal === 'customer' ? (
            <div className="location-selector">
              <MapPin size={14} className="text-primary" />
              <span className="city">HSR Layout</span>
              <span className="address">Sector 2, Bangalore</span>
            </div>
          ) : (
            <div className="location-selector res-portal-badge" style={{ borderLeft: '2px solid var(--border-glass)', paddingLeft: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChefHat size={14} className="text-primary" />
              <span className="city" style={{ color: 'var(--color-info)' }}>Restaurant Control</span>
            </div>
          )}
        </div>

        <div className="nav-right">
          {portal === 'customer' ? (
            <>
              <div 
                className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('home'); if (currentView === 'tracking') setCurrentView('hotel-list'); }}
              >
                <Utensils size={16} />
                <span>Restaurants</span>
              </div>
              <div 
                className={`nav-item ${currentTab === 'orders' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('orders'); }}
              >
                <ShoppingBag size={16} />
                <span>My Orders</span>
              </div>
              {activeOrderId && (
                <div 
                  className={`nav-item ${currentView === 'tracking' ? 'active' : ''}`}
                  onClick={() => { setCurrentView('tracking'); }}
                >
                  <Clock size={16} />
                  <span>Track Order</span>
                </div>
              )}
              {currentUser ? (
                <div className="nav-item user-profile-nav" onClick={handleLogout} title="Click to Logout" style={{ cursor: 'pointer' }}>
                  <User size={16} style={{ fill: 'var(--color-primary)', stroke: 'var(--color-primary)' }} />
                  <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{currentUser.name} (Logout)</span>
                </div>
              ) : (
                <div className="nav-item user-profile-nav" onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} style={{ cursor: 'pointer' }}>
                  <User size={16} />
                  <span>Sign In</span>
                </div>
              )}
            </>
          ) : (
            <>
              {currentRestaurant && (
                <div className="nav-item user-profile-nav" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.15)', cursor: 'default' }}>
                  <ChefHat size={16} style={{ fill: 'var(--color-info)', stroke: 'var(--color-info)' }} />
                  <span style={{ color: 'var(--color-info)', fontWeight: '700' }}>{currentRestaurant.name}</span>
                </div>
              )}
              {currentRestaurant && (
                <button 
                  className="nav-item track-btn-small" 
                  onClick={handleRestaurantLogout}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}
                >
                  Logout
                </button>
              )}
            </>
          )}
          
          {/* Portal Switcher Button */}
          <button 
            className="filter-btn active portal-switch-btn"
            id="portal-switch-btn"
            onClick={() => setPortal(portal === 'customer' ? 'restaurant' : 'customer')}
            style={{ 
              background: portal === 'customer' ? 'rgba(252, 128, 25, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              borderColor: portal === 'customer' ? 'var(--color-primary)' : 'var(--color-info)',
              color: portal === 'customer' ? 'var(--color-primary)' : 'var(--color-info)',
              fontWeight: 'bold',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            {portal === 'customer' ? 'Switch to Restaurant Portal' : 'Switch to Customer Portal'}
          </button>

          <div className="polling-indicator">
            <RefreshCw size={12} className="spin-icon" />
            <span>Sync: Live (2s)</span>
          </div>
        </div>
      </header>

      <main className="content-container">
        {portal === 'customer' ? (
          <>

        {/* VIEW: All Orders (My Orders) */}
        {currentTab === 'orders' && (
          <section className="orders-list-panel">
            <h2 className="section-title">Your Order History</h2>
            {orders.length === 0 ? (
              <div className="empty-dashboard">
                <ShoppingBag size={48} className="empty-icon" />
                <p>No orders placed yet. Select a hotel to start ordering!</p>
              </div>
            ) : (
              <div className="orders-list-grid">
                {orders.map(ord => (
                  <div key={ord.id} className="past-order-card">
                    <div className="po-header">
                      <span className="po-id">Order #{ord.id}</span>
                      <span className="po-date">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="po-items">{ord.item}</div>
                    <div className="po-footer">
                      <span className="po-amount">₹{ord.amount.toFixed(2)}</span>
                      <button 
                        className="track-btn-small"
                        onClick={() => { handleTrackPastOrder(ord.id); setCurrentTab('home'); }}
                      >
                        Track Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* VIEW: Home / Hotel List */}
        {currentTab === 'home' && currentView === 'hotel-list' && (
          <>
            {/* Promo Carousel Banners */}
            <div className="promo-carousel">
              <div className="promo-card taj">
                <span className="promo-tag">60% OFF</span>
                <span className="promo-title">The Grand Taj Hotel</span>
                <span className="promo-code">Code: WELCOME60 | Up to ₹120</span>
              </div>
              <div className="promo-card saravana">
                <span className="promo-tag">20% OFF</span>
                <span className="promo-title">Saravana Bhavan</span>
                <span className="promo-code">Code: GOURMET20 | Pure Veg special</span>
              </div>
              <div className="promo-card punjab">
                <span className="promo-tag">BOGO OFFER</span>
                <span className="promo-title">Royal Punjab Hotel</span>
                <span className="promo-code">Buy 1 Thali Get 1 Gulab Jamun Free</span>
              </div>
              <div className="promo-card gourmet">
                <span className="promo-tag">₹125 FLAT</span>
                <span className="promo-title">Gourmet Burger Express</span>
                <span className="promo-code">Code: SWIGGY125 | Truffle Burgers</span>
              </div>
            </div>

            {/* Filter controls */}
            <div className="filters-bar">
              <div className="search-box">
                <Search size={16} className="text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search for restaurants or dishes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-tags">
                <button 
                  className={`filter-btn ${ratingFilter ? 'active' : ''}`}
                  onClick={() => setRatingFilter(!ratingFilter)}
                >
                  <Star size={12} style={{ fill: ratingFilter ? '#fc8019' : 'transparent' }} /> Rating 4.5+
                </button>
                <button 
                  className={`filter-btn ${vegFilter ? 'active' : ''}`}
                  onClick={() => setVegFilter(!vegFilter)}
                >
                  <span className="veg-icon-box" style={{ width: 10, height: 10, padding: 1 }}><span className="veg-icon-dot" style={{ width: 4, height: 4 }}></span></span> Pure Veg
                </button>
                {(ratingFilter || vegFilter || searchQuery) && (
                  <button 
                    className="filter-btn text-primary"
                    onClick={() => { setRatingFilter(false); setVegFilter(false); setSearchQuery(''); }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Restaurant List Grid */}
            <h2 className="section-title">Popular Restaurants in Bangalore</h2>
            <div className="restaurant-grid">
              {filteredHotels.map(hotel => (
                <div 
                  key={hotel.id} 
                  className="restaurant-card"
                  onClick={() => handleOpenHotelMenu(hotel)}
                >
                  <div className="card-img-wrapper">
                    <img src={hotel.image} alt={hotel.name} className="card-img" />
                    <span className="card-discount-tag">{hotel.discount}</span>
                  </div>
                  <div className="card-content">
                    <h3 className="restaurant-name">{hotel.name}</h3>
                    <div className="card-meta">
                      <span className="rating-badge"><Star size={10} style={{ fill: '#000' }} /> {hotel.rating}</span>
                      <span>•</span>
                      <span>{hotel.deliveryTime}</span>
                      <span>•</span>
                      <span>{hotel.distance} km</span>
                    </div>
                    <div className="card-cuisines">{hotel.cuisine}</div>
                    <div className="card-footer">
                      <span>{hotel.avgPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredHotels.length === 0 && (
                <div className="empty-dashboard" style={{ gridColumn: '1 / -1' }}>
                  <Utensils size={48} className="empty-icon" />
                  <p>No restaurants match your filters.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* VIEW: Hotel Menu & Shopping Cart */}
        {currentTab === 'home' && currentView === 'menu' && selectedHotel && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="back-btn" onClick={() => setCurrentView('hotel-list')}>
              <ArrowLeft size={16} /> Back to Restaurants list
            </div>

            {/* Hotel Detail Header */}
            <div className="hotel-header-panel">
              <img src={selectedHotel.image} alt={selectedHotel.name} className="hotel-header-img" />
              <div className="hotel-header-info">
                <div>
                  <h2 className="section-title" style={{ fontSize: '2rem' }}>{selectedHotel.name}</h2>
                  <p className="card-cuisines" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{selectedHotel.cuisine}</p>
                </div>
                <div className="hotel-header-meta">
                  <div className="meta-item">
                    <span className="meta-label">Rating</span>
                    <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#60b246' }}>
                      <Star size={14} style={{ fill: '#60b246' }} /> {selectedHotel.rating}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Delivery Time</span>
                    <span className="meta-value">{selectedHotel.deliveryTime}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Distance</span>
                    <span className="meta-value">{selectedHotel.distance} km</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Cost</span>
                    <span className="meta-value">{selectedHotel.avgPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu split view */}
            <div className="menu-split-container">
              {/* Menu items list */}
              <div className="menu-section">
                <h3 className="section-title" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>Recommended Dishes</h3>
                {selectedHotel.menu.map(item => {
                  const qty = cart[item.id]?.quantity || 0;
                  return (
                    <div key={item.id} className="menu-item-card">
                      <div className="menu-item-left">
                        {item.isVeg ? (
                          <div className="veg-icon-box"><div className="veg-icon-dot"></div></div>
                        ) : (
                          <div className="nonveg-icon-box"><div className="nonveg-icon-dot"></div></div>
                        )}
                        <div className="item-badge-row">
                          <span className="menu-item-name">{item.name}</span>
                          {item.bestSeller && <span className="bestseller-tag">Bestseller</span>}
                        </div>
                        <span className="menu-item-price">₹{item.price}</span>
                        <p className="menu-item-desc">{item.description}</p>
                      </div>
                      <div className="menu-item-right">
                        {/* Discovered item cards can display random fallback food illustrations or empty layout */}
                        <div className="menu-item-img" style={{ background: '#131924', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Utensils size={28} className="text-muted" />
                        </div>
                        <div className="add-btn-wrapper">
                          {qty === 0 ? (
                            <button className="add-btn" onClick={() => handleAddToCart(item)}>Add</button>
                          ) : (
                            <div className="qty-selector">
                              <button className="qty-btn" onClick={() => handleRemoveFromCart(item)}>-</button>
                              <span className="qty-value">{qty}</span>
                              <button className="qty-btn" onClick={() => handleAddToCart(item)}>+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar Cart & Automatic Calculator */}
              <div className="cart-panel">
                <div className="cart-title-row">
                  <h3 className="menu-item-name" style={{ fontSize: '1.25rem' }}>Your Basket</h3>
                  <ShoppingBag size={18} className="text-primary" />
                </div>

                {cartItemsArray.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag size={36} style={{ strokeWidth: 1.5 }} />
                    <p>Basket is empty. Choose some delicious dishes from the menu.</p>
                  </div>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {cartItemsArray.map(({ item, quantity }) => (
                        <div key={item.id} className="cart-item-row">
                          <div className="cart-item-info">
                            <span className="cart-item-name">{item.name}</span>
                            <span className="cart-item-price">₹{item.price}</span>
                          </div>
                          <div className="cart-item-actions">
                            <div className="cart-qty-box">
                              <button className="cart-qty-btn" onClick={() => handleRemoveFromCart(item)}>-</button>
                              <span className="cart-qty-val">{quantity}</span>
                              <button className="cart-qty-btn" onClick={() => handleAddToCart(item)}>+</button>
                            </div>
                            <span className="cart-item-subtotal">₹{item.price * quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupon section */}
                    <div className="coupon-section">
                      <input 
                        type="text" 
                        placeholder="ENTER COUPON CODE" 
                        className="coupon-input"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button className="coupon-btn" onClick={handleApplyCoupon}>Apply</button>
                    </div>
                    {couponMessage && (
                      <div className="coupon-success-msg">
                        <Percent size={12} />
                        <span>{couponMessage}</span>
                      </div>
                    )}

                    {/* Delivery Form Details */}
                    {!currentUser ? (
                      <div className="cart-auth-prompt-card">
                        <User size={24} className="auth-prompt-icon" />
                        <h5>Login required for checkout</h5>
                        <p>To place your order, please log in or sign up to your Gourmet membership.</p>
                        <button 
                          type="button"
                          className="cart-auth-prompt-btn" 
                          onClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
                        >
                          Sign In / Register
                        </button>
                      </div>
                    ) : isLocatingGps ? (
                      <div className="cart-gps-locating-card">
                        <div className="gps-spinner-ring">
                          <RefreshCw size={20} className="spin-icon text-primary" />
                        </div>
                        <div className="gps-locating-info">
                          <h5>Locating via GPS...</h5>
                          <p>Automatically detecting your delivery coordinates.</p>
                        </div>
                        <div className="gps-pulse-ping">
                          <span className="gps-pulse-circle"></span>
                        </div>
                      </div>
                    ) : gpsDetected ? (
                      <div className="cart-delivery-summary-card">
                        <div className="delivery-card-header-row">
                          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={16} className="text-success" style={{ fill: 'rgba(96, 178, 70, 0.2)', color: 'var(--color-success)' }} />
                            <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Delivery Address</h5>
                          </div>
                          <span className="gps-auto-badge">GPS Verified</span>
                        </div>
                        <div className="delivery-details-card-body">
                          <p><strong>Name:</strong> {customerName}</p>
                          <p><strong>Phone:</strong> {customerPhone}</p>
                          <p><strong>Address:</strong> {customerAddress}</p>
                        </div>
                        <button 
                          type="button" 
                          className="re-detect-gps-btn" 
                          onClick={() => triggerGpsDetection()}
                          disabled={isCheckoutSubmitting}
                        >
                          <RefreshCw size={10} /> Re-detect Address
                        </button>
                      </div>
                    ) : (
                      <div className="cart-auth-prompt-card">
                        <MapPin size={24} className="auth-prompt-icon text-primary" />
                        <h5>Address Auto-Detection</h5>
                        <p>We will automatically detect your location using GPS.</p>
                        <button 
                          type="button" 
                          className="cart-auth-prompt-btn" 
                          onClick={() => triggerGpsDetection()}
                        >
                          Detect My Location
                        </button>
                      </div>
                    )}

                    {/* Invoice Calculator Breakdown */}
                    <div className="bill-details">
                      <div className="bill-row">
                        <span>Item Subtotal</span>
                        <span>₹{pricing.subtotal}</span>
                      </div>
                      {pricing.discount > 0 && (
                        <div className="bill-row discount">
                          <span>Coupon Discount</span>
                          <span>-₹{pricing.discount}</span>
                        </div>
                      )}
                      <div className="bill-row">
                        <span>Delivery Fee ({selectedHotel.distance} km)</span>
                        <span>₹{pricing.deliveryFee}</span>
                      </div>
                      <div className="bill-row">
                        <span>CGST (2.5%)</span>
                        <span>₹{pricing.cgst}</span>
                      </div>
                      <div className="bill-row">
                        <span>SGST (2.5%)</span>
                        <span>₹{pricing.sgst}</span>
                      </div>
                      <div className="bill-row total">
                        <span>To Pay</span>
                        <span>₹{pricing.grandTotal}</span>
                      </div>
                    </div>

                    <button 
                      className="checkout-btn" 
                      onClick={handleOpenPayment}
                      disabled={isCheckoutSubmitting || isLocatingGps}
                    >
                      {isCheckoutSubmitting ? 'Processing...' : 
                       !currentUser ? 'Sign In to Proceed' : 
                       isLocatingGps ? 'Locating via GPS...' : 
                       !gpsDetected ? 'Detect Location to Proceed' : 'Proceed to Pay'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Live Order Tracker Stepper */}
        {currentTab === 'home' && currentView === 'tracking' && activeOrderId && (
          <div className="tracker-container">
            {/* Left Stepper timeline */}
            {activeOrder && (activeOrder.status === 'CANCELLED' || activeOrder.status === 'PAYMENT_FAILED') ? (
              <div className="cancelled-tracker-card">
                <div className="cancelled-icon-box">
                  <XCircle size={36} />
                </div>
                <h2 className="section-title" style={{ color: 'var(--color-error)' }}>Order Cancelled</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  We are sorry! Your order #{activeOrder.id} failed to complete. 
                  Reason: {activeOrder.status === 'PAYMENT_FAILED' ? 'Payment Authorization Declined.' : 'Order rejected.'}
                </p>
                <button className="checkout-btn" onClick={() => setCurrentView('hotel-list')}>
                  Back to Restaurants
                </button>
              </div>
            ) : (
              <div className="tracker-card">
                <div className="tracker-header">
                  <div className="tracker-title-col">
                    <span className="tracker-id-badge">Order #{activeOrderId}</span>
                    <h2 className="section-title" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>Track Your Feast</h2>
                  </div>
                  {activeOrder && activeOrder.status !== 'DELIVERED' && (
                    <div className="tracker-delivery-eta">
                      <span className="eta-time">25 Mins</span>
                      <div className="eta-label">Estimated Delivery Time</div>
                    </div>
                  )}
                </div>

                {/* Timeline Stepper */}
                <div className="stepper-timeline">
                  {/* Step 1: PLACED */}
                  <div className={`step-node ${
                    activeOrder && (
                      activeOrder.status === 'PLACED' ? 'active' : 'completed'
                    )
                  }`}>
                    <div className="step-indicator">
                      {activeOrder && activeOrder.status !== 'PLACED' ? <Check size={12} /> : <Clock size={12} />}
                    </div>
                    <span className="step-title">Order Received</span>
                    <span className="step-desc">Your order has been logged into the system and sent to the payment queue.</span>
                  </div>

                  {/* Step 2: PAYMENT_SUCCESS */}
                  <div className={`step-node ${
                    activeOrder && (
                      activeOrder.status === 'PAYMENT_SUCCESS' ? 'active' : 
                      (['READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(activeOrder.status) ? 'completed' : '')
                    )
                  }`}>
                    <div className="step-indicator">
                      {activeOrder && ['READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(activeOrder.status) ? <Check size={12} /> : <DollarSign size={12} />}
                    </div>
                    <span className="step-title">Payment Confirmed</span>
                    <span className="step-desc">Razorpay transaction successfully verified by payment service.</span>
                  </div>

                  {/* Step 3: READY */}
                  <div className={`step-node ${
                    activeOrder && (
                      activeOrder.status === 'READY' ? 'active' : 
                      (['OUT_FOR_DELIVERY', 'DELIVERED'].includes(activeOrder.status) ? 'completed' : '')
                    )
                  }`}>
                    <div className="step-indicator">
                      {activeOrder && ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(activeOrder.status) ? <Check size={12} /> : <ChefHat size={12} />}
                    </div>
                    <span className="step-title">Prepared & Packed</span>
                    <span className="step-desc">The restaurant has cooked and packaged your fresh meal.</span>
                  </div>

                  {/* Step 4: OUT_FOR_DELIVERY */}
                  <div className={`step-node ${
                    activeOrder && (
                      activeOrder.status === 'OUT_FOR_DELIVERY' ? 'active' : 
                      (activeOrder.status === 'DELIVERED' ? 'completed' : '')
                    )
                  }`}>
                    <div className="step-indicator">
                      {activeOrder && activeOrder.status === 'DELIVERED' ? <Check size={12} /> : <Truck size={12} />}
                    </div>
                    <span className="step-title">Out for Delivery</span>
                    <span className="step-desc">Delivery rider Rider John Doe is on his way to your address.</span>
                  </div>

                  {/* Step 5: DELIVERED */}
                  <div className={`step-node ${
                    activeOrder && activeOrder.status === 'DELIVERED' ? 'active completed' : ''
                  }`}>
                    <div className="step-indicator">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="step-title">Arrived</span>
                    <span className="step-desc">Order delivered! Enjoy your hot and delicious meal.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Right Map & Rider info Panel */}
            <div className="rider-panel">
              <h3 className="restaurant-name" style={{ fontSize: '1.25rem' }}>Delivery Information</h3>
              <div className="mock-map">
                <div className="map-grid"></div>
                <div className="rider-marker">
                  <Truck size={20} color="#000" />
                  <div className="pulse-circle"></div>
                </div>
              </div>
              <div className="rider-card">
                <div className="rider-avatar">
                  <User size={24} />
                </div>
                <div className="rider-info">
                  <span className="rider-name">Rider John Doe</span>
                  <span className="rider-status-lbl">
                    {activeOrder ? (
                      activeOrder.status === 'DELIVERED' ? 'Delivery Completed' :
                      (activeOrder.status === 'OUT_FOR_DELIVERY' ? 'En Route (Active)' : 'Awaiting Dispatch')
                    ) : 'Assigning Courier...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        ) : (
          /* RESTAURANT VIEW */
          <div className="restaurant-portal-container" style={{ width: '100%' }}>
            {!currentRestaurant ? (
              /* RESTAURANT AUTH PAGE */
              <div className="res-auth-card" style={{ maxWidth: '480px', margin: '2rem auto', padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
                <div className="res-auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <ChefHat size={36} color="var(--color-info)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>Gourmet Restaurant Portal</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>Log in or register your kitchen to start receiving and preparing live customer orders.</p>
                </div>
                
                <div className="auth-tabs" style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', padding: '0.25rem', marginBottom: '1.5rem' }}>
                  <button 
                    type="button"
                    className={`auth-tab-btn ${resAuthTab === 'login' ? 'active' : ''}`}
                    onClick={() => setResAuthTab('login')}
                    style={{ 
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: resAuthTab === 'login' ? 'var(--color-info)' : 'var(--text-secondary)', 
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all 0.25s ease',
                      boxShadow: resAuthTab === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
                    }}
                  >
                    Log In
                  </button>
                  <button 
                    type="button"
                    className={`auth-tab-btn ${resAuthTab === 'signup' ? 'active' : ''}`}
                    onClick={() => setResAuthTab('signup')}
                    style={{ 
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: resAuthTab === 'signup' ? 'var(--color-info)' : 'var(--text-secondary)', 
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all 0.25s ease',
                      boxShadow: resAuthTab === 'signup' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
                    }}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleRestaurantAuthSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="auth-input-group">
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={resEmail}
                      onChange={(e) => setResEmail(e.target.value)}
                      placeholder="restaurant@example.com"
                      style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      required
                    />
                  </div>

                  <div className="auth-input-group">
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Password</label>
                    <input 
                      type="password" 
                      value={resPassword}
                      onChange={(e) => setResPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      required
                    />
                  </div>

                  {resAuthTab === 'signup' && (
                    <>
                      <div className="auth-input-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Restaurant Name</label>
                        <input 
                          type="text" 
                          value={resName}
                          onChange={(e) => setResName(e.target.value)}
                          placeholder="e.g. Royal Punjab Thali"
                          style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Mobile Number</label>
                        <input 
                          type="tel" 
                          value={resMobile}
                          onChange={(e) => setResMobile(e.target.value)}
                          placeholder="e.g. 9876543211"
                          pattern="[0-9]{10}"
                          style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Cuisines</label>
                        <input 
                          type="text" 
                          value={resCuisine}
                          onChange={(e) => setResCuisine(e.target.value)}
                          placeholder="e.g. North Indian, Punjabi, Sweets"
                          style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Restaurant Address</label>
                        <input 
                          type="text" 
                          value={resAddress}
                          onChange={(e) => setResAddress(e.target.value)}
                          placeholder="e.g. HSR Layout, Sector 3, Bangalore"
                          style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Banner Image URL (Optional)</label>
                        <input 
                          type="url" 
                          value={resImage}
                          onChange={(e) => setResImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                        />
                      </div>

                      <div className="auth-input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <input 
                          type="checkbox" 
                          id="resIsVeg"
                          checked={resIsVeg}
                          onChange={(e) => setResIsVeg(e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="resIsVeg" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Pure Vegetarian Restaurant</label>
                      </div>
                    </>
                  )}

                  <button 
                    type="submit" 
                    className="auth-submit-btn" 
                    style={{ 
                      width: '100%', 
                      marginTop: '1.25rem', 
                      background: 'var(--color-info)', 
                      border: 'none', 
                      padding: '0.75rem', 
                      color: '#000', 
                      fontWeight: '800', 
                      borderRadius: 'var(--radius-sm)', 
                      cursor: 'pointer', 
                      transition: 'background 0.2s' 
                    }}
                  >
                    {resAuthTab === 'login' ? 'Log In to Kitchen' : 'Register Restaurant'}
                  </button>
                </form>
              </div>
            ) : (
              /* RESTAURANT DASHBOARD */
              <div className="restaurant-dashboard-view" style={{ width: '100%' }}>
                {/* Dashboard Metrics Header */}
                <div className="res-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div className="res-details-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img 
                      src={currentRestaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'} 
                      alt={currentRestaurant.name} 
                      className="res-dash-avatar"
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-info)' }}
                    />
                    <div className="res-info-col">
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{currentRestaurant.name}</h2>
                      <p className="res-cuisine-lbl" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.2rem 0' }}>{currentRestaurant.cuisine}</p>
                      <p className="res-address-lbl" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{currentRestaurant.address}</p>
                    </div>
                  </div>
                  <div className="res-status-right">
                    <span className="res-status-active-badge" style={{ background: 'rgba(96, 178, 70, 0.1)', color: 'var(--color-success)', border: '1px solid rgba(96, 178, 70, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>● KITCHEN ONLINE</span>
                  </div>
                </div>

                {/* Dashboard Key Performance Indicators (KPIs) */}
                <div className="res-kpis-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="kpi-card info" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
                    <div className="kpi-icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-info)', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                      <Clock size={22} />
                    </div>
                    <div className="kpi-value-col" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="kpi-val" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{activeResOrders.length}</span>
                      <span className="kpi-lbl" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Live Orders</span>
                    </div>
                  </div>

                  <div className="kpi-card success" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
                    <div className="kpi-icon-box" style={{ background: 'rgba(96, 178, 70, 0.1)', color: 'var(--color-success)', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={22} />
                    </div>
                    <div className="kpi-value-col" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="kpi-val" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{completedResOrders.length}</span>
                      <span className="kpi-lbl" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed Orders</span>
                    </div>
                  </div>

                  <div className="kpi-card warning" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
                    <div className="kpi-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                      <DollarSign size={22} />
                    </div>
                    <div className="kpi-value-col" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="kpi-val" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>₹{resRevenue.toFixed(2)}</span>
                      <span className="kpi-lbl" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Sales Revenue</span>
                    </div>
                  </div>
                </div>

                {/* Tabs Switcher for Orders */}
                <div className="res-tabs-bar" style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <button 
                    className={`res-tab-btn ${resDashboardTab === 'live' ? 'active' : ''}`}
                    onClick={() => setResDashboardTab('live')}
                    style={{ 
                      background: 'transparent',
                      border: 'none',
                      borderBottom: resDashboardTab === 'live' ? '3px solid var(--color-info)' : '3px solid transparent',
                      color: resDashboardTab === 'live' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '1rem',
                      fontWeight: '700',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Live Orders Queue ({activeResOrders.length})
                  </button>
                  <button 
                    className={`res-tab-btn ${resDashboardTab === 'history' ? 'active' : ''}`}
                    onClick={() => setResDashboardTab('history')}
                    style={{ 
                      background: 'transparent',
                      border: 'none',
                      borderBottom: resDashboardTab === 'history' ? '3px solid var(--color-info)' : '3px solid transparent',
                      color: resDashboardTab === 'history' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '1rem',
                      fontWeight: '700',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Completed History ({completedResOrders.length})
                  </button>
                </div>

                {/* Tab content 1: Live Orders Stream */}
                {resDashboardTab === 'live' && (
                  <div className="res-live-orders-container" style={{ width: '100%' }}>
                    {activeResOrders.length === 0 ? (
                      <div className="res-empty-state" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-card)' }}>
                        <ChefHat size={48} className="empty-icon" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>No active orders right now</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>When customers order your dishes, they will appear here in real-time with status track.</p>
                      </div>
                    ) : (
                      <div className="res-orders-stream" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                        {activeResOrders.map(ord => {
                          let progressPct = 25;
                          let statusColor = 'var(--color-primary)';
                          if (ord.status === 'PAYMENT_SUCCESS') { progressPct = 50; statusColor = 'var(--color-info)'; }
                          else if (ord.status === 'READY') { progressPct = 75; statusColor = '#a855f7'; }
                          else if (ord.status === 'OUT_FOR_DELIVERY') { progressPct = 90; statusColor = 'var(--color-warning)'; }

                          return (
                            <div key={ord.id} className="res-order-live-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--shadow-card)', transition: 'transform 0.2s' }}>
                              <div className="res-ol-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="res-ol-id" style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-info)' }}>Order: #{ord.id}</span>
                                <span className="res-ol-status" style={{ background: statusColor, color: '#000', fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>{ord.status}</span>
                              </div>

                              <div className="res-ol-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                <div className="res-ol-items" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', minHeight: '40px' }}>{cleanItemDescription(ord.item)}</div>
                                <div className="res-ol-customer" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Customer:</strong> {ord.customerName}</div>
                                <div className="res-ol-time" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><strong>Placed:</strong> {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              </div>

                              <div className="res-ol-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Total:</span>
                                  <span className="res-ol-amount" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>₹{ord.amount.toFixed(2)}</span>
                                </div>
                                <div className="res-ol-progress-wrapper" style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div className="res-ol-progress-bar" style={{ width: `${progressPct}%`, height: '100%', backgroundColor: statusColor, transition: 'width 0.4s ease' }}></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab content 2: Order History */}
                {resDashboardTab === 'history' && (
                  <div className="res-history-orders-container" style={{ width: '100%' }}>
                    <div className="res-history-filters" style={{ marginBottom: '1.5rem' }}>
                      <div className="search-box" style={{ width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 1rem' }}>
                        <Search size={16} className="text-secondary" />
                        <input 
                          type="text" 
                          placeholder="Search by ID or customer name..." 
                          value={resSearchQuery}
                          onChange={(e) => setResSearchQuery(e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                        />
                      </div>
                    </div>

                    {restaurantOrders.filter(ord => ['DELIVERED', 'CANCELLED', 'PAYMENT_FAILED'].includes(ord.status)).length === 0 ? (
                      <div className="res-empty-state" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-card)' }}>
                        <ShoppingBag size={48} className="empty-icon" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>No past orders found</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completed orders will show up here once they are delivered to the customers.</p>
                      </div>
                    ) : (
                      <div className="res-history-table-wrapper" style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-card)' }}>
                        <table className="res-history-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.01)' }}>
                              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Order ID</th>
                              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Date</th>
                              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Customer</th>
                              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Items</th>
                              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Amount</th>
                              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {restaurantOrders
                              .filter(ord => ['DELIVERED', 'CANCELLED', 'PAYMENT_FAILED'].includes(ord.status))
                              .filter(ord => {
                                const q = resSearchQuery.toLowerCase().trim();
                                if (!q) return true;
                                return ord.id.toString().includes(q) || ord.customerName.toLowerCase().includes(q);
                              })
                              .map(ord => (
                                <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                  <td className="res-tbl-id" style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--color-info)', fontWeight: 'bold' }}>#{ord.id}</td>
                                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date(ord.createdAt).toLocaleDateString()}</td>
                                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{ord.customerName}</td>
                                  <td className="res-tbl-items" style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cleanItemDescription(ord.item)}</td>
                                  <td className="res-tbl-amount" style={{ padding: '1rem', fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>₹{ord.amount.toFixed(2)}</td>
                                  <td style={{ padding: '1rem' }}>
                                    <span 
                                      className={`status-badge-small ${ord.status.toLowerCase()}`}
                                      style={{ 
                                        fontSize: '0.7rem', 
                                        fontWeight: '800', 
                                        padding: '0.15rem 0.5rem', 
                                        borderRadius: '4px', 
                                        textTransform: 'uppercase',
                                        background: ord.status === 'DELIVERED' ? 'rgba(96, 178, 70, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: ord.status === 'DELIVERED' ? 'var(--color-success)' : 'var(--color-error)',
                                        border: ord.status === 'DELIVERED' ? '1px solid rgba(96, 178, 70, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                                      }}
                                    >
                                      {ord.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Simulated Razorpay payment modal overlay */}
      {showRazorpayModal && (
        <div className="modal-overlay">
          <div className="razorpay-modal">
            {/* Header */}
            <div className="rp-header">
              <div className="rp-merchant-info">
                <div className="rp-logo-row">
                  <span className="rp-logo-blue">Razor</span><span>pay</span>
                </div>
                <span className="rp-merchant-name">Gourmet Express Checkout</span>
              </div>
              <div className="rp-amount-box">
                <span className="rp-amount-val">₹{pricing.grandTotal.toFixed(2)}</span>
                <span className="rp-amount-label">Amount due</span>
              </div>
            </div>

            {/* Body */}
            <div className="rp-body">
              <div className="rp-sidebar">
                <div 
                  className={`rp-side-tab ${razorpayActiveTab === 'card' ? 'active' : ''}`}
                  onClick={() => setRazorpayActiveTab('card')}
                >
                  Card
                </div>
                <div 
                  className={`rp-side-tab ${razorpayActiveTab === 'upi' ? 'active' : ''}`}
                  onClick={() => setRazorpayActiveTab('upi')}
                >
                  UPI (GPay/PhonePe)
                </div>
                <div 
                  className={`rp-side-tab ${razorpayActiveTab === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setRazorpayActiveTab('netbanking')}
                >
                  Netbanking
                </div>
                <div 
                  className={`rp-side-tab ${razorpayActiveTab === 'wallet' ? 'active' : ''}`}
                  onClick={() => setRazorpayActiveTab('wallet')}
                >
                  Wallets
                </div>
              </div>

              <div className="rp-content-area">
                {razorpayActiveTab === 'card' && (
                  <>
                    <span className="rp-form-title">Enter Card Details</span>
                    <div className="rp-input-group">
                      <label>Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4319 8276 4398 1120"
                      />
                    </div>
                    <div className="rp-card-row">
                      <div className="rp-input-group">
                        <label>Expiry Date</label>
                        <input 
                          type="text" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/29"
                        />
                      </div>
                      <div className="rp-input-group">
                        <label>CVV</label>
                        <input 
                          type="password" 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </>
                )}

                {razorpayActiveTab === 'upi' && (
                  <>
                    <span className="rp-form-title">Pay via UPI</span>
                    <div className="rp-input-group">
                      <label>Virtual Payment Address (VPA / UPI ID)</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="janedoe@okaxis"
                      />
                    </div>
                  </>
                )}

                {razorpayActiveTab === 'netbanking' && (
                  <>
                    <span className="rp-form-title">Select Popular Banks</span>
                    <div className="rp-input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button className="filter-btn text-center justify-center">SBI</button>
                      <button className="filter-btn text-center justify-center">HDFC</button>
                      <button className="filter-btn text-center justify-center">ICICI</button>
                      <button className="filter-btn text-center justify-center">Axis</button>
                    </div>
                  </>
                )}

                {razorpayActiveTab === 'wallet' && (
                  <>
                    <span className="rp-form-title">Select Wallet</span>
                    <div className="rp-input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button className="filter-btn text-center justify-center">Paytm</button>
                      <button className="filter-btn text-center justify-center">PhonePe</button>
                      <button className="filter-btn text-center justify-center">Amazon Pay</button>
                      <button className="filter-btn text-center justify-center">Mobikwik</button>
                    </div>
                  </>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.75rem', marginTop: 'auto' }}>
                  <ShieldCheck size={14} color="#60b246" />
                  <span>Secured by Razorpay. 256-bit encryption.</span>
                </div>
              </div>
            </div>

            {/* Footer containing simulation buttons */}
            <div className="rp-footer">
              <button className="rp-btn rp-btn-cancel" onClick={() => setShowRazorpayModal(false)}>
                Cancel
              </button>
              <button className="rp-btn rp-btn-fail" onClick={() => handleRazorpayPayment(false)}>
                Simulate Payment Fail
              </button>
              <button className="rp-btn rp-btn-success" onClick={() => handleRazorpayPayment(true)}>
                Authorize & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Membership Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <div className="auth-header">
              <div className="auth-logo-row">
                <Utensils size={18} color="var(--color-primary)" style={{ fill: 'var(--color-primary)' }} />
                <span>GOURMET MEMBERSHIP</span>
              </div>
              <button className="auth-close-btn" onClick={() => setShowAuthModal(false)}>×</button>
            </div>
            
            <div className="auth-tabs">
              <button 
                type="button"
                className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => setAuthTab('login')}
              >
                Log In
              </button>
              <button 
                type="button"
                className={`auth-tab-btn ${authTab === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              <p className="auth-form-tagline" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                {authTab === 'login' 
                  ? 'Sign in to access your Gourmet Club dashboard and unlock GPS-automated checkout.' 
                  : 'Join Gourmet Club today! Enter your details to experience auto-address detection.'}
              </p>

              <div className="auth-input-group">
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                <input 
                  type="email" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="member@example.com"
                  style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                  required
                />
              </div>

              <div className="auth-input-group" style={{ marginTop: '0.85rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                  required
                />
              </div>

              {authTab === 'signup' && (
                <div className="auth-input-group" style={{ marginTop: '0.85rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Mobile Number</label>
                  <input 
                    type="tel" 
                    value={authMobile}
                    onChange={(e) => setAuthMobile(e.target.value)}
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit mobile number"
                    style={{ width: '100%', padding: '0.6rem', background: '#252d3a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                    required
                  />
                </div>
              )}

              <button type="submit" className="auth-submit-btn" style={{ width: '100%', marginTop: '1.5rem', background: 'var(--color-primary)', border: 'none', padding: '0.75rem', color: '#000', fontWeight: '800', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s' }}>
                {authTab === 'login' ? 'Log In' : 'Sign Up & Continue'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
