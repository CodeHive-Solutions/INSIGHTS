const Navbar = () => {
    const menuItems = [
        {
            title: "Home",
            url: "/",
        },
        {
            title: "Services",
            url: "/services",
            submenu: [
                {
                    title: "web design",
                    url: "web-design",
                },
                {
                    title: "web development",
                    url: "web-dev",
                    submenu: [
                        {
                            title: "Frontend",
                            url: "frontend",
                        },
                        {
                            title: "Backend",
                            submenu: [
                                {
                                    title: "NodeJS",
                                    url: "node",
                                },
                                {
                                    title: "PHP",
                                    url: "php",
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "SEO",
                    url: "seo",
                },
            ],
        },
        {
            title: "About",
            url: "/about",
            submenu: [
                {
                    title: "Who we are",
                    url: "who-we-are",
                },
                {
                    title: "Our values",
                    url: "our-values",
                },
            ],
        },
    ];

    return (
        <header>
            <div className="nav-area">
                <a href="/" className="logo">
                    Logo
                </a>
                <nav>
                    <ul className="menus">
                        {menuItems.map((menu, index) => {
                            return (
                                <li className="menu-items" key={index}>
                                    <a href={menu.url}>{menu.title}</a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
