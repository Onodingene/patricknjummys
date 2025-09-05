import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';

// Define the form data type based on the orders table schema
interface OrderFormData {
  name: string;
  house_address: string;
  city: string;
  state: string;
  email: string;
  phone_number?: string;
  amount: number;
  order_note?: string;
}

// Define the expected backend response type
interface OrderResponse {
  message: string;
  orderId?: number;
  errors?: string[];
}

const Checkout: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OrderFormData>({
    defaultValues: {
      name: '',
      house_address: '',
      city: '',
      state: '',
      email: '',
      phone_number: '',
      amount: 0,
      order_note: '',
    },
  });
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setMessage('');
    
    try {
      console.log("🚀 Submitting order data:", data);
      console.log("📡 API URL:", 'http://localhost:5000/api/orders');
      
      const response = await axios.post<OrderResponse>('http://localhost:5000/api/orders', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      console.log("✅ Success response:", response.data);
      setMessage(`Order created successfully! Order ID: ${response.data.orderId}`);
      reset();
    } catch (error) {
      console.error("❌ Order submission error:", error);
      
      const axiosError = error as AxiosError<OrderResponse>;
      
      if (axiosError.response) {
        // Server responded with error status
        console.error("📋 Server response status:", axiosError.response.status);
        console.error("📋 Server response data:", axiosError.response.data);
        
        const errorMessage = axiosError.response.data?.message || 'Error creating order';
        const validationErrors = axiosError.response.data?.errors;
        
        if (validationErrors && validationErrors.length > 0) {
          setMessage(`Validation Error: ${validationErrors.join(', ')}`);
        } else {
          setMessage(`Server Error: ${errorMessage}`);
        }
      } else if (axiosError.request) {
        // Request was made but no response received
        console.error("🌐 Network error - no response received");
        console.error("🔧 Check if backend server is running on http://localhost:5000");
        setMessage('Network error: Could not connect to server. Please check if your backend is running on port 5000.');
      } else {
        // Something else happened
        console.error("⚠️ Unexpected error:", axiosError.message);
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name *</label>
          <input
            {...register('name', { 
              required: 'Name is required', 
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 255, message: 'Name cannot exceed 255 characters' }
            })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter your full name"
          />
          {errors.name && <span style={{ color: 'red', fontSize: '14px' }}>{errors.name.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>House Address *</label>
          <input
            {...register('house_address', { 
              required: 'Address is required', 
              minLength: { value: 5, message: 'Address must be at least 5 characters' }
            })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter your house address"
          />
          {errors.house_address && <span style={{ color: 'red', fontSize: '14px' }}>{errors.house_address.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>City *</label>
          <input
            {...register('city', { 
              required: 'City is required', 
              minLength: { value: 2, message: 'City must be at least 2 characters' },
              maxLength: { value: 100, message: 'City cannot exceed 100 characters' }
            })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter your city"
          />
          {errors.city && <span style={{ color: 'red', fontSize: '14px' }}>{errors.city.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>State *</label>
          <input
            {...register('state', { 
              required: 'State is required', 
              minLength: { value: 2, message: 'State must be at least 2 characters' },
              maxLength: { value: 100, message: 'State cannot exceed 100 characters' }
            })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter your state"
          />
          {errors.state && <span style={{ color: 'red', fontSize: '14px' }}>{errors.state.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email *</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required', 
              pattern: { 
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i, 
                message: 'Please enter a valid email address' 
              }
            })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter your email address"
          />
          {errors.email && <span style={{ color: 'red', fontSize: '14px' }}>{errors.email.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number</label>
          <input
            type="tel"
            {...register('phone_number', { 
              minLength: { value: 7, message: 'Phone number must be at least 7 characters' },
              maxLength: { value: 15, message: 'Phone number cannot exceed 15 characters' }
            })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter your phone number (optional)"
          />
          {errors.phone_number && <span style={{ color: 'red', fontSize: '14px' }}>{errors.phone_number.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Amount *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
              valueAsNumber: true,
            })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter order amount"
          />
          {errors.amount && <span style={{ color: 'red', fontSize: '14px' }}>{errors.amount.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Order Note</label>
          <textarea 
            {...register('order_note')} 
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder="Any special instructions (optional)"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '12px 24px', 
            background: isSubmitting ? '#ccc' : '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Checkout;







import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePaystackPayment } from 'react-paystack';

// Define the form data type based on the orders table schema
interface OrderFormData {
  name: string;
  house_address: string;
  city: string;
  state: string;
  email: string;
  phone_number?: string;
  amount: number;
  order_note?: string;
}

// Define the expected backend response type
interface OrderResponse {
  message: string;
  orderId?: number;
  errors?: string[];
}

const Checkout: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue } = useForm<OrderFormData>({
    defaultValues: {
      name: '',
      house_address: '',
      city: '',
      state: '',
      email: '',
      phone_number: '',
      amount: 0,
      order_note: '',
    },
  });

  const publicKey = 'pk_test_aec8c259e1ce57181cd86aaf6026cf2f028d8f42'; // Note: This is a test key; use production key in live env

  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handlePayment = (data: OrderFormData) => {
    setIsSubmitting(true);
    setMessage('');

    try {
      // Configure Paystack payment
      const config = {
        reference: new Date().getTime().toString(),
        email: data.email,
        amount: data.amount * 100, // Convert to kobo (assumes NGN)
        publicKey,
        metadata: {
          name: data.name,
          phone: data.phone_number,
          custom_fields: [
            {
              display_name: "House Address",
              variable_name: "house_address",
              value: data.house_address,
            },
            {
              display_name: "City",
              variable_name: "city",
              value: data.city,
            },
            {
              display_name: "State",
              variable_name: "state",
              value: data.state,
            },
            {
              display_name: "Order Note",
              variable_name: "order_note",
              value: data.order_note || 'N/A',
            },
          ],
        },
      };

      const initializePayment = usePaystackPayment(config);

      initializePayment({
        onSuccess: (reference: { reference: string }) => {
          // Payment successful - Now submit order to backend with payment reference
          console.log("🚀 Payment successful, reference:", reference);
          axios
            .post<OrderResponse>('http://localhost:5000/api/orders', { ...data, paymentReference: reference.reference }, {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            })
            .then((response) => {
              console.log("✅ Order created:", response.data);
              setMessage(`Order created successfully! Order ID: ${response.data.orderId}`);
              reset();
            })
            .catch((error) => {
              console.error("❌ Order submission error after payment:", error);
              const axiosError = error as AxiosError<OrderResponse>;
              if (axiosError.response) {
                const errorMessage = axiosError.response.data?.message || 'Error creating order';
                const validationErrors = axiosError.response.data?.errors;
                if (validationErrors && validationErrors.length > 0) {
                  setMessage(`Validation Error: ${validationErrors.join(', ')}`);
                } else {
                  setMessage(`Server Error: ${errorMessage}`);
                }
              } else {
                setMessage('An error occurred while creating the order after payment.');
              }
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        },
        onClose: () => {
          // Payment closed
          setMessage('Payment window closed without completion.');
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("❌ Error initiating payment:", error);
      setMessage('An unexpected error occurred while initiating payment.');
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
            <form onSubmit={handleSubmit(handlePayment)} className="space-y-6">
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
                  <Label htmlFor="house_address">House Address *</Label>
                  <Input
                    id="house_address"
                    {...register('house_address', { 
                      required: 'Address is required', 
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
                      required: 'City is required', 
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
                      required: 'State is required', 
                      minLength: { value: 2, message: 'State must be at least 2 characters' },
                      maxLength: { value: 100, message: 'State cannot exceed 100 characters' }
                    })}
                    placeholder="Enter your state"
                  />
                  {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
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
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Processing...' : 'Pay with Paystack'}
              </Button>
            </form>
          </CardContent>
        </Card>
        {message && (
          <Card className="max-w-2xl mx-auto mt-6" variant={message.includes('successfully') ? 'success' : 'destructive'}>
            <CardContent className="p-4">
              <p>{message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default Checkout;

