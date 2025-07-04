export interface CompanyInfo {
  name: string;
  website: string;
  founder: string;
  headquarters: string;
  size: string; // "11-50 employees"
  type: string; // "Startup", "Public", etc.
  industry: string;
  founded: string; // Year
  description: string;
  source: string; // Source URL

  // 🔽 Enriched fields
  linkedin?: string;        // LinkedIn company page
  funding?: string;         // e.g. "Series B, $30M"
  revenue?: string;         // Approx. yearly revenue
  valuation?: string;       // If public or available
  ceo?: string;             // CEO name (even if not founder)
  employeeGrowth?: string;  // e.g. "20% YoY", optional
  keyPeople?: string[];     // Other notable executives
  stockSymbol?: string;     // e.g., "GOOG", if listed
  technologies?: string[];  // Stack: "React", "Node.js", "AWS", etc.
  competitors?: string[];   // Similar companies
  categories?: string[];    // e.g., ["HealthTech", "B2C", "Mobile App"]
}

