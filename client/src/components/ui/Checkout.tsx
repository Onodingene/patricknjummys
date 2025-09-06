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
      fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
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