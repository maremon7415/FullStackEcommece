import { assets } from "../assets/imgs";

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full mt-5 lg:mt-10 gap-4 border">
      {/* Left side of hero section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:py-10 md:ml-0">
        <div className="flex flex-col items-center lg:items-start  text-center lg:text-left">
          <div className="flex items-center gap-3 text-[#414141]">
            <div className="w-8 md:w-12 h-[2px] bg-[#414141]"></div>
            <p className="font-medium text-sm md:text-base uppercase tracking-wide">
              our best-seller
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight lg:leading-relaxed">
            Latest Arrivals
          </h1>

          <div className="flex items-center gap-3">
            <p className="font-semibold text-sm md:text-base uppercase tracking-wide">
              shop now
            </p>
            <div className="w-8 md:w-12 h-[2px] bg-[#414141]"></div>
          </div>
        </div>
      </div>

      {/* Right side of hero section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img
          className="w-full max-w-md lg:max-w-none h-auto object-contain"
          src={assets.hero_img}
          alt="hero_img"
        />
      </div>
    </div>
  );
};

export default Hero;
