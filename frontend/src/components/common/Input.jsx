import React from 'react';

/**
 * Composant Input réutilisable avec label et gestion d'erreurs
 * @param {Object} props - Les propriétés de l'input
 * @param {string} props.label - Le label de l'input
 * @param {string} props.error - Le message d'erreur
 * @param {string} props.type - Le type d'input
 * @param {string} props.placeholder - Le placeholder
 * @param {boolean} props.required - Si le champ est requis
 * @param {string} props.className - Classes CSS supplémentaires
 */
const Input = ({
  label,
  error,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg transition-colors duration-200
          ${error
            ? 'border-red-500 focus:border-red-600 focus:ring-red-200'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
          }
          focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default Input;
