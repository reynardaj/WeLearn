import { TutorFormData } from "@/types/tutor";

// Key for localStorage
const FORM_STORAGE_KEY = "tutorFormData";

// Initialize default form data
const defaultFormData: TutorFormData = {
  firstName: "",
  lastName: "",
  email: "",
  institute: "",
  profileImage: null,
  introduction: "",
  experience: "",
  specializedSubjects: [],
  certificates: [],
  certificateUrls: [],
  price: 0,
  availability: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
};

// Get form data from localStorage
export function getFormData(): TutorFormData {
  if (typeof window === "undefined") return defaultFormData; // Avoid server-side errors
  const stored = localStorage.getItem(FORM_STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultFormData;
}

// Save form data to localStorage
export function saveFormData(data: Partial<TutorFormData>) {
  if (typeof window === "undefined") return; // Avoid server-side errors
  const currentData = getFormData();
  const updatedData = { ...currentData, ...data };
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updatedData));
}

// Clear form data from localStorage
export function clearFormData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FORM_STORAGE_KEY);
}
