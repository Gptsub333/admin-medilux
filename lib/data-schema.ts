// JSON Schema for Provider model - for reference and documentation

export const providerSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Provider",
  description: "Healthcare provider profile",
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Unique provider identifier",
    },
    fullName: {
      type: "string",
      description: "Provider full name",
    },
    email: {
      type: "string",
      format: "email",
      description: "Professional email address",
    },
    phone: {
      type: "string",
      description: "Phone number",
    },
    password: {
      type: "string",
      description: "Hashed password (not stored in schema)",
    },
    medicalSpecialty: {
      type: "string",
      description: "Medical specialty (e.g., Cardiologist, Pediatrician)",
    },
    medicalLicenseID: {
      type: "string",
      description: "Medical license ID",
    },
    npiNumber: {
      type: "string",
      description: "National Provider Identifier",
    },
    credentials: {
      type: "string",
      description: "Medical credentials (e.g., MD, Board Certified)",
    },
    country: {
      type: "string",
      description: "Country of practice",
    },
    yoe: {
      type: "string",
      description: "Years of experience",
    },
    qualificationsCertifications: {
      type: "string",
      description: "Qualifications and certifications",
    },
    bio: {
      type: "string",
      description: "Professional biography",
    },
    servicesOffered: {
      type: "array",
      items: {
        type: "string",
      },
      description: "List of services offered (e.g., Consultation, Home Checkup)",
    },
    consultationFee: {
      type: "string",
      description: "Consultation fee in USD",
    },
    practiceAddress: {
      type: "string",
      description: "Practice address",
    },
    status: {
      type: "string",
      enum: ["pending", "approved", "rejected"],
      description: "Provider approval status",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Account creation timestamp",
    },
    profileImage: {
      type: "string",
      description: "Profile image URL (optional)",
    },
  },
  required: [
    "id",
    "fullName",
    "email",
    "phone",
    "medicalSpecialty",
    "medicalLicenseID",
    "npiNumber",
    "country",
    "yoe",
    "servicesOffered",
    "consultationFee",
    "practiceAddress",
    "status",
    "createdAt",
  ],
}
