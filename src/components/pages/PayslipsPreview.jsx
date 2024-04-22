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
        valueGetter: (params) => params.row.salary * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    { field: "days", headerName: "Días", width: 130, valueFormatter: (params) => params.value + " DÍAS" },
    {
        field: "biweekly_period",
        headerName: "Periodo Quincenal",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.biweekly_period * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "transport_allowance",
        headerName: "Auxilio de Transporte",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.transport_allowance * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "surcharge_night_shift_hours",
        headerName: "Horas Laboradas Recargo Nocturno",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.surcharge_night_shift_hours * 1,
        valueFormatter: (params) => params.value + " HORAS",
    },
    {
        field: "surcharge_night_shift_allowance",
        headerName: "Recargo Nocturno",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.surcharge_night_shift_hours * 1,
        valueFormatter: (params) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(params.value),
    },
    {
        field: "surcharge_night_shift_holiday_hours",
        headerName: "Horas Laboradas Recargo Nocturno Festivo",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.surcharge_night_shift_hours * 1,
        valueFormatter: (params) => params.value + " HORAS",
    },
    {
        field: "surcharge_night_shift_holiday_allowance",
        headerName: "Recargo Nocturno Festivo",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.surcharge_night_shift_hours * 1,
        valueFormatter: (params) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(params.value),
    },
    {
        field: "surcharge_holiday_hours",
        headerName: "Horas Laboradas Recargo Dominical o Festivo",
        width: 130,
        type: "number",
        valueFormatter: (params) => params.value + " HORAS",
    },
    {
        field: "surcharge_holiday_allowance",
        headerName: "Recargo Dominical o Festivo",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.surcharge_night_shift_hours * 1,
        valueFormatter: (params) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(params.value),
    },
    {
        field: "bonus_paycheck",
        headerName: "Bonificación",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.bonus_paycheck * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "biannual_bonus",
        headerName: "Prima",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.biannual_bonus * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "severance",
        headerName: "Cesantías",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.severance * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "gross_earnings",
        headerName: "Total Devengado",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.gross_earnings * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "healthcare_contribution",
        headerName: "Aporte a Salud",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.healthcare_contribution * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "pension_contribution",
        headerName: "Aporte a Pensión",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.pension_contribution * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "tax_withholding",
        headerName: "Retención en la Fuente",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.tax_withholding * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "apsalpen",
        headerName: "Aporte a Salud y Pensión",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.apsalpen * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "additional_deductions",
        headerName: "Deducciones Adicionales",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.additional_deductions * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "total_deductions",
        headerName: "Total Deducciones",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.total_deductions * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
    {
        field: "net_pay",
        headerName: "Total a Pagar",
        width: 130,
        type: "number",
        valueGetter: (params) => params.row.net_pay * 1,
        valueFormatter: (params) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(params.value),
    },
];

const PayslipsPreview = ({ rows }) => {
    console.log(rows);
    return (
        <div style={{ width: "100%", height: 400, boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
        </div>
    );
};

export default PayslipsPreview;
