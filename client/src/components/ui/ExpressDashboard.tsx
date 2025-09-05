import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import ExpressCake from "@/assets/express-cake.jpg";
import { useNavigate } from "react-router-dom";

const ExpressDashboard = () => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("6");
  const [layers, setLayers] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [cakeMessage, setCakeMessage] = useState("");
  const [selectedDecorations, setSelectedDecorations] = useState([]);

  const sizes = [
    { id: "6", name: "6 inches", price: 37500 },
    { id: "8", name: "8 inches", price: 50000 },
    { id: "10", name: "10 inches", price: 72500 },
  ];

  const prices = {
    "6": { 1: 37500, 2: 75000, 3: 112500, 4: 150000 },
    "8": { 1: 50000, 2: 100000, 3: 150000, 4: 200000 },
    "10": { 1: 72500, 2: 145000, 3: 217500, 4: 290000 },
  };

  const flavors = [
    { id: "vanilla", name: "Classic Vanilla", price: 0 },
    { id: "caramel", name: "Salted Caramel", price: 0 },
    { id: "cookies-and-cream", name: "Cookies and Cream", price: 0 },
    { id: "vanilla-with-raspberry", name: "Vanilla with raspberry", price: 12000 },
    { id: "strawberry-vanilla", name: "strawberry vanilla", price: 0 },
    { id: "blueberry-vanilla", name: "Blueberry vanilla", price: 0 },
    { id: "double-chocolate-chip", name: "Double chocolate chip", price: 0 },
    { id: "carrot", name: "Carrot", price: 8000 },
    { id: "lotus-biscoff", name: "Lotus biscoff", price: 0 },
    { id: "red-velvet", name: "Red Velvet", price: 0 },
    { id: "lemon", name: "Lemon", price: 0 },
    { id: "lemon-blueberry", name: "Lemon & blueberry", price: 0 },
  ];

  const decorations = [
    { id: "flowers", name: "Sugar Flowers", price: 20000 },
    { id: "roses", name: "Buttercream Roses", price: 15000 },
    { id: "pearls", name: "Edible Pearls", price: 10000 },
    { id: "gold-leaf", name: "Gold Leaf", price: 25000 },
    { id: "figurines", name: "Custom Figurines", price: 35000 },
  ];

  const handleDecorationChange = (decorationId, checked) => {
    if (checked) {
      setSelectedDecorations([...selectedDecorations, decorationId]);
    } else {
      setSelectedDecorations(selectedDecorations.filter((id) => id !== decorationId));
    }
  };

  const calculatePrice = () => {
    const basePrice = prices[selectedSize]?.[layers] || 0;
    const flavorPrice = flavors.find((f) => f.id === selectedFlavor)?.price || 0;
    const messagePrice = cakeMessage ? 10000 : 0;
    const decorationPrice = selectedDecorations.reduce((sum, id) => sum + (decorations.find((d) => d.id === id)?.price || 0), 0);
    return basePrice + flavorPrice + messagePrice + decorationPrice;
  };

  const addToCart = () => {
    const item = {
      id: Date.now(),
      title: `Custom Cake - ${sizes.find((s) => s.id === selectedSize)?.name}`,
      price: `₦${calculatePrice().toLocaleString()}`,
      options: flavors.find((f) => f.id === selectedFlavor)?.name || "No flavor selected",
      inches: sizes.find((s) => s.id === selectedSize)?.name,
      layers: layers,
      flowerToppings: selectedDecorations
        .map((id) => decorations.find((d) => d.id === id)?.name)
        .join(", "),
      textToAppear: cakeMessage,
      quantity: 1,
      orderNote: `Express order: ${cakeMessage || "No message"}`,
    };

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...savedCart, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Navigate immediately, mimicking CakeCustomizer
    navigate('/cart');
  };

  return (
    <section id="customize" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Express Cakes<span className="text-sm">(All express cakes are butter cream)</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Never miss a birthday again, ready in 3hrs. Express cakes are 
            3 to 6 inches tall and are one to two flavors, covered with
            Swiss Meringue butter cream; (personalized topper
            messages are at an additional cost)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Customization Form */}
          <div className="space-y-8">
            {/* Size Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Choose Your Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {sizes.map((size) => (
                      <div key={size.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={size.id} id={size.id} />
                        <Label htmlFor={size.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{size.name}</div>
                          <div className="text-sm font-semibold text-primary">Starting from ₦{size.price}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Layers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Number of Layers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLayers(Math.max(1, layers - 1))}
                    disabled={layers <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">{layers}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLayers(Math.min(4, layers + 1))}
                    disabled={layers >= 4}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {layers === 1 ? "Single layer" : `${layers} layers`} 
                    {layers > 1 && <span> (+₦{(layers - 1) * 37500})</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flavor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Select Your Flavor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedFlavor} onValueChange={setSelectedFlavor}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {flavors.map((flavor) => (
                      <div key={flavor.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={flavor.id} id={flavor.id} />
                        <Label htmlFor={flavor.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{flavor.name}</div>
                          {flavor.price > 0 && (
                            <div className="text-sm font-semibold text-primary">+₦{flavor.price}</div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Custom Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Add Topper Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder="(e.g., Happy Birthday!)"
                  className="w-full"
                />
                {cakeMessage && (
                  <div className="text-sm font-semibold text-primary mt-2">+₦10000</div>
                )}
              </CardContent>
            </Card>

            {/* Decorations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  Add Decorations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {decorations.map((decoration) => (
                    <div key={decoration.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={decoration.id}
                        checked={selectedDecorations.includes(decoration.id)}
                        onCheckedChange={(checked) => handleDecorationChange(decoration.id, !!checked)}
                      />
                      <Label htmlFor={decoration.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{decoration.name}</div>
                        <div className="text-sm font-semibold text-primary">+₦{decoration.price}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Order Summary */}
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle>Express Cake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview Image */}
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={ExpressCake}
                    alt="Cake customization preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Order Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{sizes.find((s) => s.id === selectedSize)?.name} with {layers} {layers === 1 ? 'layer' : 'layers'}</span>
                      <span>₦{prices[selectedSize]?.[layers] || 0}</span>
                    </div>
                    
                    {selectedFlavor && (
                      <div className="flex justify-between">
                        <span>Flavor: {flavors.find((f) => f.id === selectedFlavor)?.name}</span>
                        <span>
                          {flavors.find((f) => f.id === selectedFlavor)?.price === 0 
                            ? "Included" 
                            : `+₦${flavors.find((f) => f.id === selectedFlavor)?.price}`}
                        </span>
                      </div>
                    )}
                    
                    {cakeMessage && (
                      <div className="flex justify-between">
                        <span>Custom Message: {cakeMessage}</span>
                        <span>+₦10000</span>
                      </div>
                    )}
                    
                    {selectedDecorations.length > 0 && (
                      <div className="space-y-1">
                        <div className="font-medium">Decorations:</div>
                        {selectedDecorations.map((decorationId) => {
                          const decoration = decorations.find((d) => d.id === decorationId);
                          return (
                            <div key={decorationId} className="flex justify-between ml-4">
                              <span>{decoration?.name}</span>
                              <span>+₦{decoration?.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₦{calculatePrice()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {sizes.find((s) => s.id === selectedSize)?.name}
                    </Badge>
                    <Badge variant="secondary">
                      {layers} {layers === 1 ? 'layer' : 'layers'}
                    </Badge>
                    {selectedFlavor && (
                      <Badge variant="secondary">
                        {flavors.find((f) => f.id === selectedFlavor)?.name}
                      </Badge>
                    )}
                    {selectedDecorations.map((id) => (
                      <Badge key={id} variant="secondary">
                        {decorations.find((d) => d.id === id)?.name}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" size="lg" onClick={addToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart - ₦{calculatePrice()}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Need it faster? Check our <a href="#orders" className="text-primary hover:underline">last-minute orders</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpressDashboard;