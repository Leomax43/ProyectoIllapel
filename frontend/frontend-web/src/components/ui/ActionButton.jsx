const VARIANTS = {
  primary: 'bg-[#2c5282] text-white hover:bg-[#1a365d] shadow',
  outline: 'border border-[#2c5282] text-[#2c5282] hover:bg-[#ebf8ff]',
  neutral: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
};

function ActionButton({ children, variant = 'neutral', className = '', ...props }) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.neutral;

  return (
    <button
      type="button"
      className={`px-3 py-1 text-xs rounded transition disabled:opacity-60 disabled:cursor-not-allowed ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default ActionButton;
