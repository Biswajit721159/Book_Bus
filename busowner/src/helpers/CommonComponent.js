import { logo } from "../utilities/logo";

export const ImageComponent = ({ className = '' }) => {
    return (
        <img
            className={`h-16 w-20 object-contain rounded-lg ${className}`}
            src={logo}
            alt="Bus Schedule Manager"
        />
    );
};

export const commonClass = "input-field";
