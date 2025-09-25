import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import clsx from "clsx";
import {
  HiBars3,
  HiOutlineXMark,
  HiMiniArrowRightStartOnRectangle,
} from "react-icons/hi2";
import { Link, NavLink } from "react-router";
import { useSignOut } from "../hooks/useSignOut";

const navLinks = [
  { to: "/", title: "Home", public: true },
  { to: "/services", title: "Services", public: true },
  { to: "/owner", title: "Owner Page", role: "owner" },
];

export default function Navigation({ user, role }) {
  const isAuthenticated = !!user;
  const { signOut } = useSignOut();

  function signOutHandler() {
    signOut(undefined, { onSuccess: () => {} });
  }

  return (
    <Disclosure as="nav" className="border-b border-zinc-200 bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-lg font-bold">Flash Bookings</span>
              </Link>

              {/* DESKTOP */}
              <ul className="hidden md:flex md:items-center md:gap-6">
                {navLinks
                  .filter((item) => item.public || (role && item.role === role))
                  .map((item) => (
                    <li key={item.title}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          clsx("nav-link", isActive && "nav-link--active")
                        }
                      >
                        {item.title}
                      </NavLink>
                    </li>
                  ))}

                <li>
                  {isAuthenticated ? (
                    <NavLink
                      to="/account"
                      className={({ isActive }) =>
                        clsx("nav-link", isActive && "nav-link--active")
                      }
                    >
                      Account
                    </NavLink>
                  ) : (
                    <Link to="/auth/signin" className="btn btn--outline">
                      Sign in
                    </Link>
                  )}
                </li>

                {isAuthenticated && (
                  <li>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={signOutHandler}
                      title="Sign out"
                    >
                      <HiMiniArrowRightStartOnRectangle className="size-4" />
                    </button>
                  </li>
                )}
              </ul>

              {/* MOBILE TOGGLE */}
              <div className="md:hidden">
                <DisclosureButton
                  className={clsx(
                    open ? "bg-zinc-100" : "hover:bg-zinc-50",
                    "p-2 rounded-xl"
                  )}
                >
                  {open ? (
                    <HiOutlineXMark className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <HiBars3 className="w-6 h-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          <DisclosurePanel
            transition
            className="md:hidden origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
          >
            <ul className="px-3 py-3 space-y-1">
              {navLinks
                .filter((item) => item.public || (role && item.role === role))
                .map((item) => (
                  <li key={item.title}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        clsx(
                          "block rounded-lg px-3 py-2 text-sm font-medium",
                          isActive
                            ? "bg-brand-50 text-brand-700"
                            : "hover:bg-zinc-50 text-zinc-800"
                        )
                      }
                    >
                      {item.title}
                    </NavLink>
                  </li>
                ))}

              <li>
                {isAuthenticated ? (
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      clsx(
                        "block rounded-lg px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "hover:bg-zinc-50 text-zinc-800"
                      )
                    }
                  >
                    Account
                  </NavLink>
                ) : (
                  <Link to="/auth/signin" className="btn btn--outline w-full">
                    Sign in
                  </Link>
                )}
              </li>

              {isAuthenticated && (
                <li>
                  <button
                    className="btn btn--outline w-full"
                    onClick={signOutHandler}
                  >
                    Sign out
                  </button>
                </li>
              )}
            </ul>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
