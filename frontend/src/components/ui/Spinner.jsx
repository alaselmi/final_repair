function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-14 w-14 border-4'
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full border-solid border-slate-200 border-t-sky-600 ${sizes[size] || sizes.md} ${className} animate-spin`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
