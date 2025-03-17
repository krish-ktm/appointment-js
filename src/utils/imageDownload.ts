import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

export async function downloadAppointmentImage(
  appointmentDetails: any,
  type: 'patient' | 'mr',
  translations: any
) {
  // Create a temporary div to render the content
  const container = document.createElement('div');
  container.style.width = '600px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.borderRadius = '12px';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  // Format date
  const appointmentDate = utcToZonedTime(new Date(appointmentDetails.appointment_date), TIMEZONE);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');

  // Create content based on appointment type
  if (type === 'patient') {
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #16a34a; font-size: 24px; margin: 0 0 8px 0;">${translations.confirmation.title}</h1>
        <p style="color: #4b5563; margin: 0; font-size: 16px;">${translations.confirmation.subtitle}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.bookingId}</p>
        <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">#${appointmentDetails.id.slice(-8).toUpperCase()}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.date}</p>
          <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${formattedDate}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.time}</p>
          <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.appointment_time}</p>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px 0;">${translations.confirmation.patientDetails}</h2>
        <div style="display: grid; gap: 12px;">
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.name}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.name}</p>
          </div>
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.phone}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.phone}</p>
          </div>
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.age}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.age} years</p>
          </div>
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.city}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.city}</p>
          </div>
        </div>
      </div>

      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px;">
        <h3 style="color: #065f46; font-size: 16px; margin: 0 0 12px 0;">${translations.confirmation.notes.title}</h3>
        <ul style="color: #047857; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">${translations.confirmation.notes.arrival}</li>
          <li style="margin-bottom: 8px;">${translations.confirmation.notes.records}</li>
          <li style="margin-bottom: 0;">${translations.confirmation.notes.mask}</li>
        </ul>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #16a34a; font-size: 24px; margin: 0 0 8px 0;">${translations.confirmation.title}</h1>
        <p style="color: #4b5563; margin: 0; font-size: 16px;">${translations.confirmation.subtitle}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.bookingId}</p>
        <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">#${appointmentDetails.id.slice(-8).toUpperCase()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.appointmentDate}</p>
        <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${formattedDate}</p>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px 0;">${translations.confirmation.mrDetails}</h2>
        <div style="display: grid; gap: 12px;">
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.mrName}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.mr_name}</p>
          </div>
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.companyName}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.company_name}</p>
          </div>
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.divisionName}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.division_name}</p>
          </div>
          <div>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.contactNo}</p>
            <p style="color: #111827; font-size: 16px; margin: 0;">${appointmentDetails.contact_no}</p>
          </div>
        </div>
      </div>

      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px;">
        <h3 style="color: #065f46; font-size: 16px; margin: 0 0 12px 0;">${translations.confirmation.notes.title}</h3>
        <ul style="color: #047857; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">${translations.confirmation.notes.arrival}</li>
          <li style="margin-bottom: 8px;">${translations.confirmation.notes.id}</li>
          <li style="margin-bottom: 0;">${translations.confirmation.notes.mask}</li>
        </ul>
      </div>
    `;
  }

  // Use html2canvas to convert the div to an image
  const html2canvas = (await import('html2canvas')).default;
  document.body.appendChild(container);
  const canvas = await html2canvas(container, {
    scale: 2,
    backgroundColor: '#ffffff',
  });
  document.body.removeChild(container);

  // Convert canvas to blob
  const blob = await new Promise<Blob>(resolve => {
    canvas.toBlob(blob => resolve(blob!), 'image/png', 1.0);
  });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `appointment-${appointmentDetails.id.slice(-8)}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}