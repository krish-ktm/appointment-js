import { createHeaderSection, createBookingDetails, createImportantNotes } from './components';
import { AppointmentDetails, PatientDetails, MRDetails } from './types';

export function createPatientTemplate(
  appointmentDetails: AppointmentDetails & PatientDetails,
  formattedDate: string,
  translations: any
) {
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    ${createHeaderSection(
      translations.confirmation.title,
      translations.confirmation.subtitle
    )}
    <div style="padding: 48px;">
      ${createBookingDetails(appointmentDetails, formattedDate)}
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">Patient Details</h2>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;">
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.name}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.phone}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.phone}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.age}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.age} years</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.city}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.city}</p>
          </div>
        </div>
      </div>
      ${createImportantNotes({
        title: translations.confirmation.notes.title,
        items: [
          translations.confirmation.notes.arrival,
          translations.confirmation.notes.records,
          translations.confirmation.notes.mask
        ]
      })}
    </div>
  `;

  return container;
}

export function createMRTemplate(
  appointmentDetails: AppointmentDetails & MRDetails,
  formattedDate: string,
  translations: any
) {
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    ${createHeaderSection(
      translations.confirmation.title,
      translations.confirmation.subtitle
    )}
    <div style="padding: 48px;">
      ${createBookingDetails(appointmentDetails, formattedDate)}
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">MR Details</h2>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;">
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.mrName}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.mr_name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.companyName}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.company_name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.divisionName}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.division_name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.contactNo}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.contact_no}</p>
          </div>
        </div>
      </div>
      ${createImportantNotes({
        title: translations.confirmation.notes.title,
        items: [
          translations.confirmation.notes.arrival,
          translations.confirmation.notes.id,
          translations.confirmation.notes.mask
        ]
      })}
    </div>
  `;

  return container;
}