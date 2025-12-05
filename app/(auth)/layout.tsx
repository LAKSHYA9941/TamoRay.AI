import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tamoray | Authentication",
  description: "Access your Tamoray account or create a new one.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 lg:flex-row">
        <div className="relative hidden w-full max-w-sm flex-col justify-between bg-gradient-to-b from-orange-400 to-amber-600 p-8 lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Tamoray
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
              Insightful AI workflows for your business
            </h1>
          </div>
          <p className="text-base text-white/90">
            Sign in to continue where you left off or create a new account in
            seconds.
          </p>
        </div>
        <div className="flex w-full items-center justify-center bg-slate-950/40 p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
 