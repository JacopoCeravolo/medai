"use server";

import { z } from "zod";

import { createUser, getUserByName } from "@/lib/db/queries";

import { signIn } from "./auth";

const authFormSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  password: z.string().min(6),
});

export type LoginActionState = {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      name: formData.get("name"),
      surname: formData.get("surname"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      firstName: validatedData.name,
      lastName: validatedData.surname,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
};

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      name: formData.get("name"),
      surname: formData.get("surname"),
      password: formData.get("password"),
    });

    const [user] = await getUserByName(validatedData.name, validatedData.surname);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }
    await createUser(validatedData.name, validatedData.surname, validatedData.password);
    await signIn("credentials", {
      firstName: validatedData.name,
      lastName: validatedData.surname,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
