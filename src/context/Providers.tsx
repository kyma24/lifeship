import { AuthProvider } from "./AuthContext"
import { BottomSheetProvider } from "./BottomSheetContext";
import { ScheduleItemProvider } from "./ScheduleItemContext"

const Providers = ({ children }: React.PropsWithChildren) => {
    return (
        <AuthProvider>
            <ScheduleItemProvider>
                    <BottomSheetProvider>
                        {children}
                    </BottomSheetProvider>
            </ScheduleItemProvider>
        </AuthProvider>
    );
};

export default Providers;