import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/imgs";
import Newsletter from "../components/NewsLatter";

const About = () => {
  return (
    <div className="pageW  px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="text-center text-2xl">
        <Title text1={"About"} text2={"Us"} />
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Crafting quality fashion that stands the test of time
        </p>
      </div>

      {/* About Content */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        <div className="lg:w-1/2">
          <img
            className="w-full h-[400px] object-cover rounded-lg shadow-md"
            src={assets.about_image}
            alt="About Our Store"
          />
        </div>
        <div className="lg:w-1/2 space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Founded in 2020, Forever has become synonymous with timeless style
            and sustainable fashion. We believe in creating pieces that not only
            look good but also stand the test of time, both in quality and
            design.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our commitment to ethical manufacturing and sustainable practices
            sets us apart. We work closely with skilled artisans and use premium
            materials to ensure each piece meets our high standards of quality.
          </p>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To provide sustainable, high-quality fashion that empowers
              individuals to express their unique style while minimizing
              environmental impact. We strive to create a more conscious and
              sustainable fashion industry.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-10 text-4xl">
        <Title text1={"Why"} text2={"Choose Us"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {/* Quality Card */}
        <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quality Assurance
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Every piece undergoes rigorous quality control. We use premium
            materials and partner with skilled craftsmen to ensure lasting
            quality in every garment we produce.
          </p>
        </div>

        {/* Convenience Card */}
        <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Easy Shopping Experience
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Shop effortlessly with our intuitive website, secure checkout, and
            flexible delivery options. We make online shopping simple and
            enjoyable.
          </p>
        </div>

        {/* Support Card */}
        <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Exceptional Support
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Our dedicated support team is here to help you 24/7. From style
            advice to order assistance, we ensure you have the best shopping
            experience.
          </p>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};

export default About;
