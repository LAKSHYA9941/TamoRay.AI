// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import { clerkGlowAppearance } from "../../clerkTheme";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={clerkGlowAppearance}
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}  
