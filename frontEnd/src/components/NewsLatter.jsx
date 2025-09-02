import React, { useState } from "react";
import { FaEnvelope, FaPaperPlane, FaTag } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with:", email);
      setSubmitted(true);
      setEmail("");
      // Reset after 4 seconds
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="w-full py-12 px-4 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all hover:shadow-xl">
        <div className="md:flex">
          <div className="md:w-2/5 bg-black text-white p-8 flex flex-col justify-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gray-800 p-4 rounded-full">
                <FaTag className="text-3xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">20% OFF</h3>
            <p className="text-center text-gray-300">
              Subscribe now and get an instant discount on your next purchase
            </p>
          </div>

          <div className="md:w-3/5 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-gray-100 p-4 rounded-full mb-6">
                  <FaPaperPlane className="text-3xl text-gray-800" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
                <p className="text-gray-600 text-center mb-6">
                  Check your email for your 20% discount code
                </p>
                <div className="border border-gray-300 rounded-lg p-4 w-full max-w-xs text-center">
                  <p className="font-mono text-lg tracking-widest">NEWS20</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Copy this code at checkout
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
                <p className="text-gray-600 mb-6">
                  Subscribe to get exclusive updates and your 20% discount code
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div
                    className={`relative border ${
                      isFocused ? "border-gray-800" : "border-gray-300"
                    } rounded-lg transition-all`}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Your email address"
                      required
                      className="w-full px-5 py-4 pl-14 bg-transparent focus:outline-none"
                    />
                    <FaEnvelope className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium group"
                  >
                    <span>Subscribe & Get Discount</span>
                    <FaPaperPlane className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>

                <p className="text-gray-500 text-xs text-center mt-6">
                  By subscribing, you agree to receive marketing emails.
                  Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
