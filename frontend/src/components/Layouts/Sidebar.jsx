import SidebarMenu from '../Elements/SidebarMenu';
import authService from '../../features/auth/services/auth.service';
import { ROLE_PERMISSIONS } from '../../config/roles';

const Sidebar = () => {
    const user = authService.getCurrentUser();
    const role = user?.level_name || 'Admin';

    const hasAccess = (feature) => {
        return ROLE_PERMISSIONS[feature]?.includes(role);
    };

    return (
        <div className="w-64 bg-background h-screen border-r border-border flex flex-col">
            <div className="h-20 w-full items-center justify-start flex border-b border-border px-5">
                <div>
                    <p className="text-[16px] font-bold text-primary">
                        Laundry App
                    </p>
                    <p className="text-[12px] text-muted-foreground">Laundry Management System</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-5 overflow-y-auto">
                {hasAccess('dashboard') && (
                    <SidebarMenu title="Dashboard" icon="LayoutDashboard" to="/dashboard" />
                )}

                {hasAccess('customers') && (
                    <SidebarMenu title="Customers" icon="Users" to="/customers" />
                )}

                {hasAccess('transactions') && (
                    <SidebarMenu title="Transactions" icon="ShoppingCart" to="/transactions" />
                )}

                {hasAccess('pickups') && (
                    <SidebarMenu title="Pickups" icon="PackageCheck" to="/pickups" />
                )}

                {hasAccess('services') && (
                    <SidebarMenu title="Services Price" icon="Activity" to="/services" />
                )}

                {hasAccess('users') && (
                    <SidebarMenu title="Users Management" icon="UserCog" to="/users" />
                )}

                {hasAccess('reports') && (
                    <SidebarMenu title="Sales Reports" icon="BarChart3" to="/reports" />
                )}
            </div>
        </div>
    )
}

export default Sidebar
