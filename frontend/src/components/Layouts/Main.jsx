import Footer from "./Footer"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { Outlet } from 'react-router-dom'

const Main = () => {
    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="flex-1">
                    <div className="h-screen overflow-y-auto bg-muted">
                        <Navbar />
                        <div className="p-10">
                            <Outlet />
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Main
