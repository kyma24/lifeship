import BottomSheet from "@/components/layout/BottomSheet";
import { ComponentType, createContext, useCallback, useContext, useEffect, useState } from "react";

interface SheetState<P=any> {
    Component: ComponentType<P>;
    props: P;
}

interface BottomSheetContextProps {
    sheet: SheetState | null;
    isOpen: boolean;
    isMounted: boolean;
    openSheet: <P>(Component: ComponentType<P>, props: P) => void;
    closeSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextProps | null>(null);

export const BottomSheetProvider = ({children}: React.PropsWithChildren) => {
    const [sheet, setSheet] = useState<SheetState | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const openSheet = useCallback(<P,>(Component: ComponentType<P>, props: P) => {
        setSheet({ Component, props });
        setIsMounted(true);
    }, []);

    const closeSheet = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if(isMounted) {
            const id = requestAnimationFrame(() => setIsOpen(true));
            return () => cancelAnimationFrame(id);
        }
    }, [isMounted]);

    useEffect(() => {
        if(isMounted && !isOpen) {
            const timeout = setTimeout(() => {
                setIsMounted(false);
                setSheet(null);
            }, 401);
            return () => clearTimeout(timeout);
        }
    }, [isMounted, isOpen]);

    return (
        <BottomSheetContext.Provider value={{sheet, isOpen, isMounted, openSheet, closeSheet}}>
            {children}
            <BottomSheet />
        </BottomSheetContext.Provider>
    );
}

export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    if(context===null) throw new Error("Cannot access bottom sheet context");
    return context;
}