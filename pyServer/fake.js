import truecallerjs from "truecallerjs";

async function performTruecallerSearch(phoneNumber) {
    const searchData = {
        number: phoneNumber,
        countryCode: "IN",
        installationId: "your_installation_id"
    };

    try {
        const response = await truecallerjs.search(searchData);
        console.log(response.json());
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

performTruecallerSearch("9912345678");