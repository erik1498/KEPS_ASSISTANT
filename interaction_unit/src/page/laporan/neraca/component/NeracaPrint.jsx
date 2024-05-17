import React from "react";
import RowCard from "../../../../component/card/RowCard";

export const NeracaPrint = React.forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
        >
            {
                Object.keys(props.data).length > 0 ?
                    <>
                        <RowCard
                            dataList={props.data.harta}
                            title={"Aset"}
                            totalTitle={"Total Asset"}
                        />
                        <RowCard
                            dataList={props.data.utang}
                            title={"Kewajiban"}
                            totalTitle={"Total Kewajiban"}
                        />
                        <RowCard
                            dataList={props.data.modal}
                            title={"Ekuitas"}
                            totalTitle={"Total Ekuitas"}
                        />
                    </>
                    :
                    <></>
            }
        </div>
    );
});