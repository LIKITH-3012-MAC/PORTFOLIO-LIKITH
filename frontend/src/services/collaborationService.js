import CONFIG from './config';

/**
 * Submits collaboration details to the backend API.
 */
export async function submitCollaboration(payload) {
  const response = await fetch(`${CONFIG.API_BASE_URL}/api/collab`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Collaboration API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Countries/States geography mapping data.
 */
export const GEOGRAPHY_DATA = {
  "India": {
    "Andhra Pradesh": {},
    "Arunachal Pradesh": {},
    "Assam": {},
    "Bihar": {},
    "Chhattisgarh": {},
    "Goa": {},
    "Gujarat": {},
    "Haryana": {},
    "Himachal Pradesh": {},
    "Jharkhand": {},
    "Karnataka": {},
    "Kerala": {},
    "Madhya Pradesh": {},
    "Maharashtra": {},
    "Manipur": {},
    "Meghalaya": {},
    "Mizoram": {},
    "Nagaland": {},
    "Odisha": {},
    "Punjab": {},
    "Rajasthan": {},
    "Sikkim": {},
    "Tamil Nadu": {},
    "Telangana": {},
    "Tripura": {},
    "Uttar Pradesh": {},
    "Uttarakhand": {},
    "West Bengal": {},
    "Andaman and Nicobar Islands": {},
    "Chandigarh": {},
    "Dadra and Nagar Haveli and Daman and Diu": {},
    "Delhi": {},
    "Jammu and Kashmir": {},
    "Ladakh": {},
    "Lakshadweep": {},
    "Puducherry": {}
  },
  "USA": {
    "Alabama": {},
    "Alaska": {},
    "Arizona": {},
    "Arkansas": {},
    "California": {},
    "Colorado": {},
    "Connecticut": {},
    "Delaware": {},
    "Florida": {},
    "Georgia": {},
    "Hawaii": {},
    "Idaho": {},
    "Illinois": {},
    "Indiana": {},
    "Iowa": {},
    "Kansas": {},
    "Kentucky": {},
    "Louisiana": {},
    "Maine": {},
    "Maryland": {},
    "Massachusetts": {},
    "Michigan": {},
    "Minnesota": {},
    "Mississippi": {},
    "Missouri": {},
    "Montana": {},
    "Nebraska": {},
    "Nevada": {},
    "New Hampshire": {},
    "New Jersey": {},
    "New Mexico": {},
    "New York": {},
    "North Carolina": {},
    "North Dakota": {},
    "Ohio": {},
    "Oklahoma": {},
    "Oregon": {},
    "Pennsylvania": {},
    "Rhode Island": {},
    "South Carolina": {},
    "South Dakota": {},
    "Tennessee": {},
    "Texas": {},
    "Utah": {},
    "Vermont": {},
    "Virginia": {},
    "Washington": {},
    "West Virginia": {},
    "Wisconsin": {},
    "Wyoming": {}
  },
  "Other": { "Global": { "International": ["Other Region"] } }
};
