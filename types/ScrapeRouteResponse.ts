import { CompanyInfo } from "@/types/CompanyInfo";

export type ScrapeRouteResponse =
  | {
      success: true;
      data: CompanyInfo | CompanyInfo[];
      timestamp: string;
      inputType: string;
      originalInput: string;
    }
  | {
      success: false;
      error: string;
    };
