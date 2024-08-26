// Material-UI
import { DataGrid } from "@mui/x-data-grid";

const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Título", width: 300 },
    { field: "identification", headerName: "Identificación", width: 130 },
    { field: "name", headerName: "Nombre", width: 300 },
    { field: "area", headerName: "Área", width: 130 },
    { field: "job_title", headerName: "Cargo", width: 130 },
    {
        field: "salary",
        type: "number",
        headerName: "Salario",
        width: 130,
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "days",
        headerName: "Días",
        width: 130,
        type: "number",
        valueGetter: (value) => {
            if (typeof value === "string") {
                return parseFloat(value.replace(",", "."));
            }
            return NaN; // or any other default value you'd like to return
        },

        valueFormatter: (value) => value + " DÍAS",
    },
    {
        field: "biweekly_period",
        headerName: "Periodo Quincenal",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "transport_allowance",
        headerName: "Auxilio de Transporte",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "surcharge_night_shift_hours",
        headerName: "Horas Laboradas Recargo Nocturno",
        width: 130,
        type: "number",
        valueGetter: (value) => {
            if (typeof value === "string") {
                return parseFloat(value.replace(",", "."));
            }
            return NaN; // or any other default value you'd like to return
        },
        valueFormatter: (value) => value + " HORAS",
    },
    {
        field: "surcharge_night_shift_allowance",
        headerName: "Recargo Nocturno",
        width: 130,
        type: "number",
        valueFormatter: (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(value),
    },
    {
        field: "surcharge_night_shift_holiday_hours",
        headerName: "Horas Laboradas Recargo Nocturno Festivo",
        width: 130,
        type: "number",
        valueGetter: (value) => {
            if (typeof value === "string") {
                return parseFloat(value.replace(",", "."));
            }
            return NaN; // or any other default value you'd like to return
        },

        valueFormatter: (value) => value + " HORAS",
    },
    {
        field: "surcharge_night_shift_holiday_allowance",
        headerName: "Recargo Nocturno Festivo",
        width: 130,
        type: "number",
        valueFormatter: (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(value),
    },
    {
        field: "surcharge_holiday_hours",
        headerName: "Horas Laboradas Recargo Dominical o Festivo",
        width: 130,
        type: "number",
        valueFormatter: (value) => value + " HORAS",
    },
    {
        field: "surcharge_holiday_allowance",
        headerName: "Recargo Dominical o Festivo",
        width: 130,
        type: "number",
        valueFormatter: (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(value),
    },
    {
        field: "bonus_paycheck",
        headerName: "Bonificación",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "biannual_bonus",
        headerName: "Prima",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "severance",
        headerName: "Cesantías",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "gross_earnings",
        headerName: "Total Devengado",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "healthcare_contribution",
        headerName: "Aporte a Salud",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "pension_contribution",
        headerName: "Aporte a Pensión",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "tax_withholding",
        headerName: "Retención en la Fuente",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "additional_deductions",
        headerName: "Deducciones Adicionales",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "apsalpen",
        headerName: "Aporte a Salud y Pensión Sobre Incentivo",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "solidarity_fund_percentage",
        headerName: "Porcentaje de Fondo de Solidaridad",
        width: 130,
        type: "number",
        valueGetter: (value) => {
            if (typeof value === "string") {
                return parseFloat(value.replace(",", "."));
            }
            return NaN; // or any other default value you'd like to return
        },

        valueFormatter: (value) => value * 100 + "%",
    },
    {
        field: "solidarity_fund",
        headerName: "Fondo de Solidaridad",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },

    {
        field: "total_deductions",
        headerName: "Total Deducciones",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
    {
        field: "net_pay",
        headerName: "Total a Pagar",
        width: 130,
        type: "number",
        valueFormatter: (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value),
    },
];

const PayslipsPreview = ({ rows }) => {
    return (
        <div style={{ width: "100%", height: 400, boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
        </div>
    );
};

export default PayslipsPreview;
