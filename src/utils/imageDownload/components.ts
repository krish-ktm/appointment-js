import { AppointmentDetails } from './types';

export function createHeaderSection(title: string, subtitle: string) {
  return `
    <div style="
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      padding: 48px;
      color: white;
      text-align: center;
    ">
      <div style="
        width: 80px;
        height: 80px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px auto;
      ">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M20 7L9 18l-5-5"></path>
        </svg>
      </div>
      <h1 style="font-size: 32px; margin: 0 0 8px 0; font-weight: 600;">${title}</h1>
      <p style="font-size: 18px; margin: 0; opacity: 0.9;">${subtitle}</p>
    </div>
  `;
}

export function createBookingDetails(appointmentDetails: AppointmentDetails, formattedDate: string, translations: any) {
  return `
    <div style="
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      padding: 32px;
      margin-bottom: 24px;
    ">
      <div style="display: flex; items-center; gap: 16px; margin-bottom: 24px;">
        <div style="
          background-color: #f0fdf4;
          padding: 12px;
          border-radius: 12px;
          flex-shrink: 0;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div style="flex-grow: 1;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.bookingId}</p>
          <p style="color: #16a34a; font-size: 20px; font-weight: 600; margin: 0;">#${appointmentDetails.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-bottom: 24px;">
        <div>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.date}</p>
          <p style="color: #111827; font-size: 18px; font-weight: 500; margin: 0;">${formattedDate}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.time}</p>
          <p style="color: #111827; font-size: 18px; font-weight: 500; margin: 0;">${appointmentDetails.appointment_time}</p>
        </div>
      </div>
    </div>
  `;
}

export function createImportantNotes(notes: { title: string; items: string[] }) {
  return `
    <div style="
      background-color: #f0fdf4;
      border: 1px solid #dcfce7;
      padding: 24px;
      border-radius: 12px;
    ">
      <h3 style="color: #16a34a; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">${notes.title}</h3>
      <ul style="color: #166534; margin: 0; padding-left: 24px; font-size: 15px; line-height: 1.6;">
        ${notes.items.map(item => `<li style="margin-bottom: ${notes.items.indexOf(item) === notes.items.length - 1 ? '0' : '8px'};">${item}</li>`).join('')}
      </ul>
    </div>
  `;
}