import { ScheduleItem } from '@/types'
import TaskItem from './tasks/TaskItem'
import BlockItem from './blocks/BlockItem';

const ItemList = ({ items, onCompleteTask, withDate=true, isSubtask=false }: {
    items: ScheduleItem[],
    onCompleteTask: (id: string) => void,
    withDate: boolean,
    isSubtask?: boolean
}) => {

  const renderItem = (item: ScheduleItem) => {
    switch (item.variant) {
      case "task":
        return (
          <TaskItem
            key={item.id} 
            task={item}
            onComplete={onCompleteTask} 
            withDate={withDate}
            isSubtask={isSubtask}
          />
        );
      case "block":
        return (
          <BlockItem
            key={item.id}
            block={item}
          />
        );
      default:
        return (
          <></>
        );
    }
  }
  return (
    <ul className={`
      flex flex-col 
      ${isSubtask ? "" : "gap-3"}
    `}>
      {items.map(item => renderItem(item))}
    </ul>
  );
};

export default ItemList