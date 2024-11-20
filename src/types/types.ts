import { E164Number } from "libphonenumber-js/core";

export interface AdminType {
  _id?: string;
  companyName: string;
  companyLogo: string;
  email: string;
  password: string;
  gistin: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactNo: string;
  pancardNo: string;
  invoiceNo: number;
  accountNo: string;
  ifsc: string;
  bank: string;
}
export interface ClientType {
  _id?: string;
  clientName: string;
  email: string[] ;
  pancardNo: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  gistin: string;
  user: string;
  sameState?: boolean;
}
export interface ProjectType {
  _id?: string;
  projectName: string;
  rate?: number | null;
  workingPeriodType: "hours" | "days" | "fixed";
  currencyType: "rupees" | "dollars" | "pounds";
  conversionRate: number;
  paymentStatus: boolean;
  adminId: string;
  clientId: string;
  amount?: number | null;
}
export interface UpdateProjectDataType {
  _id: string;
  projectName?: string;
  projectManager?: string;
  rate?: number;
  projectPeriod?: number;
  workingPeriod?: string | null;
  workingPeriodType?: "hours" | "months";
  currencyType?: "rupees" | "dollars" | "pounds";
  conversionRate?: number;
  paymentStatus?: boolean;
  adminId: string;
  clientId: string;
  amount?: number | null;
}
export interface InvoiceType {
  _id?: string;
  invoiceNo: number;
  billDate: string;
  dueDate: string;
  amountWithoutTax: number;
  amountAfterTax: number;
  clientId: string;
  adminId: string;
  projectsId: string[];
}

export interface LoginDataType {
  email: string;
  password: string;
}
export interface DecodedTokenDataType {
  id: string;
  exp: number;
  iat: number;
}
export type CountryInfoType = {
  name: string;
  isoCode: string;
  flag: string;
  phonecode: string;
  currency: string;
  latitude: string;
  longitude: string;
  timezones?: [] | undefined;
};
export type StateInfoType = {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude?: string;
  longitude?: string;
};
export type CityInfoType = {
  name: string;
  countryCode: string;
  stateCode: string;
  // latitude?: string;
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
};

export type NewPasswordType = {
  newPassword: string;
  confirmNewPassword: string;
};
