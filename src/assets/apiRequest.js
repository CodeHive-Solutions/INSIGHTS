const apiRequest = async (url, method, data, contentType) => {
    const hostname = window.location.hostname;
    let path;
    if (hostname === "insights.cyc-bpo.com") {
        path = "https://insights-api.cyc-bpo.com";
    } else {
        path = "https://insights-api-dev.cyc-bpo.com";
    }
    try {
        const response = await fetch(`${path}/${url}`, {
            method,
            credentials: "include",
            headers: { "Content-Type": contentType },
            body: data,
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.detail);
        }

        return responseData;
    } catch (error) {
        throw error;
    }
};

export default apiRequest;
