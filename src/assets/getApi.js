// getApi.js
export const getApiUrl = (staffnet) => {
    const hostname = window.location.hostname;
    if (staffnet && hostname === "intranet.cyc-bpo.com") {
        return "https://staffnet-api.cyc-bpo.com/"
    } else if (staffnet && hostname === "insights-dev.cyc-bpo.com") {
        return "https://staffnet-api-dev.cyc-bpo.com/"
    } else if (staffnet) {
        return "https://staffnet-api-dev.cyc-bpo.com/"
    } else if (hostname === "intranet.cyc-bpo.com") {
        return "https://insights-api.cyc-bpo.com/";
    } else if (hostname === "insights-dev.cyc-bpo.com") {
        return "https://insights-api-dev.cyc-bpo.com/";
    } else {
        return "https://insights-api-dev.cyc-bpo.com/";
    }
};
