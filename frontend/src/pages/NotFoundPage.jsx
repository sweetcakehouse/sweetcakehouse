import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rosebakery-50 text-rosebakery-500 mx-auto flex items-center justify-center border border-rosebakery-100 shadow-sm">
        <Cake className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold text-choco-900">404</h1>
        <h2 className="font-serif text-xl font-bold text-choco-800">Page Not Found</h2>
        <p className="text-sm text-choco-500">
          The cake or page you are looking for seems to have been eaten or moved to a different shelf!
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Bakery Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

