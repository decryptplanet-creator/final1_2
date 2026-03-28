import { cn } from "./utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
/*Purpose: Yeh file loading state UI (skeleton placeholder) dikhane ke liye use hoti hai jab data load ho raha hota hai.

Type: Yeh web-based frontend (React) ke liye hai, mobile native app ke liye nahi.








 */