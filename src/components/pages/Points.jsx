import { useState, useEffect } from "react";

// Libraries
import { useNavigate } from "react-router-dom";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { handleError } from "../../assets/handleError";

// Material-UI
import { Container, Box, Typography } from "@mui/material";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

// MUI Icons
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// styled the row with the user's cedula
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .super-app-theme--1001185389": {
        backgroundColor: "#cfffe7",
        "&.Mui-selected": {
            backgroundColor: "#b4ffda",
        },
    },
}));

const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .no-results-primary": {
        fill: theme.palette.mode === "light" ? "#AEB8C2" : "#3D4751",
    },
    "& .no-results-secondary": {
        fill: theme.palette.mode === "light" ? "#E8EAED" : "#1D2126",
    },
    "& .no-rows-primary": {
        fill: theme.palette.mode === "light" ? "#AEB8C2" : "#3D4751",
    },
    "& .no-rows-secondary": {
        fill: theme.palette.mode === "light" ? "#E8EAED" : "#1D2126",
    },
}));

function CustomNoResultsOverlay() {
    return (
        <StyledGridOverlay>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={96} viewBox="0 0 523 299" aria-hidden focusable="false">
                <path
                    className="no-results-primary"
                    d="M262 20c-63.513 0-115 51.487-115 115s51.487 115 115 115 115-51.487 115-115S325.513 20 262 20ZM127 135C127 60.442 187.442 0 262 0c74.558 0 135 60.442 135 135 0 74.558-60.442 135-135 135-74.558 0-135-60.442-135-135Z"
                />
                <path
                    className="no-results-primary"
                    d="M348.929 224.929c3.905-3.905 10.237-3.905 14.142 0l56.569 56.568c3.905 3.906 3.905 10.237 0 14.143-3.906 3.905-10.237 3.905-14.143 0l-56.568-56.569c-3.905-3.905-3.905-10.237 0-14.142ZM212.929 85.929c3.905-3.905 10.237-3.905 14.142 0l84.853 84.853c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-84.853-84.853c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-results-primary"
                    d="M212.929 185.071c-3.905-3.905-3.905-10.237 0-14.142l84.853-84.853c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-84.853 84.853c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-results-secondary"
                    d="M0 43c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 53 0 48.523 0 43ZM0 89c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 99 0 94.523 0 89ZM0 135c0-5.523 4.477-10 10-10h74c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 181c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 227c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM523 227c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10ZM523 181c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 135c0 5.523-4.477 10-10 10h-74c-5.523 0-10-4.477-10-10s4.477-10 10-10h74c5.523 0 10 4.477 10 10ZM523 89c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 43c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10Z"
                />
            </svg>
            <Box sx={{ mt: 2, color: "gray" }}>No hay resultados</Box>
        </StyledGridOverlay>
    );
}

const CustomNoRowsOverlay = () => {
    return (
        <StyledGridOverlay>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={96} viewBox="0 0 452 257" aria-hidden focusable="false">
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box sx={{ mt: 2, color: "gray" }}>Sin resultados</Box>
        </StyledGridOverlay>
    );
};

export const Points = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const cedula = JSON.parse(localStorage.getItem("cedula"));
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes("vacancy.view_reference")) {
            navigate("/logged/home");
        }
    }, []);

    const getPoints = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}users/get-points/`, {
                method: "GET",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                // assign a unique id to each row based on the order of the data
                data.forEach((element, index) => {
                    element.id = index + 1;
                }, []);
                // move the row with the user's cedula to the first position
                const user = data.find((element) => element.cedula === cedula);
                data.splice(data.indexOf(user), 1);
                data.unshift(user);

                setRows(data);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getPoints();
    }, []);

    const handleOpenDialog = () => setOpenDialog(true);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: "vacantes-referidas",
                        delimiter: ";",
                        utf8WithBom: true,
                    }}
                />
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const columns = [
        {
            field: "id",
            headerName: "Puesto",
            width: 100,
            editable: false,
            type: "number",
            renderCell: (params) => {
                if (params.row.id === 1) return <EmojiEventsIcon sx={{ color: "#ffdc00" }} />;
                else if (params.row.id === 2) return <EmojiEventsIcon sx={{ color: "gray" }} />;
                else if (params.row.id === 3) return <EmojiEventsIcon sx={{ color: "#9c6800" }} />;
                else return `#${params.row.id}`;
            },
        },
        { field: "name", headerName: "Nombre", width: 350, editable: false },
        { field: "area", headerName: "Area", width: 250, editable: false },
        { field: "points", type: "number", headerName: "Numero de puntos", width: 150, editable: false },
    ];

    return (
        <>
            <Container
                sx={{
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Tabla de Clasificación de Puntos C&C
                </Typography>
                <Box sx={{ height: "80vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}>
                        <StyledDataGrid
                            columns={columns}
                        rows={rows}
                        getRowClassName={(params) => `super-app-theme--${params.row.cedula}`}
                        slots={{
                            toolbar: CustomToolbar,
                            noRowsOverlay: CustomNoRowsOverlay,
                            noResultsOverlay: CustomNoResultsOverlay,
                        }}
                    ></StyledDataGrid>
                </Box>
            </Container>

            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Points;
