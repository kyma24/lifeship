import HardSyncButton from "@/components/buttons/HardSyncButton";
import SignOutButton from "@/components/buttons/SignOutButton"

const SettingsPage = () => {
  return (
    <div>
        <div className="flex flex-col justify-center items-center">
            <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
                <div className="flex flex-col font-dongle">
                  <h2>Settings</h2>
                </div>
            </div>
            <div className="flex flex-col w-full max-w-3xl overflow-y-auto p-3 gap-3">
                <SignOutButton />
                <HardSyncButton />
            </div>
          </div>
    </div>
  );
};

export default SettingsPage;