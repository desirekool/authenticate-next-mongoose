import connect from "@/app/lib/server/mongodb";
import User from "@/app/models/user";


import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  const { email, password } = await req.json();
  await connect();
  // console.log(email, password);
  console.log("Hello from the server");
  console.log(req);
  const existingUser = await User.findOne({ email });
  if (existingUser) { return new NextResponse("User already exists", { status: 400 }); }

  const user = new User({ email, password });
  try {
    //   await user.save();
    return new NextResponse("User Registered successfully", { status: 201 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
