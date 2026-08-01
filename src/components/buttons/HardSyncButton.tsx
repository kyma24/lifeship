import { hardPullAPI } from "@/db";

const HardSyncButton = () => {
    const handleSync = async () => {
        await hardPullAPI();
    }

    return (
        <button
            className="flex w-fit px-2 justify-center items-center bg-amber-700"
            onClick={handleSync}
        >
            <p className="font-dongle text-2xl font-bold">
                hard sync
            </p>
        </button>
    );
};

export default HardSyncButton;