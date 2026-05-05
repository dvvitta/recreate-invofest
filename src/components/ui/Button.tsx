interface ButtonProps {
  label: string;
  variant?: "primary" | "outline";
  loading?: boolean;
  type?: "button" | "submit";
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  loading = false,
  type = "button",
}) => {
  const base =
    "inline-flex w-fit items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium transition duration-200 whitespace-nowrap";
  const style =
    variant === "primary"
      ? "bg-red-900 text-white hover:bg-red-800"
      : "border border-red-900 text-red-900 hover:bg-red-100";

  return (
    <button
      type={type}
      disabled={loading}
      className={`${base} ${style} ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Loading..." : label}
    </button>
  );
};

export default Button;
