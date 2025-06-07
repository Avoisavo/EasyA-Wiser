import React, { useState } from "react";

const KYCForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    countryOfResidence: "",
    phoneNumber: "",
    email: "",
    occupation: "",
    identityDocType: "",
    identityDocument: null,
    addressDocument: null,
  });

  const [errors, setErrors] = useState({});

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Sweden",
    "Norway",
    "Japan",
    "South Korea",
    "Singapore",
    "India",
    "Brazil",
    "Mexico",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let processedValue = value;

    if (name === "cardNumber") {
      processedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      processedValue = formatExpiryDate(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.nationality)
      newErrors.nationality = "Nationality is required";
    if (!formData.countryOfResidence)
      newErrors.countryOfResidence = "Country of residence is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    if (!formData.occupation.trim())
      newErrors.occupation = "Occupation is required";
    if (!formData.identityDocType)
      newErrors.identityDocType = "Identity document type is required";
    if (!formData.identityDocument)
      newErrors.identityDocument = "Identity document is required";
    if (!formData.addressDocument)
      newErrors.addressDocument = "Address document is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("KYC Form Submitted:", formData);
      alert(
        "KYC form submitted successfully! Processing identity verification..."
      );
    } else {
      alert("Please fix the errors in the form before submitting.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            🔐 Know Your Customer (KYC) Verification
          </h1>
          <p className="text-lg opacity-90">
            Complete all sections to verify your identity and receive your DID
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              📋 1. Personal Information
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full legal name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {errors.fullName && (
                  <span className="text-red-600 text-sm mt-1 block">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.dateOfBirth && (
                    <span className="text-red-600 text-sm mt-1 block">
                      {errors.dateOfBirth}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="nationality"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nationality *
                  </label>
                  <select
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Select nationality</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.nationality && (
                    <span className="text-red-600 text-sm mt-1 block">
                      {errors.nationality}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="countryOfResidence"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Country of Residence *
                  </label>
                  <select
                    id="countryOfResidence"
                    name="countryOfResidence"
                    value={formData.countryOfResidence}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.countryOfResidence && (
                    <span className="text-red-600 text-sm mt-1 block">
                      {errors.countryOfResidence}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-600 text-sm mt-1 block">
                      {errors.phoneNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.email && (
                    <span className="text-red-600 text-sm mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Occupation *
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    required
                    placeholder="Your profession"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.occupation && (
                    <span className="text-red-600 text-sm mt-1 block">
                      {errors.occupation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Identity Verification Document */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              🪪 2. Identity Verification Document
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Document Type *
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="identityDocType"
                      value="passport"
                      checked={formData.identityDocType === "passport"}
                      onChange={handleInputChange}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    Passport
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="identityDocType"
                      value="national_id"
                      checked={formData.identityDocType === "national_id"}
                      onChange={handleInputChange}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    National ID Card
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="identityDocType"
                      value="drivers_license"
                      checked={formData.identityDocType === "drivers_license"}
                      onChange={handleInputChange}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    Driver's License
                  </label>
                </div>
                {errors.identityDocType && (
                  <span className="text-red-600 text-sm mt-1 block">
                    {errors.identityDocType}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="identityDocument"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Document *
                </label>
                <input
                  type="file"
                  id="identityDocument"
                  name="identityDocument"
                  onChange={handleInputChange}
                  accept="image/*,.pdf"
                  required
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                />
                <small className="text-gray-500 mt-1 block">
                  PDF or image files only (max 10MB)
                </small>
                {errors.identityDocument && (
                  <span className="text-red-600 text-sm mt-1 block">
                    {errors.identityDocument}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Address Verification Document */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              📄 3. Address Verification Document
            </h2>

            <div>
              <label
                htmlFor="addressDocument"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Address Proof *
              </label>
              <p className="text-gray-600 mb-3 italic">
                Choose one of: Utility bill, Bank statement, or
                Government-issued letter
              </p>
              <input
                type="file"
                id="addressDocument"
                name="addressDocument"
                onChange={handleInputChange}
                accept="image/*,.pdf"
                required
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              />
              <small className="text-gray-500 mt-1 block">
                Document must be dated within the last 3 months
              </small>
              {errors.addressDocument && (
                <span className="text-red-600 text-sm mt-1 block">
                  {errors.addressDocument}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCForm;
