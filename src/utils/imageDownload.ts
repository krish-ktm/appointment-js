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
  container.style.width = '800px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.borderRadius = '16px';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  // Format date
  const appointmentDate = utcToZonedTime(new Date(appointmentDetails.appointment_date), TIMEZONE);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');

  // Create content based on appointment type
  if (type === 'patient') {
    container.innerHTML = `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
        border-radius: 16px 16px 0 0;
        z-index: 0;
      "></div>

      <div style="position: relative; z-index: 1;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
          ">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 7L9 18l-5-5"></path>
            </svg>
          </div>
          <h1 style="color: white; font-size: 32px; margin: 0 0 8px 0; font-weight: 600;">${translations.confirmation.title}</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 18px;">${translations.confirmation.subtitle}</p>
        </div>

        <div style="
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 32px;
          margin-bottom: 24px;
        ">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="
              background-color: #f0fdf4;
              padding: 12px;
              border-radius: 12px;
            ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <p style="color: #374151; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.bookingId}</p>
              <p style="color: #16a34a; font-size: 20px; font-weight: 600; margin: 0;">#${appointmentDetails.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.date}</p>
              <p style="color: #111827; font-size: 18px; font-weight: 500; margin: 0;">${formattedDate}</p>
            </div>
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.timeSlot}</p>
              <p style="color: #111827; font-size: 18px; font-weight: 500; margin: 0;">${appointmentDetails.appointment_time}</p>
            </div>
          </div>

          <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px;">
            <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">${translations.confirmation.patientDetails}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.name}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.name}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.phone}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.phone}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.age}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.age} years</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.city}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.city}</p>
              </div>
            </div>
          </div>
        </div>

        <div style="
          background-color: #f0fdf4;
          border: 1px solid #dcfce7;
          padding: 24px;
          border-radius: 12px;
        ">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="8"></line>
            </svg>
            <h3 style="color: #16a34a; font-size: 18px; font-weight: 600; margin: 0;">${translations.confirmation.notes.title}</h3>
          </div>
          <ul style="color: #166534; margin: 0; padding-left: 24px; font-size: 15px; line-height: 1.6;">
            <li style="margin-bottom: 8px;">${translations.confirmation.notes.arrival}</li>
            <li style="margin-bottom: 8px;">${translations.confirmation.notes.records}</li>
            <li style="margin-bottom: 0;">${translations.confirmation.notes.mask}</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
        border-radius: 16px 16px 0 0;
        z-index: 0;
      "></div>

      <div style="position: relative; z-index: 1;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
          ">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 7L9 18l-5-5"></path>
            </svg>
          </div>
          <h1 style="color: white; font-size: 32px; margin: 0 0 8px 0; font-weight: 600;">${translations.confirmation.title}</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 18px;">${translations.confirmation.subtitle}</p>
        </div>

        <div style="
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 32px;
          margin-bottom: 24px;
        ">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="
              background-color: #f0fdf4;
              padding: 12px;
              border-radius: 12px;
            ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <p style="color: #374151; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.bookingId}</p>
              <p style="color: #16a34a; font-size: 20px; font-weight: 600; margin: 0;">#${appointmentDetails.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.appointmentDate}</p>
            <p style="color: #111827; font-size: 18px; font-weight: 500; margin: 0;">${formattedDate}</p>
          </div>

          <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px;">
            <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">${translations.confirmation.mrDetails}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.mrName}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.mr_name}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.companyName}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.company_name}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.divisionName}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.division_name}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.contactNo}</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0;">${appointmentDetails.contact_no}</p>
              </div>
            </div>
          </div>
        </div>

        <div style="
          background-color: #f0fdf4;
          border: 1px solid #dcfce7;
          padding: 24px;
          border-radius: 12px;
        ">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="8"></line>
            </svg>
            <h3 style="color: #16a34a; font-size: 18px; font-weight: 600; margin: 0;">${translations.confirmation.notes.title}</h3>
          </div>
          <ul style="color: #166534; margin: 0; padding-left: 24px; font-size: 15px; line-height: 1.6;">
            <li style="margin-bottom: 8px;">${translations.confirmation.notes.arrival}</li>
            <li style="margin-bottom: 8px;">${translations.confirmation.notes.id}</li>
            <li style="margin-bottom: 0;">${translations.confirmation.notes.mask}</li>
          </ul>
        </div>
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