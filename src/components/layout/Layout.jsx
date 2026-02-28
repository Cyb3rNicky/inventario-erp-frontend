import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  RocketLaunchIcon,
  XMarkIcon,
  UsersIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { getAuth, clearAuth, isAdmin } from "../../utils/auth";

import Logo from '../../../public/umg250x250.svg';

import NotificationsModal from "../notifications/NotificationsModal";

const baseNavigation = [
  { name: "Productos", to: "/", icon: RocketLaunchIcon },
];

const adminNavigation = [
  { name: "Usuarios", to: "#", icon: UsersIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  const [navigation, setNavigation] = useState(baseNavigation);
  const navigate = useNavigate();

  useEffect(() => {
    const a = getAuth();

    const mostrado =
      a?.user?.nombre?.trim() ||
      a?.user?.userName?.trim() ||
      a?.user?.email?.split("@")?.[0] ||
      "Usuario";
    setUserName(mostrado);

    if (isAdmin()) {
      setNavigation([...baseNavigation, ...adminNavigation]);
    } else {
      setNavigation(baseNavigation);
    }
  }, []);

  // Cerrar sesión
  const onLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Sidebar mobile */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4 ring-1 ring-white/10">
              <div className="relative flex h-16 shrink-0 items-center">
                <img
                  alt="Logo"
                  src={Logo}
                  className="h-8 w-auto"
                />
              </div>
              <nav className="relative flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? "bg-white/5 text-white"
                                  : "text-gray-400 hover:bg-white/5 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )
                            }
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className="size-6 shrink-0" />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Sidebar desktop */}
      <div className="hidden bg-black ring-1 ring-white/10 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Logo"
              src={Logo}
              className="h-12 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-white/5 text-white"
                              : "text-gray-400 hover:bg-white/5 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )
                        }
                      >
                        <item.icon className="size-6 shrink-0" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Top bar + main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-end gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
          >
            <Bars3Icon className="size-6" />
          </button>

          <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative rounded-full p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="size-6" />
          </button>        

          <Menu as="div" className="relative">
            <MenuButton className="relative flex items-center">
              <span className="sr-only">Open user menu</span>
              <img
                alt=""
                src="https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png"
                className="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5"
              />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm/6 font-semibold text-gray-900">
                  {userName}
                </span>
                <ChevronDownIcon className="ml-2 size-5 text-gray-400" />
              </span>
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-gray-900/5">
              <MenuItem>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-3 py-1 text-sm/6 text-gray-900"
                >
                  Cerrar sesión
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="px-4 py-5 sm:p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      <NotificationsModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

    </div>
  );
}
