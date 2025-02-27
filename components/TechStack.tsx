'use client'

import Image from "next/image"
import { useState } from "react"

const technologies = [
    { name: "React", logo: "/logos/react.svg" },
    { name: "Next.js", logo: "/logos/nextjs.svg" },
    { name: "CSharp", logo: "/logos/csharp.svg" },
    { name: "TypeScript", logo: "/logos/typescript.svg" },
    { name: "Node.js", logo: "/logos/nodejs.svg" },
    { name: "Tailwind CSS", logo: "/logos/tailwindcss.svg" },
    { name: "Docker", logo: "/logos/docker.svg" },
]

export default function TechStack() {
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-8 gap-4">
                {technologies.map((tech) => (
                    <div 
                        key={tech.name} 
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setHoveredTech(tech.name)}
                        onMouseLeave={() => setHoveredTech(null)}
                    >
                        <div className="flex flex-col items-center 
                            opacity-50 group-hover:opacity-100
                            transition-opacity duration-300">
                            {hoveredTech === tech.name && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                                text-center font-medium bg-gray-800 text-white px-2 py-1 rounded
                                z-10 whitespace-nowrap">
                                    {tech.name}
                                </div>
                            )}
                            <Image
                                src={tech.logo || "/placeholder.svg"}
                                alt={tech.name}
                                width={100}
                                height={100}
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

