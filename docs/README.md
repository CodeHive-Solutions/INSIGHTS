# Welcome to the INSIGHTS project documentation!

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Table of Contents

- [About](#about)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About

INSIGHTS is the intranet for C&C Services S.A.S, featuring secure login with Active Directory, a dynamic blog, document management, 'About Us,' and a unique employee birthday profile picture display. The platform also includes utility modules for enhanced productivity and collaboration.

## Technologies

-   **Frontend**: React, Material-UI, Formik, Yup, Pnpm
-   **Backend**: Django, Django REST Framework
-   **Authentication**: JWT, Active Directory, LDAP
-   **Database**: MySQL, Redis
-   **Deployment**: Linux, Docker, Apache, Gunicorn

## Features

-   Login and registration system with sessions and cookies
-   Dynamic blog with a storage article system
-   Secure authentication with Active Directory and LDAP
-   Data tables with CRUD operations, modularity and dinamicity
-   Connection to different APIs and services at the same time
-   User-friendly interface with Material-UI components and Formik forms
-   Vacancies and job applications management
-   Employee birthday profile picture display
-   Document management system with file upload and download capabilities
-   'About Us' page with company information and contact details
-   Utility modules for enhanced productivity and collaboration
-   Job certifications and Payrolls detachments
-   Implementing a comprehensive suite of over one hundred tests to rigorously validate the functionality and performance of the application

## Usage

### Frontend:
Pre-requisites:
- Access to the server where the project is hosted

1. Access the server via SSH
2. Go to the project directory `cd /var/www/INSIGHTS`
3. Run the following command to start the frontend server: `pnpm run dev`
4. The frontend server will start running on port 8000 that is to say, you can access the frontend by going to `http://server_ip:8000`
5. The frontend server will automatically update when changes are made to the code
6. To stop the frontend server, press `Ctrl + C`

Building the frontend:
1. Access the server via SSH
2. Go to the project directory `cd /var/www/INSIGHTS`
3. Run the following command to build the frontend: `pnpm run build && pnpm run postbuild`
4. The files will be built in the `/dist` directory
5. Move the `/dist` directory to the server where the frontend will be hosted
6. The frontend can be served by any web server (e.g. Apache, Nginx)
> Note: The login and other functionalities will not work if the backend is not running, also have in mind that the frontend will point to the development backend server by default unless the frontend URL where is hosted is exactly: `https://intranet.cyc-bpo.com`, this can be change in the `src/assets/getApi.js` file.

## Migration
In case you need to migrate the project to another server, follow these steps:
1. Clone the project repository to the new server
2. Install the dependencies by running `pnpm install` (assuming you have pnpm installed)


## Contributing

Specify guidelines for contributing to your project, if applicable.

## License

This project is licensed under the [MIT License](LICENSE).
