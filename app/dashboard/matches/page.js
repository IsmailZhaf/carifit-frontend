"use client";

import { useState, useEffect } from "react";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Briefcase } from "lucide-react";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { StaggeredAppear } from "@/components/staggered-appear";
import { Badge } from "@/components/ui/badge";

const FilterButton = ({ filter, isActive, toggleFilter }) => (
    <Button variant={isActive ? "default" : "outline"} size="sm" onClick={toggleFilter} className="h-8">
        {filter}
    </Button>
);

export default function MatchesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("match");
    const [filters, setFilters] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiMessage, setApiMessage] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/recommendations");
                console.log("Response:", response);

                if (!response.ok) {
                    throw new Error("Failed to fetch recommendations");
                }

                const result = await response.json();
                console.log("API Result:", result);
                console.log("Jobs data:", result.data);

                // Log each job to see what fields are missing
                if (result.data && result.data.length > 0) {
                    result.data.forEach((job, index) => {
                        console.log(`Job ${index}:`, job);
                        console.log(`Job ${index} fields:`, {
                            id: job.id,
                            title: job.title,
                            company: job.company,
                            location: job.location,
                            skills: job.skills,
                            matchPercentage: job.matchPercentage,
                            postedDate: job.postedDate,
                            description: job.description,
                        });
                    });
                }

                setJobs(result.data || []);
                setApiMessage(result.message);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const filteredJobs = jobs
        .filter((job) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query) || job.location.toLowerCase().includes(query) || job.skills.some((skill) => skill.toLowerCase().includes(query));
            }
            return true;
        })
        .filter((job) => {
            if (filters.length === 0) return true;
            return filters.some((filter) => {
                if (filter === "Remote") return job.location.includes("Remote");
                if (filter === "High Match") return job.matchPercentage >= 80;
                return job.skills.includes(filter);
            });
        })
        .sort((a, b) => {
            if (sortBy === "match") return b.matchPercentage - a.matchPercentage;
            if (sortBy === "recent") {
                if (a.postedDate.includes("day") && b.postedDate.includes("week")) return -1;
                if (a.postedDate.includes("week") && b.postedDate.includes("day")) return 1;
                return 0;
            }
            if (sortBy === "company") return a.company.localeCompare(b.company);
            return 0;
        });

    const toggleFilter = (filter) => {
        setFilters((prevFilters) => (prevFilters.includes(filter) ? prevFilters.filter((f) => f !== filter) : [...prevFilters, filter]));
    };

    const hasJobsButFiltered = jobs.length > 0 && filteredJobs.length === 0;
    const hasNoJobsFromAPI = jobs.length === 0;

    if (loading) {
        return (
            <div className="space-y-8">
                <RevealOnScroll>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Rekomendasi Pekerjaan</h1>
                        <p className="text-muted-foreground mt-2">Memuat rekomendasi pekerjaan...</p>
                    </div>
                </RevealOnScroll>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-muted/30 rounded-lg h-64 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <RevealOnScroll>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Rekomendasi Pekerjaan</h1>
                        <p className="text-muted-foreground mt-2">Terjadi kesalahan saat memuat rekomendasi pekerjaan</p>
                    </div>
                </RevealOnScroll>
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Error saat memuat rekomendasi</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Try again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <RevealOnScroll>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rekomendasi Pekerjaan</h1>
                    <p className="text-muted-foreground mt-2">Pekerjaan yang sesuai dengan keterampilan dan pengalaman Anda ({jobs.length} ditemukan)</p>
                </div>
            </RevealOnScroll>

            {jobs.length > 0 && (
                <>
                    <RevealOnScroll delay={200}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input placeholder="Search jobs..." className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="flex gap-4">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[210px] transition-all duration-300 hover:border-primary/50">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="match">Persentase Kecocokan</SelectItem>
                                        <SelectItem value="recent">Terbaru</SelectItem>
                                        <SelectItem value="company">Company</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant={showFilters ? "default" : "outline"} size="icon" className="transition-all duration-300 hover:bg-primary/10 hover:border-primary/50" onClick={() => setShowFilters(!showFilters)}>
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Filter</span>
                                </Button>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {showFilters && (
                        <RevealOnScroll>
                            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Filters</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setFilters([])}>
                                        Hapus semua
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Lokasi</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <FilterButton filter="Remote" isActive={filters.includes("Remote")} toggleFilter={() => toggleFilter("Remote")} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Kecocokan</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <FilterButton filter="High Match (80%+)" isActive={filters.includes("High Match")} toggleFilter={() => toggleFilter("High Match")} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {["React", "TypeScript", "Node.js", "Python", "UI/UX", "AWS"].map((skill) => (
                                                <FilterButton key={skill} filter={skill} isActive={filters.includes(skill)} toggleFilter={() => toggleFilter(skill)} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    )}

                    {filters.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <Badge key={filter} variant="secondary" className="flex items-center gap-1 py-1.5 pr-1 pl-3">
                                    {filter}
                                    <button onClick={() => toggleFilter(filter)} className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors">
                                        <X className="h-3 w-3" />
                                        <span className="sr-only">Hapus {filter}</span>
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Job results or empty states */}
            {filteredJobs.length > 0 ? (
                <StaggeredAppear className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" staggerAmount={150}>
                    {filteredJobs.map((job) => (
                        <div key={job.id}>
                            <JobCard job={job} />
                        </div>
                    ))}
                </StaggeredAppear>
            ) : hasNoJobsFromAPI ? (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                    <div className="flex justify-center mb-4">
                        <Briefcase className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Belum Ada Rekomendasi Pekerjaan</h3>

                    <div className="space-y-3">
                        <Button variant="default" onClick={() => (window.location.href = "/dashboard/upload")}>
                            Unggah CV Anda
                        </Button>
                    </div>
                </div>
            ) : hasJobsButFiltered ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Belum Ada Rekomendasi Pekerjaan</h3>
                    <p className="text-muted-foreground mb-4">Coba sesuaikan pencarian atau filter Anda untuk melihat lebih banyak hasil</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery("");
                            setFilters([]);
                        }}
                    >
                        Hapus Semua Filter
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
