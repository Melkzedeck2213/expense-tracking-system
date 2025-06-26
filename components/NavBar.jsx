import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);

     // ─── Blur-on-scroll logic ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();                           // run once on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // ───────────────────────────────────────────────────────────────────────


  const toggleIsOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = (
    <>
      <li key="dashboard">
        <Link href="/dashboard" className="hover:underline transition duration-500 ease-in-out">Dashboard</Link>
      </li>
      <li key="expenses">
        <Link href="/expenses" className="hover:underline">Expenses</Link>
      </li>
      <li key="add-expenses">
        <Link href="/expenses/new" className="hover:underline">Add Expenses</Link>
      </li>
     
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-8 py-10 ${isScrolled
          ? "backdrop-blur-lg bg-base-100/70 dark:bg-base-200/60 shadow-md"
          : "bg-transparent"}`  }>
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4">
        <h3 className="text-xl font-bold cursor-pointer">Expenses Tracking System</h3>

        {/* Desktop nav */}
        <ul className="flex flex-row gap-6 hidden md:flex">
          {navLinks}
        </ul>

        {/* Right-side icons (theme toggle + menu) */}
        <div className={`flex flex-row gap-4 transition-all duration-300 ${isMenuOpen ? 'translate-x-[-240px]' : ''}`}>
          {/* Theme toggle */}
         <label className="swap swap-rotate">
  {/* this hidden checkbox controls the state */}
  <input type="checkbox" className="theme-controller" value="cupcake" />

  {/* sun icon */}
  <svg
    className="swap-off h-10 w-10 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24">
    <path
      d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
  </svg>

  {/* moon icon */}
  <svg
    className="swap-on h-10 w-10 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24">
    <path
      d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
  </svg>
</label>

          {/* Menu toggle */}
          <button className="cursor-pointer md:hidden" onClick={toggleIsOpen}>
            {isMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile side menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64  shadow-lg p-8 transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <ul className="flex flex-col gap-6 mt-12 backdrop-blur" onClick={toggleIsOpen}>{navLinks}</ul>
      </div>
    </nav>
  );
};

export default NavBar;
