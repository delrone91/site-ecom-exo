import React from 'react';

/**
 * Composant Card réutilisable pour afficher du contenu dans une carte
 * @param {Object} props - Les propriétés de la carte
 * @param {React.ReactNode} props.children - Le contenu de la carte
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {boolean} props.hover - Activer l'effet hover
 * @param {Function} props.onClick - Fonction de clic
 */
const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer' : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
