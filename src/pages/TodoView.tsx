import { useScheduleItems } from '@/context/ScheduleItemContext';
import CreateTaskBlock from '@/components/schedule-items/tasks/CreateTaskBlock';
import ItemList from '@/components/schedule-items/ItemList';
import { defaultTask } from '@/utils/constants';
import CreateItemBlock from '@/components/schedule-items/CreateItemBlock';
import { useState } from 'react';
import { PartialScheduleItem } from '@/types';

const TodoView = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const { rootItems, createTask, createBlock, toggleChecked } = useScheduleItems();

  const handleCreateItem = (draftItem: PartialScheduleItem) => {
    if(draftItem.variant==="task") createTask(draftItem);
    if(draftItem.variant==="block") createBlock(draftItem);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
        <div className="flex flex-col font-dongle">
          <h2>Todo</h2>
          <div className="font-dongle font-bold text-2xl">things to do</div>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-3xl overflow-y-auto p-3 gap-3">
        <ItemList
            items={rootItems}
            onCompleteTask={toggleChecked} 
            withDate={true}
          />
        <CreateItemBlock 
          isCreating={isCreating}
          onToggleCreating={() => setIsCreating(!isCreating)}
          onCreateItem={handleCreateItem}
          isCondensed={true}
        />
        </div>
    </div>
  )
}

export default TodoView