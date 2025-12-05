import React from "react";

export function DemoVideoSection() {
    return (
        <section className="py-12 bg-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold text-white mb-4">See Tamoray AI in Action 🎥</h2>
                <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                    A quick demonstration of our lightning-fast, high-conversion thumbnail engine.
                </p>

                {/* Video Placeholder (Styled for Premium) */}
                <div
                    className="w-full max-w-4xl mx-auto aspect-video bg-gray-900 rounded-2xl shadow-2xl border-4 border-amber-500/50 flex items-center justify-center relative overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-amber-500/70"
                >
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white text-4xl md:text-6xl font-black opacity-80">
                            [ DEMO VIDEO PLACEHOLDER ]
                        </span>
                    </div>
                    <div className="w-full h-full bg-gray-900/80 backdrop-blur-sm"></div>
                </div>
            </div>
        </section>
    );
}
