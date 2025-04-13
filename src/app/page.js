import { Brain, PlayCircle, PlusCircle, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Welcome to the Quiz App
          </h1>
          <p className="text-lg text-gray-600">
            Test your knowledge across various topics
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Take Quiz */}
          <Link href="/quiz" className="transform transition-all duration-300 hover:scale-105">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow h-full">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 mx-auto">
                <PlayCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                Take Quiz
              </h3>
              <p className="text-gray-600 text-center">
                Challenge yourself with our collection of quizzes across various topics
              </p>
            </div>
          </Link>

          {/* Leaderboard */}
          <Link href="/leaderboard" className="transform transition-all duration-300 hover:scale-105">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow h-full">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 mx-auto">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                Leaderboard
              </h3>
              <p className="text-gray-600 text-center">
                See how you rank against other quiz takers
              </p>
            </div>
          </Link>

          {/* Create Quiz */}
          <Link href="/quiz/add" className="transform transition-all duration-300 hover:scale-105">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow h-full">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                <PlusCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                Create Quiz
              </h3>
              <p className="text-gray-600 text-center">
                Design your own quiz and share knowledge with others
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Join our community of quiz enthusiasts and start your learning journey today!
          </p>
        </div>
      </div>
    </div>
  );
}