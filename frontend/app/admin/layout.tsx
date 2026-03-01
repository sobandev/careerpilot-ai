import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Admin Control Panel | CareerPilot",
    description: "Platform management and metrics for CareerPilot administrators.",
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900">CareerPilot <span className="text-blue-600">Admin</span></span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full relative">
                {children}
            </main>
        </div>
    )
}
