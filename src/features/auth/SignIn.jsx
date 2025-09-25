import { Button, Field, Input, Label } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { EMAIL_REGEX_PATTERN } from "../../utils/constants";
import { useSignIn } from "../../hooks/useSignIn";
import LoadingMini from "../../ui/LoadingMini";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

export default function SignIn() {
  const [isSigning, setIsSigning] = useState(false);
  const redirectRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const { signIn, signInPending } = useSignIn();

  function signInHandler(formData) {
    const { signInEmail: email, signInPassword: password } = formData;
    signIn(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Signed in! Redirecting...");
          setIsSigning(true);
          redirectRef.current = setTimeout(() => {
            navigate("/", { replace: true });
            reset({ signInEmail: "", signInPassword: "" });
            setIsSigning(false);
          }, 2000);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  }

  useEffect(() => () => clearTimeout(redirectRef.current), []);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-3">Sign in</h1>

      <form onSubmit={handleSubmit(signInHandler)} className="space-y-4">
        <Field>
          <Label htmlFor="signInEmail" className="label">
            Email address
          </Label>
          <Input
            type="email"
            id="signInEmail"
            name="signInEmail"
            className="input"
            disabled={isSigning}
            {...register("signInEmail", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value: EMAIL_REGEX_PATTERN,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.signInEmail && (
            <p className="field-error">{errors.signInEmail.message}</p>
          )}
        </Field>

        <Field>
          <Label htmlFor="signInPassword" className="label">
            Password
          </Label>
          <Input
            type="password"
            id="signInPassword"
            name="signInPassword"
            className="input"
            disabled={isSigning}
            {...register("signInPassword", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 8,
                message: "Password should be at least 8 characters long",
              },
            })}
          />
          {errors.signInPassword && (
            <p className="field-error">{errors.signInPassword.message}</p>
          )}
        </Field>

        <Button
          type="submit"
          disabled={signInPending || isSigning}
          className="btn btn--primary"
        >
          {signInPending ? (
            <LoadingMini size="sm" label="Signing in" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/auth/signup" className="underline">
          Sign up now!
        </Link>
      </p>
    </>
  );
}
