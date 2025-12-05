// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { clerkGlowAppearance } from "../../clerkTheme";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={clerkGlowAppearance}
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />

    </div>
  );
}