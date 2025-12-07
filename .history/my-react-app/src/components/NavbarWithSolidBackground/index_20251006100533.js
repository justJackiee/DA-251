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
      <Navbar style={{ position: 'sticky', top: 0, zIndex: 10, borderRadius: 0, padding: '1rem 1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Typography
            as="a"
            href="/"
            style={{ cursor: 'pointer', fontSize: '1.125rem', fontWeight: '600', textDecoration: 'none' }}
          >
            Material Tailwind
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>{navList}</div>
          <Button
            size="sm"
            style={{ backgroundColor: '#1f2937', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
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