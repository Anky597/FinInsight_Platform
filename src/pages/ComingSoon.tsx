import React from 'react';
import { Sparkles, Clock, Bell } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-indigo-500 animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <Clock className="w-8 h-8 text-indigo-600" />
                <div className="absolute top-0 right-0">
                  <Bell className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Exciting Features Coming Soon!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          We're working on something amazing. Stay tuned for new features that will revolutionize your loan management experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Advanced Analytics
            </h3>
            <p className="text-gray-600 text-sm">
              Deep insights into your financial patterns and personalized recommendations
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Smart Notifications
            </h3>
            <p className="text-gray-600 text-sm">
              Real-time alerts and updates about your loan status and opportunities
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI Predictions
            </h3>
            <p className="text-gray-600 text-sm">
              Machine learning powered forecasts for better financial planning
            </p>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-xl">
          <p className="text-sm text-indigo-700">
            Want to be notified when we launch new features? Stay connected with us!
          </p>
        </div>
      </div>
      
      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;