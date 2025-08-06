import { format } from "date-fns";

const Footer = () => {
    const today = new Date();
    const year = format(today, "yyyy"); 
    return (
        <>
            <div className="py-2 w-full">
                <div className="py-4 border-y-2 items-center text-center jusitify-center">
                    &copy; Vinoth Kumar {year}
                </div>
            </div>
        </>
    )
}
export default Footer;
