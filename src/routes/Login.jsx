import { Box, Typography, Button, TextField, Link } from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import login_image from "../images/login_image.avif";

const Login = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <Box
                sx={{
                    height: "100vh",
                    width: "65%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${login_image})`,
                    clipPath: "polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)",
                }}
            ></Box>
            <Box
                sx={{
                    width: "35%",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        width: "100%",
                        height: "30%",
                        paddingRight: "15px",
                    }}
                >
                    <Typography variant="h6">INSIGHTS</Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "15px",
                    }}
                >
                    <Typography sx={{ fontWeight: 500 }} variant="h4">
                        Iniciar Sesion
                    </Typography>

                    <TextField
                        sx={{ width: "330px" }}
                        label="Usuario"
                        variant="outlined"
                        autoComplete="off"
                        spellCheck={false}
                    ></TextField>

                    <TextField
                        sx={{ width: "330px" }}
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        autoComplete="off"
                        spellCheck={false}
                    ></TextField>

                    <Box sx={{ width: "330px" }}>
                        <Link>Has olvidado tu contraseña?</Link>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<LoginOutlinedIcon />}
                    >
                        Iniciar Sesion
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        width: "100%",
                        height: "35%",
                        paddingRight: "15px",
                    }}
                >
                    <Typography variant="subtitle2">
                        C&C SERVICES © - Bogotá D.C. / Colombia.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
