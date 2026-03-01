"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Eye, Briefcase, Users, Activity, Shield, LogOut } from "lucide-react"

export default function AdminDashboardPage() {
    const { user, loading: authLoading } = useAuth()

    const [secretKey, setSecretKey] = useState<string>("")
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [stats, setStats] = useState<{ total_users: number, total_jobs: number, total_applications: number } | null>(null)
    const [usersList, setUsersList] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // Check on mount if user is auto-authenticated via role or cached key
    useEffect(() => {
        if (authLoading) return

        const storedKey = localStorage.getItem("admin_secret_key")

        if (user?.role === "admin") {
            // Logged in as real admin user
            setIsAuthenticated(true)
            fetchData()
        } else if (storedKey) {
            // Attempt bypass with stored key
            setSecretKey(storedKey)
            attemptBypassLogin(storedKey)
        } else {
            setIsLoading(false)
        }
    }, [user, authLoading])

    const attemptBypassLogin = async (key: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await api.getAdminStats(key)
            if (data) {
                localStorage.setItem("admin_secret_key", key)
                setIsAuthenticated(true)
                await fetchData(key)
            }
        } catch (err: any) {
            setError("Invalid Secret Key or unauthorized.")
            localStorage.removeItem("admin_secret_key")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchData = async (overrideKey?: string) => {
        setIsLoading(true)
        try {
            const activeKey = overrideKey || secretKey || undefined
            const [statsData, usersData] = await Promise.all([
                api.getAdminStats(activeKey),
                api.getAdminUsers(activeKey)
            ])
            setStats(statsData)
            setUsersList(usersData)
        } catch (err) {
            setError("Session expired or connection failed.")
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("admin_secret_key")
        setIsAuthenticated(false)
        setSecretKey("")
    }

    if (authLoading || (isLoading && !stats)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500 font-medium">Authenticating Secure Connection...</p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h1>
                    <p className="text-gray-500 mb-8 text-sm">
                        You need an administrator account or a valid Secret Key to proceed.
                    </p>

                    <form
                        onSubmit={(e) => { e.preventDefault(); attemptBypassLogin(secretKey); }}
                        className="space-y-4"
                    >
                        <div>
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                placeholder="Enter Admin Secret Key..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Verifying..." : "Unlock Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
                    <p className="text-gray-500 mt-1">Real-time metrics and user management.</p>
                </div>
                {secretKey && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm w-fit"
                    >
                        <LogOut className="w-4 h-4" /> Exit Secure Session
                    </button>
                )}
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-blue-600">
                            <Users className="w-5 h-5" />
                            <h3 className="font-medium text-sm uppercase tracking-wider">Total Users</h3>
                        </div>
                        <p className="text-4xl font-black text-gray-900">{stats?.total_users || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-purple-600">
                            <Briefcase className="w-5 h-5" />
                            <h3 className="font-medium text-sm uppercase tracking-wider">Total Jobs</h3>
                        </div>
                        <p className="text-4xl font-black text-gray-900">{stats?.total_jobs || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-green-600">
                            <Activity className="w-5 h-5" />
                            <h3 className="font-medium text-sm uppercase tracking-wider">Total Applications</h3>
                        </div>
                        <p className="text-4xl font-black text-gray-900">{stats?.total_applications || 0}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* User Data Grid */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900">Registered Accounts</h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{usersList.length} total</span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 z-10">
                                <tr>
                                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name / ID</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {usersList.map((usr) => (
                                    <tr key={usr.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="py-4 px-6 text-sm">
                                            <p className="font-semibold text-gray-900">{usr.full_name || "Unknown User"}</p>
                                            <p className="text-gray-400 text-xs mt-0.5 font-mono truncate w-24" title={usr.id}>{usr.id.split('-')[0]}...</p>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                                            {usr.email}
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${usr.role === 'admin' ? 'bg-black text-white border-black' :
                                                    usr.role === 'employer' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                {usr.role || 'jobseeker'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {new Date(usr.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                                {usersList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-500">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Subscriptions Placeholder */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col p-6 h-[600px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Subscription Management
                    </h2>

                    <div className="flex-1 flex items-center justify-center flex-col text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 mb-4">
                            <span className="text-2xl">🚧</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">SaaS Billing Coming Soon</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-[200px]">
                            Connect Stripe to monitor MRR, active plans, and invoice history directly from this panel.
                        </p>
                        <button className="mt-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            Configure Stripe Gateway
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
