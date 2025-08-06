"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/animated-button";

export function CVUploader({ onUploadComplete, className }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [progress, setProgress] = useState(0);
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const uploadFile = async (selectedFile) => {
        try {
            setStatus("uploading");
            setProgress(0);
            setErrorMessage(null);

            const formData = new FormData();
            formData.append("file", selectedFile);

            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = prev + 10;
                    return newProgress > 90 ? 90 : newProgress;
                });
            }, 200);

            const response = await fetch("/api/cv/upload", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!response.ok) {
                const errorData = await response.json();

                // Handle authentication errors
                if (response.status === 401) {
                    throw new Error("Session expired. Please log in again.");
                }

                throw new Error(errorData.error || "Upload failed");
            }

            const result = await response.json();
            setUploadResult(result);
            setStatus("success");

            if (onUploadComplete) {
                onUploadComplete(selectedFile, result);
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage(error.message);
            console.error("Upload error:", error);

            if (error.message.includes("Session expired")) {
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            }
        }
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            const selectedFile = acceptedFiles[0];
            if (selectedFile) {
                setFile(selectedFile);
                uploadFile(selectedFile);
            }
        },
        [onUploadComplete]
    );

    const { getRootProps, getInputProps, isDragAccept } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        maxFiles: 1,
        disabled: status === "uploading",
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
    });

    const resetUpload = () => {
        setFile(null);
        setStatus("idle");
        setProgress(0);
        setUploadResult(null);
        setErrorMessage(null);
    };

    useEffect(() => {
        if (status === "uploading") {
            const element = document.querySelector(".progress-pulse");
            element?.classList.add("animate-pulse");
        }
    }, [status]);

    return (
        <div className={cn("w-full", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer",
                    isDragActive || isDragAccept ? "border-primary bg-primary/5 scale-102 shadow-lg" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
                    status === "success" && "border-accent bg-accent/5",
                    status === "error" && "border-destructive bg-destructive/5"
                )}
            >
                <input {...getInputProps()} />

                {status === "idle" && (
                    <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 transition-transform duration-500 hover:scale-110 hover:bg-primary/20">
                            <FileUp className={cn("h-8 w-8 text-primary transition-transform duration-300", isDragActive && "scale-125")} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{isDragActive ? "Seret CV Anda di sini" : "Unggah CV Anda"}</h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-md">Seret dan letakkan berkas CV Anda di sini, atau klik untuk menelusuri. Kami mendukung format PDF, DOC, dan DOCX.</p>
                        <AnimatedButton variant="outline" size="sm">
                            Pilih File
                        </AnimatedButton>
                    </>
                )}

                {status === "uploading" && (
                    <>
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Mengunggah CV Anda</h3>
                        <p className="text-sm text-muted-foreground mb-4">{file?.name}</p>
                        <div className="w-full max-w-md mb-4 progress-pulse">
                            <Progress value={progress} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <span className="inline-block animate-pulse">Menganalisis keterampilan dan pengalaman Anda...</span>
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mb-4 transform transition-all duration-500 animate-bounce-once">
                            <CheckCircle className="h-12 w-12 text-accent" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{file?.name}</p>
                        {uploadResult && (
                            <div className="text-sm text-muted-foreground mb-4 space-y-1">
                                <h3 className="text-green-600">{uploadResult.message}</h3>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={resetUpload}>
                                Upload Another CV
                            </Button>
                        </div>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mb-4 transform transition-all duration-300 animate-shake">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Gagal Mengunggah</h3>
                        <p className="text-sm text-muted-foreground mb-4">{errorMessage || "Terjadi kesalahan saat mengunggah berkas Anda. Silakan coba lagi."}</p>
                        <AnimatedButton variant="outline" size="sm" onClick={resetUpload}>
                            Coba Lagi
                        </AnimatedButton>
                    </>
                )}
            </div>

            {file && status !== "error" && (
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                        <span className="font-medium">File:</span> {file.name}
                    </p>
                    <p>
                        <span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
            )}
        </div>
    );
}
