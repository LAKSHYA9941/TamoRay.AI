"use client";
import React from "react";
import { Zap, TrendingUp, DollarSign } from 'lucide-react';

interface ThumbnailFactCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Premium Feature Card (Inspired by Aceternity's card styles)
const ThumbnailFactCard = ({ title, description, icon: Icon }: ThumbnailFactCardProps) => (
    <div className="relative p-8 bg-black border border-white/10 rounded-2xl shadow-2xl transition duration-500 hover:shadow-amber-500/50 group">
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-amber-500/20 blur-lg"></div>
        <div className="relative z-10">
            <Icon className="text-amber-400 w-8 h-8 mb-4 transform group-hover:scale-110 transition duration-300" />
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
);

export function ShowcaseSection() {
    return (
        <section className="py-24 bg-gray-950/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-5xl font-extrabold text-center text-white mb-20">
                    Generate <span className="text-amber-400">Thumbnails Engineered</span> for Success
                </h2>

                {/* Thumbnail Showcase Grid (Use a premium card component here) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Replace these divs with a premium Aceternity card component, like EvervaultCard or GlareCard */}
                    <img src="https://res.cloudinary.com/cloud4lakshya/image/upload/v1757060759/gameexample_fsfsik.jpg" alt="High CTR Thumbnail Example 1" className="h-48 w-96 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 text-xl  shadow-lg hover:shadow-amber-500/50 transition transform hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out">
                        
                    </img>
                    <div className="h-48 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 text-xl shadow-lg hover:shadow-amber-500/50 transition transform hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out">
                        [ High CTR Thumbnail Example 2 ]
                    </div>
                    <div className="h-48 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 text-xl  shadow-lg hover:shadow-amber-500/50 transition transform hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out">
                        [ High CTR Thumbnail Example 3 ]
                    </div>
                </div>

                {/* Facts Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ThumbnailFactCard
                        title="YouTube-Optimized AI"
                        description="Our models are trained on billions of data points to predict and generate thumbnails with industry-leading Click-Through Rates (CTR)."
                        icon={TrendingUp}
                    />
                    <ThumbnailFactCard
                        title="Speed & Iteration"
                        description="Instantly generate and refine multiple designs. High-quality output is ready in seconds, dramatically cutting production time."
                        icon={Zap}
                    />
                    <ThumbnailFactCard
                        title="Pixel-Perfect Branding"
                        description="Maintain visual consistency with advanced style transfer and color correction, ensuring every thumbnail aligns with your brand."
                        icon={DollarSign}
                    />
                </div>
            </div>
        </section>
    );
}
