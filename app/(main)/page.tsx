'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { COEFFICIENTS } from '@/constants/coefficients';
import { useUser, SignInButton } from '@clerk/nextjs';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TooltipProps } from 'recharts';
import { useMemo } from 'react'; // useMemo'yu ekliyoruz

// chartData için tip tanımı
interface ChartData {
    name: string;
    value: number;
}

export default function Home() {
    // Bireysel hesaplama state'leri
    const [step, setStep] = useState<'electricity' | 'heating' | 'fuel' | 'results'>('electricity');
    const [monthlyElectricity, setMonthlyElectricity] = useState('');
    const [heatingType, setHeatingType] = useState<'naturalGas' | 'coal' | 'wood' | 'lpg' | null>(null);
    const [heatingConsumption, setHeatingConsumption] = useState('');
    const [vehicleCount, setVehicleCount] = useState('');
    const [vehicles, setVehicles] = useState<
        Array<{ fuelType: 'gasoline' | 'diesel' | 'electric' | null; consumption: string }>
    >([]);
    const [results, setResults] = useState<{
        electricityCO2: number | null;
        heatingCO2: number | null;
        totalFuelCO2: number | null;
        totalCO2: number | null;
    }>({
        electricityCO2: null,
        heatingCO2: null,
        totalFuelCO2: null,
        totalCO2: null,
    });
    const [isFlipped, setIsFlipped] = useState(false);

    // Clerk ile kullanıcı durumu
    const { isSignedIn } = useUser();

    // Animasyon varyantları
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95 },
    };

    const flipVariants = {
        front: { rotateY: 0, opacity: 1, transition: { duration: 0.6 } },
        back: { rotateY: 180, opacity: 1, transition: { duration: 0.6 } },
    };

    const chartData: ChartData[] = [
        { name: 'Elektrik', value: results.electricityCO2 ? results.electricityCO2 * 12 : 0 },
        { name: 'Isınma', value: results.heatingCO2 || 0 },
        { name: 'Araçlar', value: results.totalFuelCO2 || 0 },
    ].filter((item) => item.value > 0);

    // Renk paleti
    const COLORS = ['#34d399', '#10b981', '#059669'];

    // Özel tooltip
    type CustomTooltipProps = TooltipProps<number, string>;

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        const total = useMemo(() => chartData.reduce((sum, entry) => sum + entry.value, 0), [chartData]);

        if (active && payload && payload.length > 0 && payload[0]?.value !== undefined) {
            const percentage = ((payload[0].value / total) * 100).toFixed(1);
            return (
                <div className="bg-white p-2 rounded-lg shadow-md border border-green-200">
                    <p className="text-green-800 font-semibold">{payload[0].name}</p>
                    <p className="text-gray-600">{`${Number(payload[0].value).toFixed(2)} kg CO2/yıl`}</p>
                    <p className="text-green-600 text-sm">{`%${percentage}`}</p>
                </div>
            );
        }
        return null;
    };

    // Hesaplama formu doğrulama
    const isStepValid = () => {
        if (step === 'electricity') return monthlyElectricity !== '';
        if (step === 'heating') return heatingType && heatingConsumption !== '';
        if (step === 'fuel') {
            if (vehicleCount === '' || parseInt(vehicleCount) === 0) return true;
            return vehicles.every((v) => v.fuelType && v.consumption !== '');
        }
        return true;
    };

    // Araç sayısı değişimi
    const handleVehicleCountChange = (count: string) => {
        setVehicleCount(count);
        const vehicleNum = parseInt(count);
        if (vehicleNum > 0) {
            setVehicles(
                Array.from({ length: vehicleNum }, () => ({
                    fuelType: null,
                    consumption: '',
                }))
            );
        } else {
            setVehicles([]);
        }
    };

    // Araç bilgisi güncelleme
    const updateVehicle = (index: number, field: 'fuelType' | 'consumption', value: string) => {
        setVehicles(
            vehicles.map((vehicle, i) =>
                i === index ? { ...vehicle, [field]: value } : vehicle
            )
        );
    };

    // Sonraki adıma geçiş
    const handleNextStep = () => {
        if (!isStepValid()) return;

        switch (step) {
            case 'electricity':
                const electricityCO2 = parseFloat(monthlyElectricity) * COEFFICIENTS.electricity;
                setResults((prev) => ({ ...prev, electricityCO2 }));
                setStep('heating');
                break;
            case 'heating':
                let heatingCO2 = 0;
                if (heatingType && heatingConsumption) {
                    switch (heatingType) {
                        case 'naturalGas':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.naturalGas;
                            break;
                        case 'coal':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.coal;
                            break;
                        case 'wood':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.wood;
                            break;
                        case 'lpg':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.lpg;
                            break;
                    }
                }
                setResults((prev) => ({ ...prev, heatingCO2 }));
                setStep('fuel');
                break;
            case 'fuel':
                if (!isSignedIn) {
                    return;
                }
                let totalFuelCO2 = 0;
                vehicles.forEach((vehicle) => {
                    if (vehicle.fuelType && vehicle.consumption) {
                        switch (vehicle.fuelType) {
                            case 'gasoline':
                                totalFuelCO2 += parseFloat(vehicle.consumption) * COEFFICIENTS.gasoline;
                                break;
                            case 'diesel':
                                totalFuelCO2 += parseFloat(vehicle.consumption) * COEFFICIENTS.diesel;
                                break;
                            case 'electric':
                                totalFuelCO2 += parseFloat(vehicle.consumption) * COEFFICIENTS.electricVehicle;
                                break;
                        }
                    }
                });
                const totalCO2 = (results.electricityCO2 || 0) * 12 + (results.heatingCO2 || 0) + totalFuelCO2;
                setResults((prev) => ({ ...prev, totalFuelCO2, totalCO2 }));
                setIsFlipped(true);
                setStep('results');
                break;
        }
    };

    // Form sıfırlama
    const handleReset = () => {
        setStep('electricity');
        setMonthlyElectricity('');
        setHeatingType(null);
        setHeatingConsumption('');
        setVehicleCount('');
        setVehicles([]);
        setResults({
            electricityCO2: null,
            heatingCO2: null,
            totalFuelCO2: null,
            totalCO2: null,
        });
        setIsFlipped(false);
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Bölümü */}
            <section
                className="pt-24 pb-20 text-white text-center relative z-10"
                style={{
                    backgroundImage: `url('/hero.png')`, // 1
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-green-900 opacity-50" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold tracking-tight mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Gezegenin Geleceğini Şekillendirin
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Karbon ayak izinizi analiz ederek sürdürülebilir bir dünya için ilk adımı atın.
                    </motion.p>
                </div>
            </section>

            {/* Endüstriyel Sürdürülebilirlik Bölümü */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Endüstriyel Sürdürülebilirlik
                    </motion.h2>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Image
                                src="/factory-workers.png" // 2
                                alt="Sürdürülebilir Endüstri"
                                width={500}
                                height={300}
                                className="rounded-xl shadow-lg"
                            />
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                Fabrikalarınızda Çevresel Etkiyi Azaltın
                            </h3>
                            <p className="text-gray-600">
                                İşçilerimiz ve yenilikçi teknolojilerimizle, fabrikalarınızın karbon emisyonlarını azaltarak sürdürülebilir bir üretim sürecine geçiş yapabilirsiniz.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Bireysel Hesaplama Aracı */}
            <section
                className="py-20 relative"
                style={{
                    backgroundImage: `url('/nature-bg.jpeg')`, // 3
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white opacity-90" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        10 Dakikada Karbon Ayak İzinizi Hesaplayın
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Günlük alışkanlıklarınızın çevresel etkisini hızlıca öğrenin. Basit adımlarla başlayın, büyük değişimler yaratın!
                    </motion.p>
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto perspective-1000"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                variants={flipVariants}
                                initial="front"
                                animate={step === 'results' && isFlipped ? 'back' : 'front'}
                                className="relative"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {step === 'electricity' && (
                                    <div>
                                        <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                            Elektrik Tüketimi
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Aylık elektrik tüketiminizi kWh cinsinden girin (faturanızdan kontrol edebilirsiniz).
                                        </p>
                                        <input
                                            type="number"
                                            value={monthlyElectricity}
                                            onChange={(e) => setMonthlyElectricity(e.target.value)}
                                            placeholder="Ör: 300 kWh"
                                            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                        />
                                    </div>
                                )}
                                {step === 'heating' && (
                                    <div>
                                        <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                            Isınma Türü ve Tüketimi
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Evde kullandığınız ısınma türünü seçin ve yıllık tüketiminizi girin.
                                        </p>
                                        <select
                                            value={heatingType || ''}
                                            onChange={(e) =>
                                                setHeatingType(e.target.value as typeof heatingType)
                                            }
                                            className="w-full p-3 border border-green-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        >
                                            <option value="" disabled>
                                                Isınma türünü seçin
                                            </option>
                                            <option value="naturalGas">Doğal Gaz</option>
                                            <option value="coal">Kömür</option>
                                            <option value="wood">Odun</option>
                                            <option value="lpg">LPG</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={heatingConsumption}
                                            onChange={(e) => setHeatingConsumption(e.target.value)}
                                            placeholder="Ör: 500 m³"
                                            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                        />
                                    </div>
                                )}
                                {step === 'fuel' && (
                                    <div>
                                        <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                            Araç ve Yakıt Tüketimi
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Kullandığınız araç sayısını girin (yoksa 0 seçin) ve yakıt tüketimlerini belirtin.
                                        </p>
                                        <input
                                            type="number"
                                            value={vehicleCount}
                                            onChange={(e) => handleVehicleCountChange(e.target.value)}
                                            placeholder="Araç sayısı"
                                            min="0"
                                            className="w-full p-3 border border-green-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        />
                                        {vehicles.map((vehicle, index) => (
                                            <div key={index} className="mt-4">
                                                <p className="text-gray-600 mb-2">Araç {index + 1}</p>
                                                <select
                                                    value={vehicle.fuelType || ''}
                                                    onChange={(e) =>
                                                        updateVehicle(index, 'fuelType', e.target.value)
                                                    }
                                                    className="w-full p-3 border border-green-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                >
                                                    <option value="" disabled>
                                                        Yakıt türünü seçin
                                                    </option>
                                                    <option value="gasoline">Benzin</option>
                                                    <option value="diesel">Dizel</option>
                                                    <option value="electric">Elektrik</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    value={vehicle.consumption}
                                                    onChange={(e) =>
                                                        updateVehicle(index, 'consumption', e.target.value)
                                                    }
                                                    placeholder="Yıllık tüketim (litre/kWh)"
                                                    className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {step === 'results' && isSignedIn && (
                                    <div style={{ transform: 'rotateY(180deg)' }} className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                                Karbon Ayak İziniz
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                İşte günlük alışkanlıklarınızın çevresel etkisi:
                                            </p>
                                            <ul className="text-gray-600 mb-6">
                                                {results.electricityCO2 && (
                                                    <li>
                                                        Elektrik: {(results.electricityCO2 * 12).toFixed(2)} kg CO2/yıl
                                                    </li>
                                                )}
                                                {results.heatingCO2 && (
                                                    <li>Isınma: {results.heatingCO2.toFixed(2)} kg CO2/yıl</li>
                                                )}
                                                {results.totalFuelCO2 !== null && (
                                                    <li>Araçlar: {results.totalFuelCO2.toFixed(2)} kg CO2/yıl</li>
                                                )}
                                                {results.totalCO2 && (
                                                    <li className="font-semibold mt-2">
                                                        Toplam: {results.totalCO2.toFixed(2)} kg CO2/yıl
                                                    </li>
                                                )}
                                            </ul>
                                            <p className="text-green-600 italic">
                                                Daha ayrıntılı analiz ve öneriler için tam hesaplama araçlarımıza geçin!
                                            </p>
                                        </div>
                                        <div className="flex-1 flex justify-center items-center">
                                            <ResponsiveContainer width={200} height={200}>
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        dataKey="value"
                                                        labelLine={false}
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        {step === 'fuel' && !isSignedIn && (
                            <div className="mt-6 text-center">
                                <p className="text-red-600 mb-4">
                                    Sonuçları görmek için lütfen giriş yapın.
                                </p>
                                <SignInButton mode="modal">
                                    <button className="py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                                        Giriş Yap
                                    </button>
                                </SignInButton>
                            </div>
                        )}
                        <div className="mt-6 flex gap-4">
                            {(step === 'electricity' || step === 'heating' || (step === 'fuel' && isSignedIn)) && (
                                <motion.button
                                    onClick={handleNextStep}
                                    disabled={!isStepValid()}
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className={`flex-1 h-12 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                                        isStepValid()
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-green-300 cursor-not-allowed'
                                    }`}
                                >
                                    {step === 'electricity'
                                        ? 'İleri: Isınma'
                                        : step === 'heating'
                                            ? 'İleri: Yakıt'
                                            : 'Sonuçları Gör'}
                                </motion.button>
                            )}
                            {step === 'results' && isSignedIn && (
                                <div className="flex gap-4 w-full">
                                    <motion.button
                                        onClick={handleReset}
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="flex-1 h-12 py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Yeniden Başla
                                    </motion.button>
                                    <motion.div
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="flex-1"
                                    >
                                        <Link
                                            href="/calculator"
                                            className="flex-1 h-12 py-3 px-4 rounded-lg bg-white text-green-600 font-medium border border-green-600 hover:bg-gray-100 transition-colors text-center flex items-center justify-center"
                                        >
                                            Tam Analize Geç
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tanıtım Bölümü */}
            <section
                className="py-20 relative"
                style={{
                    backgroundImage: `url('/intro-bg.jpeg')`, // 6
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        CO2 Hesaplama Platformu Nedir?
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        “Bir Adım, Bin Çözüm.” CO2 Hesaplama Platformu, karbon ayak izinizi ölçerek çevresel farkındalığınızı artıran ve sürdürülebilir bir geleceğe katkıda bulunan yenilikçi bir araçtır.
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                Neden Önemli?
                            </h3>
                            <p className="text-gray-600">
                                İklim değişikliği, gezegenimizin karşı karşıya olduğu en büyük tehditlerden biri. Karbon ayak izinizi bilmek, çevresel etkilerinizi azaltmanın ilk adımıdır.
                                Platformumuz, bu süreci basit, hızlı ve etkili hale getiriyor.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                Kimler İçin?
                            </h3>
                            <p className="text-gray-600">
                                Bireyler, öğrenciler, işletmeler, fabrikalar... Herkes için özelleştirilmiş analiz araçlarımızla sürdürülebilirlik hedeflerinize ulaşın.
                                Çevreyi korumak hepimizin sorumluluğu!
                            </p>
                        </motion.div>
                    </div>
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Image
                            src="/intro-image.jpg"
                            alt="Platform tanıtım görseli"
                            width={800}
                            height={400}
                            className="max-w-2xl mx-auto rounded-lg shadow-lg"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Özellikler Bölümü */}
            <section
                className="py-20 relative bg-green-50"
                style={{
                    backgroundImage: `url('/features-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-green-50 opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Sürdürülebilirlik Parmaklarınızın Ucunda
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Bilimsel Analizler',
                                description: 'Sektörünüze özel, yüksek doğruluklu karbon ayak izi hesaplamaları ile güvenilir sonuçlar.',
                                image: '/feature-analysis.jpg',
                            },
                            {
                                title: 'Çevre Dostu Çözümler',
                                description: 'Emisyonlarınızı azaltmak için rehber raporlar ve uygulanabilir öneriler sunuyoruz.',
                                image: '/feature-sustainability.jpg',
                            },
                            {
                                title: 'Kullanıcı Dostu Arayüz',
                                description: 'Sezgisel tasarımımızla analizlerinizi hızlı ve kolay bir şekilde tamamlayın.',
                                image: '/feature-usability.jpg',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.2 }}
                                className="hover:scale-105 transition-transform duration-300"
                            >
                                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        width={96}
                                        height={96}
                                        className="h-24 w-24 mx-auto mb-4 rounded-full object-cover"
                                    />
                                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nasıl Çalışır? Bölümü */}
            <section
                className="py-20 relative"
                style={{
                    backgroundImage: `url('/process-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Analiz Sürecimiz
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        “Basit, Hızlı, Etkili.” Karbon ayak izinizi hesaplamak için sadece birkaç adım gerekiyor.
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1. Verilerinizi Girin',
                                description: 'Elektrik, ısınma ve yakıt tüketim bilgilerinizi paylaşın.',
                                image: '/step-input.jpg',
                            },
                            {
                                step: '2. Analizi Görün',
                                description: 'Bilimsel hesaplamalarla emisyonlarınızı anında öğrenin.',
                                image: '/step-analysis.jpg',
                            },
                            {
                                step: '3. Çözüm Uygulayın',
                                description: 'Önerilerimizle çevresel etkinizi azaltın.',
                                image: '/step-solutions.jpg',
                            },
                        ].map((step, index) => (
                            <motion.div
                                key={step.step}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.2 }}
                                className="hover:scale-105 transition-transform duration-300"
                            >
                                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <Image
                                        src={step.image}
                                        alt={step.step}
                                        width={96}
                                        height={96}
                                        className="h-24 w-24 mx-auto mb-4 rounded-full object-cover"
                                    />
                                    <h3 className="text-xl font-semibold text-green-800 mb-2">{step.step}</h3>
                                    <p className="text-sm text-gray-600">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Misyon ve Vizyon Bölümü */}
            <section
                className="py-20 relative bg-green-50"
                style={{
                    backgroundImage: `url('/mission-bg.jpeg')`, // 9
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-green-50 opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Misyonumuz: Daha Yeşil Bir Dünya
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        “Her Analiz, Daha Temiz Bir Gelecek Demektir.” Çevresel farkındalığı artırarak gezegenimizi koruyoruz.
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                Misyonumuz
                            </h3>
                            <p className="text-gray-600">
                                Her birey ve işletmenin karbon ayak izini anlamasını sağlayarak, sürdürülebilir yaşam tarzlarını teşvik ediyoruz.
                                Bilimsel verilerle desteklenen araçlarımız, çevresel etkilerinizi ölçmek ve azaltmak için rehberinizdir.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            <h3 className="text-2xl font-semibold text-green-800 mb-4">
                                Vizyonumuz
                            </h3>
                            <p className="text-gray-600">
                                Karbon nötr bir dünya yaratmak için teknolojinin gücünü kullanıyoruz.
                                Her analiz, daha yeşil bir gezegen için atılmış bir adımdır. Gelecek nesillere yaşanabilir bir dünya bırakmak bizim sorumluluğumuz.
                            </p>
                        </motion.div>
                    </div>
                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Image
                            src="/mission-image.jpg"
                            alt="Misyon ve vizyon görseli"
                            width={800}
                            height={400}
                            className="max-w-3xl mx-auto rounded-lg shadow-lg"
                        />
                    </motion.div>
                </div>
            </section>

            {/* İstatistikler Bölümü */}
            <section
                className="py-20 relative"
                style={{
                    backgroundImage: `url('/stats-bg.jpeg')`, // 10
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Etkimiz ve Güvenilirliğimiz
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        “Birlikte Daha Güçlüyüz.” Platformumuz, binlerce kullanıcıya karbon ayak izlerini azaltma konusunda ilham verdi.
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                value: '1000+',
                                label: 'Kullanıcı',
                                description: 'Platformumuzu kullanarak karbon ayak izini analiz eden kişi sayısı.',
                            },
                            {
                                value: '10 Ton',
                                label: 'CO2 Azaltımı',
                                description: 'Kullanıcılarımızın önerilerimizle azalttığı toplam emisyon.',
                            },
                            {
                                value: '50+',
                                label: 'Sektör',
                                description: 'Farklı sektörlerden işletmeler için özelleştirilmiş analizler.',
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.2 }}
                                className="hover:scale-105 transition-transform duration-300"
                            >
                                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <Image
                                        src="/stats-icon.png"
                                        alt="İstatistik ikonu"
                                        width={48}
                                        height={48}
                                        className="mx-auto mb-4"
                                    />
                                    <h3 className="text-3xl font-bold text-green-600 mb-2">{stat.value}</h3>
                                    <h4 className="text-xl font-semibold text-green-800 mb-2">{stat.label}</h4>
                                    <p className="text-sm text-gray-600">{stat.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kullanıcı Yorumları Bölümü */}
            <section
                className="py-20 relative bg-green-50"
                style={{
                    backgroundImage: `url('/reviews-bg.jpeg')`, // 11
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-green-50 opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Kullanıcılarımız Ne Diyor?
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        “Değişim, Birlikte Başlar.” Kullanıcılarımızın platformumuz hakkındaki deneyimlerini keşfedin.
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Ayşe Yılmaz',
                                comment: 'Bu platform sayesinde karbon ayak izimi öğrendim ve enerji tüketimimi azalttım. Kullanımı çok kolay!',
                                image: '/user1-image.jpg',
                            },
                            {
                                name: 'Mehmet Kaya',
                                comment: 'Çevresel etkilerimi ölçmek hiç bu kadar basit olmamıştı. Öneriler gerçekten fark yaratıyor!',
                                image: '/user2-image.jpg',
                            },
                            {
                                name: 'Elif Demir',
                                comment: 'Hızlı ve güvenilir analizlerle sürdürülebilir bir yaşam tarzına geçiş yaptım. Herkese tavsiye ederim!',
                                image: '/user3-image.jpg',
                            },
                        ].map((review, index) => (
                            <motion.div
                                key={review.name}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.2 }}
                                className="hover:scale-105 transition-transform duration-300"
                            >
                                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        width={64}
                                        height={64}
                                        className="h-16 w-16 mx-auto mb-4 rounded-full object-cover"
                                    />
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">{review.name}</h3>
                                    <p className="text-sm text-gray-600 italic">{review.comment}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sık Sorulan Sorular (SSS) Bölümü */}
            <section
                className="py-20 relative"
                style={{
                    backgroundImage: `url('/faq-bg.jpeg')`, // 12
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-4xl font-semibold text-green-800 mb-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Sık Sorulan Sorular
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Platformumuz hakkında merak ettiklerinizi öğrenin.
                    </motion.p>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        {[
                            {
                                question: 'Karbon ayak izi nedir?',
                                answer:
                                    'Karbon ayak izi, bir bireyin veya kuruluşun faaliyetleri sonucu atmosfere salınan sera gazlarının miktarıdır. Platformumuz, bunu ölçmenize yardımcı olur.',
                            },
                            {
                                question: 'Hesaplamalar ne kadar doğru?',
                                answer:
                                    'Hesaplamalarımız, bilimsel verilere ve uluslararası standartlara dayanır. Sektörünüze özel katsayılarla yüksek doğruluk sağlarız.',
                            },
                            {
                                question: 'Sonuçlarımı nasıl kullanırım?',
                                answer:
                                    'Sonuçlarınızı analiz ederek enerji tüketiminizi azaltabilir, çevre dostu alışkanlıklar edinebilir ve platformumuzun önerilerinden faydalanabilirsiniz.',
                            },
                            {
                                question: 'Platform ücretsiz mi?',
                                answer:
                                    'Evet, bireysel hesaplama araçlarımız ücretsizdir. Daha gelişmiş analizler için /calculator sayfamızı ziyaret edebilirsiniz.',
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={faq.question}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.2 }}
                                className="hover:scale-105 transition-transform duration-300"
                            >
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">{faq.question}</h3>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Bölümü */}
            <section
                className="py-20 relative text-white text-center"
                style={{
                    backgroundImage: `url('/cta-bg.jpeg')`, // 13
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-green-600 opacity-80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-semibold mb-6">
                                Sürdürülebilirlik Yolculuğunuza Başlayın
                            </h2>
                            <p className="text-lg max-w-2xl mx-auto mb-8">
                                Gelişmiş hesaplama araçlarımızla karbon ayak izinizi detaylı bir şekilde analiz edin.
                                “Her Analiz, Daha Temiz Bir Gelecek Demektir.”
                            </p>
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Link
                                    href="/calculator"
                                    className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
                                >
                                    Hemen Analize Başla
                                </Link>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Image
                                src="/renewable-energy.jpeg" // 4
                                alt="Yenilenebilir Enerji"
                                width={500}
                                height={300}
                                className="rounded-xl shadow-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="py-12 relative bg-green-800 text-white"
                style={{
                    backgroundImage: `url('/footer-pattern.jpeg')`, // 5
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-green-900 opacity-50" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-green-100 mb-4">
                        © {new Date().getFullYear()} CO2 Hesaplama Platformu. Tüm hakları saklıdır.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="https://twitter.com" className="text-green-100 hover:text-white">
                            Twitter
                        </a>
                        <a href="https://linkedin.com" className="text-green-100 hover:text-white">
                            LinkedIn
                        </a>
                        <a href="https://instagram.com" className="text-green-100 hover:text-white">
                            Instagram
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}