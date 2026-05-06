import React, { useEffect, useState } from "react";
import Area from "@components/common/Area";
import LoadingBar from "@components/common/LoadingBar";
import "./Layout.scss";
import "./tailwind.scss";
import GoogleAnalytics from "../../../components/GoogleAnalytics";

export default function Layout() {
    const colors = ["text-black", "text-white"];
    const [underConstruction, setUnderConstruction] = useState(true);

    useEffect(() => {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        if (params.get("site_status") === "active") {
            setUnderConstruction(false);
        }
    }, []);

    // if (underConstruction) {
    //   return (
    //     <>
    //       {colors.map((color, index) => (
    //         <div key={index} className={color}>
    //           <p className="text-center">Sitio en Construcción...</p>
    //           <p className="text-center">
    //             Para contactarnos comunicate tel/Whatsapp la empresa.
    //           </p>
    //           <p className="text-center">RENTAL & BIKE +54 2901 640089</p>
    //           <p className="text-center">TRAVELS +54 2901 619587</p>
    //         </div>
    //       ))}
    //     </>
    //   );
    // }

    return (
        <>
            <GoogleAnalytics />
            <LoadingBar />
            <div className="header grid grid-cols-12 p-6">
                <Area id="header" noOuter />
            </div>
            <main className="content">
                <Area id="content" noOuter />
            </main>
            <div className="footer mt-10">
                <Area id="footer" noOuter coreComponents={[]} />
            </div>
        </>
    );
}

export const layout = {
    areaId: "body",
    sortOrder: 1,
};
