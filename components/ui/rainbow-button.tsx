import React from "react";
import { Text } from "react-native";
import { Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";

interface RainbowButtonProps extends React.ComponentProps<typeof Pressable> {
  children: React.ReactNode;
  className?: string;
}

export function RainbowButton({ children, className, ...props }: RainbowButtonProps) {
  return (
    <Pressable {...props} className={cn("rounded-xl overflow-hidden", className)}>
      <LinearGradient
        colors={["#ff0080", "#ff8c00", "#40e0d0", "#8a2be2", "#ff0080"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="p-4 rounded-xl"
      >
        <Text className="text-white font-bold text-center">{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}
