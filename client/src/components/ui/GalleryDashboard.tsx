import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import brownie from "@/assets/brownies.png";
import cakeslice from "@/assets/cakeslice.png";
import cinnamon from "@/assets/cinnamon.png";
import cupcake from "@/assets/cupcake.png";
import doughnut from "@/assets/doughnuts.png";
import macroons from "@/assets/macroons.png";
import meatpie from "@/assets/meatpie.png";
import oreos from "@/assets/oreos.png";
import vanillasponge from "@/assets/vanillasponge.png";
import bundt from "@/assets/bundt.png";
import cake1 from "@/assets/cake1.jpg";
import cake2 from "@/assets/cake2.jpg";
import cake3 from "@/assets/cake3.jpg";
import cake4 from "@/assets/cake4.jpg";
import cake5 from "@/assets/cake5.jpg";
import cake6 from "@/assets/cake6.jpg";
import cake7 from "@/assets/cake7.jpg";
import cake8 from "@/assets/cake8.jpg";
import cake9 from "@/assets/cake9.jpg";
import cake10 from "@/assets/cake10.jpg";
import cake11 from "@/assets/cake11.jpg";


const GalleryDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All P&J" },
    { id: "cakes", name: "Cake" },
    { id: "pastries", name: "Pastries" },
    { id: "treats", name: "Treats" },
    { id: "custom", name: "Custom" },
  ];

  const galleryItems = [
    {
      id: 1,
      title: "Brownies",
      category: "pastries",
      image: brownie,
      description: "Crunch chocolate cake with rich ganache ",
      rating: 5,
      basePrice: 16500,
      tags: [
        { name: "Box of 6", price: 16500 },
        { name: "Box of 12", price: 30000 }
      ]
    },
    {
      id: 2,
      title: "Cake Slice",
      category: "cakes",
      image: cakeslice,
      description: "Colorful cake slice",
      rating: 5,
      basePrice: 18000,
      tags: [
        { name: "Box of 6", price: 18000 },
        { name: "Box of 12", price: 34000 }
      ]
    },
    {
      id: 3,
      title: "Cinnamon Rolls",
      category: "pastries",
      image: cinnamon,
      description: "Cinnamon with cream cheese frosting ",
      rating: 5,
      basePrice: 15000,
      tags: [
        { name: "Box of 6", price: 15000 },
        { name: "Box of 12", price: 28000 }
      ]
    },
    {
      id: 4,
      title: "Cupcakes",
      category: "cakes",
      image: cupcake,
      description: "Flavoured Cupcakes",
      rating: 5,
      basePrice: 16500,
      tags: [
        { name: "Box of 6", price: 16500 },
        { name: "Box of 12", price: 30000 }
      ]
    },
    {
      id: 5,
      title: "Doughnut",
      category: "pastries",
      image: doughnut,
      description: "Doughnut with sprinkles and icing",
      rating: 5,
      basePrice: 12000,
      tags: [
        { name: "Box of 12 Midi", price: 12000 },
        { name: "Box of 12 Midi with Fillings", price: 18000 },
        { name: "Box of 12 Maxi", price: 24000 },
        { name: "Box of 12 Maxi with Fillings", price: 30000 }
      ]
    },
    
    {
      id: 6,
      title: "Macroons",
      category: "treats",
      image: macroons,
      description: "Macroons with assorted fillings",
      rating: 5,
      basePrice: 10000,
      tags: [
        { name: "Box of 6", price: 10000 },
        { name: "Box of 12", price: 18000 }
      ]
    },

    {
      id: 7,
      title: "Meat Pie and Chicken Pie",
      category: "pastries",
      image: meatpie,
      description: "Spicy meat pie and chicken pie",
      rating: 5,
      basePrice: 5000,
      tags: [
        { name: "Box of 12 Midi", price: 5000 },
        { name: "Box of 12 Maxi", price: 9000 }
      ]
    },
    {
      id: 8,
      title: "Chocolate Covered Oreos",
      category: "treats",
      image: oreos,
      description: "Sugary Chocolate covered oreos with sprinkles",
      rating: 5,
      basePrice: 16000,
      tags: [
        { name: "Tubs of 5", price: 16000 },
        { name: "Tubs of 10", price: 30000 }
      ]
    },

    {
      id: 9,
      title: "Vanilla Sponge Cake",
      category: "cakes",
      image: vanillasponge,
      description: "Cream vanilla sponge cake with buttercream and candy decorations",
      rating: 5,
      basePrice: 25000,
      tags: [
        { name: "6 inches", price: 25000 },
        { name: "8 inches", price: 40000 }
      ]
    },
    {
      id: 10,
      title: "Bundt Cake",
      category: "cakes",
      image: bundt,
      description: "One-pan cakes baked in various beautiful origami shaped moulds",
      rating: 5,
      basePrice: 60000,
      tags: [
        { name: "Double Chocolate Chips", price: 60000 },
        { name: "Red velvet & cream cheese", price: 65000 },
        { name: "Vanilla & Mixed Berries", price: 70000 }
      ]
    },



    {
      id: 11,
      title: "Custom 8 inch cake",
      category: "custom",
      image: cake1,
      description: "8 inch tall 4 flavours white chocolate ganache cover",
      rating: 5,
      basePrice: 210000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },

        {
      id: 12,
      title: "Custom 8 inch cake",
      category: "custom",
      image: cake2,
      description: "8 inch tall 4 flavours white chocolate ganache cover",
      rating: 5,
      basePrice: 280000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },

        {
      id: 13,
      title: "Custom 8 inch cake",
      category: "custom",
      image: cake3,
      description: "8 inch tall 4 flavours white chocolate ganache cover",
      rating: 5,
      basePrice: 375000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },


        {
      id: 14,
      title: "Custom 2 tier 10 inch and 8 inch short",
      category: "custom",
      image: cake4,
      description: " 2 tier 10 inch and 8 inch short dark chocolate ganache and fondant flutes",
      rating: 5,
      basePrice: 460000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },

        {
      id: 15,
      title: "Custom 8 inch cake",
      category: "custom",
      image: cake5,
      description: "8 inch tall white chocolate and velour cover",
      rating: 5,
      basePrice: 220000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },

        {
      id: 16,
      title: "Custom 6 inch cake",
      category: "custom",
      image: cake6,
      description: "6 inch tall with dark chocolate ganache and marbles fondant cover",
      rating: 5,
      basePrice: 150000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },

        {
      id: 17,
      title: "Custom 8 inch cake",
      category: "custom",
      image: cake7,
      description: "8 inch tall swiss meringue butter cream",
      rating: 5,
      basePrice: 200000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },


        {
      id: 18,
      title: "Custom 8 inch cake",
      category: "custom",
      image: cake8,
      description: "8 inch tall  chocolate ganache and fondant cover",
      rating: 5,
      basePrice: 230000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },

        {
      id: 19,
      title: "Custom 8 inch cake",
      category: "custom",
      image: cake9,
      description: "8 inch tall white chocolate ganache and wafer paper cover",
      rating: 5,
      basePrice: 225000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },

            {
      id: 20,
      title: "Custom 10 inch cake",
      category: "custom",
      image: cake10,
      description: "10 inch tall  chocolate ganache cover and paper wrap",
      rating: 5,
      basePrice: 225000,
      tags: [
        { name: "ORDER", price: 300000 },

      ]
    },

            {
      id: 21,
      title: "Custom 6 inch cake",
      category: "custom",
      image: cake11,
      description: "6 inch tall ganache and fondant covered",
      rating: 5,
      basePrice: 145000,
      tags: [
        { name: "ORDER", price: 60000 },

      ]
    },
  ];

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const addToCart = (item, selectedTag) => {
    const updatedItem = {
      ...item,
      price: `₦${selectedTag ? selectedTag.price : item.basePrice}`,
      selectedTag: selectedTag ? selectedTag.name : item.tags[0].name
    };
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...savedCart, updatedItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate("/cart");
  };

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Shop
          </h2>
          <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-primary" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our collection of Treats and beautiful custom cakes  
            created for our amazing customers!
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge variant="secondary" className="bg-[#A1CAE2]">
                          ₦{item.basePrice}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white">
                        <Heart className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-80 md:h-96 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Heart className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-lg">{item.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Choice</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => addToCart(item, tag)}
                            className="mb-2"
                          >
                            {tag.name} (+₦{tag.price})
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryDashboard;