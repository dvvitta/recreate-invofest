interface InputTextProps {
  label: string;
  nama: string;
  register: any;
  error?: string;
  type?: string;
  placeholder?: string;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  nama,
  register,
  error,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        {...register(nama)}
        placeholder={placeholder || label}
        className={`p-2 rounded-xl outline-none transition-all
          ${
            error
              ? "border border-red-500 bg-red-50 focus:ring-2 focus:ring-red-400"
              : "border border-gray-300 focus:ring-2 focus:ring-red-200"
          }
        `}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default InputText;
