import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect, Dispatch, SetStateAction } from "react";
import {
  CityInfoType,   
  CountryInfoType,
  StateInfoType,
} from "../../types/types";

export default function SelectCountryStateCity({
  selectedCountry,
  selectedState,
  selectedCity,
  setSelectedCountry,
  setSelectedState,
  setSelectedCity,
  forEditClient,
  countryString,
  stateString,
  cityString,
}: {
  selectedCountry: CountryInfoType;
  selectedState: StateInfoType;
  selectedCity: CityInfoType;
  setSelectedCountry: Dispatch<SetStateAction<CountryInfoType>>;
  setSelectedState: Dispatch<SetStateAction<StateInfoType>>;
  setSelectedCity: Dispatch<SetStateAction<CityInfoType>>;
  forEditClient: boolean;
  countryString: string;
  stateString: string;
  cityString: string | undefined;
}) {
  
  const countriesArr: CountryInfoType[] = Country.getAllCountries().map(
    (country) => ({
      name: country.name,
      isoCode: country.isoCode,
      flag: country.flag,
      phonecode: country.phonecode,
      currency: country.currency,
      latitude: country.latitude,
      longitude: country.longitude,
    })
  );
  const statesArr: StateInfoType[] = State?.getStatesOfCountry(
    selectedCountry?.isoCode
  ).map((state) => ({
    name: state.name,
    isoCode: state.isoCode,
    countryCode: state.countryCode,
  }));
  const citiesArr: CityInfoType[] = City.getCitiesOfState(
    selectedState?.countryCode,
    selectedState?.isoCode
  ).map((city) => ({
    name: city.name,
    countryCode: city.countryCode,
    stateCode: city.stateCode,
  }));
  console.log("Cities for state:", selectedState?.name, citiesArr);

  useEffect(() => {
    if (forEditClient) {
      if (!selectedCountry.name && countryString) {
        const country = countriesArr.find((c) => c.name === countryString);
        country && setSelectedCountry(country);
      }
      if (!selectedState.name && stateString && selectedCountry?.isoCode) {
        const state = statesArr.find((s) => s.name === stateString);
        state && setSelectedState(state);
      }
      if (
        !selectedCity.name &&
        cityString &&
        selectedState?.isoCode &&
        citiesArr.length > 0
      ) {
        const city = citiesArr.find((c) => c.name === cityString);
        city && setSelectedCity(city);
      }
    }
  }, [
    forEditClient,
    countryString,
    stateString,
    cityString,
    selectedCountry,
    selectedState,
    selectedCity,
    citiesArr,
  ]);

  return (
    <div className="my-2 flex flex-col">
      <label className="text-xs py-1 opacity-60">
        {/* {/* Country: <b>{countryString}</b> */}
        Country <span className="text-black-500">*</span>: <b>{countryString}</b> 
      </label>
      <Select
        options={countriesArr}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.name}
        value={selectedCountry.name ? selectedCountry : null}
        onChange={(item) => {
          if (item) {
            setSelectedCountry(item);
            setSelectedState({} as StateInfoType); 
            setSelectedCity({} as CityInfoType); 
          }
        }}
        filterOption={(option, inputValue) =>
          option.label.toLowerCase().startsWith(inputValue.toLowerCase())
        }
        placeholder="Select Country"
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
      <label className="text-xs py-1 opacity-60">
        State: <b>{stateString}</b>
      </label>
      <Select
        options={statesArr}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.name}
        value={selectedState.name ? selectedState : null}
        onChange={(item) => {
          if (item) {
            setSelectedState(item);
            setSelectedCity({} as CityInfoType); 
          }
        }}
        filterOption={(option, inputValue) =>
          option.label.toLowerCase().startsWith(inputValue.toLowerCase())
        }
        placeholder="Select State" 
        menuPortalTarget={document.body} 
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
      <label className="text-xs py-1 opacity-60">
        City : <b>{cityString}</b>{" "}
      </label>
      <Select
        options={citiesArr}
        getOptionLabel={(options) => options.name}
        getOptionValue={(options) => options.name}
        value={selectedCity.name ? selectedCity : null} 
        onChange={(item) => {
          if (item) {
            setSelectedCity(item);
          }
        }}
        filterOption={(option, inputValue) =>
          option.label.toLowerCase().startsWith(inputValue.toLowerCase())
        }
        placeholder="Select City" 
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
}

