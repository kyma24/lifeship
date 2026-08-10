import { ChevronDown, ChevronUp, SunMedium } from "lucide-react";
import Menu from "@/components/menu/Menu";
import { Block, BlockActions, ScheduleItem } from "@/types";
import { blockMenu } from "@/utils/constants";

const DisplayBlockHeader = ({ block, subtasks, isExpanded, onClick, actions }: {
    block: Block,
    subtasks: ScheduleItem[],
    isExpanded: boolean,
    onClick: () => void,
    actions: BlockActions,
}) => {

    return (
        <div className="flex flex-row w-full gap-2 items-center">
            {/* menu */}
            {!block.fixed && 
                <Menu 
                    items={blockMenu(block,actions)} 
                /> 
            }

            {/* main section */}
            <div className="flex flex-row w-full p-1 justify-between items-center">
                <div 
                    className="flex flex-row gap-3 items-center
                                bg-gray-700 rounded-full"
                    onClick={onClick}
                >
                    {/* icon 
                    <div>
                        <SunMedium 
                            className="size-6"
                            strokeWidth={2} 
                        />
                    </div>*/}

                    <div 
                        className="flex flex-row items-center px-2 py-1 gap-1 
                                    text-left leading-tight">
                        {/* title, no. tasks left */}
                        <p className="font-bold">{block.name} ({(subtasks ?? []).length})</p>

                        {/* caret/expand */}
                        <div>
                            {isExpanded ? (
                                <ChevronUp 
                                    className="size-6"
                                    strokeWidth={2} 
                                />
                            ) : (
                                <ChevronDown
                                    className="size-6"
                                    strokeWidth={2}
                                />
                            )}
                        </div>
                    </div>
                </div>
                    
                {/* time */}
                { block.doInfo && 
                    <div className="ml-auto">
                        <p className="text-sm">10:30 - 12:50</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default DisplayBlockHeader;