"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileUp, Search, Zap } from "lucide-react";
import { AnimatedGradientBackground } from "@/components/animated-gradient-background";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { StaggeredAppear } from "@/components/staggered-appear";
import { AnimatedButton } from "@/components/animated-button";
import Image from "next/image";

export default function Home() {
    useEffect(() => {
        // Add a delay to ensure everything is mounted
        const timer = setTimeout(() => {
            toast.success("🚀 Welcome to CariFit!", {
                description: "Your AI-powered job matching platform",
                duration: 5000,
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <AnimatedGradientBackground className="py-12 md:py-24 lg:py-32 bg-background">
                    <div className="container max-w-[1600px] px-4 md:px-6 mx-auto">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center mx-auto max-w-[1200px]">
                            <StaggeredAppear className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Temukan Pekerjaan yang <span className="bg-gradient-to-r from-primary-indigo to-accent-emerald bg-clip-text text-transparent">Sesuai dengan CV Anda</span>
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">Dengan bantuan AI, temukan pekerjaan yang paling sesuai dengan profil Anda. Proses lebih cepat, hasil lebih relevan.</p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/register">
                                        <AnimatedButton size="lg" className="gap-1.5">
                                            Mulai Sekarang
                                            <ArrowRight className="h-4 w-4" />
                                        </AnimatedButton>
                                    </Link>
                                </div>
                            </StaggeredAppear>
                        </div>
                    </div>
                </AnimatedGradientBackground>

                {/* How It Works Section */}
                <section id="cara-kerja" className="py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container max-w-[1600px] px-4 md:px-6 mx-auto">
                        <RevealOnScroll>
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Bagaimana CariFit Bekerja</h2>
                                    <p className="max-w-[700px] text-muted-foreground md:text-xl">Tiga langkah sederhana untuk menemukan pekerjaan yang cocok untuk Anda</p>
                                </div>
                            </div>
                        </RevealOnScroll>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-12 pt-12">
                            <RevealOnScroll delay={100}>
                                <div className="flex flex-col items-center space-y-4 text-center group">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                                        <FileUp className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Unggah CV Anda</h3>
                                        <p className="text-muted-foreground">Cukup seret dan letakkan resume atau CV Anda dalam format apa pun. AI kami akan mengerjakan sisanya.</p>
                                    </div>
                                </div>
                            </RevealOnScroll>
                            <RevealOnScroll delay={300}>
                                <div className="flex flex-col items-center space-y-4 text-center group">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                                        <Zap className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">AI Menganalisis Keterampilan Anda</h3>
                                        <p className="text-muted-foreground">AI kami mengekstrak keterampilan, pengalaman, dan kualifikasi Anda untuk membuat profil Anda.</p>
                                    </div>
                                </div>
                            </RevealOnScroll>
                            <RevealOnScroll delay={500}>
                                <div className="flex flex-col items-center space-y-4 text-center group">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                                        <Search className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Dapatkan Pekerjaan yang Sesuai</h3>
                                        <p className="text-muted-foreground">Dapatkan rekomendasi pekerjaan yang dipersonalisasi berdasarkan keterampilan dan pengalaman Anda.</p>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="mulai-sekarang" className="py-12 md:py-24 lg:py-32 bg-background border-t">
                    <div className="container max-w-[1600px] px-4 md:px-6 mx-auto">
                        <RevealOnScroll>
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Siap Menemukan Pekerjaan yang Cocok untuk Anda?</h2>
                                    <p className="max-w-[700px] text-muted-foreground md:text-xl">Bergabunglah dengan ribuan pencari kerja yang telah menemukan pekerjaan impian mereka dengan CariFit.</p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/register">
                                        <AnimatedButton size="lg" className="gap-1.5">
                                            Mulai Sekarang <ArrowRight className="h-4 w-4" />
                                        </AnimatedButton>
                                    </Link>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
