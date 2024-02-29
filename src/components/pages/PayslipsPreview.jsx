import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Título", width: 300 },
    { field: "identification", headerName: "Identificación", width: 130 },
    { field: "name", headerName: "Nombre", width: 130 },
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
    { field: "days", headerName: "Días", width: 130 },
    { field: "biweekly_period", headerName: "Periodo Quincenal", width: 130 },
    { field: "transport_allowance", headerName: "Auxilio de Transporte", width: 130 },
    { field: "bonus_paycheck", headerName: "Bonificación", width: 130 },
    { field: "gross_earnings", headerName: "Total Devengado", width: 130 },
    { field: "healthcare_contribution", headerName: "Aporte a Salud", width: 130 },
    { field: "pension_contribution", headerName: "Aporte a Pensión", width: 130 },
    { field: "tax_withholding", headerName: "Retención en la Fuente", width: 130 },
    { field: "apsalpen", headerName: "Aporte a Salud y Pensión", width: 130 },
    { field: "additional_deductions", headerName: "Deducciones Adicionales", width: 130 },
    { field: "total_deductions", headerName: "Total Deducciones", width: 130 },
    { field: "net_pay", headerName: "Total a Pagar", width: 130 },
];

const PayslipsPreview = ({ rows }) => {
    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
        </div>
    );
};

export default PayslipsPreview;
