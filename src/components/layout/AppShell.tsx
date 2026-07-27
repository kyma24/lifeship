import React, { useState } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
import BottomNav from './BottomNav';
import CreateItemSheet from '@/components/schedule-items/CreateItemSheet';
import { useScheduleItems } from '@/context/ScheduleItemContext';
import { PartialScheduleItem } from '@/types';

const AppShell = ({ children }: React.PropsWithChildren) => {
    const [createIsOpen, setCreateIsOpen] = useState<boolean>(false);
    const [createIsMounted, setCreateIsMounted] = useState<boolean>(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    
    const { createTask, createBlock } = useScheduleItems();

    const handleCreateOpen = () => {
        setCreateIsMounted(true);
        requestAnimationFrame(() => setCreateIsOpen(true));
    }

    const handleCreateClose = () => {
        setCreateIsOpen(false);
        setTimeout(() => setCreateIsMounted(false), 401);
    }

    const handleCreate = (draft: PartialScheduleItem) => {
        handleCreateClose();
        if(draft.variant === "task") createTask(draft);
        if(draft.variant === "block") createBlock(draft);
    }

    return (
        <div className="flex flex-col w-screen h-dvh overflow-hidden">
            {createIsMounted && 
                <>
                    <button
                        className={`fixed w-full h-full z-100 ${createIsOpen ? "bg-[#16171d]/50" : "bg-[#16171d]/0"} transition-colors duration-300 ease-in-out`}
                        onClick={handleCreateClose}
                    />
                    <CreateItemSheet
                        isOpen={createIsOpen}
                        onCreate={handleCreate} 
                    />
                </>
            }
            <main className={`flex-1 overflow-y-auto w-screen h-screen overscroll-none
                ${!isDesktop && "pb-30"}`
            }>
                {children}
            </main>
            {!isDesktop &&
                <BottomNav
                    onAddTaskClick={handleCreateOpen}
                />
            }
        </div>
    );
}

export default AppShell;