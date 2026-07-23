import { NavLink } from "react-router-dom";
import AddTaskButton from "../buttons/AddTaskButton";

const BottomNav = ({ onAddTaskClick }: {
    onAddTaskClick: () => void,
}) => {
    
    const activeStyle = (isActive: boolean) => {
        return (`
            ${(isActive ? "bg-gray-300 text-[#2e303a] opacity-100" : "bg-gray-700 opacity-75")}
            px-4 py-2 rounded-full transition duration-300 font-dongle font-bold text-2xl
        `)
    };

    return (
        <nav className="flex w-full h-25 fixed bottom-0 z-50 pb-2.5 gap-3 justify-center items-center">
            <ul className="flex gap-2 max-w-4/5 list-none items-center">
                <li>
                    <NavLink
                        to="/todo"
                        className={({ isActive }) => activeStyle(isActive)}
                    >
                        todo
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/plan"
                        className={({ isActive }) => activeStyle(isActive)}
                    >
                        plan
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/week"
                        className={({ isActive }) => activeStyle(isActive)}
                    >
                        week
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/tags"
                        className={({ isActive }) => activeStyle(isActive)}
                    >
                        tags
                    </NavLink>
                </li>
            </ul>
            <AddTaskButton onClick={onAddTaskClick} />
        </nav>
    )
}

export default BottomNav