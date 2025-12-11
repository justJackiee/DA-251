import React from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function NavBar() {
    const [openNav, setOpenNav] = React.useState(false);
    
    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    const navList = (
        <ul className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <li>
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                </a>
            </li>
            <li>
                <a href="/employees" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Employees Management
                </a>
            </li>
            <li>
                <a href="/timetracking" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Time Tracking
                </a>
            </li>
            <li>
                <a href="/contract" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Contract
                </a>
            </li>
        </ul>
    );

    return (
        <nav className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
                <a href="#" className="text-xl font-bold text-gray-900">
                    Píckmink
                </a>
                
                <div className="hidden lg:block">{navList}</div>
                
                <button className="hidden lg:inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Get started
                </button>
                
                <button
                    className="lg:hidden p-2"
                    onClick={() => setOpenNav(!openNav)}
                >
                    {openNav ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>
            
            {openNav && (
                <div className="lg:hidden mt-4 border-t border-gray-200 pt-4">
                    {navList}
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mt-4">
                        Get started
                    </button>
                </div>
            )}
        </nav>
    );
}
