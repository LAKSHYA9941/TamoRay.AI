"use client";
import React from "react";
import Link from "next/link";
import { Vortex } from "@/components/ui/vortex";
import { MovingBorderButton } from "@/components/ui/moving-border";

export function HeroSection() {
    return (
        <div className="relative h-screen w-full">
            <Vortex
                backgroundColor="black"
                rangeY={800}
                particleCount={500}
                baseHue={120}
                className="flex items-center flex-col justify-center px-4 md:px-10 py-4 w-full h-full"
            >
                {/* Yellow: Tamoray, White: AI */}
                <h1 className="text-3xl md:text-7xl font-black text-center mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                        Tamoray
                    </span>
                    <span className="text-white ml-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                        AI
                    </span>
                </h1>
                <p className="text-xl md:text-3xl max-w-2xl mt-4 text-center text-amber-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] font-light">
                    Generate High-CTR thumbnails optimized by YouTube's data.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 mt-10">
                    {/* Using MovingBorderButton for premium CTA */}
                    <Link href="/sign-up" passHref>
                        <MovingBorderButton
                            containerClassName="rounded-full"
                            className="bg-black text-white px-8 py-2 font-semibold uppercase tracking-widest text-lg border-2 border-transparent"
                        >
                            Start Generating
                        </MovingBorderButton>
                    </Link>
                </div>
            </Vortex>

            {/* Blur Gradient Overlay to blend Hero with rest of the page */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>
    );
}
