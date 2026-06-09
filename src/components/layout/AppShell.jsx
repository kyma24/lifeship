import React, { useState } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
import BottomNav from './BottomNav';
import CreateTask from '@/pages/operations/CreateTask';
import { useTasks } from '@/features/tasks/context/TaskContext';

const AppShell = ({ children }) => {
    const [createIsOpen, setCreateIsOpen] = useState(false);
    const [createIsMounted, setCreateIsMounted] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    
    const { createTask } = useTasks();

    const handleCreateOpen = () => {
        setCreateIsMounted(true);
        requestAnimationFrame(() => setCreateIsOpen(true));
    }

    const handleCreateClose = () => {
        setCreateIsOpen(false);
        setTimeout(() => setCreateIsMounted(false), 401);
    }

    const handleCreate = (draftTask) => {
        handleCreateClose();
        createTask(draftTask);
    }

    return (
        <div className="flex flex-col w-screen h-dvh overflow-hidden">
            {createIsMounted && 
                <>
                    <button
                        className={`fixed w-full h-full z-100 ${createIsOpen ? "bg-[#16171d]/50" : "bg-[#16171d]/0"} transition-colors duration-300 ease-in-out`}
                        onClick={handleCreateClose}
                    />
                    <CreateTask
                        isOpen={createIsOpen}
                        onCreate={handleCreate} 
                    />
                </>
            }
            <main className="flex-1 overflow-y-auto w-screen h-screen overscroll-none">
                {children}
            </main>
            {!isDesktop &&
                <BottomNav
                    onAddTaskClick={handleCreateOpen}
                />
            }
        </div>
    )
}

export default AppShell