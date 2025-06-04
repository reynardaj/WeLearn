import { cn } from "@/lib/utils";
import { TextLg } from "./Text";
import { CheckIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface Step {
  id: number;
  title: string;
  status: "inactive" | "active" | "done";
  route?: string; // Optional route for done steps
}

interface ProgressIndicatorProps {
  steps: Step[];
  className?: string;
}

export default function ProgressIndicator({
  steps,
  className,
}: ProgressIndicatorProps) {
  const router = useRouter();

  const handleStepClick = (step: Step) => {
    if (step.status === "done" && step.route) {
      router.push(step.route);
    }
  };

  return (
    <div className={cn("hidden md:flex flex-col", className)}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex cursor-pointer"
          onClick={() => handleStepClick(step)}
        >
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-full border-2 text-lg font-medium",
                step.status === "active"
                  ? "bg-primary border-primary hover:opacity-90"
                  : "border-primary hover:opacity-90"
              )}
            >
              {step.status === "done" ? (
                <CheckIcon className="w-6 h-6 text-primary" />
              ) : (
                <TextLg
                  className={
                    step.status === "active" ? "text-white" : "text-primary"
                  }
                >
                  {step.id}
                </TextLg>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 h-20 bg-primary my-2"></div>
            )}
          </div>
          <div className="ml-4 mt-2">
            <TextLg>{step.title}</TextLg>
          </div>
        </div>
      ))}
    </div>
  );
}
