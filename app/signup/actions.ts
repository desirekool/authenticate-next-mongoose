'use server';
import User from '@/app/models/user';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import config from '@/app/lib/server/config';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  },
  message?: string | null;
}

export async function signup(prevState: State, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const result = signupSchema.safeParse({ email, password, confirmPassword, });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, message: "Invalid email or password" };
  }

  if (password !== confirmPassword) {
    return { errors: { confirmPassword: ["Passwords do not match"] }, message: "Passwords do not match" };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { errors: { email: ["email already taken"], }, message: "email already taken" };
  }

  const hashPassword = await bcrypt.hash(password?.toString()!, 10);

  try {
    const user = new User({ email, password: hashPassword });
    const response = await user.save();
    const jwt = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(email?.toString()!)
      .setIssuedAt()
      .setExpirationTime('2w')
      .sign(new TextEncoder().encode(config.JWT_SECRET));

    cookies().set("jwt-token", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: Date.now() + (1000 * 60 * 60 * 24 * 14),
    });
    // }
  } catch (error) {
    return { errors: { email: ["Error creating user"] }, message: "Error creating user" };
  }
  redirect("/dashboard");
}