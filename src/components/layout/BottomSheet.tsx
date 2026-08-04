import { useBottomSheet } from "@/context/BottomSheetContext";
import { createPortal } from "react-dom";

const BottomSheet = () => {
    const {sheet, isOpen, isMounted, closeSheet} = useBottomSheet();

    const portalTarget = document.getElementById("bottom-sheet-root")!;

    if(!isMounted) return null;

    return createPortal(
        (<>
            <button
                className={`fixed top-0 left-0 w-dvw h-dvh ${isOpen ? "bg-[#16171d]/50" : "bg-[#16171d]/0"} transition-colors duration-300 ease-in-out`}
                onClick={closeSheet}
            />
            <div
                className={`fixed inset-x-0 bottom-0 ${isOpen ? "translate-y-0" : "translate-y-[101%]"} transition duration-400 ease-in-out
                            flex flex-col gap-3
                            z-100 w-full h-fit bg-[#1f2028] rounded-t-4xl p-8`}
            >
                { sheet && <sheet.Component {...sheet.props} /> }
            </div>
        </>),
        portalTarget
    );
};

export default BottomSheet;