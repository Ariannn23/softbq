import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginValues } from "../types";

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  return {
    form,
    showPassword,
    togglePassword: () => setShowPassword((value) => !value),
  };
}
