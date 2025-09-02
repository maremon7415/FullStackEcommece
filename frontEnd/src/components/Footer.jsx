import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { assets } from "../assets/imgs";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebookF, href: "#" },
    { icon: FaTwitter, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaLinkedinIn, href: "#" },
  ];

  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about" },
    { name: "Collections", to: "/collections" },
    { name: "Contact", to: "/contact" },
    { name: "FAQs", to: "/faq" },
  ];

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="text-center lg:text-left grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex justify-center lg:justify-start">
              <img src={assets.logo} alt="Logo" className="w-32" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
              Premium quality products with timeless design. We believe in
              sustainable fashion and ethical manufacturing practices.
            </p>
            {/* Social Links */}
            <div className="flex justify-center lg:justify-start space-x-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center 
                           text-gray-600 hover:bg-black hover:text-white hover:border-black 
                           transition-all duration-300 ease-in-out"
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-black transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center lg:justify-start text-gray-600">
                <FaPhone className="mr-3" />
                <a
                  href="tel:+8801785892074"
                  className="hover:text-black transition-colors duration-300"
                >
                  +880 1785 892074
                </a>
              </li>
              <li className="flex items-center justify-center lg:justify-start text-gray-600">
                <FaEnvelope className="mr-3" />
                <a
                  href="mailto:support@forever.com"
                  className="hover:text-black transition-colors duration-300"
                >
                  support@forever.com
                </a>
              </li>
              <li className="flex items-center justify-center lg:justify-start text-gray-600">
                <FaMapMarkerAlt className="mr-3" />
                <span>123 Fashion Street, New York</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-4">
              &copy; {currentYear} forever.com - All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/privacy"
                className="hover:text-black transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-black transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-black transition-colors duration-300"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
