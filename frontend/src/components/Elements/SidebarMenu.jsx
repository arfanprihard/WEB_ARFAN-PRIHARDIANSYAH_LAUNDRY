import * as Icons from 'lucide-react'
import { NavLink } from 'react-router-dom'

const SidebarMenu = ({ title, icon, to }) => {
    const Icon = Icons[icon] || Icons.HelpCircle;

    return (
        <NavLink 
            to={to} 
            className={({ isActive }) => 
                `rounded-md p-3 flex gap-2 items-center transition-all ${
                    isActive 
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
            }
        >
            {Icon && <Icon size={20} />}
            <span className="text-[14px]">
                {title}
            </span>
        </NavLink>
    )
}

export default SidebarMenu
