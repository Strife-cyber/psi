import { Shield } from "lucide-react";

interface AppLogoIconProps {
    width?: number;
    height?: number;
}

export default function AppLogoIcon({ width = 16, height = 16 }: AppLogoIconProps) {
    return (
        <div className="relative inline-block group" style={{ width: `${width * 4}px`, height: `${height * 4}px` }}>
            <Shield className="h-full w-full text-center text-primary" />
        </div>
    );
}
