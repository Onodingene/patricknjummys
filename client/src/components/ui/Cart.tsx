import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Import Badge for express indicator
import toast from "react-hot-toast";

const CartPage = () => {
  const [customOrders, setCustomOrders] = useState([]);
  const [regularCartItems, setRegularCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      // Fetch cart items from backend using a dummy cartId for now (replace with dynamic cartId)
      const cartId = localStorage.getItem("currentCartId") || Date.now().toString();
      const response = await fetch(`http://localhost:5000/api/custom-cart/${cartId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const orders = await response.json();
        // Filter for custom cakes (assuming all from custom_cart are custom cakes)
        const customCakes = orders.map(order => ({
          id: order.id,
          title: `Custom Cake - ${order.inches}`,
          price: `₦${order.price.toLocaleString()}`,
          options: order.flavors ? order.flavors.join(", ") : "No flavor selected",
          inches: order.inches,
          layers: order.num_layers,
          flowerToppings: order.decoration,
          textToAppear: order.topper_message,
          quantity: order.quantity || 1,
          orderNote: order.order_note,
        }));
        setCustomOrders(customCakes);

        // For now, regular items remain from localStorage (update if needed)
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const regularItems = savedCart.filter((item) => !item.title?.includes("Custom Cake"));
        setRegularCartItems(regularItems);
      } else {
        console.error("Failed to fetch cart items");
        // Fallback to localStorage if API fails
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const customCakes = savedCart.filter((item) => item.title?.includes("Custom Cake"));
        const regularItems = savedCart.filter((item) => !item.title?.includes("Custom Cake"));
        setCustomOrders(customCakes);
        setRegularCartItems(regularItems);
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
      // Fallback to localStorage
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const customCakes = savedCart.filter((item) => item.title?.includes("Custom Cake"));
      const regularItems = savedCart.filter((item) => !item.title?.includes("Custom Cake"));
      setCustomOrders(customCakes);
      setRegularCartItems(regularItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const updateItemQuantity = (id, delta) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = savedCart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    loadCartItems();
    toast.success("Quantity updated");
  };

  const removeItem = (id) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = savedCart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    loadCartItems();
    toast.success("Item removed from cart");
  };

  const customOrdersTotal = customOrders.reduce((sum, order) => {
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
                          <div className="flex gap-4">
                            {order.uploadedImage && (
                              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={order.uploadedImage}
                                  alt="Custom cake reference"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold mb-2">{order.title}</h4>
                              {order.orderNote?.includes("Express order") && (
                                <Badge variant="destructive" className="mb-2">Express</Badge>
                              )}
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
                                  {order.orderNote && (
                                    <p><strong>Order Note:</strong> {order.orderNote}</p>
                                  )}
                                </div>
                              </div>
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
                        <div className="flex items-center gap-2 ml-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(order.id, -1)}
                            disabled={(order.quantity || 1) <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">{order.quantity || 1}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(order.id, 1)}
                          >
                            +
                          </Button>
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