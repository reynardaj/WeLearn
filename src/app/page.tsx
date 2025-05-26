import { Title } from "@/components/Heading";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="">
      <Title className="!text-primary">Landing Page</Title>

      {/* <SignedOut>
        <p>Sign in to access the app</p>
        <SignIn routing="hash" />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn> */}
    </div>
  );
}
