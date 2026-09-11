import useMediaQuery from '../../hooks/useMediaQuery'
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

const AppShell = () => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    return (
        <div className="w-dvw h-dvh flex flex-col overflow-hidden">
            <main className={`w-dvw h-dvh flex-1 overflow-y-auto overscroll-none
                ${!isDesktop && "pb-30"}`
            }>
                <Outlet />
            </main>
            {!isDesktop &&
                <BottomNav />
            }
        </div>
    );
}

export default AppShell;