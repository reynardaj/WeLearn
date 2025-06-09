// DashboardPath.tsx
"use client"; // Required for useRouter, useState, and usePathname

import Image from "next/image";
import React, { useState, useEffect } from "react"; // Added useEffect
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname

interface NavItem {
  name: string;
  icon: string;
  path: string; // This will be the segment after /dashboard/tutor/
  fullPath: string; // The complete path for navigation and comparison
}

const navItems: NavItem[] = [
  // Updated Dashboard path to be the root of /dashboard/tutor
  { name: "Dashboard", icon: "/assets/dashboard.png", path: "", fullPath: "/dashboard/tutor" },
  { name: "Profile", icon: "/assets/profile.png", path: "profile", fullPath: "/dashboard/tutor/profile" },
  { name: "Finance", icon: "/assets/finance.png", path: "finance", fullPath: "/dashboard/tutor/finance" },
  { name: "Availability", icon: "/assets/availability.png", path: "availability", fullPath: "/dashboard/tutor/availability" },
  { name: "Messaging", icon: "/assets/messaging.png", path: "messaging", fullPath: "/dashboard/tutor/message" },
  { name: "Pro", icon: "/assets/pro.png", path: "pro", fullPath: "/dashboard/tutor/pro" },
];

const DashboardPath: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL pathname

  // State to hold the name of the currently selected item
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  // Effect to update selectedItemName based on the current pathname
  useEffect(() => {
    const currentNavItem = navItems.find(item => {
      // For the root dashboard path, we need an exact match.
      // For other paths, we check if the pathname starts with the item's fullPath.
      // This handles cases like /dashboard/tutor/profile/edit still highlighting "Profile".
      if (item.path === "") { // Root dashboard case
        return pathname === item.fullPath;
      }
      return pathname.startsWith(item.fullPath);
    });

    if (currentNavItem) {
      setSelectedItemName(currentNavItem.name);
    } else if (pathname === "/dashboard/tutor") { // Explicitly handle if no sub-path matches but it's the root
        setSelectedItemName("Dashboard");
    } else {
        // Optional: default to Dashboard or leave empty if no match
        // setSelectedItemName(navItems[0].name); // Default to first item if no match
    }
  }, [pathname]); // Re-run effect when the pathname changes

  const handleItemClick = (item: NavItem): void => {
    // No need to setSelectedItemName here if useEffect handles it,
    // but it can make the UI feel slightly more responsive immediately.
    setSelectedItemName(item.name);
    router.push(item.fullPath);
  };

  return (
    <div className="w-[65%] h-auto flex flex-col justify-between space-y-1">
      {navItems.map((item) => (
        <div
          key={item.name}
          className={`p-3 pl-4 rounded-lg flex items-center cursor-pointer transition-all duration-200 ease-in-out group ${
            selectedItemName === item.name // Compare with selectedItemName
              ? "bg-white text-blue-700 font-semibold shadow-md"
              : "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900"
          }`}
          onClick={() => handleItemClick(item)}
        >
          <Image
            src={item.icon}
            alt={`${item.name} icon`}
            width={20}
            height={20}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://placehold.co/20x20/E0E0E0/B0B0B0?text=${item.name.substring(0,1)}`;
            }}
          />
          <h1 className={`ml-3 text-sm ${selectedItemName === item.name ? 'text-black' : 'text-gray-600 group-hover:text-gray-800'}`}>
            {item.name}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default DashboardPath;
