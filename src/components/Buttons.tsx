import { TextMd } from "@/components/Text";
interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  type = "button",
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`w-40 h-10 px-4 py-3 bg-primary rounded-[10px] inline-flex justify-center items-center gap-2.5 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <TextMd className="text-white ">{children}</TextMd>
    </button>
  );
};
