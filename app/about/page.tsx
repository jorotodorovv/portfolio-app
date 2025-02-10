import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"
import TechStack from "@/components/base/TechStack"
import ProjectCard from "@/components/base/ProjectCard"

export default function About() {
  const projects = [
    {
      title: "Scheduler Calendar App",
      imageSrc: "https://dd0vjyvor455isbt.public.blob.vercel-storage.com/images/scheduler-calendar-app-eWkwjxnmd0ofcjl5tUBgy4jeIBbeEG.jpg",
      technologies: ["Next.js", "Redux.js", "Tailwind CSS", "Typescript", "Docker", "Prisma"],
      link: "https://scheduler-calendar-app.vercel.app/",
    },
    {
      title: "Video Streaming App",
      imageSrc: "https://dd0vjyvor455isbt.public.blob.vercel-storage.com/images/video-streaming-app-Q92P3Nl3NBfhH8EVekdN9NsrpihtUM.jpg",
      technologies: ["React.js", "Typescript", "Docker", "Prisma"],
      link: "https://github.com/jorotodorovv/video-streaming-app/",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <section className="mb-20">
        <div className="flex items-center mb-6">
          <Image src="https://dd0vjyvor455isbt.public.blob.vercel-storage.com/images/personal-photo-2iTOztPLiUj2x7KMd5KdsFgtMoXu97.jpg" 
              alt="Personal photo" width={150} height={150} className="rounded-full mr-6" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Georgi Todorov</h1>
            <em className="text-xl text-gray-300">Just a Developer</em>
          </div>
        </div>
        <p className="text-lg text-gray-300">
        <strong className="token function">Hey there!</strong>
        <br/>
        <br/>
        I’m a developer who enjoys creating cool and useful things just by writing code.
        <br/>
        I’ve been working with web technologies for the past <strong className="token function">6+ years</strong>, 
        building back-end and front-end solutuions.
        <br/>
        Always eager to learn, experiment, and tackle new challenges.
        <br/>
        Right now, I’m freelancing and open to help out with whatever problem you throw at me.
        <br/>
        <br/>
        <strong className="token function">Let’s connect and build something together!</strong>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-10">Stuff I know</h2>
        <TechStack />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-10">Things I made</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Find me</h2>
        <div className="flex space-x-4">
          <a
            href="https://github.com/jorotodorovv/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/georgizhivkovtodorov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            <Linkedin size={24} />
          </a>
          <a href="mailto:georgizhivkovtodorov@gmail.com" className="text-gray-300 hover:text-white">
            <Mail size={24} />
          </a>
        </div>
      </section>
    </div>
  )
}