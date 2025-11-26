# HomeCare Admin & Provider Dashboard

A comprehensive home-care medical services platform with separate Admin and Provider dashboards built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### Authentication System
- Role-based login (Admin & Provider)
- JWT-based token management
- Secure session handling
- Protected routes by user role
- Provider registration with multi-step form validation

### Admin Dashboard
- **Provider Management**: View, search, filter, and manage all providers
- **Approval Workflow**: Approve, reject, or reset provider registrations
- **Provider Details**: View complete provider credentials and practice information
- **Statistics Dashboard**: Real-time provider status overview
- **Settings**: System configuration and notification preferences

### Provider Dashboard
- **Profile Management**: View and edit professional credentials
- **Appointment Management**: Accept/reject appointment requests
- **Availability Management**: Set working hours and availability
- **Account Settings**: Password management and preferences
- **Status Tracking**: Monitor approval status in real-time

## User Credentials (Demo)

### Admin Account
- **Email**: admin@homecare.com
- **Password**: admin123

### Provider Account
- **Email**: provider@homecare.com
- **Password**: provider123

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx                 # Root layout with auth provider
│   ├── page.tsx                   # Login page
│   ├── register/
│   │   └── page.tsx              # Provider registration
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── providers/
│   │   │   ├── page.tsx          # Providers list
│   │   │   └── [id]/page.tsx     # Provider detail
│   │   └── settings/page.tsx     # Admin settings
│   └── provider/
│       ├── layout.tsx            # Provider layout
│       ├── page.tsx              # Provider dashboard
│       ├── profile/
│       │   ├── page.tsx          # View profile
│       │   └── edit/page.tsx     # Edit profile
│       ├── appointments/page.tsx # Appointments
│       └── settings/page.tsx     # Provider settings
├── components/
│   ├── login-form.tsx            # Login form component
│   ├── provider-registration-form.tsx
│   ├── provider-table.tsx        # Admin provider table
│   ├── sidebar-nav.tsx           # Navigation sidebar
│   ├── protected-route.tsx       # Route protection
│   └── ui/                       # ShadCN UI components
├── lib/
│   ├── auth-context.tsx          # Authentication context
│   ├── types.ts                  # TypeScript types
│   ├── data-schema.ts            # JSON schema
│   └── utils.ts                  # Utility functions
└── globals.css                   # Global styles & theme

\`\`\`

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **State Management**: React Context API
- **Storage**: Local Storage (JSON-based demo)
- **Authentication**: JWT tokens (demo implementation)

## Provider Registration Fields

The registration form collects the following information:

### Basic Information
- Full Name
- Professional Email
- Phone Number
- Password & Confirmation

### Medical Information
- Medical Specialty
- Medical License ID
- NPI Number
- Years of Experience
- Credentials
- Qualifications & Certifications

### Practice Information
- Country
- Consultation Fee (USD)
- Practice Address
- Professional Bio
- Services Offered (Consultation, Follow-up, Home Checkup, etc.)

## Provider Schema

\`\`\`json
{
  "id": "unique-provider-id",
  "fullName": "Dr. John Doe",
  "email": "john@hospital.com",
  "phone": "+1 (555) 000-0000",
  "medicalSpecialty": "Cardiologist",
  "medicalLicenseID": "LIC-123456",
  "npiNumber": "1234567890",
  "credentials": "MD, Board Certified",
  "country": "United States",
  "yoe": "10",
  "qualificationsCertifications": "Harvard Medical School, Board Certified",
  "bio": "Professional biography...",
  "servicesOffered": ["Consultation", "Follow-up Visit", "Home Checkup"],
  "consultationFee": "100",
  "practiceAddress": "123 Medical St, City, State, 12345",
  "status": "approved",
  "createdAt": "2025-01-10T12:00:00Z"
}
\`\`\`

## Getting Started

1. **Install Dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

2. **Run Development Server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

3. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - Login with demo credentials above

## Key Features Implementation

### Authentication Flow
1. User selects role (Admin/Provider) and enters credentials
2. System validates against demo database
3. JWT token created and stored in localStorage
4. User redirected to appropriate dashboard
5. All routes protected by role verification

### Approval Workflow
1. New providers register with complete credentials
2. Admin reviews pending provider applications
3. Admin can approve, reject, or request more information
4. Provider status updates in real-time
5. Approved providers can activate services

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Adaptive grid layouts
- Touch-friendly controls
- Optimized for all screen sizes

## Demo Data Storage

Currently using localStorage for demo purposes. In production, replace with:
- **Backend Database**: PostgreSQL, MongoDB, or Firebase
- **Authentication Service**: Auth0, Supabase Auth, or Firebase Auth
- **API Layer**: RESTful or GraphQL backend

## Future Enhancements

- Real-time appointment notifications
- Video consultation integration
- Payment processing (Stripe)
- Email notifications
- Document upload & verification
- Analytics dashboard
- Multi-language support
- Dark mode

## Security Considerations

For production deployment:
- Implement proper JWT handling with expiry
- Use secure password hashing (bcrypt)
- Enable CORS properly
- Add rate limiting
- Implement audit logging
- Use HTTPS only
- Add CSRF protection
- Validate all inputs server-side
