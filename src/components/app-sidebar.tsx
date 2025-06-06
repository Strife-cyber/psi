import { NavItem } from '..';
import AppLogo from './app-logo';
import { NavUser } from './nav-user';
import { NavMain } from './nav-main';
import { Link } from 'react-router-dom';
import { NavFooter } from './nav-footer';
import { 
    LayoutGrid, 
    Grid3X3, Key, Vault
} from 'lucide-react';
import { 
    Sidebar, SidebarContent, 
    SidebarFooter, SidebarHeader, 
    SidebarMenu, SidebarMenuButton, SidebarMenuItem 
} from '@/components/ui/sidebar';

export function AppSidebar() {
    const mainNavItems: NavItem[] = [
        {
            title: "Dashboard",
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: "Passwords",
            href: '/passwords',
            icon: Key
        },
        /*{
            title: "Generator",
            href: '/generator',
            icon: Grid3X3
        },*/
        {
            title: "Vault",
            href: '/vault',
            icon: Vault
        }
    ];
    
    const footerNavItems: NavItem[] = [
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
