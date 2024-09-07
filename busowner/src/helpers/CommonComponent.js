import { logo } from "../utilities/logo";

export const  ImageComponent = () => {
    return (
        <img
            className="h-30 w-40"
            src={logo}
            alt="loading..." />
    )
}

export const commonClass="outline-blue-800 rounded-md bg-gray-100 font-medium w-full"