import { NavLink } from "react-router-dom";

const NavigationLink = ({
    to,
    label,
    setNavigationList = () => { },
    icon,
    addClass
}) => {
    return <NavLink
        className={({ isActive }) => (
            isActive ? `${addClass} hover:bg-blue-900 hover:text-white bg-blue-900 text-white` : `${addClass}`
        )}
        to={to}
        onClick={setNavigationList}
    >
        {icon}
        {label}
    </NavLink>
}

export default NavigationLink;