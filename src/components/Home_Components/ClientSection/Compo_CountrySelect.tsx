// import { getCode, getName } from "country-list";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  CityInfoType,
  CountryInfoType,
  StateInfoType,
} from "../../../types/types";

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
  cityString: string;
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

  useEffect(() => {
    if (forEditClient) {
      // Set selected country if it's not already set
      if (!selectedCountry.name && countryString) {
        const country = countriesArr.find((c) => c.name === countryString);
        if (country) setSelectedCountry(country);
      }

      // Set selected state if it's not already set
      if (!selectedState.name && stateString && selectedCountry?.isoCode) {
        const state = statesArr.find((s) => s.name === stateString);
        if (state) setSelectedState(state);
      }

      // Set selected city if it's not already set
      if (!selectedCity.name && cityString && selectedState?.isoCode) {
        const city = citiesArr.find((c) => c.name === cityString);
        if (city) setSelectedCity(city);
      }
    }
  }, [
    forEditClient,
    countryString,
    stateString,
    cityString,
    countriesArr,
    statesArr,
    citiesArr,
  ]);

  return (
    <div className="my-2 flex flex-col">
      <label className="text-xs py-1 opacity-60">
        Country: <b>{countryString}</b>
      </label>
      <Select
        options={countriesArr}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.name}
        value={selectedCountry.name ? selectedCountry : null}
        onChange={(item) => {
          if (item) {
            setSelectedCountry(item);
            setSelectedState({} as StateInfoType); // Reset state when country changes
            setSelectedCity({} as CityInfoType); // Reset city when country changes
          }
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
            setSelectedCity({} as CityInfoType); // Reset city when state changes
          }
        }}
      />
      <label className="text-xs py-1 opacity-60">
        City : <b>{cityString}</b>{" "}
      </label>
      <Select
        options={citiesArr}
        getOptionLabel={(options) => {
          return options["name"];
        }}
        getOptionValue={(options) => {
          return options["name"];
        }}
        value={selectedCity}
        onChange={(item) => {
          if (item) {
            setSelectedCity(item);
          }
        }}
      />
    </div>
  );
}
