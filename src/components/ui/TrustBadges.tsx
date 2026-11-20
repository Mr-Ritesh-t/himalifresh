import React from 'react';
import { Sprout, Award, Truck, ShieldCheck, Headphones } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Sprout,
      title: '100% Natural',
      subtitle: 'No Preservatives',
    },
    {
      icon: Award,
      title: 'Authentic & Local',
      subtitle: 'From the Himalayas',
    },
    {
      icon: Truck,
      title: 'Safe Delivery',
      subtitle: 'Across India',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Quality',
      subtitle: 'Carefully Sourced',
    },
    {
      icon: Headphones,
      title: 'Direct Support',
      subtitle: 'We are here to help',
    },
  ];

  return (
    <section className="bg-[#F8F0E4] pt-1 pb-5 sm:pt-2 sm:pb-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* On mobile: 4 items in a clean single row matching reference; Desktop: 5 items */}
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-3.5 lg:gap-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 py-2 px-1 sm:py-3.5 sm:px-4 rounded-xl bg-white shadow-sm border border-[#E8DFC8]/60 hover:shadow-md hover:border-[#064B32]/30 transition-all text-center sm:text-left ${
                  idx === 4 ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div className="flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF5EF] text-[#064B32]">
                  <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-sm font-semibold text-gray-800 leading-tight">
                    {badge.title}
                  </h4>
                  <p className="hidden sm:block text-xs text-gray-500 leading-tight mt-0.5">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
