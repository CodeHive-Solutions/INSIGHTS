import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, TextField, Link } from "@mui/material";

const Navbar = () => {
    const menuItems = [
        {
            title: "Formularios",
            url: "/services",
            submenu: [
                {
                    title: "Desempeño con personal a cargo",
                    url: "web-design",
                },
                {
                    title: "Desempeño con cargos gerenciales",
                    url: "web-design",
                },
                {
                    title: "Desempeño laboral sin personal a cargo",
                    url: "web-design",
                },
                {
                    title: "Sub-submenu",
                    url: "web-dev",
                    submenu: [
                        {
                            title: "Sub-suboptions",
                            url: "frontend",
                        },
                        {
                            title: "Sub-suboptions",
                            submenu: [
                                {
                                    title: "Sub-Sub-suboptions",
                                    url: "node",
                                },
                                {
                                    title: "Sub-Sub-suboptions",
                                    url: "php",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            title: "Blog",
            url: "/",
        },
        {
            title: "SGC",
            url: "/",
        },
        {
            title: "Sobre Nosotros",
            url: "/",
        },
    ];

    const Dropdown = ({ submenus, dropdown, depthLevel }) => {
        depthLevel = depthLevel + 1;
        const dropdownClass = depthLevel > 1 ? "dropdown-submenu" : "";
        return (
            <ul className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}>
                {submenus.map((submenu, index) => (
                    <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
                ))}
            </ul>
        );
    };

    const MenuItems = ({ items, depthLevel }) => {
        const [dropdown, setDropdown] = useState(false);
        let ref = useRef();

        useEffect(() => {
            const handler = (event) => {
                if (dropdown && ref.current && !ref.current.contains(event.target)) {
                    setDropdown(false);
                }
            };
            document.addEventListener("mousedown", handler);
            document.addEventListener("touchstart", handler);
            return () => {
                // Cleanup the event listener
                document.removeEventListener("mousedown", handler);
                document.removeEventListener("touchstart", handler);
            };
        }, [dropdown]);

        const onMouseEnter = () => {
            window.innerWidth > 960 && setDropdown(true);
        };

        const onMouseLeave = () => {
            window.innerWidth > 960 && setDropdown(false);
        };

        return (
            <li className="menu-items" ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                {items.submenu ? (
                    <>
                        <button type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"} onClick={() => setDropdown((prev) => !prev)}>
                            {items.title} {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
                        </button>
                        <Dropdown submenus={items.submenu} dropdown={dropdown} depthLevel={depthLevel} />
                    </>
                ) : (
                    <a>{items.title}</a>
                )}
            </li>
        );
    };

    return (
        <header>
            <Box className="nav-area" sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" href="/" className="logo" sx={{ color: "primary" }}>
                    INSIGHTS
                </Typography>
                <nav>
                    <ul className="menus" sx={{ borderRadius: "20px" }}>
                        {menuItems.map((menu, index) => {
                            const depthLevel = 0;
                            return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
                        })}
                    </ul>
                </nav>
            </Box>
        </header>
    );
};

export default Navbar;
