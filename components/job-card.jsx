"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { MatchPercentage } from "@/components/match-percentage";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/animated-button";
import Link from "next/link";

export function JobCard({ job }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    console.log("JobCard rendered with job: ", job);

    return (
        <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md h-full", isHovered && "transform-gpu scale-[1.02]")} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                        <div>
                            <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                            <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                        </div>
                    </div>
                    <div className={cn("transition-transform duration-300", isHovered && "scale-110")}>
                        <MatchPercentage percentage={job.matchPercentage} />
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mt-4">
                        {job.skills.map((skill, index) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className={cn("font-normal transition-all duration-300", isHovered && "bg-primary/10")}
                                style={{
                                    transitionDelay: `${index * 50}ms`,
                                    transform: isHovered ? "translateY(-2px)" : "none",
                                }}
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {job.description && (
                    <div className={cn("mt-4 overflow-hidden transition-all duration-300", isExpanded ? "max-h-48" : "max-h-0")}>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                )}

                {job.description && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsExpanded(!isExpanded);
                        }}
                        className="mt-4 text-sm text-primary flex items-center hover:underline"
                    >
                        {isExpanded ? (
                            <>
                                Tampilkan lebih sedikit <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Tampilkan lebih banyak <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                        )}
                    </button>
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 p-6 pt-0 border-t mt-auto">
                <p className="text-sm text-muted-foreground">Diposting {job.postedDate}</p>
                <Link href={`/dashboard/matches/${job.id}`} className="block h-full">
                    <AnimatedButton size="sm" className="gap-1.5  cursor-pointer">
                        Lihat Pekerjaan <ExternalLink className="h-3.5 w-3.5" />
                    </AnimatedButton>
                </Link>
            </CardFooter>
        </Card>
    );
}
