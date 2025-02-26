import React from 'react';
import Link from "next/link";
import { IconType } from "react-icons";

interface CalculatorCardProps {
    isOnLive?: boolean;
    targetPage?: string;
    icon: IconType;
    title: string;
    description: string;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ isOnLive = true, targetPage = "/", icon: Icon, title, description }) => {
    const cardContent = (
        <div className="p-8">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                {Icon && <Icon className="text-green-600" />}
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
                {title}
            </h3>
            <p className="text-green-600">
                {description}
            </p>
        </div>
    );

    if (!isOnLive) {
        return (
            <div className="relative bg-white rounded-xl shadow-md overflow-hidden opacity-75 cursor-pointer group">
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-9">
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Yakında
                    </span>
                </div>
                {cardContent}
            </div>
        );
    }

    return (
        <Link
            href={targetPage}
            className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            {cardContent}
        </Link>
    );
};

export default CalculatorCard;
