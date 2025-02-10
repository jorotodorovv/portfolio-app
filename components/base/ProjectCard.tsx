import Link from "next/link"
import Image from "next/image"

interface ProjectCardProps {
  title: string
  imageSrc: string
  technologies: string[]
  link: string
}

export default function ProjectCard({ title, imageSrc, technologies, link }: ProjectCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl opacity-50 hover:opacity-100 
        transition-all duration-300 ease-in-out hover:scale-110 transform">
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <h3 className="text-xl font-semibold mb-5">{title}</h3>
        <Image className="mb-10 rounded-xl" src={imageSrc} alt={title} width={300} height={400} />
        <div className="mb-4">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-300 mr-2 mb-2">
              {tech}
            </span>
          ))}
        </div>
      </Link>
    </div>
  )
}

