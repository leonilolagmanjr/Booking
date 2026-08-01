import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Building2, CalendarDays, Clock, Shield,
  Star, ChevronRight, ArrowRight, CheckCircle, Users,
  MapPin, TennisBall,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Find Venues',
    desc: 'Browse hundreds of sports venues near you with detailed information and real-time availability.',
  },
  {
    icon: CalendarDays,
    title: 'Book Instantly',
    desc: 'Select your date, choose your time slot, and confirm your booking in seconds.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'Pay securely online with peace of mind. Your bookings are guaranteed.',
  },
  {
    icon: Clock,
    title: 'Manage Easily',
    desc: 'View, reschedule, or cancel bookings from your personal dashboard anytime.',
  },
];

const sports = [
  { name: 'Pickleball', icon: TennisBall, count: '24 venues' },
  { name: 'Tennis', icon: TennisBall, count: '18 venues' },
  { name: 'Basketball', icon: TennisBall, count: '12 venues' },
  { name: 'Badminton', icon: TennisBall, count: '15 venues' },
  { name: 'Volleyball', icon: TennisBall, count: '8 venues' },
  { name: 'Squash', icon: TennisBall, count: '6 venues' },
];

const steps = [
  { num: '01', title: 'Search', desc: 'Find venues by sport, location, or name' },
  { num: '02', title: 'Choose', desc: 'Browse courts, check availability, pick your slot' },
  { num: '03', title: 'Book', desc: 'Confirm your booking with secure payment' },
  { num: '04', title: 'Play', desc: 'Show up and enjoy your game!' },
];

const testimonials = [
  {
    quote: 'BookVault makes it so easy to find and book pickleball courts. I can reserve a court in under a minute!',
    name: 'Maria Santos',
    role: 'Regular Player',
  },
  {
    quote: 'As a venue owner, the business dashboard gives me full control over bookings and scheduling. Fantastic platform.',
    name: 'Juan Dela Cruz',
    role: 'Venue Owner',
  },
  {
    quote: 'No more calling around to check availability. Everything is online and real-time. Game changer!',
    name: 'Alex Reyes',
    role: 'Weekend Warrior',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0f1420]">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C08A5D]/10 via-transparent to-[#0f1420] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C08A5D]/20 bg-[#C08A5D]/10 px-4 py-1.5 text-sm font-medium text-[#C08A5D] mb-6">
              <Star size={14} />
              Trusted by 10,000+ Players
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Book Your Perfect
              <span className="block text-[#C08A5D]">Court, Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
              Discover and reserve sports venues near you. From pickleball to tennis,
              find available courts and book in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/venues"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold text-lg hover:bg-[#b07a4e] transition-all shadow-lg shadow-[#C08A5D]/25 no-underline"
              >
                <Search size={20} />
                Find Venues
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all no-underline"
              >
                Get Started Free
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#C08A5D]" />
                No hidden fees
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#C08A5D]" />
                Free cancellation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#C08A5D]" />
                24/7 support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED VENUES ═══════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Venues</h2>
              <p className="text-gray-400">Top-rated sports venues near you</p>
            </div>
            <Link
              to="/venues"
              className="hidden sm:flex items-center gap-2 text-[#C08A5D] font-medium hover:text-[#b07a4e] transition-colors no-underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link
                key={i}
                to="/venues"
                className="group block rounded-2xl border border-white/10 bg-[#151b27] overflow-hidden hover:border-[#C08A5D]/30 transition-all no-underline"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-[#1a1f2e] to-[#1e2538] flex items-center justify-center">
                  <Building2 size={48} className="text-[#C08A5D]/30" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-[#C08A5D] transition-colors">
                      {['Elite Sports Center', 'Metro Court Complex', 'Sunset Badminton Club'][i - 1]}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      <Star size={14} fill="currentColor" />
                      4.{8 + i}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin size={14} />
                    {['Makati City', 'Quezon City', 'Taguig City'][i - 1]}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded-md bg-[#C08A5D]/10 text-[#C08A5D]">Pickleball</span>
                    <span className="px-2 py-1 rounded-md bg-[#C08A5D]/10 text-[#C08A5D]">Tennis</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ POPULAR SPORTS ═══════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Popular Sports
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map((sport) => (
              <Link
                key={sport.name}
                to={`/venues?sport=${sport.name.toLowerCase()}`}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-[#151b27] border border-white/10 hover:border-[#C08A5D]/30 hover:bg-[#1a1f2e] transition-all group no-underline"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C08A5D]/10 flex items-center justify-center group-hover:bg-[#C08A5D]/20 transition-colors">
                  <sport.icon size={24} className="text-[#C08A5D]" />
                </div>
                <span className="text-sm font-medium text-white">{sport.name}</span>
                <span className="text-xs text-gray-500">{sport.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            How It Works
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
            Book a court in four simple steps
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#C08A5D]/10 border border-[#C08A5D]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-black text-[#C08A5D]">{step.num}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Why Book with Us?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
            Everything you need for hassle-free court bookings
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-[#151b27] border border-white/5 hover:border-[#C08A5D]/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C08A5D]/10 flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-[#C08A5D]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            What Players Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-xl bg-[#151b27] border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-500" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#C08A5D]/20 to-[#b07a4e]/10 border border-[#C08A5D]/20 p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Play?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Join thousands of players who book their courts with ease.
              Sign up today and get started!
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold text-lg hover:bg-[#b07a4e] transition-all no-underline"
            >
              Create Free Account
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C08A5D]">
                  <span className="text-sm font-black text-[#0f1420]">B</span>
                </div>
                <span className="text-lg font-bold text-white">BookVault</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                Your go-to platform for booking sports venues. Easy, fast, and reliable.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Venues', 'Bookings', 'Pricing', 'FAQ'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Security'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-gray-500 hover:text-[#C08A5D] cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} BookVault. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'Facebook', 'Instagram'].map((social) => (
                <span
                  key={social}
                  className="text-sm text-gray-600 hover:text-[#C08A5D] cursor-pointer transition-colors"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

