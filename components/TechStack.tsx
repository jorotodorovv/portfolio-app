import Image from "next/image"

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
    return (
        <div className="grid grid-cols-8 gap-4">
            {technologies.map((tech) => (
                <div key={tech.name} className="relative group">
                    <div className="flex flex-col items-center 
                        opacity-50 group-hover:opacity-100
                        transition-opacity duration-300">
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
    )
}

