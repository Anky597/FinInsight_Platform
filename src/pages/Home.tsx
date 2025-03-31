import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, ShieldCheck, Users, DollarSign, TrendingUp, ClipboardList, Cpu, PieChart, BarChart3 } from 'lucide-react'; // Added new icons

const Home = () => {
  const navigate = useNavigate();

  // Helper for feature cards for cleaner code
  const FeatureCard = ({ Icon, title, description }: { Icon: React.FC<any>, title: string, description: string }) => (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-base">{description}</p>
      </div>
    </div>
  );

  // Helper for "How It Works" steps
  const HowItWorksStep = ({ Icon, title, description, stepNumber }: { Icon: React.FC<any>, title: string, description: string, stepNumber: number }) => (
    <div className="relative p-6 bg-white rounded-lg shadow-md border border-gray-200">
       <div className="absolute top-0 left-0 -mt-3 -ml-3 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
        {stepNumber}
      </div>
      <div className="flex justify-center mb-3">
        <Icon className="h-10 w-10 text-indigo-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Simplify Your</span>
              <span className="block text-indigo-600">Financial Decisions</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              Instantly check your loan eligibility with our Machine Learning powered system.
              {/* Added mention of segmentation */}
              Gain insights into your financial profile segment and make informed choices.
            </p>
            {/* Call to Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/loan-checker')} // Assuming this is the main tool page
                className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
              >
                Check Eligibility Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="mt-3 sm:mt-0 flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-indigo-600 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Sign In / Register
              </button>
            </div>
          </div>
          {/* Hero Image / Placeholder */}
          <div className="mt-12 lg:mt-0 lg:w-1/2">
             {/* Kept the placeholder graphic */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl transform -rotate-3 rounded-2xl"></div>
              <div className="relative bg-white p-6 shadow-lg rounded-2xl border border-gray-100">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-500">FinInsight Platform</div>
                  </div>
                   {/* Simplified graphic representation */}
                  <div className="space-y-3">
                    <div className="h-4 bg-indigo-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-indigo-100 rounded animate-pulse delay-100"></div>
                     <div className="flex items-center space-x-4 my-4">
                       <div className="flex-1 h-10 bg-indigo-200 rounded flex items-center justify-center text-indigo-600 font-semibold">Input</div>
                       <ArrowRight className="w-6 h-6 text-gray-400"/>
                       <div className="flex-1 h-10 bg-green-200 rounded flex items-center justify-center text-green-700 font-semibold">Results</div>
                     </div>
                    <div className="h-4 bg-indigo-100 rounded w-5/6 animate-pulse delay-200"></div>
                     <div className="h-10 bg-indigo-500 rounded mt-4 flex items-center justify-center text-white font-medium shadow">Get Analysis</div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">Avg. Analysis Time: <span className="font-bold text-indigo-600">~1 sec</span></div>
                  <div className="text-xs text-gray-500">Prediction Accuracy: <span className="font-bold text-green-500">High</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
       <div className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Simple Steps to Financial Clarity</h2>
            <p className="mt-4 text-lg text-gray-600">
              Understand your standing in just a few clicks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <HowItWorksStep
                Icon={ClipboardList}
                title="1. Enter Your Data"
                description="Securely provide key financial details like income and asset values through our intuitive form."
                stepNumber={1}
             />
             <HowItWorksStep
                Icon={Cpu} // Or Zap for speed
                title="2. Instant AI Analysis"
                description="Our advanced Machine Learning models process your information in real-time."
                stepNumber={2}
             />
             <HowItWorksStep
                Icon={BarChart3} // Or CheckCircle / PieChart
                title="3. Get Clear Results"
                description="Receive your loan eligibility status (Approved/Rejected), probability, and your financial profile segment."
                stepNumber={3}
             />
          </div>
        </div>
       </div>

      {/* Features Section (Expanded) */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Platform Highlights</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Leverage powerful tools designed for your financial journey.
            </p>
          </div>

          {/* Adjusted grid for 4 features */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
             <FeatureCard
                Icon={Clock}
                title="Fast Eligibility Check"
                description="Get your loan eligibility results almost instantly. No lengthy forms or waiting periods."
             />
             <FeatureCard
                Icon={CheckCircle}
                title="Accurate Predictions"
                description="Our ML models provide precise eligibility assessments and probability scores based on your data."
             />
             {/* Added Segmentation Feature */}
             <FeatureCard
                Icon={PieChart} // Or Users icon
                title="Profile Segmentation"
                description="Understand where your financial profile fits. Our system groups similar profiles, offering valuable context."
             />
             <FeatureCard
                Icon={ShieldCheck}
                title="Secure & Confidential"
                description="Your information is protected with robust security measures and kept strictly confidential."
             />
          </div>
        </div>
      </div>

      {/* Stats Section (Kept as is) */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Stats items remain the same */}
             <div className="text-center">
              <div className="flex justify-center"> <Users className="h-10 w-10 text-indigo-200" /> </div>
              <p className="mt-2 text-3xl font-extrabold text-white">10,000+</p>
              <p className="mt-1 text-xl font-medium text-indigo-200">Users Analyzed</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center"> <DollarSign className="h-10 w-10 text-indigo-200" /> </div>
              <p className="mt-2 text-3xl font-extrabold text-white">$500M+</p>
              <p className="mt-1 text-xl font-medium text-indigo-200">Loan Values Assessed</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center"> <TrendingUp className="h-10 w-10 text-indigo-200" /> </div>
              <p className="mt-2 text-3xl font-extrabold text-white">High</p>
              <p className="mt-1 text-xl font-medium text-indigo-200">Prediction Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section (Kept as is) */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to gain financial insights?</span>
            <span className="block text-indigo-600">Start your analysis today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/loan-checker')} // Navigate to the tool
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;