export const getCountryByIP = async (ipAddress) => {
    try {
        const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        const data = await response.json();
        return data.country_name;
    } catch (error) {
        console.error("Error fetching country by IP:", error);
        return null; // Or throw an error if needed
    }
};