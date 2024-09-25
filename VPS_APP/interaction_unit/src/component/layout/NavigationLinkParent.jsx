const NavigationLinkParent = ({
    sideBars, parentName, Icon
}) => {
    return <>
        <summary className={`${Icon ? 'mx-2 ' : ''}${sideBars == parentName ? `hover:bg-blue-900 hover:text-white bg-blue-900 text-white rounded-md` : ``}`}>
            {Icon}
            <p className="pointer-events-none">{parentName}</p>
        </summary>
    </>
}
export default NavigationLinkParent