
import { supabase } from "@/integrations/supabase/client";

export type SignUpData = {
  email: string;
  password: string;
  fullName: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export const signUp = async ({ email, password, fullName }: SignUpData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signIn = async ({ email, password }: SignInData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Convert the email_not_confirmed error to a more user-friendly message
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email for the confirmation link.');
      }
      throw error;
    }

    return data;
  } catch (error: any) {
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
