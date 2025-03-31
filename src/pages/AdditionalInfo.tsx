import React, { useState } from 'react';
import { 
  DollarSign, Building, Home, Car, Wallet, Save, Loader2, AlertCircle, 
  BarChart3, Info, PieChart, TrendingUp, Database, Users
} from 'lucide-react';
import Plot from 'react-plotly.js';

// Interface for form data
interface FinancialInfo {
  income_annum: string;
  loan_amount: string;
  residential_assets_value: string;
  commercial_assets_value: string;
  luxury_assets_value: string;
  bank_asset_value: string;
}

// Interface for the expected successful API response
interface PredictionResult {
  kmeans_segment_pred: number;
  kmeans_segment_name: string;
  dbscan_segment_pred: number;
  dbscan_segment_name: string;
  status?: string;
  input_data?: Record<string, any>;
}

// Define Backend API Endpoint
const API_ENDPOINT = "https://fin-pltform.onrender.com/segment";

const FinancialProfiler = () => {
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    income_annum: '',
    loan_amount: '',
    residential_assets_value: '',
    commercial_assets_value: '',
    luxury_assets_value: '',
    bank_asset_value: ''
  });

  // State for API interaction and results
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('3d');
  const [showInfoPopup, setShowInfoPopup] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Basic validation: allow only numbers (and empty string)
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setFinancialInfo(prev => ({
        ...prev,
        [name]: value
      }));
      // Reset results if input changes after submission
      if(showResults) {
        setShowResults(false);
        setPredictionResult(null);
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictionResult(null);
    setShowResults(false);

    // Convert string values to numbers for API
    const numericFinancialInfo = Object.entries(financialInfo).reduce((acc, [key, value]) => {
      const numValue = parseFloat(value);
      acc[key as keyof FinancialInfo] = numValue || 0;
      return acc;
    }, {} as Record<keyof FinancialInfo, number>);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericFinancialInfo)
      });

      if (!response.ok) {
        let errorData: any = { message: `HTTP error! Status: ${response.status}` };
        try {
          const errJson = await response.json();
          errorData = errJson;
        } catch (parseError) {
          errorData.message = errorData.message + ` - ${response.statusText}`;
        }
        throw new Error(errorData.error || errorData.message || "An unknown API error occurred.");
      }

      const result: PredictionResult = await response.json();
      setPredictionResult(result);
      setShowResults(true);

    } catch (err: any) {
      setError(err.message || "An unknown error occurred while predicting the segment.");
      setPredictionResult(null);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  // Reusable Input Field Component
  const renderInputField = (
    id: string,
    label: string,
    name: keyof FinancialInfo,
    Icon: React.FC<any>,
    placeholder: string = "",
    tooltipText: string = ""
  ) => (
    <div className="relative group">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600">
          {label}
        </label>
        {tooltipText && (
          <button 
            type="button"
            onClick={() => setShowInfoPopup(id)}
            className="text-gray-400 hover:text-indigo-600 focus:outline-none"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600" />
        </div>
        <input
          id={id}
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          name={name}
          value={financialInfo[name]}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm transition-colors"
          placeholder={placeholder}
          required
        />
      </div>
      {showInfoPopup === id && (
        <div className="absolute z-10 mt-1 p-2 bg-white rounded-md shadow-lg border border-gray-200 text-xs text-gray-700 w-64">
          <div className="flex justify-between items-start">
            <p>{tooltipText}</p>
            <button 
              type="button" 
              onClick={() => setShowInfoPopup(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Data preparation for various visualizations
  const getPlotData = () => {
    if (!predictionResult || !showResults) return [];

    const xFeature: keyof FinancialInfo = 'income_annum';
    const yFeature: keyof FinancialInfo = 'loan_amount';
    const zFeature: keyof FinancialInfo = 'bank_asset_value';

    const xValue = parseFloat(financialInfo[xFeature]) || 0;
    const yValue = parseFloat(financialInfo[yFeature]) || 0;
    const zValue = parseFloat(financialInfo[zFeature]) || 0;

    const predictedKmeansName = predictionResult.kmeans_segment_name || "N/A";
    
    // Define colors for K-Means segments
    const kmeansColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    const pointColor = kmeansColors[predictionResult.kmeans_segment_pred >= 0 ? predictionResult.kmeans_segment_pred % kmeansColors.length : 0];

    return [{
      x: [xValue],
      y: [yValue],
      z: [zValue],
      mode: 'markers',
      marker: {
        size: 12,
        color: pointColor,
        opacity: 0.8,
        line: { color: 'rgba(50, 50, 50, 0.5)', width: 1 }
      },
      type: 'scatter3d',
      name: `Your Profile (${predictedKmeansName})`,
      hovertemplate: `<b>${predictedKmeansName}</b><br>` +
                     `${xFeature.replace(/_/g, ' ')}: %{x:$,.0f}<br>` +
                     `${yFeature.replace(/_/g, ' ')}: %{y:$,.0f}<br>` +
                     `${zFeature.replace(/_/g, ' ')}: %{z:$,.0f}<extra></extra>`
    }];
  };

  // Plot Layout for 3D visualization
  const getPlotLayout = () => {
    const xFeature: keyof FinancialInfo = 'income_annum';
    const yFeature: keyof FinancialInfo = 'loan_amount';
    const zFeature: keyof FinancialInfo = 'bank_asset_value';
    
    return {
      title: 'Your Financial Profile in 3D Space',
      autosize: true,
      margin: { l: 10, r: 10, b: 10, t: 50 },
      scene: {
        xaxis: { title: 'Annual Income' },
        yaxis: { title: 'Loan Amount' },
        zaxis: { title: 'Bank Assets' },
        camera: { eye: {x: 1.5, y: 1.5, z: 0.8} }
      },
      legend: { yanchor: "top", y: 0.99, xanchor: "left", x: 0.01 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    };
  };

  // Get pie chart data for assets distribution
  const getAssetsPieChartData = () => {
    const residentialValue = parseFloat(financialInfo.residential_assets_value) || 0;
    const commercialValue = parseFloat(financialInfo.commercial_assets_value) || 0;
    const luxuryValue = parseFloat(financialInfo.luxury_assets_value) || 0;
    const bankValue = parseFloat(financialInfo.bank_asset_value) || 0;
    
    const totalAssets = residentialValue + commercialValue + luxuryValue + bankValue;
    
    return [{
      values: [residentialValue, commercialValue, luxuryValue, bankValue],
      labels: ['Residential', 'Commercial', 'Luxury', 'Bank'],
      type: 'pie',
      marker: {
        colors: ['#60A5FA', '#34D399', '#A78BFA', '#FBBF24']
      },
      textinfo: 'label+percent',
      textposition: 'inside',
      hoverinfo: 'label+value+percent',
      hole: 0.4,
      hovertemplate: '%{label}: $%{value:,.0f} (%{percent})<extra></extra>'
    }];
  };

  // Layout for pie chart
  const getPieChartLayout = () => {
    return {
      title: 'Your Assets Distribution',
      height: 400,
      margin: { l: 20, r: 20, t: 50, b: 20 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      showlegend: false
    };
  };

  // Get segment benchmark comparison data
  const getSegmentComparisonData = () => {
    if (!predictionResult) return [];
    
    // Sample average data for segments (would come from your model in reality)
    const segmentAverages: Record<string, any> = {
      'Mid Income/Loan': {
        income_annum: 3500000,
        loan_amount: 10000000,
        bank_asset_value: 3000000
      },
      'Low Value': {
        income_annum: 7500000,
        loan_amount: 25000000,
        bank_asset_value: 7000000
      },
      'Dense Core 1': {
        income_annum: 5500000,
        loan_amount: 15000000,
        bank_asset_value: 4500000
      },
      'Noise/Outlier': {
        income_annum: 500000,
        loan_amount: 1000000,
        bank_asset_value: 300000
      }
    };
    
    const userSegment = predictionResult.kmeans_segment_name;
    const userValues = {
      income_annum: parseFloat(financialInfo.income_annum) || 0,
      loan_amount: parseFloat(financialInfo.loan_amount) || 0,
      bank_asset_value: parseFloat(financialInfo.bank_asset_value) || 0
    };
    
    const segmentData = segmentAverages[userSegment] || segmentAverages['Mid Income/Loan'];
    
    return [
      {
        x: ['Income', 'Loan Amount', 'Bank Assets'],
        y: [userValues.income_annum, userValues.loan_amount, userValues.bank_asset_value],
        type: 'bar',
        name: 'Your Profile',
        marker: {
          color: '#4F46E5',
          opacity: 0.8
        },
        hovertemplate: '%{x}: $%{y:,.0f}<extra>Your Profile</extra>'
      },
      {
        x: ['Income', 'Loan Amount', 'Bank Assets'],
        y: [segmentData.income_annum, segmentData.loan_amount, segmentData.bank_asset_value],
        type: 'bar',
        name: `${userSegment} Average`,
        marker: {
          color: '#10B981',
          opacity: 0.6
        },
        hovertemplate: '%{x}: $%{y:,.0f}<extra>Segment Average</extra>'
      }
    ];
  };

  // Layout for comparison chart
  const getComparisonChartLayout = () => {
    return {
      title: 'How You Compare to Your Segment',
      height: 400,
      margin: { l: 40, r: 40, t: 50, b: 40 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      barmode: 'group',
      legend: {
        x: 0.1,
        y: 1.2,
        orientation: 'h'
      },
      yaxis: {
        title: 'Value (₹)',
        tickformat: ',.0f'
      }
    };
  };

  // Segment descriptions to provide context
  const getSegmentDescription = (segmentName: string) => {
    const descriptions: Record<string, string> = {
      'Mid Income/Loan': 'Clients with moderate income levels seeking smaller loans. This segment typically has modest asset values and represents a balanced risk profile.',
      'Low Value': 'Despite the name, this segment represents high-value clients with substantial income and large loan requirements. They possess significant assets across multiple categories.',
      'Dense Core 1': 'The majority of clients fall into this core segment, representing moderate to high financial stability with well-distributed assets.',
      'Noise/Outlier': 'Rare cases that fall outside typical patterns, often representing unique financial circumstances that require special attention.'
    };
    
    return descriptions[segmentName] || 'No description available for this segment.';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-6 py-5 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Financial Profile Analyzer</h1>
          <p className="text-indigo-100 text-center mt-1 text-sm md:text-base">Discover your financial segment and compare with market trends</p>
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-6">
          {/* Form */}
          <div className="md:col-span-5 p-6 border-r border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Your Financial Details
                </h2>
                <p className="text-xs text-gray-500 mt-1">All values are in Indian Rupees (₹)</p>
              </div>
              
              {renderInputField(
                "income", 
                "Annual Income", 
                "income_annum", 
                DollarSign, 
                "e.g., 5000000",
                "Your total yearly income from all sources before taxes."
              )}
              
              {renderInputField(
                "loan", 
                "Desired Loan Amount", 
                "loan_amount", 
                DollarSign, 
                "e.g., 1000000",
                "The total loan amount you're interested in applying for."
              )}
              
              {renderInputField(
                "residential", 
                "Residential Assets Value", 
                "residential_assets_value", 
                Home, 
                "e.g., 8000000",
                "Total value of your residential properties like houses, apartments, etc."
              )}
              
              {renderInputField(
                "commercial", 
                "Commercial Assets Value", 
                "commercial_assets_value", 
                Building, 
                "e.g., 2000000",
                "Total value of commercial properties, business assets, etc."
              )}
              
              {renderInputField(
                "luxury", 
                "Luxury Assets Value", 
                "luxury_assets_value", 
                Car, 
                "e.g., 1000000",
                "Value of high-end assets like luxury cars, jewelry, art, etc."
              )}
              
              {renderInputField(
                "bank", 
                "Bank Assets Value", 
                "bank_asset_value", 
                Wallet, 
                "e.g., 3000000",
                "Total value of cash, savings, fixed deposits, and other liquid assets."
              )}

              {/* Submit Button & Loading/Error Area */}
              <div className="pt-4">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm flex items-center transition-opacity duration-300 ease-in-out">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0"/>
                    <span>Error: {error}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing Profile...</>
                  ) : (
                    <><Save className="w-5 h-5 mr-2 group-hover:animate-pulse" />Analyze My Profile</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results and Visualization Section - Renders based on state */}
          <div className="md:col-span-7 p-6 bg-gray-50">
            {!showResults && !loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Database className="w-16 h-16 text-indigo-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Enter Your Details</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Fill out the form with your financial information to see your predicted market segment and personalized insights.
                </p>
              </div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Loader2 className="w-16 h-16 text-indigo-500 mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Analyzing Your Profile</h3>
                <p className="text-sm text-gray-500">
                  Our AI is processing your financial data to identify your market segment...
                </p>
              </div>
            ) : predictionResult && showResults ? (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>

                {/* Segment Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* K-Means Result Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200 transform hover:scale-102 transition-transform duration-200">
                    <div className="flex items-center mb-2">
                      <PieChart className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-sm font-medium text-blue-800">K-Means Segment</p>
                    </div>
                    <p className="text-xl font-bold text-blue-900">{predictionResult.kmeans_segment_name || 'N/A'}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      {getSegmentDescription(predictionResult.kmeans_segment_name)}
                    </p>
                  </div>
                  
                  {/* DBSCAN Result Box */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200 transform hover:scale-102 transition-transform duration-200">
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 text-purple-600 mr-2" />
                      <p className="text-sm font-medium text-purple-800">DBSCAN Segment</p>
                    </div>
                    <p className="text-xl font-bold text-purple-900">{predictionResult.dbscan_segment_name || 'N/A'}</p>
                    <p className="text-xs text-purple-700 mt-1">
                      {getSegmentDescription(predictionResult.dbscan_segment_name)}
                    </p>
                  </div>
                </div>
                
                {/* Visualization Tabs */}
                <div className="mt-8 border rounded-lg bg-white shadow-sm">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        className={`${
                          activeTab === '3d'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
                        onClick={() => setActiveTab('3d')}
                      >
                        <div className="flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          3D View
                        </div>
                      </button>
                      <button
                        className={`${
                          activeTab === 'assets'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
                        onClick={() => setActiveTab('assets')}
                      >
                        <div className="flex items-center justify-center">
                          <PieChart className="w-4 h-4 mr-2" />
                          Assets
                        </div>
                      </button>
                      <button
                        className={`${
                          activeTab === 'compare'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
                        onClick={() => setActiveTab('compare')}
                      >
                        <div className="flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Compare
                        </div>
                      </button>
                    </nav>
                  </div>
                  
                  <div className="p-4">
                    {activeTab === '3d' && (
                      <div style={{ height: '400px', width: '100%' }}>
                        <Plot
                          data={getPlotData() as any}
                          layout={getPlotLayout() as any}
                          useResizeHandler={true}
                          style={{ width: '100%', height: '100%' }}
                          config={{ responsive: true, displaylogo: false }}
                        />
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Visualizing your position in the financial landscape based on income, loan amount, and bank assets
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'assets' && (
                      <div>
                        <Plot
                          data={getAssetsPieChartData() as any}
                          layout={getPieChartLayout() as any}
                          useResizeHandler={true}
                          style={{ width: '100%', height: '100%' }}
                          config={{ responsive: true, displaylogo: false }}
                        />
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Breakdown of your total assets by category
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'compare' && (
                      <div>
                        <Plot
                          data={getSegmentComparisonData() as any}
                          layout={getComparisonChartLayout() as any}
                          useResizeHandler={true}
                          style={{ width: '100%', height: '100%' }}
                          config={{ responsive: true, displaylogo: false }}
                        />
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          How your profile compares to others in your segment
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Segment Insights */}
                <div className="mt-6 p-4 border rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50">
                  <h3 className="font-medium text-indigo-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    What This Means For You
                  </h3>
                  <p className="text-sm text-indigo-800">
                    {predictionResult.kmeans_segment_name === 'Mid Income/Loan' ? (
                      "You're in the Mid Income/Loan segment, characterized by moderate income levels and loan requirements. This group typically has balanced financial health with diversified assets. Financial institutions often offer specialized products for this segment with competitive interest rates and flexible terms."
                    ) : predictionResult.kmeans_segment_name === 'Low Value' ? (
                      "Despite the name, the Low Value segment represents high-value clients seeking substantial loans with significant income. Your asset portfolio shows strong financial standing. You may qualify for premium financial products, including preferential rates, higher credit limits, and personalized banking services."
                    ) : (
                      "Based on your financial profile, you belong to a segment with specific financial characteristics. Your particular combination of income, loan requirements, and assets puts you in a position where customized financial products may be applicable."
                    )}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default FinancialProfiler;