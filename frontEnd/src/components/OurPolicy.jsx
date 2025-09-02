import { FaExchangeAlt, FaUndoAlt, FaHeadset } from "react-icons/fa";
import Title from "./Title";

const OurPolicy = () => {
  const policies = [
    {
      icon: <FaExchangeAlt className="text-3xl" />,
      title: "Easy Exchange Policy",
      description: "Hassle-free product exchanges within 14 days",
    },
    {
      icon: <FaUndoAlt className="text-3xl" />,
      title: "7 Days Return Policy",
      description: "Full refunds with no questions asked",
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "Premium Support",
      description: "24/7 customer service with real agents",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-3xl text-center py-8">
          <Title text1={"Our-Custome"} text2={"Promise"} />
          <p className="text-gray-500 text-xl">
            We're committed to providing exceptional service at every step of
            your shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-indigo-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors duration-300">
                  <div className="transition-colors">{policy.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {policy.title}
                </h3>
                <p className="text-gray-600">{policy.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
