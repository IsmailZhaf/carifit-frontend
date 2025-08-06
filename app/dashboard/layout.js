"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({ children }) {
    
    return (
        <div className="flex h-screen bg-muted/30">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b bg-background flex items-center justify-end px-6">
                    <ModeToggle />
                </header>
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
