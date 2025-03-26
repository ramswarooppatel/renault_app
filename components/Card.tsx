
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRef } from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  withHover?: boolean;
  withAnimation?: boolean;
  id?: string;
  variant?: "default" | "outlined" | "elevated" | "flat" | "gradient";
  glowEffect?: boolean;
  tiltEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  className,
  children,
  withHover = true,
  withAnimation = true,
  id,
  variant = "default",
  glowEffect = false,
  tiltEffect = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Tilt effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = () => {
    if (!tiltEffect || !cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };
  
  const variantClasses = {
    default: "bg-white border border-gray-100 shadow-sm",
    outlined: "bg-white border border-gray-200",
    elevated: "bg-white border border-gray-100 shadow-lg",
    flat: "bg-gray-50 border border-gray-100",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm",
  };
  
  const content = (
    <div
      id={id}
      ref={cardRef}
      className={cn(
        "rounded-xl overflow-hidden p-6 transition-all duration-300",
        variantClasses[variant],
        withHover && "hover:shadow-lg hover:border-gray-200",
        glowEffect && "hover:shadow-[0_0_15px_rgba(255,204,51,0.3)]",
        tiltEffect && "transition-transform duration-200",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {glowEffect && (
        <div className="absolute inset-0 -z-10 bg-renault-yellow/0 opacity-0 blur-xl rounded-xl transition-opacity duration-300 pointer-events-none group-hover:opacity-25"></div>
      )}
    </div>
  );

  if (withAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        whileHover={withHover ? { y: -5 } : undefined}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;
