import jsPDF from "jspdf";
import cycLogo from "../../images/cyc-logos/logotipo-navbar.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { getApiUrl } from "../../assets/getApi";

const PDFcomponent = () => {
    const navigate = useNavigate();
    const [goalCedula, setGoalCedula] = useState();
    const [goalAdvisorClaro, setGoalAdvisorClaro] = useState();
    const [goalQuantity, setGoalQuantity] = useState();
    const [goalCriteria, setGoalCriteria] = useState();
    const [goalName, setName] = useState();
    const [campaign, setCampaign] = useState();
    const [goalDate, setGoalDate] = useState();
    const getGoal = async () => {
        try {
            const response = await fetch(`${getApiUrl()}goals/15225716/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
            }
        } catch (error) {
            console.error(error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        const imgWidth = 60; // Your image width

        const pageWidth = doc.internal.pageSize.getWidth();

        const imgX = (pageWidth - imgWidth) / 2;

        const date = new Date();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        const day = date.getDate();

        doc.addImage(cycLogo, "PNG", imgX, 10, imgWidth, 30);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("PLANTILLA DE ENTREGA DE METAS", doc.internal.pageSize.getWidth() / 2, 60, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Bogotá D.C. ${day} de ${month} de ${year}`, 10, 70);
        doc.text("Señor(a) ${name}", 10, 80);
        doc.text("Identificación: ${id}", 10, 90);
        doc.text("Cargo: Asesor", 10, 100);
        doc.text("Campaña: ${campaign}", 10, 110);
        doc.text("Referencia: Notificación de Metas Mes ${month} año ${year}", 10, 120);
        doc.text("Cordial saludo,", 10, 130);
        doc.text(
            "Mediante el presente comunicado nos permitimos informarle que, de acuerdo con el objeto de su contrato, la meta esperada para el mes de la referencia es la siguiente:",
            10,
            140
        );

        let y = 170;
        // additionalInfo.forEach((info) => {
        //     doc.text("${info.fringe} ${info.diary_goal} ${info.days} ${info.month_goal} ${info.hours} ${info.collection_account}", 10, y);
        //     y += 10;
        // });

        doc.text("Cordialmente,", 10, y);
        y += 10;

        // doc.addImage("./firmas/firma.png", "PNG", 10, y, 60, 60);
        doc.text("___________________", 10, y + 70);
        doc.text("Adriana Páez", 10, y + 80);
        doc.text("Gerente de Operaciones", 10, y + 90);

        doc.save("document.pdf");
        window.open(URL.createObjectURL(doc.output("blob")));
    };

    return (
        <div>
            <button onClick={generatePDF} type="primary">
                Download PDF
            </button>
        </div>
    );
};
export default PDFcomponent;
