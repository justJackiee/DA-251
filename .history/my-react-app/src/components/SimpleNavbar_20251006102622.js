import React from "react";
import { Navbar, Typography, Button } from "@material-tailwind/react";

export function SimpleNavbar() {
  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium"
        >
          Material Tailwind
        </Typography>
        <div className="flex items-center gap-4">
          <Typography
            as="a"
            href="#"
            variant="small"
            className="p-1 font-normal cursor-pointer"
          >
            Home
          </Typography>
          <Typography
            as="a"
            href="#"
            variant="small"
            className="p-1 font-normal cursor-pointer"
          >
            About
          </Typography>
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
          >
            <span>Get Started</span>
          </Button>
        </div>
      </div>
    </Navbar>
  );
}