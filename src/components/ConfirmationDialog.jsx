import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useNavigate } from "react-router";
import { useResendEmail } from "../hooks/useResendEmail";
import LoadingMini from "../ui/LoadingMini";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ConfirmationDialog({ isOpen, setIsOpen, email }) {
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { resendEmail, resendPending } = useResendEmail();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function resendHandler() {
    if (cooldown > 0) return;
    resendEmail(email, {
      onSuccess: () => {
        setCooldown(60);
        toast.success("Confirmation email sent");
      },
      onError: (e) => toast.error(e?.message || "Could not resend email"),
    });
  }

  function confirmedHandler() {
    setIsOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="dialog-panel">
          <DialogTitle className="text-xl font-semibold">
            Email confirmation
          </DialogTitle>
          <Description className="mt-1 text-sm text-zinc-600">
            We sent a confirmation email. Click the link to complete your
            registration.
          </Description>

          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <button
              onClick={resendHandler}
              disabled={resendPending || cooldown > 0}
              className="btn btn--outline"
            >
              {resendPending ? (
                <LoadingMini size="sm" label="Resending" />
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                "Resend email"
              )}
            </button>

            <button onClick={confirmedHandler} className="btn btn--primary">
              I&apos;ve confirmed my email
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
