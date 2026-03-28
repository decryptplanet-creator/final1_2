"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio@1.1.2";

function AspectRatio({
  ...props
}) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };

/*Purpose: Yeh component images/videos ka fixed aspect ratio maintain karne ke liye use hota hai taake UI responsive aur properly aligned rahe.
Type: Web-based React component hai (web apps ke liye). */