// export const clerkGlowAppearance = {
//   variables: {
//     colorPrimary: "#fbbf24",
//     colorBackground: "rgba(0,0,0,0.75)",
//     colorText: "#fefce8",
//     borderRadius: "1rem",
//     fontFamily: "var(--font-geist-sans, 'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
//   },
//   elements: {
//     rootBox: "w-full",
//     card: "bg-black/80 border border-amber-400/20 backdrop-blur-xl shadow-[0_0_60px_rgba(251,191,36,0.35)]",
//     headerTitle: "text-3xl font-semibold text-amber-200 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]",
//     headerSubtitle: "text-base text-amber-100/80",
//     formFieldLabel: "text-sm uppercase tracking-[0.25em] text-amber-100/80",
//     formFieldInput:
//       "bg-black/60 border border-amber-300/30 rounded-lg text-amber-50 placeholder:text-amber-100/40 focus:border-amber-300 focus:ring-amber-200/70",
//     formFieldInputShowPasswordIcon: "text-amber-200",
//     socialButtonsBlockButton:
//       "bg-black/40 border border-amber-300/30 text-amber-100 hover:bg-amber-500/10",
//     socialButtonsBlockButtonText: "text-amber-50 font-medium",
//     formButtonPrimary:
//       "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-black font-semibold shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:shadow-[0_0_35px_rgba(251,191,36,0.65)]",
//     footerActionText: "text-amber-100/70",
//     footerActionLink: "text-amber-300 hover:text-amber-200",
//     identityPreviewText: "text-amber-100",
//     userPreviewSecondaryIdentifier: "text-amber-200/70",
//   },
// } as const;



export const clerkGlowAppearance = {
    variables: {
        colorPrimary: "#fbbf24",
        colorBackground: "rgba(0,0,0,0.75)",
        colorText: "#fefce8",
        borderRadius: "1rem",
        fontFamily:
            "var(--font-geist-sans, 'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
    },

    elements: {
        // Global wrapper
        rootBox: "w-full",

        // ---------- AUTH MODAL ----------
        card:
            "bg-black/80 border border-amber-400/20 backdrop-blur-xl shadow-[0_0_60px_rgba(251,191,36,0.35)]",
        headerTitle:
            "text-3xl font-semibold text-amber-200 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]",
        headerSubtitle: "text-base text-amber-100/80",

        formFieldLabel: "text-sm uppercase tracking-[0.25em] text-amber-800",
        formFieldInput: `
  bg-black/60 border border-amber-300/30 rounded-lg text-amber-50 
  [&::placeholder]:!text-black [&::placeholder]:!opacity-80
  focus:border-amber-300 focus:ring-amber-200/70
`,
        formFieldInputShowPasswordIcon: "text-amber-200",

        socialButtonsBlock: "space-y-3", // Add spacing between buttons
        socialButtonsBlockButton: `
  !bg-white/90 !text-slate-900 !font-medium !border !border-amber-300/50 
  hover:!bg-amber-50 !transition-all !shadow-sm
  [&>span]:!text-current [&>svg]:!text-current
`,
        socialButtonsBlockButtonText: "!text-inherit",
        socialButtonsBlockButtonIcon: "!text-amber-600",

        formButtonPrimary:
            "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-white font-semibold shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:shadow-[0_0_35px_rgba(251,191,36,0.65)]",

        footerActionText: "text-amber-100/70",
        footerActionLink: "text-amber-300 hover:text-amber-200",

        identityPreviewText: "text-amber-100",
        userPreviewSecondaryIdentifier: "text-amber-200/70",

        // ---------- NAVBAR BUTTONS ----------
        // Applies to SignInButton, SignUpButton, UserButton when placed in navbar
        button:
            "px-4 py-2 rounded-xl bg-black/60 border border-amber-400/30 hover:bg-black/70 transition-all shadow-md shadow-amber-400/20",
        buttonText: "text-amber-200 font-medium tracking-wide",

        // UserButton avatar frame
        avatarBox: "ring-2 ring-amber-400 rounded-full shadow-lg shadow-amber-300/30",

        // Dropdown menu
        userButtonPopoverCard: `
  !bg-white !shadow-lg  !border !border-gray-200 !overflow-hidden
  [&>*:first-child]:!p-4 [&>*:last-child]:!p-2
`,
        userButtonPopoverActionButtonText: "!text-gray-50 hover:!text-gray-900 font-medium",
        userButtonPopoverActionButton: `
  !px-4 !py-3 !w-full !text-left
  hover:!bg-amber-50 !transition-colors
  !border-b !border-gray-100 last:!border-0
`,
        userButtonPopoverActionButtonIcon: "!text-amber-500 !w-5 !h-5",
        userButtonPopoverUserButton: "hover:!bg-transparent",
        userPreviewMainIdentifier: "!text-gray-900 font-semibold",
    },
} as const;
