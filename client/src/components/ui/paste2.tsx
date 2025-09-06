import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const CartPage = () => {
  const [customOrders, setCustomOrders] = useState([]);
  const [regularCartItems, setRegularCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCartItems = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Separate custom cakes from regular items
    const customCakes = savedCart.filter((item) => item.title?.includes("Custom Cake"));
    const regularItems = savedCart.filter((item) => !item.title?.includes("Custom Cake"));
    
    setCustomOrders(customCakes);
    setRegularCartItems(regularItems);
    setLoading(false);
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const updateItemQuantity = (id, delta, isCustom = false) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = savedCart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    loadCartItems(); // Reload to update state
    toast.success("Quantity updated");
  };

  const removeItem = (id) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = savedCart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    loadCartItems(); // Reload to update state
    toast.success("Item removed from cart");
  };
a
  const customOrdersTotal = customOrders.reduce((sum, order) => {
    // Parse price from "₦50000" format
    const price = parseFloat(order.price.replace("₦", "").replace(",", "")) || 0;
    return sum + price * (order.quantity || 1);
  }, 0);

  const regularItemsTotal = regularCartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("₦", "").replace(",", "")) || 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  const grandTotal = customOrdersTotal + regularItemsTotal;

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading your cart...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-foreground mb-6 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Your Cart
        </h2>
        
        {customOrders.length === 0 && regularCartItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => window.location.href = "/"}>Continue Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {customOrders.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Custom Cake Orders</h3>
                {customOrders.map((order) => (
                  <Card key={order.id} className="mb-4">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold mb-2">{order.title}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p><strong>Size:</strong> {order.inches}</p>
                              <p><strong>Layers:</strong> {order.layers}</p>
                              <p><strong>Flavors:</strong> {order.options}</p>
                              {order.recipientGender && <p><strong>Recipient:</strong> {order.recipientGender}</p>}
                            </div>
                            <div>
                              {order.textToAppear && <p><strong>Message:</strong> "{order.textToAppear}"</p>}
                              {order.flowerToppings && <p><strong>Decorations:</strong> {order.flowerToppings}</p>}
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-4">
                            <div className="text-lg font-semibold">
                              {order.price} x {order.quantity || 1}
                            </div>
                            <div className="text-xl font-bold text-primary">
                              = ₦{(parseFloat(order.price.replace("₦", "").replace(",", "")) * (order.quantity || 1)).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-6">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(order.id, -1, true)}
                              disabled={(order.quantity || 1) <= 1}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">{order.quantity || 1}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(order.id, 1, true)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {regularCartItems.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Regular Items</h3>
                {regularCartItems.map((item) => (
                  <Card key={item.id} className="mb-4">
                    <CardContent className="p-6 flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.options && <p><strong>Options:</strong> {item.options}</p>}
                          {item.inches && <p><strong>Size:</strong> {item.inches}</p>}
                          {item.layers && <p><strong>Layers:</strong> {item.layers}</p>}
                          {item.recipientGender && <p><strong>Recipient:</strong> {item.recipientGender}</p>}
                          {item.flowerToppings && <p><strong>Toppings:</strong> {item.flowerToppings}</p>}
                          {item.topperAccessories && <p><strong>Topper:</strong> {item.topperAccessories}</p>}
                          {item.textToAppear && <p><strong>Text:</strong> {item.textToAppear}</p>}
                        </div>
                        <div className="mt-2 text-lg font-semibold">
                          {item.price} x {item.quantity || 1}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {customOrders.length > 0 && (
                    <div className="flex justify-between">
                      <span>Custom Orders ({customOrders.length} item{customOrders.length !== 1 ? "s" : ""})</span>
                      <span className="font-semibold">₦{customOrdersTotal.toLocaleString()}</span>
                    </div>
                  )}
                  {regularCartItems.length > 0 && (
                    <div className="flex justify-between">
                      <span>Regular Items ({regularCartItems.length} item{regularCartItems.length !== 1 ? "s" : ""})</span>
                      <span className="font-semibold">₦{regularItemsTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">₦{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.location.href = "/customize"}
                  >
                    Add More Items
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={() => window.location.href = `/checkout?amount=${grandTotal}`}
                    disabled={grandTotal === 0}
                  >
                    Proceed to Checkout - ₦{grandTotal.toLocaleString()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;








import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-cake.png";
import hero2Image from "@/assets/hero2-cake.png";
import { useNavigate } from "react-router-dom";
import AOS from "aos"; 
import image from "@/assets/circle.png";
import '@/assets/fonts.css';
import "aos/dist/aos.css";

const HeroSection = () => {
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-out-cubic",
      once: true,
    });

    const interval = setInterval(() => {
      setIsFirstSlide((prev) => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center">

        <img
          src={heroImage}
          alt="Beautiful slice of cake"
          className={`h-full object-contain absolute right-0 bg-white transition-opacity duration-1000 ease-in-out tranform ${
            isFirstSlide ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={hero2Image}
          alt="Beautiful slice of cake"
          className={`w-auto h-full object-contain transition-opacity duration-1000 ease-in-out transform absolute ${
            isFirstSlide ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <div className="relative mb-8">
            <img src={image} alt="Decorative circle" className="w-32 h-100 mx-auto" />
            <h1 className="absolute left-0 top-1/2 -translate-y-1/2 text-6xl font-alfa-slab-one text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary -rotate-90 origin-left tracking-tight">
              Patrick
            </h1>
            <h1 className="absolute left-0 top-1/2 translate-y-20 text-6xl font-alfa-slab-one text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary -rotate-90 origin-left tracking-tight">
              Jummys
            </h1>
          </div>

          <p
            className={`text-xl md:text-2xl text-white/90 mb-8 leading-relaxed transition-opacity duration-1000 ease-in-out ${
              isFirstSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            From elegant wedding cakes to delightful birthday treats, we bring your sweetest dreams to life.
          </p>
          <p
            className={`text-xl md:text-2xl text-[#A1CAE2] mb-8 leading-relaxed transition-opacity duration-1000 ease-in-out ${
              isFirstSlide ? "opacity-0" : "opacity-100"
            }`}
          >
            Baked With Love, Delivered with Joy
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="elegant" size="lg" className="text-lg px-8 py-6" onClick={() => navigate("")}>
              Build Your Cake
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="elegant" size="lg" className="text-lg px-16 py-6" onClick={() => navigate("/gallery")}>
              View Gallery
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;




import cakeImg from "@/assets/hero-cake.png"; // replace with your cake image path
import { Button } from "@/components/ui/button";
import "@/assets/fonts.css"; // make sure you import a cursive font (e.g., from Google Fonts)

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden font-[cursive]">
      {/* Decorative Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Big Circle */}
        <div className="absolute w-[500px] h-[500px] rounded-full border-4 border-[#A1CAE2]/50"></div>
        {/* Medium Circle */}
        <div className="absolute w-[350px] h-[350px] rounded-full border-4 border-[#EFB6C8]/50"></div>
        {/* Small Circle */}
        <div className="absolute w-[200px] h-[200px] rounded-full border-4 border-[#A1CAE2]/50 left-16 top-1/2 -translate-y-1/2 flex items-center justify-center bg-white">
          {/* Cake Image inside circle */}
          <img src={cakeImg} alt="Cake" className="w-24 h-24 object-contain" />
        </div>
      </div>

      {/* Center Text */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
          <span className="text-[#A1CAE2]">PATRICK</span> n{" "}
          <span className="text-[#EFB6C8]">DJUMMYS</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto">
          Baked with love, delivered with joy. From elegant cakes to delightful treats, we bring your sweetest dreams to life.
        </p>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="px-10 py-4 text-lg font-semibold rounded-md text-white shadow-lg"
            style={{
              background: "",
            }}
          >
            ORDER NOW →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;














import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Truck, Package } from 'lucide-react';

// Simulated form validation hook
const useForm = <T extends Record<string, any>>(options: { defaultValues: T }) => {
  const [values, setValues] = useState<T>(options.defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, { message: string }>>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (name: keyof T, value: any, rules: any) => {
    if (rules.required && !value) {
      return { message: typeof rules.required === 'string' ? rules.required : `${String(name)} is required` };
    }
    if (rules.minLength && value.length < rules.minLength.value) {
      return { message: rules.minLength.message };
    }
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return { message: rules.maxLength.message };
    }
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return { message: rules.pattern.message };
    }
    if (rules.min && value < rules.min.value) {
      return { message: rules.min.message };
    }
    return null;
  };

  const register = (name: keyof T, rules: any = {}) => ({
    value: values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
      setValues(prev => ({ ...prev, [name]: value }));
      
      const error = validateField(name, value, rules);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    },
    name: String(name),
  });

  const handleSubmit = (onSubmit: (data: T) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const reset = () => {
    setValues(options.defaultValues);
    setErrors({});
  };

  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const watch = (name: keyof T) => values[name];

  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== null);
    const hasRequiredValues = values.name && values.email && values.amount > 0;
    setIsValid(!hasErrors && hasRequiredValues);
  }, [errors, values]);

  return {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  };
};

interface OrderFormData {
  name: string;
  house_address: string;
  city: string;
  state: string;
  email: string;
  phone_number?: string;
  amount: number;
  order_note?: string;
  delivery_method: 'pickup' | 'delivery';
}

// Define the expected backend response type
interface OrderResponse {
  message: string;
  orderId?: number;
  errors?: string[];
}

const Checkout: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch } = useForm<OrderFormData>({
    defaultValues: {
      name: '',
      house_address: '',
      city: '',
      state: '',
      email: '',
      phone_number: '',
      amount: 0,
      order_note: '',
      delivery_method: 'pickup',
    },
  });

  const publicKey = 'pk_test_aec8c259e1ce57181cd86aaf6026cf2f028d8f42'; // Note: This is a test key; use production key in live env

  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const deliveryMethod = watch('delivery_method');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get('amount');
    if (amountParam) {
      const amount = parseFloat(amountParam);
      if (!isNaN(amount) && amount > 0) {
        setValue('amount', amount);
      }
    }
  }, [setValue]);

  const simulatePayment = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setMessage('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const paymentReference = `PAY_${new Date().getTime()}`;
      console.log("🚀 Payment successful, reference:", paymentReference);
      
      // Simulate order creation
      const orderData = {
        ...data,
        paymentReference,
        timestamp: new Date().toISOString(),
      };
      
      console.log("📦 Order data to be saved:", orderData);
      
      // Here you would normally send to your backend:
      // fetch('http://localhost:5000/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // })
      
      const mockOrderId = Math.floor(Math.random() * 10000);
      setMessage(`Order created successfully! Order ID: ${mockOrderId}`);
      
      // Reset form after successful submission
      setTimeout(() => {
        reset();
      }, 500);
      
    } catch (error) {
      console.error("❌ Error processing order:", error);
      setMessage('An error occurred while processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Checkout
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete your order by providing your details below.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div onSubmit={handleSubmit(simulatePayment)} className="space-y-6">
              {/* Delivery Method Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Delivery Method *</Label>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(value) => setValue('delivery_method', value as 'pickup' | 'delivery')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <Package className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Pickup</div>
                        <div className="text-sm text-muted-foreground">Collect from store</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <Truck className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-muted-foreground">Deliver to address</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <input type="hidden" {...register('delivery_method')} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register('name', { 
                      required: 'Name is required', 
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      maxLength: { value: 255, message: 'Name cannot exceed 255 characters' }
                    })}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required', 
                      pattern: { 
                        value: /^\S+@\S+\.\S+$/i, 
                        message: 'Please enter a valid email address' 
                      }
                    })}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    {...register('phone_number', { 
                      minLength: { value: 7, message: 'Phone number must be at least 7 characters' },
                      maxLength: { value: 15, message: 'Phone number cannot exceed 15 characters' }
                    })}
                    placeholder="Enter your phone number (optional)"
                  />
                  {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    readOnly
                    {...register('amount', {
                      required: 'Amount is required',
                      min: { value: 0.01, message: 'Amount must be greater than 0' },
                      valueAsNumber: true,
                    })}
                    placeholder="Enter order amount"
                  />
                  {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                </div>
              </div>

              {/* Address fields - conditionally required based on delivery method */}
              {deliveryMethod === 'delivery' && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Delivery Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="house_address">House Address *</Label>
                      <Input
                        id="house_address"
                        {...register('house_address', { 
                          required: deliveryMethod === 'delivery' ? 'Address is required for delivery' : false, 
                          minLength: { value: 5, message: 'Address must be at least 5 characters' }
                        })}
                        placeholder="Enter your house address"
                      />
                      {errors.house_address && <p className="text-sm text-destructive">{errors.house_address.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register('city', { 
                          required: deliveryMethod === 'delivery' ? 'City is required for delivery' : false, 
                          minLength: { value: 2, message: 'City must be at least 2 characters' },
                          maxLength: { value: 100, message: 'City cannot exceed 100 characters' }
                        })}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        {...register('state', { 
                          required: deliveryMethod === 'delivery' ? 'State is required for delivery' : false, 
                          minLength: { value: 2, message: 'State must be at least 2 characters' },
                          maxLength: { value: 100, message: 'State cannot exceed 100 characters' }
                        })}
                        placeholder="Enter your state"
                      />
                      {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {deliveryMethod === 'pickup' && (
                <>
                  <input type="hidden" {...register('house_address')} value="" />
                  <input type="hidden" {...register('city')} value="" />
                  <input type="hidden" {...register('state')} value="" />
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="order_note">Order Note</Label>
                <Textarea
                  id="order_note"
                  {...register('order_note')}
                  placeholder="Any special instructions (optional)"
                  className="min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleSubmit(simulatePayment)}
                disabled={!isValid || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Processing...' : 'Pay with Paystack'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {message && (
          <Card className={`max-w-2xl mx-auto mt-6 ${
            message.includes('successfully') 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <CardContent className="p-4">
              <p className={message.includes('successfully') ? 'text-green-800' : 'text-red-800'}>
                {message}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default Checkout;
