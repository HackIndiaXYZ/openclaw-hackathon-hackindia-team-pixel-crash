import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-b from-green-50 to-green-100 py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* About Us Column */}
          <div className="space-y-6">
            <h3 className="text-lg lg:text-xl font-semibold text-green-800 mb-4">About Us</h3>

            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              Smart farming solutions for modern agriculture, empowering farmers with technology and data-driven
              insights.
            </p>

            <div className="flex items-start gap-3 text-sm lg:text-base text-slate-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0 mt-1" />
              <span>123 Agro Park, Tech Valley, Bangalore - 560001</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs lg:text-sm text-slate-500 mb-1">Farmers Served</p>
                <p className="text-xl lg:text-2xl font-bold text-green-700">10,000+</p>
              </div>
              <div className="text-center">
                <p className="text-xs lg:text-sm text-slate-500 mb-1">States Covered</p>
                <p className="text-xl lg:text-2xl font-bold text-green-700">15+</p>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h3 className="text-lg lg:text-xl font-semibold text-green-800 mb-4">Quick Links</h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Link
                href="/kisan-setu"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                KisanSetu
              </Link>
              <Link
                href="/market-analysis"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Market Analysis
              </Link>
              <Link
                href="/agro-tourism"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Agro Tourism
              </Link>
              <Link
                href="/weather"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Weather Tracking
              </Link>
              <Link
                href="/shop"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Shop
              </Link>
              <Link
                href="/agricare"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                AgriCare
              </Link>
              <Link
                href="/agro-bot"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Agro Bot
              </Link>
              <Link
                href="/contact"
                className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Contact Us
              </Link>
            </div>

            {/* Our Achievements Section */}
            <div className="mt-8">
              <h4 className="text-base lg:text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Our Achievements
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 text-sm font-bold">🏆</span>
                  </div>
                  <span className="text-sm lg:text-base text-slate-600">Best AgriTech Solution 2024</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">📋</span>
                  </div>
                  <span className="text-sm lg:text-base text-slate-600">ISO 9001 Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us Column */}
          <div className="space-y-6">
            <h3 className="text-lg lg:text-xl font-semibold text-green-800 mb-4">Contact Us</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0" />
                <a
                  href="mailto:info@agrogenix.com"
                  className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors"
                >
                  info@agrogenix.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0" />
                <a
                  href="tel:+918765432109"
                  className="text-sm lg:text-base text-slate-600 hover:text-green-700 transition-colors"
                >
                  +91 87654 32109
                </a>
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <h4 className="text-base lg:text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Follow us on social media
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-green-600" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-all hover:scale-110"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5 text-green-600" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-green-600" />
                </a>
              </div>
            </div>

            {/* Business Hours Section */}
            <div>
              <h4 className="text-base lg:text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Business Hours
              </h4>
              <div className="space-y-2 text-sm lg:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Monday - Friday:</span>
                  <span className="text-slate-800 font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Saturday:</span>
                  <span className="text-slate-800 font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sunday:</span>
                  <span className="text-slate-800 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-green-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg lg:text-xl font-bold text-green-800">AGRO-GENIX</span>
            </div>
            <p className="text-sm lg:text-base text-slate-500 text-center sm:text-right">
              © 2025 AGRO-GENIX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
