"use client";
import React from "react";
import Link from "next/link";
import { motion } from 'framer-motion';

interface PricingCardProps {
    tokens: number;
    price: number;
    isBestSeller?: boolean;
}

// Premium Pricing Card (Using Framer Motion for Best Seller Animation)
const PricingCard = ({ tokens, price, isBestSeller = false }: PricingCardProps) => (
    <motion.div
        initial={{ scale: 1, boxShadow: "none" }}
        whileHover={{
            scale: isBestSeller ? 1.05 : 1.02,
            boxShadow: isBestSeller ? "0 0 40px rgba(251, 191, 36, 0.5)" : "0 0 20px rgba(255, 255, 255, 0.1)"
        }}
        // Scroll animation hook for the Best Seller
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={`relative flex flex-col items-center p-8 m-4 rounded-xl transition duration-300 w-full max-w-sm ${isBestSeller
            ? 'border-4 border-yellow-400 bg-black/80 ring-4 ring-yellow-400/50'
            : 'border border-gray-700 bg-gray-950/70 hover:border-amber-400/50'
            }`}
    >
        {isBestSeller && (
            <div className="absolute -top-4 px-6 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-sm font-extrabold uppercase rounded-full shadow-xl animate-pulse tracking-widest">
                Best Seller
            </div>
        )}
        <h3 className="text-4xl font-extrabold text-white mt-4">{tokens} Tokens</h3>
        <p className="text-6xl font-black text-amber-400 my-8">
            ${price}
        </p>
        <ul className="text-gray-300 text-center space-y-3 mb-10 w-full text-lg">
            <li className="border-b border-gray-700 pb-2">Full access to **All AI Models**</li>
            <li className="border-b border-gray-700 pb-2">Lifetime token validity</li>
            <li className="border-b border-gray-700 pb-2">Advanced image editor tools</li>
            <li>Priority Support</li>
        </ul>
        <Link
            href="/checkout"
            className={`w-full text-center py-3 rounded-lg font-bold uppercase tracking-wider transition duration-300 ${isBestSeller
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg hover:shadow-xl hover:shadow-amber-500/50'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
        >
            Purchase Now
        </Link>
    </motion.div>
);

export function PricingSection() {
    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-5xl font-extrabold text-white mb-4">Simple & Powerful Token Pricing</h2>
                <p className="text-xl text-gray-400 mb-20 max-w-3xl mx-auto">
                    A token is used per generation. Buy once, use forever. No recurring fees.
                </p>

                {/* Pricing Card Grid */}
                <div className="flex flex-wrap justify-center items-stretch -m-4">

                    <PricingCard tokens={50} price={8.99} />

                    {/* Best Seller Card - Motion animations handled in the component definition */}
                    <PricingCard tokens={100} price={13.99} isBestSeller={true} />

                    <PricingCard tokens={150} price={17.99} />
                </div>

            </div>
        </section>
    );
}
