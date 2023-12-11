// getApi.js
export const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === "insights.cyc-bpo.com") {
        return "https://insights-api.cyc-bpo.com/";
    } else if (hostname === "insights-dev.cyc-bpo.com") {
        return "https://insights-api-dev.cyc-bpo.com/";
    } else {
        return "https://insights-api-dev.cyc-bpo.com/";
    }
};
