interface TimeSlot {
  from: string;
  to: string;
}

interface AvailabilityData {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

interface Option {
  label: string;
  value: string;
  // Add other properties if your Option type includes more
}

export interface TutorFormData {
  // Step 1
  firstName: string;
  lastName: string;
  institute: string;

  // Step 2
  profileImage: File | string | null;
  introduction: string;
  experience: string;
  specializedSubjects: Option[];
  certificates: File[];
  certificateUrls: string[];

  // Step 3
  price: number;

  // Step 4
  availability: AvailabilityData;
}
