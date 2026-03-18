/**
 * Password Strength Indicator Component
 * Real-time password validation and strength visualization for Trading Journal Pro+
 */

import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { validatePassword, getStrengthColor } from '../utils/passwordValidator';

const PasswordStrengthIndicator = ({ 
  password, 
  username = '', 
  email = '',
  showRequirements = true 
}) => {
  const [validation, setValidation] = useState({
    isValid: false,
    errors: [],
    strength: 'weak',
    score: 0
  });

  // Requirements to check
  const requirements = [
    {
      id: 'length',
      label: 'At least 12 characters',
      test: (pwd) => pwd.length >= 12
    },
    {
      id: 'uppercase',
      label: 'At least 1 uppercase letter (A-Z)',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      id: 'lowercase',
      label: 'At least 1 lowercase letter (a-z)',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      id: 'number',
      label: 'At least 1 number (0-9)',
      test: (pwd) => /[0-9]/.test(pwd)
    },
    {
      id: 'special',
      label: 'At least 1 special character (!@#$%^&*)',
      test: (pwd) => /[!@#$%^&*]/.test(pwd)
    }
  ];

  // Validate password whenever it, username, or email changes
  useEffect(() => {
    if (password) {
      const result = validatePassword(password, username, email);
      setValidation(result);
    } else {
      setValidation({
        isValid: false,
        errors: [],
        strength: 'weak',
        score: 0
      });
    }
  }, [password, username, email]);

  if (!password) {
    return null;
  }

  const strengthColor = getStrengthColor(validation.strength);

  return (
    <div className="space-y-4 mt-2">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Password Strength</label>
          <span className={`text-sm font-semibold ${strengthColor.color}`}>
            {strengthColor.label}
          </span>
        </div>
        
        {/* Strength Indicator Bars */}
        <div className="flex gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded transition-colors ${
                validation.score >= level * 2 - 1
                  ? strengthColor.borderColor === 'border-green-300'
                    ? 'bg-green-500'
                    : strengthColor.borderColor === 'border-yellow-300'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase">Requirements</p>
          <div className="space-y-2">
            {requirements.map((req) => {
              const isMet = req.test(password);
              return (
                <div
                  key={req.id}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isMet ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                    isMet ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isMet ? (
                      <Check size={12} className="text-green-600" />
                    ) : (
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <span>{req.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {validation.errors.length > 0 && (
        <div className={`p-3 rounded border ${strengthColor.bgColor} ${strengthColor.borderColor}`}>
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <div
                key={index}
                className={`text-sm flex items-start gap-2 ${strengthColor.color}`}
              >
                <X size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {validation.isValid && (
        <div className="p-3 rounded border bg-green-100 border-green-300">
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <Check size={16} />
            <span>Password meets all security requirements</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
