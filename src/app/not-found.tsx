import Link from 'next/link';
import { FiAlertCircle, FiHome } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#171615] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-[#1D1C1B]  p-8 ">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 flex items-center justify-center">
                        <FiAlertCircle className="text-primary text-4xl" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-xl font-semibold text-[#D6D5D4] mb-4">Page Not Found</h2>
                <p className="text-subtle text-sm mb-8 leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-[3px] font-medium hover:bg-primary/90 transition-all"
                >
                   
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
