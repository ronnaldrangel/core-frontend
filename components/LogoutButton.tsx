"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <button
            onClick={handleLogout}
            className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all border border-red-500/20"
        >
            <LogOut className="w-5 h-5" />
        </button>
    );
}
