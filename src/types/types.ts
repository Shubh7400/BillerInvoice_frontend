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
  contactNo: string;
}

export interface FileData {
  name: string;
  file: File;
  url: string;
}
export interface UploadedFile {
  filename: string;
  url: string;
  imageUrl:string;
}
export interface ProjectType {
  _id?: string;
  projectName: string;
  rate?: number | null;
  workingPeriodType: "hours" | "months" | "fixed";
  currencyType: "rupees" | "dollars" | "pounds";
  conversionRate: number;
  paymentStatus: boolean;
  adminId: string;
  clientId: string;
  amount?: number | null;
  advanceAmount?: number | null;
  workingPeriod?: number | null;
  ratePerDay?: number |null;  
  paymentCycle?: string | undefined;
  billingCycle?:string | undefined;
  technology?:string | undefined;
  paidLeave?:number | undefined;
  timeSheet?:string | undefined;
  candidateName?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  files?: FileData[]; 
  fileUrls?: string[];
  uploadedFiles?: UploadedFile[];
}
export interface UpdateProjectDataType {
  _id?: string;
  projectName?: string;
  rate?: number | null;
  workingPeriodType: "hours" | "months" | "fixed";
  currencyType: "rupees" | "dollars" | "pounds";
  conversionRate?: number;
  paymentStatus?: boolean;
  adminId: string;
  clientId: string;
  workingPeriod?:number| null;
  amount?: number | null;
  advanceAmount?: number | null;
  paymentCycle?: string | undefined;
  billingCycle?:string | undefined;
  technology?:string | undefined;
  paidLeave?:number | undefined;
  timeSheet?:string | undefined;
  candidateName?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  files?: FileData[]; 
  fileUrls?: string[];
  uploadedFiles?: UploadedFile[];
}
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ClientDetails {
  clientName: string;
  gistin: string;
  pancardNo: string;
  address: Address;
  email: string[];
}

export interface AdminDetails {
  email: string;
  companyName: string;
  gistin: string;
  contactNo: string;
  pancardNo: string;
  address: Address;
  companyLogo?: string;
  accountNo: string;
  ifsc: string;
  bank: string;
}

export interface InvoiceType {
  invoiceNo: number;
  billDate: string;
  dueDate: string;
  amountWithoutTax: number;
  amountAfterTax: number;
  clientId: string;
  adminId: string;
  projectsId: string[];
  taxType: string;
  taxAmount:number;
  grandTotal?:number;
  projectName: string;
  rate?: number | null;
  workingPeriodType: "hours" | "months" | "fixed";
  currencyType: "rupees" | "dollars" | "pounds";
  conversionRate: number;
  paymentStatus: boolean;
  amount?: number | null;
  advanceAmount?: number | null;
  workingPeriod?: number | null;
  ratePerDay?: number |null;  
  contactNo?:string;
  files?: FileData[];
  fileUrls?: string[];
  uploadedFiles?: UploadedFile[];
   clientDetails?: ClientDetails;
  adminDetails?: AdminDetails;
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
