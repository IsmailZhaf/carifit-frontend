"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton } from "@/components/animated-button";
import { Progress } from "@/components/ui/progress";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { useAuth } from "@/context/provider";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    useEffect(() => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
        setPasswordChecks(checks);

        const passedChecks = Object.values(checks).filter(Boolean).length;
        setPasswordStrength((passedChecks / 5) * 100);
    }, [password]);

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return "No password";
        if (passwordStrength <= 20) return "Very weak";
        if (passwordStrength <= 40) return "Weak";
        if (passwordStrength <= 60) return "Medium";
        if (passwordStrength <= 80) return "Strong";
        return "Very strong";
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 20) return "bg-destructive";
        if (passwordStrength <= 40) return "bg-orange-500";
        if (passwordStrength <= 60) return "bg-yellow-500";
        if (passwordStrength <= 80) return "bg-blue-500";
        return "bg-green-500";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (password !== confirmPassword) {
            setError("Password tidak cocok");
            return;
        }

        if (passwordStrength < 60) {
            setError("Silakan pilih password yang lebih kuat");
            return;
        }

        setIsLoading(true);

        try {
            const name = `${firstName} ${lastName}`.trim();
            await register(name, email, password);
            toast.success("Berhasil mendaftar!");

            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (err) {
            setError(err.message || "An error occurred during registration. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <RevealOnScroll>
                    <Card className="border-none shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Buat Akun</CardTitle>
                            <CardDescription className="text-center">Masukkan informasi Anda untuk membuat akun Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nama Depan</Label>
                                        <Input id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="transition-all duration-300 focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Nama Belakang</Label>
                                        <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="transition-all duration-300 focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="space-y-2 mt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs">{getPasswordStrengthText()}</span>
                                                <span className="text-xs">{passwordStrength.toFixed(0)}%</span>
                                            </div>
                                            <Progress value={passwordStrength} className={`h-1 ${getPasswordStrengthColor()}`} />
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className="flex items-center gap-1 text-xs">
                                                    {passwordChecks.length ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                                                    <span className={passwordChecks.length ? "text-green-500" : "text-muted-foreground"}>At least 8 characters</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    {passwordChecks.uppercase ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                                                    <span className={passwordChecks.uppercase ? "text-green-500" : "text-muted-foreground"}>Uppercase letter</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    {passwordChecks.lowercase ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                                                    <span className={passwordChecks.lowercase ? "text-green-500" : "text-muted-foreground"}>Lowercase letter</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    {passwordChecks.number ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                                                    <span className={passwordChecks.number ? "text-green-500" : "text-muted-foreground"}>Number</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    {passwordChecks.special ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                                                    <span className={passwordChecks.special ? "text-green-500" : "text-muted-foreground"}>Special character</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Konfirmasi password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className={`pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${confirmPassword && password !== confirmPassword ? "border-destructive focus:ring-destructive/20" : ""}`}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && <p className="text-xs text-destructive mt-1">Passwords do not match</p>}
                                </div>
                                {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</div>}
                                <AnimatedButton type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Silahkan Tunggu
                                        </>
                                    ) : (
                                        "Buat Akun"
                                    )}
                                </AnimatedButton>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-center text-sm">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-primary hover:underline transition-colors">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </RevealOnScroll>
            </div>
        </div>
    );
}
