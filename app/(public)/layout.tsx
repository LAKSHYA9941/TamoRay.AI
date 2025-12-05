import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex items-center justify-between bg-black px-6 py-4 text-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl hover:opacity-90 transition-all duration-200"
        >
          {/* SVG Logo - replace with your preferred icon */}
          <svg
            className="w-6 h-6 text-amber-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-white">Tamoray</span>
          <span className="text-amber-300">AI</span>
        </Link>

        <nav className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-xl bg-amber-400 text-black font-semibold
                hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]
                transition-all duration-200">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 rounded-xl bg-black/40 text-amber-200 
                border border-amber-300/40 hover:bg-amber-500/10
                transition-all duration-200">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </header>
      {children}
    </>
  );
}
