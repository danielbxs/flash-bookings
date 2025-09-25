import {
  Button,
  Description,
  Field,
  Input,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import clsx from "clsx";
import { HiCheck } from "react-icons/hi2";
import { EMAIL_REGEX_PATTERN, ROLES } from "../../utils/constants";
import { Controller, useForm } from "react-hook-form";
import { useSignUp } from "../../hooks/useSignUp";
import LoadingMini from "../../ui/LoadingMini";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router";

export default function SignUp() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailCreated, setEmailCreated] = useState("");

  const {
    register,
    control,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { signUpRole: "" } });

  const { signUp, signUpPending } = useSignUp();

  function signUpHandler(formData) {
    const {
      signUpEmail: email,
      signUpPassword: password,
      signUpRole: role,
      signUpName: name,
    } = formData;
    const dataObj = { role, name };

    signUp(
      { email, password, dataObj },
      {
        onSuccess: (data) => {
          setShowConfirmation(true);
          setEmailCreated(data.user.email);
          toast.success("Account created!");
          reset({
            signUpName: "",
            signUpEmail: "",
            signUpRole: "",
            signUpPassword: "",
            signUpConfirmPassword: "",
          });
        },
        onError: (err) => toast.error(err.message),
      }
    );
  }

  return (
    <>
      {showConfirmation && (
        <ConfirmationDialog
          isOpen={showConfirmation}
          setIsOpen={setShowConfirmation}
          email={emailCreated}
        />
      )}

      <h1 className="text-3xl font-semibold mb-3">Create an account</h1>
      <p className="mb-4 text-sm">
        Already have an account?{" "}
        <Link to="/auth/signin" replace className="underline">
          Sign in here!
        </Link>
      </p>

      <form onSubmit={handleSubmit(signUpHandler)} className="space-y-4">
        <Field>
          <Label htmlFor="signUpName" className="label">
            Name
          </Label>
          <Input
            name="signUpName"
            id="signUpName"
            type="text"
            maxLength={20}
            className="input"
            required
            {...register("signUpName", {
              required: { value: true, message: "This field is required" },
              maxLength: {
                value: 20,
                message: "Maximum of 20 characters allowed",
              },
            })}
          />
          {errors.signUpName && (
            <p className="field-error">{errors.signUpName.message}</p>
          )}
        </Field>

        <Field>
          <Label htmlFor="signUpEmail" className="label">
            Email address
          </Label>
          <Input
            name="signUpEmail"
            id="signUpEmail"
            type="email"
            className="input"
            {...register("signUpEmail", {
              required: { value: true, message: "This field is required" },
              pattern: { value: EMAIL_REGEX_PATTERN, message: "Invalid email" },
            })}
          />
          {errors.signUpEmail && (
            <p className="field-error">{errors.signUpEmail.message}</p>
          )}
        </Field>

        <Controller
          name="signUpRole"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field: { value, onChange, onBlur } }) => (
            <RadioGroup
              aria-label="Account type"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className="space-y-2"
            >
              <Description className="label">Account type</Description>

              <div className="space-y-2">
                {ROLES.map(({ role, name, description }) => (
                  <Radio
                    key={role}
                    value={role}
                    className={({ checked, disabled }) =>
                      clsx(
                        "radio-card flex items-center justify-between",
                        checked && "border-brand-300 bg-brand-50",
                        disabled && "opacity-60"
                      )
                    }
                  >
                    {({ checked }) => (
                      <div className="flex w-full items-center justify-between">
                        <div>
                          <p className="radio-title">{name}</p>
                          <span className="radio-desc">{description}</span>
                        </div>
                        <HiCheck
                          className={clsx(
                            "size-5 transition",
                            checked ? "opacity-100 text-brand-600" : "opacity-0"
                          )}
                        />
                      </div>
                    )}
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          )}
        />
        {errors.signUpRole && (
          <p className="field-error">{errors.signUpRole.message}</p>
        )}

        <Field>
          <Label htmlFor="signUpPassword" className="label">
            Password
          </Label>
          <Input
            name="signUpPassword"
            id="signUpPassword"
            type="password"
            minLength={8}
            className="input"
            {...register("signUpPassword", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 8,
                message: "Password should be at least 8 characters",
              },
            })}
          />
          {errors.signUpPassword && (
            <p className="field-error">{errors.signUpPassword.message}</p>
          )}
        </Field>

        <Field>
          <Label htmlFor="signUpConfirmPassword" className="label">
            Confirm Password
          </Label>
          <Input
            name="signUpConfirmPassword"
            id="signUpConfirmPassword"
            type="password"
            minLength={8}
            className="input"
            {...register("signUpConfirmPassword", {
              required: { value: true, message: "This field is required" },
              validate: (val) =>
                val === getValues().signUpPassword || "Passwords do not match",
              minLength: {
                value: 8,
                message: "Password should be at least 8 characters",
              },
            })}
          />
          {errors.signUpConfirmPassword && (
            <p className="field-error">
              {errors.signUpConfirmPassword.message}
            </p>
          )}
        </Field>

        <Button
          className="btn btn--primary mt-2"
          type="submit"
          disabled={signUpPending}
        >
          {signUpPending ? (
            <LoadingMini label="Creating account" size="sm" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </>
  );
}
