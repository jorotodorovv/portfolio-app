import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-800 py-4">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold"></Link>
        <ul className="flex space-x-4">
          <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
          <li><Link href="/blog" className="hover:text-gray-300">Blog</Link></li>
          <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
        </ul>
      </nav>
    </header>
  )
}

