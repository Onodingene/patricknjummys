import { Button } from "@/components/ui/button";
import cakeimage from "@/assets/hero-cake.png";
import wheatImg from "@/assets/hero2-cake.png";
import cakeImg from "@/assets/hero-cake.png"; // add a cake image

const HeroSection = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-8 md:px-16 bg-white overflow-hidden font-['Dancing_Script',cursive]">
      
      {/* Left Side - Text + Cake */}
      <div className="flex flex-col items-center justify-center md:w-1/3 relative">

        <h1 className="text-8xl md:text-5xl font-bold tracking-tight text-gray-800 whitespace-nowrap">
          PATRICK n DJUMMYS
        </h1>

      </div>

      {/* Center - Basket Image */}
      <div className="relative flex justify-center md:w-1/3 z-10">
        <img
          src={cakeimage}
          alt="Basket of bread"
          className="max-h-[600px] object-contain"
        />
      </div>

      {/* Right Side - Description */}
      <div className="md:w-1/3 text-center md:text-left mt-8 md:mt-0">
        <img
          src={wheatImg}
          alt="Wheat"
          className="w-32 h-auto mb-4 mx-auto md:mx-0"
        />

        <p className="text-lg text-gray-700 leading-relaxed max-w-md">
          The bakery is an establishment that produces food baked in an oven
          such as bread, cookies, cakes, pastries, and pies. Some retail bakeries
          are also categorized as cafés, serving coffee and tea to customers.
        </p>

        {/* Button */}
        <div className="mt-6">
          <Button
            size="lg"
            className="px-8 py-4 text-lg font-semibold rounded-md text-white shadow-lg transition-all duration-300"
            style={{
              background: "#EFB6C8",
            }}
          >
            ORDER NOW →
          </Button>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full border-4 border-[#A1CAE2]/50"></div>
        <div className="absolute w-72 h-72 rounded-full border-4 border-[#EFB6C8]/50 bottom-10 right-10"></div>
        <div className="absolute w-40 h-40 rounded-full border-4 border-[#A1CAE2]/40 top-20 right-1/4"></div>
      </div>
    </section>
  );
};

export default HeroSection;
