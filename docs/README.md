# Welcome to the INSIGHTS project documentation!

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Table of Contents

- [About](#about)
- [Technologies](#technologies)
- [Features](#features)
- [Usage](#usage)
    - [Frontend](#frontend)
        - [Building the frontend](#building-the-frontend)
        - [File organization](#file-organization)
        - [Code structure](#code-structure)
        - [Potential issues](#potential-issues)
    - [Migration](#migration)
        - [Frontend](#frontend-1)
- [Contributing](#contributing)
- [License](#license)

## About

INSIGHTS is the intranet for C&C Services S.A.S, featuring secure login with Active Directory, a dynamic blog, document management, 'About Us,' and a unique employee birthday profile picture display. The platform also includes utility modules for enhanced productivity and collaboration.

## Technologies

-   **Frontend**: React, Material-UI, Formik, Yup, Pnpm, Vite
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

## Installation

### Frontend:
Pre-requisites:
- Git
- Node.js
- Pnpm

1. Clone the project repository `git clone https://github.com/CodeHive-Solutions/INSIGHTS.git`
2. Go to the project directory `cd INSIGHTS`
3. Install the dependencies by running `pnpm install` (assuming you have pnpm installed)


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

#### Building the frontend:
1. Access the server via SSH
2. Go to the project directory `cd /var/www/INSIGHTS`
3. Run the following command to build the frontend: `pnpm run build && pnpm run postbuild`
4. The files will be built in the `/dist` directory
5. Move the `/dist` directory to the server where the frontend will be hosted
6. The frontend can be served by any web server (e.g. Apache, Nginx)

> Note: The login and other functionalities will not work if the backend is not running, also have in mind that the frontend will point to the development backend server by default unless the frontend URL where is hosted is exactly: `https://intranet.cyc-bpo.com`, this can be change in the `src/assets/getApi.js` file

#### File organization:
- The frontend code is located in the `/src` directory
- The main entry point is the `main.js` file
- The `/images` directory is organized based on the pages where the images are used
- The components are located in the `/src/components` directory
- The `/components` directory is organized as follows:
    - `/common`: Contains common components used throughout the application
    - `/container`: Contains the main container components
    - `/pages`: Contains the main pages of the application
    - `/shared`: Contains shared components used in multiple pages

#### Code structure:
- The code in each component is organized into sections (e.g. imports, javascript functions, another JSX elements part of the main component and the main component return statement)

Example of a component code structure with a shopping cart component:

```javascript
// Import statements
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Helper functions
const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price, 0);
};

// Main component function
const ShoppingCart = ({ initialItems }) => {
  // State hooks
  const [items, setItems] = useState(initialItems);

  // Event handlers
  const addItem = (item) => {
    setItems([...items, item]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // JSX elements part of the main component
  const renderItems = () => {
    return items.map((item, index) => (
      <div key={index}>
        <span>{item.name}</span>
        <button onClick={() => removeItem(index)}>Remove</button>
      </div>
    ));
  };

  // Main return statement
  return (
    <div>
      <h1>Shopping Cart</h1>
      <div>{renderItems()}</div>
      <h2>Total: ${calculateTotal(items)}</h2>
      <button onClick={() => addItem({ name: 'NewItem', price: 10 })}>
        Add Item
      </button>
    </div>
  );
};

// Prop types validation
ShoppingCart.propTypes = {
  initialItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ShoppingCart;

```

#### Potential issues:
- If the frontend is not working as expected, check the browser console for any errors
- If the frontend is not connecting to the backend, check the backend URL in the `getApi.js` file
- If the frontend is not updating, check the terminal for any errors when running the `pnpm run dev` command
- If the frontend is not displaying the correct data, check the API response in the browser console
- If the frontend is not displaying the correct styles, check the CSS files and the Material-UI components
- If the frontend is not displaying the correct images, check the image paths in the code
- If the frontend is not displaying the correct components, check the component imports and exports
- If the frontend is not displaying the correct pages, check the page routes in the `main.js` file
- If there are issues with the routes, double-check that you built the frontend correctly with the `pnpm run build` and `pnpm run postbuild` commands, this because the `postbuild` script is used to copy the `.htaccess` file to the `/dist` directory (this file is used to handle the routes correctly in the web server)

> Note: If the web server is not working as expected, check the server logs `/var/log/apache2/error.log` for any errors and the status of the web server service `sudo systemctl status apache2` also have in mind that working with React Router (library to handle the routes) and Apache can be tricky, you may need to ensure that your apache configuration file has the following configuration to avoid issues with the routes:

```apache
<Directory "path/to/the/dist/directory">
    AllowOverride All
</Directory>
```

### Backend:

#### Pre-requisites:
- Install Python 3.10 or higher and pip
- Go to the project directory `cd /your/path/INSIGHTS/INSIGHTSAPI`

#### Installation:
1. Get the project from the repository `git clone https://github.com/CodeHive-Solutions/INSIGHTS.git`
2. Go to the API directory `cd INSIGHTS/INSIGHTSAPI`
3. Install the dependencies by running `pip install -r requirements.txt`
4. Create a `.env` file with the following environment variables:
    ```
    SECRET_KEY=your_secret_key
    DEBUG=True (for development)
    ALLOWED_HOSTS=YOUR_SERVER_IP or your_domain (e.g. "intranet.cyc-bpo.com, localhost")
    ADMINS=your_name and your_email (e.g. "John Doe:john@example.com, Jane Smith:jane@example.com")
    SERVER_EMAIL=The email that will be used to send emails
    EMAIL_HOST=your.smtp.server.com
    EMAIL_PORT=your smtp port usually 587
    EMAIL_HOST_PASSWORD=your smtp password
    EMAILS_ETHICAL_LINE= List of emails separated by commas that will receive the emails (e.g. "email1@example.com", "email2@example.com", etc)
    EMAIL_FOR_TEST=The email that will receive the test emails (e.g. "email@example.com")
    TEST_CEDULA=The cedula that will be used for testing purposes (It have to be register in StaffNet) (e.g. "123456789")
    SERVER_DB=YOUR_DB_SERVER_IP (e.g. "173.16.0.22")
    INSIGHTS_DB_PASS=YOUR_DB_PASSWORD (e.g. "password")
    AdminLDAPPassword=YOUR_LDAP_PASSWORD (e.g. "password")
    ```
5. In the `settings.py` file, change the `ENV_PATH` variable to the path of the `.env` file
6. Run the following command to realize the migrations: `python manage.py migrate`
7. Verify that all has been set up correctly by running the following command: `python manage.py test`
8. Run the following command to start the backend server: `python manage.py runserver`
9. The backend server will start running on port 8000 that is to say, you can access the backend by going to `http://server_ip:8000`

## Migration

### Frontend:
In case you need to migrate the project to another server, follow these steps:
1. Clone the project repository to the new server
2. Install the dependencies by running `pnpm install` (assuming you have pnpm installed)

## License

This project is licensed under the [MIT License](LICENSE).
