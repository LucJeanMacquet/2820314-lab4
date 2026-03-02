const input = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {
    if (!countryName) return;

    try {
        
        errorMessage.textContent = "";
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";

        
        spinner.classList.remove("hidden");

      
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

    
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                    </div>
                `;
            }
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = "Error: Unable to find that country.";
    } finally {
        
        spinner.classList.add("hidden");
    }
}

searchBtn.addEventListener("click", () => {
    searchCountry(input.value.trim());
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchCountry(input.value.trim());
    }
});
