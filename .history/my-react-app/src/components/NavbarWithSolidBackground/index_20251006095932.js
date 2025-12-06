import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
 
export function NavbarWithSolidBackground() {
  const [openNav, setOpenNav] = React.useState(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);
 
  const navList = (
    <ul className="flex flex-row items-center gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="font-normal"
      >
        <a href="/pages" className="flex items-center hover:text-blue-500 transition-colors">
          Pages
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="font-normal"
      >
        <a href="/account" className="flex items-center hover:text-blue-500 transition-colors">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="font-normal"
      >
        <a href="/blocks" className="flex items-center hover:text-blue-500 transition-colors">
          Blocks
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="font-normal"
      >
        <a href="/docs" className="flex items-center hover:text-blue-500 transition-colors">
          Docs
        </a>
      </Typography>
    </ul>
  );
 
  return (
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-6 py-3 shadow-md">
        <div className="flex items-center justify-between text-blue-gray-900 max-w-screen-xl mx-auto">
          <Typography
            as="a"
            href="/"
            className="cursor-pointer text-lg font-semibold"
          >
            Material Tailwind
          </Typography>
          <div className="flex items-center">{navList}</div>
          <Button
            size="sm"
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            GET STARTED
          </Button>
          <IconButton
            variant="text"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <div className="mt-4">
            {navList}
            <Button fullWidth size="sm" className="mt-4 bg-gray-900 text-white">
              GET STARTED
            </Button>
          </div>
        </Collapse>
      </Navbar>
  );
}