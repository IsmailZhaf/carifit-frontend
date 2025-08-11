"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, MapPin, Calendar, Clock, Briefcase, DollarSign, Share2, Bookmark, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MatchPercentage } from "@/components/match-percentage";
import { AnimatedButton } from "@/components/animated-button";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { StaggeredAppear } from "@/components/staggered-appear";
import { SkillMatch } from "@/components/skill-match";
import { JobCard } from "@/components/job-card";
import { ChatBot } from "@/components/chat/chat-bot";

export default function JobDetailPage(props) {
    const params = use(props.params);
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [allJobs, setAllJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch all jobs from recommendations API
                const response = await fetch("/api/recommendations");

                if (!response.ok) {
                    throw new Error("Failed to fetch job data");
                }

                const result = await response.json();
                const jobs = result.data || [];
                setAllJobs(jobs);

                // Find the specific job by ID (using job hash as ID)
                const currentJob = jobs.find((j) => j.id === params.id || j.jobHash === params.id);

                if (currentJob) {
                    // Transform the job data to match the expected format
                    const transformedJob = {
                        id: currentJob.id,
                        title: currentJob.title,
                        company: currentJob.company,
                        logo: currentJob.logo || "/placeholder.svg",
                        location: currentJob.location,
                        locationType: currentJob.location.toLowerCase().includes("remote") ? "Remote" : currentJob.location.toLowerCase().includes("hybrid") ? "Hybrid" : "On-site",
                        jobType: currentJob.job_type || "Full-time", // Default since backend doesn't provide this
                        salary: currentJob.salary || "Competitive", // Default since backend doesn't provide this
                        postedDate: currentJob.postedDate,
                        applicationDeadline: "30 days", // Default
                        experience: "3-5 years", // Default
                        matchPercentage: currentJob.matchPercentage,
                        skills: currentJob.skills.map((skill) => ({
                            name: skill,
                            match: currentJob.matchedSkills ? currentJob.matchedSkills.includes(skill) : false,
                        })),
                        description: formatJobDescription(currentJob.description),
                        companyDescription: `${currentJob.company} is a company in the ${currentJob.industry} industry.`,
                        companySize: currentJob.employeeSize || "Not specified",
                        companyIndustry: currentJob.industry,
                        companyWebsite: "#",
                        applicationUrl: currentJob.url || "#",
                        matchReason: currentJob.matchReason || "",
                        matchedSkills: currentJob.matchedSkills || [],
                    };

                    setJob(transformedJob);
                } else {
                    setError("Job not found");
                }
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobData();
    }, [params.id, router]);

    const formatJobDescription = (description) => {
        if (!description) return "<p>Tidak ada deskripsi tersedia.</p>";

        // Pecah berdasarkan titik + spasi yang diikuti huruf kapital
        const sentences = description.split(/(?<=\.)\s+(?=[A-Z])/);
        let formattedHtml = "<ul>";

        sentences.forEach((sentence) => {
            const trimmed = sentence.trim();
            if (trimmed) {
                formattedHtml += `<li>${trimmed}</li>`;
            }
        });

        formattedHtml += "</ul>";
        return formattedHtml;
    };

    const handleApply = () => {
        if (job.applicationUrl && job.applicationUrl !== "#") {
            window.open(job.applicationUrl, "_blank");
        }
    };

    const jobId = params.id;

    const similarJobs = allJobs
        .filter((j) => j.id !== params.id && j.jobHash !== params.id)
        .slice(0, 3)
        .map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            logo: job.logo || "/placeholder.svg",
            location: job.location,
            matchPercentage: job.matchPercentage,
            skills: job.skills.slice(0, 3), // Show only first 3 skills
            postedDate: job.postedDate,
            description: job.description,
        }));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Pekerjaan Tidak ditemukan</h2>
                <p className="text-muted-foreground mt-2">{error || "Pekerjaan yang Anda cari tidak ada atau telah dihapus."}</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/matches">Kembali</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="gap-1">
                        <Link href="/dashboard/matches">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <RevealOnScroll>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        <div className="flex-1">
                                            <h1 className="text-2xl font-bold">{job.title}</h1>
                                            <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Building className="h-4 w-4" /> {job.company}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" /> {job.location}
                                                </span>
                                                <Badge variant="outline" className="ml-1">
                                                    {job.locationType}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>Diposting {job.postedDate}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>Lamar langsung {job.applicationDeadline}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                    <span>{job.jobType}</span>
                                                </div>
                                                {job.salary !== "Competitive" && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                        <span>{job.salary}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:self-center">
                                            <MatchPercentage percentage={job.matchPercentage} size="lg" />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {job.skills.map((skill) => (
                                            <SkillMatch key={skill.name} name={skill.name} match={skill.match} />
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        <AnimatedButton onClick={handleApply} className="w-full sm:w-auto">
                                            Lamar Sekarang <ExternalLink className="ml-1 h-4 w-4" />
                                        </AnimatedButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </RevealOnScroll>

                        <RevealOnScroll delay={100}>
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Deskripsi Pekerjaan</h2>
                                    <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: job.description }} />
                                </CardContent>
                            </Card>
                        </RevealOnScroll>
                    </div>

                    <div className="space-y-6">
                        <RevealOnScroll delay={200}>
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-semibold mb-4">Tentang {job.company}</h2>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div>
                                            <h3 className="font-medium">{job.company}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">{job.companyDescription}</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Industri</span>
                                            <span>{job.companyIndustry}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Jumlah Karyawan</span>
                                            <span>{job.companySize}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </RevealOnScroll>

                        <RevealOnScroll delay={300}>
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-semibold mb-4">Analisis Kecocokan</h2>
                                    <div className="flex justify-center mb-4">
                                        <MatchPercentage percentage={job.matchPercentage} size="lg" animated={false} />
                                    </div>
                                    <p className="text-sm text-center mb-4">
                                        Profil Anda cocok sebesar <span className="font-semibold">{job.matchPercentage}%</span> dengan persyaratan pekerjaan ini.
                                    </p>

                                    {job.matchReason && (
                                        <>
                                            <Separator className="my-4" />
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-medium">Mengapa Anda Cocok</h3>
                                                <p className="text-sm text-muted-foreground">{job.matchReason}</p>
                                            </div>
                                        </>
                                    )}

                                    <Separator className="my-4" />
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium">Kecocokan Keterampilan</h3>
                                        <div className="space-y-2">
                                            {job.skills.map((skill) => (
                                                <div key={skill.name} className="flex justify-between items-center">
                                                    <span className="text-sm">{skill.name}</span>
                                                    {skill.match ? <Badge className="bg-green-500 hover:bg-green-600">Cocok</Badge> : <Badge variant="outline">Belum Ada</Badge>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </RevealOnScroll>
                    </div>
                </div>

                {similarJobs.length > 0 && (
                    <RevealOnScroll delay={400}>
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Pekerjaan Serupa</h2>
                            </div>
                            <StaggeredAppear staggerAmount={150}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {similarJobs.map((job) => (
                                        <div key={job.id}>
                                            <JobCard job={job} />
                                        </div>
                                    ))}
                                </div>
                            </StaggeredAppear>
                        </div>
                    </RevealOnScroll>
                )}
            </div>

            <ChatBot
                jobTitle={job.title}
                jobDescription={job.description}
                companyName={job.company}
                jobId={jobId}
                initialSuggestedQuestions={[
                    { id: "1", text: "Apa saja keterampilan yang dibutuhkan untuk pekerjaan ini?" },
                    { id: "2", text: `Pengalaman seperti apa yang dibutuhkan untuk posisi ${job.title}?` },
                    { id: "3", text: `Apakah ini posisi ${job.locationType}?` },
                ]}
            />
        </>
    );
}
