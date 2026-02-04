'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-background.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-5xl mx-auto relative z-10">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Code Clash
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-300 font-medium mb-8 tracking-wide">
            Offline Quiz Competition Platform
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the thrill of real-time quiz competitions. Form your team, showcase your knowledge,
            and compete against the best in exciting, fast-paced challenges designed for excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Link href="/participant/register">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-900 hover:from-cyan-400 hover:to-cyan-300 text-lg px-10 py-6 rounded-xl font-semibold w-full sm:w-auto shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                Register as Participant
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button
                size="lg"
                variant="outline"
                className="group relative border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 text-lg px-10 py-6 rounded-xl font-semibold w-full sm:w-auto bg-transparent backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Admin Login
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">&copy; 2024 Code Clash. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Offline Quiz Competition Platform</p>
        </div>
      </footer>
    </div>
  );
}
