"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Home, LogOut, Briefcase, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Sidebar({ className }) {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const routes = [
        {
            label: "Dashboard",
            icon: Home,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Unggah CV",
            icon: FileText,
            href: "/dashboard/upload",
            active: pathname === "/dashboard/upload",
        },
        {
            label: "Pekerjaan",
            icon: Briefcase,
            href: "/dashboard/matches",
            active: pathname === "/dashboard/matches",
        },
    ];

    const handleLogout = async () => {
        try {
            localStorage.removeItem("access");
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
            </div>

            {/* Sidebar for Desktop */}
            <div className={cn("hidden md:flex h-screen w-64 flex-col border-r bg-background p-6", className)}>
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-indigo to-accent-emerald bg-clip-text text-transparent">CariFit</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted", route.active ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground")}
                        >
                            <route.icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                </nav>

                {/* User Info and Logout */}
                <div className="mt-auto pt-4 border-t space-y-4">
                    {!isLoading && user && (
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{getUserInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <Button variant="outline" className="w-full justify-start gap-2 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
                    <div className="flex flex-col h-full p-6 pt-16">
                        {/* Logo */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary-indigo to-accent-emerald bg-clip-text text-transparent">CariFit</span>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-2">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn("flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-all hover:bg-muted", route.active ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground")}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </Link>
                            ))}
                        </nav>

                        {/* User Info and Logout */}
                        <div className="mt-auto pt-4 border-t space-y-4">
                            {!isLoading && user && (
                                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-medium truncate">{user.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>
                            )}
                            <Button variant="outline" className="w-full justify-start gap-2 py-3 text-base hover:cursor-pointer" onClick={handleLogout}>
                                <LogOut className="h-5 w-5" />
                                Log out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
