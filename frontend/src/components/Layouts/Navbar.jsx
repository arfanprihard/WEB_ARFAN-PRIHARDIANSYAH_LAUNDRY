import authService from "../../features/auth/services/auth.service"

const Navbar = () => {
    const user = authService.getCurrentUser();

    return (
        <div className="bg-background flex items-center justify-between border-b shadow-[0_4px_6px_-2px_rgba(0,0,0,0.1)] border-border h-20 sticky top-0 w-full px-10">
            <div className="text-[18px] font-bold text-foreground">
                Sistem Informasi Laundry
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[14px] font-semibold text-foreground">{user?.name || "Guest"}</p>
                    <p className="text-[12px] text-muted-foreground">{user?.level_name || "Guest Role"}</p>
                </div>
                <button 
                    onClick={() => authService.logout()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-[13px] font-semibold cursor-pointer transition-all"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar
