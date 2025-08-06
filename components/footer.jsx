import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container max-w-[1600px] mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-indigo to-accent-emerald bg-clip-text text-transparent">CariFit</span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">Platform pencocokan pekerjaan berbasis AI yang menganalisis CV Anda dan merekomendasikan pekerjaan yang relevan.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="#cara-kerja" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                                    Cara Kerja
                                </Link>
                            </li>
                            <li>
                                <Link href="#mulai-sekarang" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                                    Mulai
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t">
                    <p className="text-sm text-muted-foreground text-center">© {new Date().getFullYear()} CariFit. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
