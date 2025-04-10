import { User } from '..';
import { LogOut } from 'lucide-react';
import { UserInfo } from './user-info';
import useAuthHook from '@/hooks/auth-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { logout } = useAuthHook();
    const navigate = useNavigate();

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" to="/" onClick={() => { logout(); navigate("/"); }}>
                    <LogOut className="mr-2" />
                    Logout
                </Link>
            </DropdownMenuItem>
        </>
    );
}
