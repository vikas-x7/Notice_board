'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#171615] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-[#1D1C1B] rounded-2xl border border-[#343332] p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center">
                        <FiAlertTriangle className="text-danger text-4xl" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Something went wrong!</h1>
                <p className="text-subtle text-sm mb-8 leading-relaxed">
                    We apologize for the inconvenience. An unexpected error has occurred while processing your request.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 cursor-pointer transition-all"
                    >
                        <FiRefreshCw />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-transparent border border-[#343332] text-[#D6D5D4] rounded-xl font-medium hover:bg-[#343332]/50 transition-all"
                    >
                        <FiHome />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
