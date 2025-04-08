import Link from "next/link";

export default function Navbar() {
  return (
    <div>
        <Link href="/" className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="text-lg font-bold">Quiz App</div>
            <div className="flex space-x-4">
            
            </div>
        </Link>
    </div>
  )
}
