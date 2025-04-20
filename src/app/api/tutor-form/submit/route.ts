import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.json();
  console.log(formData);
  //   const data = Object.fromEntries(formData);
  //   console.log("Form data:", data);
  return NextResponse.json({ success: true }, { status: 200 });
}
