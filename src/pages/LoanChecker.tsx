import React, { useState } from 'react';
import { AlertCircle, Loader, DollarSign, Users, School, Briefcase, Clock, BarChart3, Home, Building, Car, Wallet } from 'lucide-react';

interface FormData {
  dependents: string;
  education: string;
  selfEmployed: string;
  annualIncome: string;
  loanAmount: string;
  loanTerm: string;
  cibilScore: string;
  residentialAssets: string;
  commercialAssets: string;
  luxuryAssets: string;
  bankAssets: string;
}

const initialFormData: FormData = {
  dependents: '',
  education: '',
  selfEmployed: '',
  annualIncome: '',
  loanAmount: '',
  loanTerm: '',
  cibilScore: '',
  residentialAssets: '',
  commercialAssets: '',
  luxuryAssets: '',
  bankAssets: '',
};

const LoanChecker = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Convert string values to numbers for the API payload
    const payload = {
      no_of_dependents: parseInt(formData.dependents) || 0,
      education: formData.education,
      self_employed: formData.selfEmployed,
      income_annum: parseFloat(formData.annualIncome) || 0,
      loan_amount: parseFloat(formData.loanAmount) || 0,
      loan_term: parseInt(formData.loanTerm) || 0,
      cibil_score: parseInt(formData.cibilScore) || 300,
      residential_assets_value: parseFloat(formData.residentialAssets) || 0,
      commercial_assets_value: parseFloat(formData.commercialAssets) || 0,
      luxury_assets_value: parseFloat(formData.luxuryAssets) || 0,
      bank_asset_value: parseFloat(formData.bankAssets) || 0
    };

    try {
      console.log("Sending payload:", JSON.stringify(payload));

      const response = await fetch('https://fin-pltform.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        const errorMessage = data?.error || `Request failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }

      console.log("Received result:", data);
      setResult(data);

    } catch (err) {
      console.error("API request error:", err);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please check your internet connection or try again later.');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    id: string,
    label: string,
    name: keyof FormData,
    type: string = "number",
    min?: string,
    max?: string,
    Icon?: React.FC<any>,
    placeholder: string = ""
  ) => (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={type}
          name={name}
          min={min}
          max={max}
          value={formData[name]}
          onChange={handleInputChange}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${Icon ? 'pl-10' : ''}`}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
          <h1 className="text-3xl font-bold text-white">Loan Eligibility Checker</h1>
          <p className="text-indigo-100 mt-2">Fill in your details to check if you qualify for a loan (Some Time it take times to Bootup the backend Please wait)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details Section */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Details</h2>
            </div>

            {renderInputField("dependents", "Number of Dependents", "dependents", "number", "0", undefined, Users, "0")}

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <School className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
                  required
                >
                  <option value="" disabled>Select Education</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Not Graduate">Not Graduate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Self Employed</label>
              <div className="relative rounded-md shadow-sm p-3 border border-gray-300 rounded-md">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="selfEmployedYes"
                      type="radio"
                      name="selfEmployed"
                      value="Yes"
                      checked={formData.selfEmployed === 'Yes'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      required
                    />
                    <label htmlFor="selfEmployedYes" className="ml-2 block text-sm text-gray-700">Yes</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="selfEmployedNo"
                      type="radio"
                      name="selfEmployed"
                      value="No"
                      checked={formData.selfEmployed === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="selfEmployedNo" className="ml-2 block text-sm text-gray-700">No</label>
                  </div>
                </div>
              </div>
              {!formData.selfEmployed && <input type="text" required style={{display: 'none'}} value={formData.selfEmployed} readOnly/>}
            </div>

            {renderInputField("annualIncome", "Annual Income", "annualIncome", "number", "0", undefined, DollarSign, "Your yearly income")}

            {/* Loan Details Section */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Loan Details</h2>
            </div>

            {renderInputField("loanAmount", "Loan Amount", "loanAmount", "number", "0", undefined, DollarSign, "Amount you want to borrow")}
            {renderInputField("loanTerm", "Loan Term (Years)", "loanTerm", "number", "1", undefined, Clock, "Duration of the loan in years")}
            {renderInputField("cibilScore", "CIBIL Score", "cibilScore", "number", "300", "900", BarChart3, "Score between 300-900")}

            {/* Assets Section */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Your Assets</h2>
            </div>

            {renderInputField("residentialAssets", "Residential Assets Value", "residentialAssets", "number", "0", undefined, Home, "Value of properties")}
            {renderInputField("commercialAssets", "Commercial Assets Value", "commercialAssets", "number", "0", undefined, Building, "Value of business properties")}
            {renderInputField("luxuryAssets", "Luxury Assets Value", "luxuryAssets", "number", "0", undefined, Car, "Value of luxury items")}
            {renderInputField("bankAssets", "Bank Assets Value", "bankAssets", "number", "0", undefined, Wallet, "Value of deposits & investments")}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Processing Your Application...
                </>
              ) : (
                'Check Loan Eligibility'
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {result && result.status === 'success' && (
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Loan Eligibility Result</h3>

          <div className={`mb-6 p-4 rounded-lg ${result.prediction === 'Approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h4 className="text-lg font-semibold mb-2">
              Status: <span className={result.prediction === 'Approved' ? 'text-green-700' : 'text-red-700'}>{result.prediction}</span>
            </h4>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-600">Approval Probability:</p>
                <p className="text-2xl font-bold text-green-600">{(result.probability_approved * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejection Probability:</p>
                <p className="text-2xl font-bold text-red-600">{(result.probability_rejected * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {result.prediction === 'Approved' ? (
            <div className="text-sm text-gray-600">
              <p>Congratulations! Based on the information provided, you are likely to be approved for this loan. Our system has analyzed your financial profile and determined that you meet the eligibility criteria.</p>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>Based on the information provided, your loan application may not be approved at this time. You might consider:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Applying for a smaller loan amount</li>
                <li>Improving your CIBIL score</li>
                <li>Reducing existing debt obligations</li>
                <li>Adding a co-applicant with strong financials</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {result && result.status !== 'success' && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Processing Error</h3>
              <div className="mt-1 text-sm text-red-700">
                There was a problem processing your application. Please verify your information and try again.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanChecker;