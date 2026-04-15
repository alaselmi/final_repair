function Spinner({ className = '' }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-full border-4 border-slate-200 border-t-sky-600 p-2 ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
