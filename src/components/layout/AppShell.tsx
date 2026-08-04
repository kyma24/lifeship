import useMediaQuery from '../../hooks/useMediaQuery'
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

const AppShell = () => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    return (
        <div className="flex flex-col w-screen h-dvh overflow-hidden">
            <main className={`flex-1 overflow-y-auto w-screen h-screen overscroll-none
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