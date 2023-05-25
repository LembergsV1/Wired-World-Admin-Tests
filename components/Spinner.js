import { ClipLoader, MoonLoader } from "react-spinners";

export default function Spinner({fullWidth}) {
    if (fullWidth) {
        return(
            <div className="w-full flex justify-center">
                <ClipLoader color={'#000000'} speedMultiplier={2}/>
            </div>
        );
    }
    return(
        <ClipLoader color={'#000000'} speedMultiplier={2}/>
    );
}