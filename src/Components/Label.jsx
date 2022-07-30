import { useState } from "react";
import LabelSetting from "./LabelSetting";

const Label = (parameter) => {
    const [OpenLabelSetting, setOpenLabelSetting] = useState(false);

    const toggleOpenLabelSetting = () =>{
        setOpenLabelSetting(!OpenLabelSetting);
    }

    return (
        <div>
            <div onClick={toggleOpenLabelSetting} className={`bg-${parameter.label.data().color}-500 min-w-[5rem] w-fit h-8 flex items-center justify-center m-2 text-white rounded-lg `}>
                <p>{parameter.label.data().LabelName}</p>
            </div>
            {OpenLabelSetting === true && (
                <LabelSetting label={parameter.label} toggle={toggleOpenLabelSetting}></LabelSetting>
            )}
        </div>
    );
}
 
export default Label;