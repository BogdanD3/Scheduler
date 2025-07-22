import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseconfig'; 

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -5 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -5 },
};

export const SettingsMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="absolute top-4 right-2 z-50 flex flex-col items-end"
      ref={menuRef}
    >
      {/* Gear button without background */}
      <button
        onClick={toggleMenu}
        className=" text-white transition"
        aria-label="Settings"
      >
        <span className="text-[1.5rem] leading-none text-white">⚙️</span>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
            className="mt-2 w-40 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-lg text-white px-4 py-2"
          >
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm border-transparent hover:bg-white/11 transition"
            >
              Logout
            </button>
            <button
            //   onClick={handleLogout}
              className="w-full text-left text-sm border-transparent hover:bg-white/11 transition"
            >
              Profile
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
