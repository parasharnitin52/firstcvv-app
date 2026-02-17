import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-6xl font-display font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary inline-flex">
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
