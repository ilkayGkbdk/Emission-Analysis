import { FaUser } from "react-icons/fa";
import { IoSchoolSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { GrCafeteria } from "react-icons/gr";
import CalculatorCard from "@/app/components/CalculatorCard";

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-800 mb-4">
                    CO2 Emisyon Hesaplayıcı
                </h1>
                <p className="text-xl text-green-600">
                    Karbon ayak izinizi hesaplayın ve çevreye olan etkinizi öğrenin
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Bireysel Hesaplayıcı Kartı */}
                <CalculatorCard
                    targetPage="/calculator/personal"
                    icon={FaUser}
                    title="Bireysel Hesaplayıcı"
                    description="Günlük aktivitelerinizden kaynaklanan karbon ayak izinizi hesaplayın."
                />

                {/* Okul Hesaplayıcı Kartı */}
                <CalculatorCard
                    targetPage="/calculator/school"
                    icon={IoSchoolSharp}
                    title="Okul Hesaplayıcı"
                    description="Okulunuzun karbon ayak izini hesaplayın ve sürdürülebilirlik hedeflerinizi belirleyin."
                />

                {/* Restorant-Kafe Hesaplayıcı Kartı */}
                <CalculatorCard
                    targetPage="/calculator/cafe"
                    icon={GrCafeteria}
                    title="Restorant-Kafe Hesaplayıcı"
                    description="Restoran veya kafenizin karbon ayak izini hesaplayın ve sürdürülebilirliğinizi artırın."
                />

                <CalculatorCard
                    isOnLive={false}
                    icon={FaBuilding}
                    title="Fabrika Hesaplayıcı"
                    description="Çok yakında detaylı bir fabrika analizi eklenecek..."
                />
            </div>
        </div>
    )
} 