import React from "react";
import Link from "next/link";

/**
 * Simplified site footer
 */
export const Footer = () => {
  return (
    <footer className="w-full py-4 flex justify-center text-sm text-gray-500">
      <div className="flex flex-wrap gap-2 justify-center">
        <span>© Optilex, LLC</span>
        <span>·</span>
        <Link href="/privacy-policy" className="link">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link href="/terms" className="link">
          Terms
        </Link>
      </div>
    </footer>
  );
};
