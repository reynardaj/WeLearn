import { Heading1 } from "@/components/Heading";
import { TextMd } from "@/components/Text";
import SubscribeButton from "@/components/SubscribeButton";

export default function Subscription() {
  return (
    <div className="container mx-auto p-8">
      <Heading1 className="mb-4">Subscription</Heading1>
      <TextMd className="mb-4">TODO: Dev subscription page</TextMd>
      <SubscribeButton userId="133" email="example@example.com" />
    </div>
  );
}
