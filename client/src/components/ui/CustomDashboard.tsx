import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import customizeImage from "@/assets/customize-cake.jpg";
import cake6 from "@/assets/cake6.jpg";
import cake8 from "@/assets/cake8.jpg";
import cake10 from "@/assets/cake10.jpg";
import { useNavigate } from "react-router-dom";

// Define interfaces for data structures
interface Size {
  id: string;
  name: string;
  price: number;
}

interface PriceMap {
  [key: string]: { [key: number]: number };
}

interface Flavor {
  id: string;
  name: string;
  price: number;
}

interface Gender {
  id: string;
  name: string;
  price: number;
}

interface Decoration {
  id: string;
  name: string;
  price: number;
}

interface ImageMap {
  [size: string]: {
    [gender: string]: string;
  };
}

const CustomDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("6");
  const [layers, setLayers] = useState<number>(1);
  const [numFlavors, setNumFlavors] = useState<number>(1);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const [cakeMessage, setCakeMessage] = useState<string>("");
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [orderNote, setOrderNote] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);


  const sizes: Size[] = [
    { id: "4", name: "4 inches", price: 27500 },
    { id: "6", name: "6 inches", price: 37500 },
    { id: "8", name: "8 inches", price: 50000 },
    { id: "10", name: "10 inches", price: 72500 },
    { id: "12", name: "12 inches", price: 345000 },
    { id: "14", name: "14 inches", price: 400000 },
  ];

  const prices: PriceMap = {
    "6": { 1: 37500, 2: 75000, 3: 135000, 4: 140000 },
    "8": { 1: 50000, 2: 100000, 3: 187500, 4: 200000 },
    "10": { 1: 72500, 2: 145000, 3: 275000, 4: 300000 },
    "12": { 3: 345000, 4: 375000 },
    "14": { 3: 400000, 4: 435000 },
  };

  const imageMap: ImageMap = {
    "6": { male: cake6, female: cake6, girl: cake6, boy: cake6 },
    "8": { male: cake8, female: cake8, girl: cake8, boy: cake8 },
    "10": { male: cake10, female: cake10, girl: cake10, boy: cake10 },
    "12": { male: customizeImage, female: customizeImage, girl: customizeImage, boy: customizeImage },
    "14": { male: customizeImage, female: customizeImage, girl: customizeImage, boy: customizeImage },
  };

  const getPreviewImage = (): string => {
    if (uploadedImage) return uploadedImage;
    return imageMap[selectedSize]?.[selectedGender] || customizeImage;
  };

  const getFlavorLimits = (size: string): { min: number; max: number } => {
    switch (size) {
      case "6":
      case "8":
      case "10":
        return { min: 1, max: 4 };
      case "12":
      case "14":
        return { min: 3, max: 4 };
      default:
        return { min: 1, max: 4 };
    }
  };

  const limits = getFlavorLimits(selectedSize);

  const updateNumFlavors = (newNum: number): void => {
    const clamped = Math.max(limits.min, Math.min(limits.max, newNum));
    setNumFlavors(clamped);
    if (selectedFlavors.length > clamped) {
      setSelectedFlavors(selectedFlavors.slice(0, clamped));
    }
  };

  useEffect(() => {
    updateNumFlavors(numFlavors);
  }, [selectedSize, numFlavors]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPEG or PNG images are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setUploadedImageFile(file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

// Replace your addToCart function with this updated version:

const addToCart = async (): Promise<void> => {
  if (selectedFlavors.length === 0) {
    toast.error("Please select at least one flavor");
    return;
  }
  if (quantity < 1) {
    toast.error("Quantity must be at least 1");
    return;
  }

  setIsAddingToCart(true);
  const loadingToast = toast.loading("Adding to cart...");

  try {
    // Create item for localStorage (compatible with existing CartPage)
    const localStorageItem = {
      id: Date.now(), // Unique ID based on timestamp
      title: `Custom Cake - ${sizes.find((s) => s.id === selectedSize)?.name}`,
      price: `₦${Math.floor(calculatePrice() / quantity)}`, // Price per unit
      options: selectedFlavors.map(id => flavors.find(f => f.id === id)?.name).join(", "),
      inches: sizes.find((s) => s.id === selectedSize)?.name,
      layers: layers,
      recipientGender: genders.find((g) => g.id === selectedGender)?.name,
      flowerToppings: selectedDecorations.map(id => decorations.find(d => d.id === id)?.name).join(", "),
      textToAppear: cakeMessage,
      orderNote: orderNote,
      quantity: quantity,
      uploadedImage: uploadedImage, // Include uploaded image
    };

    // Save to localStorage for existing CartPage compatibility
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...savedCart, localStorageItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Also send to your backend API
    let cartId = localStorage.getItem("guestCartId");
    if (!cartId) {
      cartId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestCartId", cartId);
    }

    const formData = new FormData();
    formData.append("cartId", cartId);
    formData.append("inches", selectedSize);
    formData.append("num_layers", layers.toString());
    formData.append("num_flavors", numFlavors.toString());
    formData.append("flavors", JSON.stringify(selectedFlavors.map((id) => flavors.find((f) => f.id === id)?.name ?? "")));
    formData.append("gender", genders.find((g) => g.id === selectedGender)?.name ?? "Unknown");
    formData.append("topper_message", cakeMessage || "");
    formData.append("price", (calculatePrice() / quantity).toString());
    formData.append("quantity", quantity.toString());
    formData.append("decoration", selectedDecorations.map((id) => decorations.find((d) => d.id === id)?.name ?? "").join(", ") || "");
    formData.append("order_note", orderNote || "");
    if (uploadedImageFile) {
      formData.append("image", uploadedImageFile);
    }

    // Try to send to backend, but don't fail if it's not available
    try {
      const response = await fetch("http://localhost:5000/api/custom-cart", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.warn("Backend API unavailable, continuing with localStorage only");
      }
    } catch (error) {
      console.warn("Backend API unavailable:", error);
    }

    toast.success("Custom order added to cart!", { id: loadingToast });
    navigate("/cart");
  } catch (error) {
    console.error("Error adding custom order to cart:", error);
    toast.error(`Failed to add item to cart: ${error instanceof Error ? error.message : "Unknown error"}`, { id: loadingToast });
  } finally {
    setIsAddingToCart(false);
  }
};

  const flavors: Flavor[] = [
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

  const genders: Gender[] = [
    { id: "male", name: "Male", price: 0 },
    { id: "female", name: "Female", price: 0 },
    { id: "girl", name: "Girl", price: 0 },
    { id: "boy", name: "Boy", price: 0 },
  ];

  const decorations: Decoration[] = [
    { id: "flowers", name: "Sugar Flowers", price: 20000 },
    { id: "roses", name: "Buttercream Roses", price: 15000 },
    { id: "pearls", name: "Edible Pearls", price: 10000 },
    { id: "gold-leaf", name: "Gold Leaf", price: 25000 },
    { id: "figurines", name: "Custom Figurines", price: 35000 },
  ];

  const handleFlavorChange = (flavorId: string, checked: boolean): void => {
    if (checked) {
      if (selectedFlavors.length < numFlavors) {
        setSelectedFlavors([...selectedFlavors, flavorId]);
      }
    } else {
      setSelectedFlavors(selectedFlavors.filter((id) => id !== flavorId));
    }
  };

  const handleDecorationChange = (decorationId: string, checked: boolean): void => {
    if (checked) {
      setSelectedDecorations([...selectedDecorations, decorationId]);
    } else {
      setSelectedDecorations(selectedDecorations.filter((id) => id !== decorationId));
    }
  };

  const calculatePrice = (): number => {
    const basePrice = prices[selectedSize]?.[numFlavors] ?? 0;
    const flavorPrice = selectedFlavors.reduce((sum, id) => sum + (flavors.find((f) => f.id === id)?.price ?? 0), 0);
    const layerPrice = (layers - 1) * 20000;
    const genderPrice = genders.find((g) => g.id === selectedGender)?.price ?? 0;
    const messagePrice = cakeMessage ? 10000 : 0;
    const decorationPrice = selectedDecorations.reduce((sum, id) => sum + (decorations.find((d) => d.id === id)?.price ?? 0), 0);
    return (basePrice + flavorPrice + layerPrice + genderPrice + messagePrice + decorationPrice) * quantity;
  };

  return (
    <section id="customize" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Build Your Perfect Cake
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Customize every detail of your dream cake. From size and flavor to decorations, 
            create something truly unique for your special occasion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
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
                          <div className="text-sm font-semibold text-primary">Starting from ₦{size.price.toLocaleString()}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

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
                    onClick={() => setLayers(Math.min(5, layers + 1))}
                    disabled={layers >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {layers === 1 ? "Single layer" : `${layers} layers`} 
                    {layers > 1 && <span> (+₦{((layers - 1) * 20000).toLocaleString()})</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Number of Flavors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateNumFlavors(numFlavors - 1)}
                    disabled={numFlavors <= limits.min}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">{numFlavors}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateNumFlavors(numFlavors + 1)}
                    disabled={numFlavors >= limits.max}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {numFlavors === 1 ? "Single flavor" : `${numFlavors} flavors`}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Select Your Flavors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {flavors.map((flavor) => (
                    <div key={flavor.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={flavor.id}
                        checked={selectedFlavors.includes(flavor.id)}
                        onCheckedChange={(checked) => handleFlavorChange(flavor.id, !!checked)}
                        disabled={!selectedFlavors.includes(flavor.id) && selectedFlavors.length >= numFlavors}
                      />
                      <Label htmlFor={flavor.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{flavor.name}</div>
                        {flavor.price > 0 && (
                          <div className="text-sm font-semibold text-primary">+₦{flavor.price.toLocaleString()}</div>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  Choose Gender of Cake Recipient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedGender} onValueChange={setSelectedGender}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {genders.map((gender) => (
                      <div key={gender.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={gender.id} id={gender.id} />
                        <Label htmlFor={gender.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{gender.name}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">6</span>
                  Add Topper Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={cakeMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCakeMessage(e.target.value)}
                  placeholder="(e.g., Happy Birthday Baby!)"
                  className="w-full"
                />
                {cakeMessage && (
                  <div className="text-sm font-semibold text-primary mt-2">+₦10,000</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">7</span>
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
                        <div className="text-sm font-semibold text-primary">+₦{decoration.price.toLocaleString()}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">8</span>
                  Upload Inspiration Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                {uploadedImage && (
                  <div className="mt-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded cake reference"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">9</span>
                  Add Order Note (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orderNote}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrderNote(e.target.value)}
                  placeholder="Add any special instructions or notes for your order..."
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">10</span>
                  Quantity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle>Your Custom Cake</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={getPreviewImage()}
                    alt="Cake customization preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{sizes.find((s) => s.id === selectedSize)?.name ?? "Unknown"} with {numFlavors} {numFlavors === 1 ? "flavor" : "flavors"}</span>
                      <span>₦{(prices[selectedSize]?.[numFlavors] ?? 0).toLocaleString()}</span>
                    </div>
                    {layers > 1 && (
                      <div className="flex justify-between">
                        <span>Additional Layers ({layers - 1})</span>
                        <span>+₦{((layers - 1) * 20000).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="font-medium">Flavors:</div>
                      {selectedFlavors.map((id) => {
                        const flavor = flavors.find((f) => f.id === id);
                        return (
                          <div key={id} className="flex justify-between ml-4">
                            <span>{flavor?.name ?? "Unknown"}</span>
                            <span>{flavor?.price === 0 ? "Included" : `+₦${flavor?.price.toLocaleString()}`}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between">
                      <span>Gender: {genders.find((g) => g.id === selectedGender)?.name ?? "Unknown"}</span>
                      <span>Included</span>
                    </div>
                    {cakeMessage && (
                      <div className="flex justify-between">
                        <span>Custom Message: {cakeMessage}</span>
                        <span>+₦10,000</span>
                      </div>
                    )}
                    {selectedDecorations.length > 0 && (
                      <div className="space-y-1">
                        <div className="font-medium">Decorations:</div>
                        {selectedDecorations.map((decorationId) => {
                          const decoration = decorations.find((d) => d.id === decorationId);
                          return (
                            <div key={decorationId} className="flex justify-between ml-4">
                              <span>{decoration?.name ?? "Unknown"}</span>
                              <span>+₦{decoration?.price.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {orderNote && (
                      <div className="space-y-1">
                        <div className="font-medium">Order Note:</div>
                        <div className="ml-4 text-muted-foreground">{orderNote}</div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Quantity</span>
                      <span>{quantity}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₦{calculatePrice().toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{sizes.find((s) => s.id === selectedSize)?.name ?? "Unknown"}</Badge>
                    <Badge variant="secondary">{layers} {layers === 1 ? "layer" : "layers"}</Badge>
                    {selectedFlavors.map((id) => (
                      <Badge key={id} variant="secondary">{flavors.find((f) => f.id === id)?.name ?? "Unknown"}</Badge>
                    ))}
                    <Badge variant="secondary">{genders.find((g) => g.id === selectedGender)?.name ?? "Unknown"}</Badge>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={addToCart}
                    disabled={isAddingToCart || selectedFlavors.length === 0}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart - ₦{calculatePrice().toLocaleString()}
                      </>
                    )}
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

export default CustomDashboard;