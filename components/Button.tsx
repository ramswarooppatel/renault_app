
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Link, LinkProps } from "react-router-dom";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-renault-yellow/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-renault-yellow text-renault-black hover:shadow-lg hover:bg-amber-400",
        secondary: "bg-renault-gray text-renault-black hover:bg-gray-200",
        outline: "border border-renault-yellow text-renault-black hover:bg-renault-yellow/10",
        ghost: "text-renault-black hover:bg-renault-gray",
        link: "text-renault-black underline-offset-4 hover:underline",
        black: "bg-renault-black text-white hover:bg-gray-800",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-sm",
        lg: "h-12 px-8 py-4 text-lg",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  withAnimation?: boolean;
  // Add support for React Router Link
  asChild?: boolean;
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    children,
    icon,
    iconPosition = "left",
    withAnimation = true,
    asChild = false,
    to,
    ...props 
  }, ref) => {
    // Determine if this should be rendered as a Link
    const isLink = !!to;
    
    const buttonClasses = cn(buttonVariants({ variant, size, className }));
    
    const content = isLink ? (
      <Link
        to={to as string}
        className={buttonClasses}
        {...(props as unknown as LinkProps)}
      >
        {icon && iconPosition === "left" && (
          <span className={cn("mr-2", size === "icon" ? "mr-0" : "")}>
            {icon}
          </span>
        )}
        {size !== "icon" && children}
        {icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </Link>
    ) : (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className={cn("mr-2", size === "icon" ? "mr-0" : "")}>
            {icon}
          </span>
        )}
        {size !== "icon" && children}
        {icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );

    if (withAnimation) {
      return (
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      );
    }

    return content;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
