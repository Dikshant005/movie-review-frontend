export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 p-6 bg-black/40 backdrop-blur-sm border-t border-white/10 text-center">
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CineReview. All rights reserved.
      </p>
    </footer>
  );
}
