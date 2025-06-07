import React, { useState } from "react";

const KYCForm = () => {
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Personal Information - aligned with backend
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    phoneNumber: "",
    email: "",
    gender: "",
    placeOfBirth: "",

    // Identity Document - aligned with backend
    identityDocType: "",
    identityDocument: null,
    documentNumber: "",
    issueDate: "",
    expiryDate: "",

    // Address Information - aligned with backend
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addressDocument: null,

    // Financial Information - aligned with backend
    incomeRange: "",
    employmentStatus: "",
    sourceOfFunds: "",
    employer: "",
    payslip: null,

    // Debit Card Information - aligned with backend
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    bankName: "",
    cardType: "debit",

    // Consents - aligned with backend
    dataProcessing: false,
    kycVerification: false,
    dataSharing: false,
    termsOfService: false,
    privacyPolicy: false,
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

  const incomeRanges = [
    "0-20000",
    "20000-50000",
    "50000-75000",
    "75000-100000",
    "100000-200000",
    "200000+",
  ];

  const employmentStatuses = [
    "employed",
    "self-employed",
    "student",
    "unemployed",
    "retired",
  ];

  const genderOptions = ["male", "female", "other", "prefer-not-to-say"];

  const sourceOfFundsOptions = [
    "salary",
    "business-income",
    "investments",
    "inheritance",
    "savings",
    "other",
  ];

  const cardTypes = ["debit", "credit"];

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    }

    return v;
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let processedValue = value;

    // Special formatting for specific fields
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Step validation functions
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
        if (!formData.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.nationality)
          newErrors.nationality = "Nationality is required";
        if (!formData.phoneNumber.trim())
          newErrors.phoneNumber = "Phone number is required";
        if (!formData.email.trim())
          newErrors.email = "Email address is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.placeOfBirth.trim())
          newErrors.placeOfBirth = "Place of birth is required";
        break;

      case 2: // Identity Documents
        if (!formData.identityDocType)
          newErrors.identityDocType = "Identity document type is required";
        if (!formData.identityDocument)
          newErrors.identityDocument = "Identity document file is required";
        if (!formData.documentNumber.trim())
          newErrors.documentNumber = "Document number is required";
        break;

      case 3: // Address Verification
        if (!formData.street.trim())
          newErrors.street = "Street address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim())
          newErrors.state = "State/Province is required";
        if (!formData.postalCode.trim())
          newErrors.postalCode = "Postal code is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.addressDocument)
          newErrors.addressDocument = "Address proof document is required";
        break;

      case 4: // Financial Information
        if (!formData.incomeRange)
          newErrors.incomeRange = "Income range is required";
        if (!formData.employmentStatus)
          newErrors.employmentStatus = "Employment status is required";
        if (!formData.sourceOfFunds)
          newErrors.sourceOfFunds = "Source of funds is required";
        break;

      case 5: // Debit Card
        if (!formData.cardholderName.trim())
          newErrors.cardholderName = "Cardholder name is required";
        if (!formData.cardNumber.replace(/\s/g, ""))
          newErrors.cardNumber = "Card number is required";
        if (!formData.bankName.trim())
          newErrors.bankName = "Bank name is required";
        if (!formData.cardType) newErrors.cardType = "Card type is required";
        break;

      case 6: // Consents
        if (!formData.dataProcessing)
          newErrors.dataProcessing = "Data processing consent is required";
        if (!formData.kycVerification)
          newErrors.kycVerification = "KYC verification consent is required";
        if (!formData.dataSharing)
          newErrors.dataSharing = "Data sharing consent is required";
        if (!formData.termsOfService)
          newErrors.termsOfService = "Terms of service acceptance is required";
        if (!formData.privacyPolicy)
          newErrors.privacyPolicy = "Privacy policy acceptance is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Backend integration function
  const submitKYCData = async (kycData) => {
    // For now, simulate the backend call - replace with actual implementation
    console.log("Submitting KYC Data:", kycData);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate successful response
    return {
      did: "did:xrpl:rAbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
      address: "rAbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
      verifiableCredentials: ["identity", "address", "financial", "payment"],
      publishResult: {
        transactionHash: "ABC123DEF456",
        explorerUrl: "https://testnet.xrpl.org/transactions/ABC123DEF456",
      },
      kycTimestamp: new Date().toISOString(),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform frontend data to backend format
      const kycData = transformToBackendFormat(formData);

      console.log("KYC Form Submitted:", kycData);

      // Submit to backend and create DID
      const result = await submitKYCData(kycData);

      setSubmitResult(result);
      setCurrentStep(totalSteps + 1); // Show success step
    } catch (error) {
      console.error("KYC submission error:", error);
      alert(`KYC submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform frontend form data to backend-expected format
  const transformToBackendFormat = (formData) => {
    return {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        gender: formData.gender,
        placeOfBirth: formData.placeOfBirth,
      },
      identityDocuments: [
        {
          type:
            formData.identityDocType === "national_id"
              ? "government_id"
              : formData.identityDocType,
          documentNumber: formData.documentNumber,
          issueDate: formData.issueDate,
          expiryDate: formData.expiryDate,
          file: formData.identityDocument,
        },
      ],
      addressData: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      addressProofDocument: {
        type: "utility_bill",
        issueDate: new Date().toISOString().split("T")[0],
        file: formData.addressDocument,
      },
      financialInfo: {
        incomeRange: formData.incomeRange,
        employmentStatus: formData.employmentStatus,
        sourceOfFunds: formData.sourceOfFunds,
        employer: formData.employer,
      },
      cardData: {
        cardNumber: formData.cardNumber.replace(/\s/g, ""),
        bankName: formData.bankName,
        cardType: formData.cardType,
      },
      consents: {
        dataProcessing: formData.dataProcessing,
        kycVerification: formData.kycVerification,
        dataSharing: formData.dataSharing,
        termsOfService: formData.termsOfService,
        privacyPolicy: formData.privacyPolicy,
        ipAddress: "unknown",
      },
    };
  };

  // Progress steps configuration
  const steps = [
    { number: 1, title: "Personal Information", icon: "👤" },
    { number: 2, title: "Identity Documents", icon: "🆔" },
    { number: 3, title: "Address Verification", icon: "🏠" },
    { number: 4, title: "Financial Information", icon: "💰" },
    { number: 5, title: "Payment Method", icon: "💳" },
    { number: 6, title: "Consents", icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            🔐 Know Your Customer (KYC) Verification
          </h1>
          <p className="text-lg opacity-90">
            Complete all sections to verify your identity and receive your DID
          </p>
        </div>

        {/* Success Page */}
        {currentStep === totalSteps + 1 && submitResult && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                KYC Verification Complete!
              </h2>
              <p className="text-gray-600">
                Your identity has been verified and your DID has been created
                successfully.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Your Digital Identity
              </h3>
              <div className="text-sm text-left space-y-2">
                <p>
                  <strong>DID:</strong> {submitResult.did}
                </p>
                <p>
                  <strong>Address:</strong> {submitResult.address}
                </p>
                <p>
                  <strong>Transaction:</strong>
                  <a
                    href={submitResult.publishResult.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline ml-1"
                  >
                    {submitResult.publishResult.transactionHash}
                  </a>
                </p>
                <p>
                  <strong>Credentials:</strong>{" "}
                  {submitResult.verifiableCredentials.length} types issued
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        {currentStep <= totalSteps && (
          <>
            {/* Progress Indicator */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
                        currentStep >= step.number
                          ? "bg-indigo-600 text-white"
                          : currentStep === step.number
                          ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.number
                            ? "text-indigo-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-4 ${
                          currentStep > step.number
                            ? "bg-indigo-600"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Step {currentStep} of {totalSteps}:{" "}
                  {steps[currentStep - 1]?.title}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <form onSubmit={handleSubmit}>
                <div className="p-8">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        👤 Personal Information
                      </h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              First Name *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.firstName && (
                              <span className="text-red-600 text-sm">
                                {errors.firstName}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Last Name *
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.lastName && (
                              <span className="text-red-600 text-sm">
                                {errors.lastName}
                              </span>
                            )}
                          </div>
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.dateOfBirth && (
                              <span className="text-red-600 text-sm">
                                {errors.dateOfBirth}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="gender"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Gender *
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select gender</option>
                              {genderOptions.map((gender) => (
                                <option key={gender} value={gender}>
                                  {gender}
                                </option>
                              ))}
                            </select>
                            {errors.gender && (
                              <span className="text-red-600 text-sm">
                                {errors.gender}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select nationality</option>
                              {countries.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                            {errors.nationality && (
                              <span className="text-red-600 text-sm">
                                {errors.nationality}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="placeOfBirth"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Place of Birth *
                            </label>
                            <input
                              type="text"
                              id="placeOfBirth"
                              name="placeOfBirth"
                              value={formData.placeOfBirth}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.placeOfBirth && (
                              <span className="text-red-600 text-sm">
                                {errors.placeOfBirth}
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.email && (
                              <span className="text-red-600 text-sm">
                                {errors.email}
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.phoneNumber && (
                              <span className="text-red-600 text-sm">
                                {errors.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Identity Documents */}
                  {currentStep === 2 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        🆔 Identity Documents
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Document Type *
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              { value: "passport", label: "Passport" },
                              { value: "national_id", label: "National ID" },
                              {
                                value: "drivers_license",
                                label: "Driver's License",
                              },
                            ].map((doc) => (
                              <label
                                key={doc.value}
                                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                              >
                                <input
                                  type="radio"
                                  name="identityDocType"
                                  value={doc.value}
                                  checked={
                                    formData.identityDocType === doc.value
                                  }
                                  onChange={handleInputChange}
                                  className="mr-3"
                                />
                                {doc.label}
                              </label>
                            ))}
                          </div>
                          {errors.identityDocType && (
                            <span className="text-red-600 text-sm">
                              {errors.identityDocType}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="documentNumber"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Document Number *
                            </label>
                            <input
                              type="text"
                              id="documentNumber"
                              name="documentNumber"
                              value={formData.documentNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.documentNumber && (
                              <span className="text-red-600 text-sm">
                                {errors.documentNumber}
                              </span>
                            )}
                          </div>
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
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer"
                          />
                          {errors.identityDocument && (
                            <span className="text-red-600 text-sm">
                              {errors.identityDocument}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 3: Address Verification */}
                  {currentStep === 3 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        🏠 Address Verification
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Street Address *
                          </label>
                          <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            placeholder="123 Main Street"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {errors.street && (
                            <span className="text-red-600 text-sm">
                              {errors.street}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              City *
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="New York"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.city && (
                              <span className="text-red-600 text-sm">
                                {errors.city}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="state"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              State/Province *
                            </label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="NY"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.state && (
                              <span className="text-red-600 text-sm">
                                {errors.state}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="postalCode"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              placeholder="10001"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.postalCode && (
                              <span className="text-red-600 text-sm">
                                {errors.postalCode}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="country"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Country *
                            </label>
                            <select
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select country</option>
                              {countries.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                            {errors.country && (
                              <span className="text-red-600 text-sm">
                                {errors.country}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="addressDocument"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Upload Address Proof *
                          </label>
                          <p className="text-gray-600 mb-3 text-sm">
                            Upload a utility bill, bank statement, or government
                            letter (dated within last 3 months)
                          </p>
                          <input
                            type="file"
                            id="addressDocument"
                            name="addressDocument"
                            onChange={handleInputChange}
                            accept="image/*,.pdf"
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer"
                          />
                          {errors.addressDocument && (
                            <span className="text-red-600 text-sm">
                              {errors.addressDocument}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 4: Financial Information */}
                  {currentStep === 4 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        💰 Financial Information
                      </h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="incomeRange"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Annual Income Range *
                            </label>
                            <select
                              id="incomeRange"
                              name="incomeRange"
                              value={formData.incomeRange}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select income range</option>
                              {incomeRanges.map((range) => (
                                <option key={range} value={range}>
                                  $
                                  {range.replace("-", " - $").replace("+", "+")}
                                </option>
                              ))}
                            </select>
                            {errors.incomeRange && (
                              <span className="text-red-600 text-sm">
                                {errors.incomeRange}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="employmentStatus"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Employment Status *
                            </label>
                            <select
                              id="employmentStatus"
                              name="employmentStatus"
                              value={formData.employmentStatus}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select status</option>
                              {employmentStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1).replace("-", " ")}
                                </option>
                              ))}
                            </select>
                            {errors.employmentStatus && (
                              <span className="text-red-600 text-sm">
                                {errors.employmentStatus}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="sourceOfFunds"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Source of Funds *
                            </label>
                            <select
                              id="sourceOfFunds"
                              name="sourceOfFunds"
                              value={formData.sourceOfFunds}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select source</option>
                              {sourceOfFundsOptions.map((source) => (
                                <option key={source} value={source}>
                                  {source.charAt(0).toUpperCase() +
                                    source.slice(1).replace("-", " ")}
                                </option>
                              ))}
                            </select>
                            {errors.sourceOfFunds && (
                              <span className="text-red-600 text-sm">
                                {errors.sourceOfFunds}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="employer"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Employer (Optional)
                            </label>
                            <input
                              type="text"
                              id="employer"
                              name="employer"
                              value={formData.employer}
                              onChange={handleInputChange}
                              placeholder="Company name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="payslip"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Payslip Upload (Optional)
                          </label>
                          <p className="text-gray-600 mb-3 text-sm">
                            Upload your most recent payslip for verification
                          </p>
                          <input
                            type="file"
                            id="payslip"
                            name="payslip"
                            onChange={handleInputChange}
                            accept="image/*,.pdf"
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 5: Payment Method */}
                  {currentStep === 5 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        💳 Payment Method
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="cardholderName"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            id="cardholderName"
                            name="cardholderName"
                            value={formData.cardholderName}
                            onChange={handleInputChange}
                            placeholder="Name as it appears on card"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {errors.cardholderName && (
                            <span className="text-red-600 text-sm">
                              {errors.cardholderName}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="cardNumber"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Card Number *
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.cardNumber && (
                              <span className="text-red-600 text-sm">
                                {errors.cardNumber}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="bankName"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Bank Name *
                            </label>
                            <input
                              type="text"
                              id="bankName"
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleInputChange}
                              placeholder="Chase, Bank of America, etc."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.bankName && (
                              <span className="text-red-600 text-sm">
                                {errors.bankName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label
                              htmlFor="cardType"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Card Type *
                            </label>
                            <select
                              id="cardType"
                              name="cardType"
                              value={formData.cardType}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              {cardTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                              ))}
                            </select>
                            {errors.cardType && (
                              <span className="text-red-600 text-sm">
                                {errors.cardType}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="expiryDate"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              maxLength="5"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.expiryDate && (
                              <span className="text-red-600 text-sm">
                                {errors.expiryDate}
                              </span>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="cvv"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              CVV *
                            </label>
                            <input
                              type="password"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength="4"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.cvv && (
                              <span className="text-red-600 text-sm">
                                {errors.cvv}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 6: Consents */}
                  {currentStep === 6 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        ✅ Consents & Declarations
                      </h2>
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <p className="text-blue-800 text-sm">
                            Please review and accept all consents below to
                            complete your KYC verification and create your DID.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <label className="flex items-start cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              name="dataProcessing"
                              checked={formData.dataProcessing}
                              onChange={handleInputChange}
                              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <span className="font-medium text-gray-800">
                                Data Processing Consent *
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                I consent to the processing of my personal data
                                for KYC verification purposes.
                              </p>
                            </div>
                          </label>
                          {errors.dataProcessing && (
                            <span className="text-red-600 text-sm ml-6">
                              {errors.dataProcessing}
                            </span>
                          )}

                          <label className="flex items-start cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              name="kycVerification"
                              checked={formData.kycVerification}
                              onChange={handleInputChange}
                              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <span className="font-medium text-gray-800">
                                KYC Verification Consent *
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                I agree to undergo identity verification and
                                authorize third-party verification services.
                              </p>
                            </div>
                          </label>
                          {errors.kycVerification && (
                            <span className="text-red-600 text-sm ml-6">
                              {errors.kycVerification}
                            </span>
                          )}

                          <label className="flex items-start cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              name="dataSharing"
                              checked={formData.dataSharing}
                              onChange={handleInputChange}
                              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <span className="font-medium text-gray-800">
                                Data Sharing Consent *
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                I consent to share my verified information with
                                authorized financial institutions and exchanges.
                              </p>
                            </div>
                          </label>
                          {errors.dataSharing && (
                            <span className="text-red-600 text-sm ml-6">
                              {errors.dataSharing}
                            </span>
                          )}

                          <label className="flex items-start cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              name="termsOfService"
                              checked={formData.termsOfService}
                              onChange={handleInputChange}
                              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <span className="font-medium text-gray-800">
                                Terms of Service *
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                I have read and agree to the{" "}
                                <a
                                  href="#"
                                  className="text-indigo-600 hover:underline"
                                >
                                  Terms of Service
                                </a>
                                .
                              </p>
                            </div>
                          </label>
                          {errors.termsOfService && (
                            <span className="text-red-600 text-sm ml-6">
                              {errors.termsOfService}
                            </span>
                          )}

                          <label className="flex items-start cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              name="privacyPolicy"
                              checked={formData.privacyPolicy}
                              onChange={handleInputChange}
                              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <span className="font-medium text-gray-800">
                                Privacy Policy *
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                I have read and agree to the{" "}
                                <a
                                  href="#"
                                  className="text-indigo-600 hover:underline"
                                >
                                  Privacy Policy
                                </a>
                                .
                              </p>
                            </div>
                          </label>
                          {errors.privacyPolicy && (
                            <span className="text-red-600 text-sm ml-6">
                              {errors.privacyPolicy}
                            </span>
                          )}
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                          <p className="text-green-800 text-sm">
                            🎉 Once you submit, your KYC verification will be
                            processed and your unique DID (Decentralized
                            Identity) will be created and published to the XRPL
                            network.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="px-8 py-6 bg-gray-50 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      currentStep === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        isSubmitting
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isSubmitting ? "Submitting..." : "Submit KYC"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KYCForm;
