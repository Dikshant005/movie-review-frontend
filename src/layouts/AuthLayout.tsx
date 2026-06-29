import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bgImage from '../assets/cinematic_bg.png';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-black text-white relative font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* Gradients to blend background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
      </div>

      <Header />
      
      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
