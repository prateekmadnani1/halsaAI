import React, { useState } from 'react';
import './LandingPage.css'; // Import the CSS file
import Spinner from './Spinner'; // Import the Spinner component

const LandingPage = () => {
  const [hasInsurance, setHasInsurance] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    smoker: '',
    maritalStatus: '',
    dependents: '',
    zipCode: '',
    healthStatus: '',
    doctorVisits: '',
    medications: '',
    employmentStatus: '',
    annualIncome: '',
    coverageType: '',
    preferredPlan: '',
  });

  const [existingInsuranceData, setExistingInsuranceData] = useState({
    currentProvider: '',
    currentPlan: '',
    lookingForNewPlan: false,
  });

  const [recommendedProviders, setRecommendedProviders] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const [enquireMessage, setEnquireMessage] = useState(''); // State for enquiry messages

  const handleInsuranceChange = (e) => {
    setHasInsurance(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleExistingInsuranceChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setExistingInsuranceData({
        ...existingInsuranceData,
        [name]: checked,
      });
    } else {
      setExistingInsuranceData({
        ...existingInsuranceData,
        [name]: value,
      });
    }
  };

  const fetchRecommendedProviders = async (payload) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch('https://your-backend-api.com/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      // Simulate a delay before returning the recommendations
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay for 3 seconds
      return data.topProviders; // Assume the API returns the top providers
    } catch (error) {
      console.error('Error fetching recommended plans:', error);
  
      // Simulate a delay before returning the fallback providers
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay for 3 seconds
  
      // Return real providers from Buffalo, NY when there's an error, with details
      return [
        {
          name: 'Kaleida Health',
          pros: ['Comprehensive network of hospitals', 'Wide range of specialists'],
          cons: ['Long waiting times', 'Higher out-of-pocket expenses'],
          contact: '716-859-5600',
          address: '100 High St, Buffalo, NY 14203',
        },
        {
          name: 'Catholic Health',
          pros: ['Personalized care', 'Strong focus on community health'],
          cons: ['Limited specialists compared to larger networks'],
          contact: '716-706-2112',
          address: '144 Genesee St, Buffalo, NY 14203',
        },
        {
          name: 'Teladoc Health',
          pros: ['24/7 virtual consultations', 'Affordable telehealth services'],
          cons: ['No in-person care', 'Specialty care is limited'],
          contact: '1-800-835-2362',
          address: '28 Liberty St, New York, NY 10005 (virtual services)',
        },
      ];
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the data to be sent based on the user's response
    const payload =
      hasInsurance === 'yes' && existingInsuranceData.lookingForNewPlan
        ? { ...existingInsuranceData }
        : { ...formData };

    // Print the JSON data to be sent to the backend
    console.log('JSON to be sent to backend:', JSON.stringify(payload, null, 2));

    // Now proceed with hitting the API
    const topProviders = await fetchRecommendedProviders(payload);
    setRecommendedProviders(topProviders);
    setShowResults(true);
  };

  const handleEnquire = (providerName) => {
    setEnquireMessage(`The healthcare provider ${providerName} will contact you shortly.`);
    // Set a timeout to clear the message after 30 seconds
    setTimeout(() => {
        setEnquireMessage(''); // Clear the message after 30 seconds
      }, 30000); // 30000 milliseconds = 30 seconds
  };

  const handleBackToHome = () => {
    setHasInsurance(null);
    setShowResults(false);
    setRecommendedProviders([]);
    setFormData({
      age: '',
      smoker: '',
      maritalStatus: '',
      dependents: '',
      zipCode: '',
      healthStatus: '',
      doctorVisits: '',
      medications: '',
      employmentStatus: '',
      annualIncome: '',
      coverageType: '',
      preferredPlan: '',
    });
    setExistingInsuranceData({
      currentProvider: '',
      currentPlan: '',
      lookingForNewPlan: false,
    });
  };

  return (
    <div className="container">
      <h1 className="main-heading">Hälsa.ai</h1>

      {!hasInsurance && hasInsurance !== null ? (
        <h2>You already have health insurance!</h2>
      ) : hasInsurance === null ? (
        <>
          <h2>Do you have health insurance?</h2>
          <label>
            <input
              type="radio"
              value="yes"
              name="hasInsurance"
              onChange={handleInsuranceChange}
            />{' '}
            Yes
          </label>
          <label>
            <input
              type="radio"
              value="no"
              name="hasInsurance"
              onChange={handleInsuranceChange}
            />{' '}
            No
          </label>
        </>
      ) : hasInsurance === 'yes' ? ( // New block for users with insurance
        <>
          <h2>Your Current Insurance</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Current Provider:
              <input
                type="text"
                name="currentProvider"
                value={existingInsuranceData.currentProvider}
                onChange={handleExistingInsuranceChange}
                required
              />
            </label>
            <label>
              Current Plan:
              <select
                name="currentPlan"
                value={existingInsuranceData.currentPlan}
                onChange={handleExistingInsuranceChange}
                required
                >
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                </select>
            </label>
            <label>
              Looking for a new plan?
              <input
                type="checkbox"
                name="lookingForNewPlan"
                checked={existingInsuranceData.lookingForNewPlan}
                onChange={handleExistingInsuranceChange}
              />
            </label>
            {existingInsuranceData.lookingForNewPlan && (
              <button type="submit" className="submit-button">Find New Insurance</button>
            )}
          </form>
          {!existingInsuranceData.lookingForNewPlan && <p>You can continue with your current plan.</p>}
        </>
      ) : !showResults && (
        <form onSubmit={handleSubmit} className="form">
          {/* Personal Information */}
          <div className="section">
            <h3>Personal Information</h3>
            <label>
              Age:
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Smoker:
              <select
                name="smoker"
                value={formData.smoker}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              Marital Status:
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </label>
            <label>
              Dependents:
              <input
                type="number"
                name="dependents"
                value={formData.dependents}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Health Information */}
          <div className="section">
            <h3>Health Information</h3>
            <label>
              Health Status:
              <select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
              </select>
            </label>
            <label>
              Doctor Visits per Year:
              <input
                type="number"
                name="doctorVisits"
                value={formData.doctorVisits}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Medications:
              <input
                type="text"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Employment and Income Information */}
          <div className="section">
            <h3>Employment and Income Information</h3>
            <label>
              Employment Status:
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
              </select>
            </label>
            <label>
              Annual Income:
              <select
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                required
               >
                <option value="">Select</option>
                <option value="0-50000">Less than 50k</option>
                <option value="50000-100000">50k-100k</option>
                <option value="50000-100000">100k-150k</option>
                <option value="50000-100000">150k-200k</option>
                <option value="100000-150000">Greater than 200k</option>
                </select>
            </label>
            <label>
              Coverage Type:
              <select
                name="coverageType"
                value={formData.coverageType}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="individual">Individual</option>
                <option value="family">Family</option>
              </select>
            </label>
            <label>
              Preferred Plan:
              <select
                name="preferredPlan"
                value={formData.preferredPlan}
                onChange={handleChange}
                required
                >
                <option value="">Select</option>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                </select>
            </label>
          </div>

          <button type="submit" className="submit-button">Get Recommendations</button>
        </form>
      )}

      {loading && <Spinner />} {/* Show spinner while loading */}
      
      {showResults && (
        <div>
          <h2>Recommended Healthcare Providers</h2>
          {recommendedProviders.map((provider, index) => (
            <div key={index} className="provider">
              <h3>{provider.name}</h3>
              <p><strong>Pros:</strong> {provider.pros.join(', ')}</p>
              <p><strong>Cons:</strong> {provider.cons.join(', ')}</p>
              <p><strong>Contact:</strong> {provider.contact}</p>
              <p><strong>Address:</strong> {provider.address}</p>
              <button onClick={() => handleEnquire(provider.name)} className="enquire-button">Enquire</button>
            </div>
          ))}
          <p className="enquire-message">{enquireMessage}</p>
          <button onClick={handleBackToHome} className="back-button">Back to Home</button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
