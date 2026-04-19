function Input({
  label,
  id,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error = '',
  helpText = '',
  className = '',
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-3xl border px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:ring-offset-0 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-900/40' : 'border-slate-200'} `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-rose-600 dark:text-rose-300">
          {error}
        </p>
      ) : (
        helpText && <p className="text-sm text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  );
}

export default Input;
