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
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <Typography
        as="a"
        href="/pages"
        variant="small"
        color="blue-gray"
        style={{ textDecoration: 'none', fontWeight: 'normal', cursor: 'pointer' }}
      >
        Pages
      </Typography>
      <Typography
        as="a"
        href="/account"
        variant="small"
        color="blue-gray"
        style={{ textDecoration: 'none', fontWeight: 'normal', cursor: 'pointer' }}
      >
        Account
      </Typography>
      <Typography
        as="a"
        href="/blocks"
        variant="small"
        color="blue-gray"
        style={{ textDecoration: 'none', fontWeight: 'normal', cursor: 'pointer' }}
      >
        Blocks
      </Typography>
      <Typography
        as="a"
        href="/docs"
        variant="small"
        color="blue-gray"
        style={{ textDecoration: 'none', fontWeight: 'normal', cursor: 'pointer' }}
      >
        Docs
      </Typography>
    </div>
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