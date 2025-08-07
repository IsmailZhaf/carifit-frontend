"use client";
import { useState, useEffect } from "react";
import { CVUploader } from "@/components/cv-uploader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function UploadPage() {
    const [uploadResult, setUploadResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const socket = new WebSocket(`wss://${process.env.NEXT_PUBLIC_WS_API_URL}/ws/notification/`); // Ganti URL sesuai backend kamu

        socket.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📬 Received WebSocket message: ", data);

                if (typeof window !== "undefined") {
                    switch (data.type) {
                        case "error":
                            setIsLoading(false);
                            toast.error(data.title || "❌ Error Occurred", {
                                description: data.message || "Something went wrong. Please try again.",
                                duration: 6000,
                            });
                            break;

                        case "info":
                            toast.message(data.title || "ℹ️ Info", {
                                description: data.message || "We are processing your CV...",
                                duration: 60000,
                            });
                            break;

                        case "success":
                            setIsLoading(false);
                            toast.success(data.title || "✅ Success", {
                                description: data.message || "Job matching completed successfully.",
                                duration: 6000,
                            });
                            break;

                        default:
                            toast("🔔 Notification", {
                                description: data.message || "You have a new update.",
                                duration: 6000,
                            });
                            break;
                    }
                }
            } catch (err) {
                toast.error("📛 Invalid Notification", {
                    description: "Unable to parse notification data.",
                    duration: 5000,
                });
                console.error("❌ Failed to parse WebSocket message", err);
                setIsLoading(false);
            }
        };

        socket.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
        };

        socket.onclose = () => {
            console.warn("🔌 WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleUploadComplete = (file, result) => {
        setUploadResult({
            file,
            ...result,
        });
        setIsLoading(true);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Unggah CV Anda</h1>
                <p className="text-muted-foreground mt-2">Unggah CV Anda untuk mendapatkan rekomendasi pekerjaan yang dipersonalisasi</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <CVUploader className="mb-6" onUploadComplete={handleUploadComplete} />

                    <div className="border-t pt-6">
                        <h3 className="font-medium mb-2">Apa yang terjadi selanjutnya?</h3>
                        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            <li>AI kami akan menganalisis CV Anda untuk mengekstrak keterampilan dan pengalaman Anda</li>
                            <li>Kami akan mencocokkan profil Anda dengan persyaratan pekerjaan dari ribuan iklan</li>
                            <li>Anda akan menerima rekomendasi pekerjaan yang dipersonalisasi berdasarkan kualifikasi Anda</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col items-end space-y-2">
                <Link href="/dashboard/matches">
                    <Button className="gap-1.5 cursor-pointer" disabled={!uploadResult || isLoading}>
                        Lihat Pekerjaan <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
                {isLoading && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                        <span>Matching jobs...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
