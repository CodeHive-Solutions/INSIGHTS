// getApi.js
export const getApiUrl = (staffnet) => {
    const hostname = window.location.hostname;
    const mapping = {
        'intranet.cyc-bpo.com': {
            staffnet: 'https://staffnet-api.cyc-bpo.com/',
            nonStaffnet: 'https://insights-api.cyc-bpo.com/',
            environment: 'production',
        },
        'insights-dev.cyc-bpo.com': {
            staffnet: 'https://staffnet-api-dev.cyc-bpo.com/',
            nonStaffnet: 'https://insights-api-dev.cyc-bpo.com/',
            environment: 'development',
        },
    };

    const defaultMapping = {
        staffnet: 'https://staffnet-api-dev.cyc-bpo.com/',
        nonStaffnet: 'https://insights-api-dev.cyc-bpo.com/',
        environment: 'development',
    };

    const config = mapping[hostname] || defaultMapping;
    const apiUrl = staffnet ? config.staffnet : config.nonStaffnet;
    const environment = config.environment;

    return { apiUrl, environment };
};
