import { Title } from "@/components/Heading";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="p-6">
      <Title className="!text-primary">Mentor Dashboard</Title>
    </div>
  );
}
