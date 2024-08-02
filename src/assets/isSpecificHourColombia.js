const isSpecificHourColombia = (hour) => {
        // Get the current time in the Colombia timezone
        const colombiaTime = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });
        const currentTimeColombia = new Date(colombiaTime);

        // Check if the current hour matches the specified hour
        const isMatch = currentTimeColombia.getHours() >= hour;

        return isMatch;
}
export default isSpecificHourColombia;