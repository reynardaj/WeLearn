import { Heading1 } from "@/components/Heading";
import { TextMd } from "@/components/Text";

import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn />
}



// export default function Login() {
//   return (
//     <div className="container mx-auto p-8">
//       <Heading1 className="mb-4">Login</Heading1>
//       <TextMd className="mb-4">TODO: Dev login page</TextMd>
//     </div>
//   );
// }
