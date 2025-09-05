import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LastMinuteOrders: React.FC = () => {
  const navigate = useNavigate();

  const quickCakes = [
    {
      id: 1,
      name: "Custom Cake 1 Flavor",
      description: "NB: All Express Cakes are butter cream",
      sizes: ["6\"", "8\"", "10\""],
      readyIn: "3 hours",
      price: "From ₦37,500",
    },
    {
      id: 2,
      name: "Custom Cake 2 Flavors",
      description: "NB: All Express Cakes are butter cream",
      sizes: ["6\"", "8\"", "10\""],
      readyIn: "3 hours",
      price: "From ₦75,000",
    },
  ];

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Contact", path: "/contact" },
    { name: "Express Orders", path: "/ExpressDashboard" },
  ];

  return (
    <footer className="bg-gradient-to-br from-secondary/10 to-primary/10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Express Cakes Section */}
        <section id="orders" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Express Cakes
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Never miss a celebration! Our express cakes are ready in just 3 hours. Choose from 6\", 8\", or 10\" sizes, with one or two flavors, covered in Swiss Meringue buttercream.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {quickCakes.map((cake) => (
              <Card
                key={cake.id}
                className="hover:shadow-xl transition-shadow duration-300 border border-muted rounded-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{cake.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Ready in {cake.readyIn}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{cake.description}</p>
                  <div>
                    <div className="text-sm font-medium mb-2">Available sizes:</div>
                    <div className="flex flex-wrap gap-2">
                      {cake.sizes.map((size, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{cake.price}</span>
                    <Button
                      size="sm"
                      onClick={() => navigate("/ExpressDashboard")}
                      aria-label={`Order ${cake.name}`}
                    >
                      Quick Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer Content */}
        <div className=" bg-[#A1CAE2] border-t border-muted pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-foreground">PatricknJummys</h3>
              <p className="text-sm text-muted-foreground">
                Baked with love, crafted for joy. Your go-to for custom and express cakes that make every moment special.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/patricknjummys?igsh=Z3hpbTE5dWFxNDdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow PatricknJummys on Instagram"
                >
                  <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors duration-200" />
                </a>
                <a
                  href="https://www.facebook.com/102256412003412"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow PatricknJummys on Facebook"
                >
                  <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors duration-200" />
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow PatricknJummys on Twitter"
                >
                  <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors duration-200" />
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Button
                      variant="link"
                      className="p-0 text-muted-foreground hover:text-primary text-sm"
                      onClick={() => navigate(link.path)}
                      aria-label={`Navigate to ${link.name}`}
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Contact Us</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:+2348077531368" className="hover:text-primary transition-colors">
                    0807 753 1368
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:info@patricknjummys.com" className="hover:text-primary transition-colors">
                    info@patricknjummys.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-muted pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PatricknJummys. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LastMinuteOrders;