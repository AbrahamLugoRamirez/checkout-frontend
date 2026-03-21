import React, { useEffect, useRef } from "react";

const PagoWompi = ({ total, reference, signatureIntegrity }) => {
    const scriptContainer = useRef(null);
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        const container = scriptContainer.current;

        if (!container) return;

        setTimeout(() => {
            const script = document.createElement("script");
            script.src = "https://checkout.wompi.co/widget.js";
            script.async = true;

            script.dataset.render = "button";
            script.setAttribute(
            "data-public-key",
            "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
            );
            script.dataset.currency = "COP";
            script.dataset.amountInCents = total.toString();
            script.dataset.reference = reference;
            script.dataset.environment = "sandbox";

            container.innerHTML = "";
            container.appendChild(script);
        }, 100); // 🔥 clave

    }, []);

    return (
        <div>
            <h2>Realiza tu pago con Wompi</h2>
            <div ref={scriptContainer}></div>
        </div>
    );
};

export default PagoWompi;