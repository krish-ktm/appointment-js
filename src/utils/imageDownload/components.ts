import { AppointmentDetails } from './types';
import { formatMarkdown } from '../markdown';

export function createHeaderSection(title: string, subtitle: string) {
  return `
    <div style="
      background: linear-gradient(135deg, #2B5C4B 0%, #234539 100%);
      padding: 48px;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: -40px;
        right: -40px;
        width: 200px;
        height: 200px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        filter: blur(40px);
      "></div>
      <div style="
        position: absolute;
        bottom: -40px;
        left: -40px;
        width: 200px;
        height: 200px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        filter: blur(40px);
      "></div>
      <div style="
        width: 80px;
        height: 80px;
        background-color: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px auto;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
      ">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M20 7L9 18l-5-5"></path>
        </svg>
      </div>
      <h1 style="
        font-size: 32px;
        margin: 0 0 8px 0;
        font-weight: 600;
        position: relative;
      ">${title}</h1>
      <p style="
        font-size: 18px;
        margin: 0;
        opacity: 0.9;
        position: relative;
      ">${subtitle}</p>
    </div>
  `;
}

export function createBookingDetails(appointmentDetails: AppointmentDetails, formattedDate: string, translations: any) {
  return `
    <div style="
      background: white;
      border-radius: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      padding: 32px;
      margin-bottom: 24px;
      border: 1px solid rgba(43, 92, 75, 0.1);
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: -20px;
        right: -20px;
        width: 100px;
        height: 100px;
        background: rgba(43, 92, 75, 0.03);
        border-radius: 50%;
        filter: blur(20px);
      "></div>
      <div style="display: flex; items-center; gap: 16px; margin-bottom: 24px;">
        <div style="
          background-color: rgba(43, 92, 75, 0.05);
          padding: 12px;
          border-radius: 16px;
          flex-shrink: 0;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2B5C4B" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div style="flex-grow: 1;">
          <p style="color: #4B5563; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.bookingId}</p>
          <p style="color: #2B5C4B; font-size: 20px; font-weight: 600; margin: 0;">#${appointmentDetails.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-bottom: 24px;">
        <div style="
          background-color: rgba(43, 92, 75, 0.03);
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(43, 92, 75, 0.05);
        ">
          <p style="color: #4B5563; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.date}</p>
          <p style="color: #1F2937; font-size: 18px; font-weight: 500; margin: 0;">${formattedDate}</p>
        </div>
        <div style="
          background-color: rgba(43, 92, 75, 0.03);
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(43, 92, 75, 0.05);
        ">
          <p style="color: #4B5563; font-size: 14px; margin: 0 0 4px 0;">${translations.confirmation.time}</p>
          <p style="color: #1F2937; font-size: 18px; font-weight: 500; margin: 0;">${appointmentDetails.appointment_time}</p>
        </div>
      </div>
    </div>
  `;
}

export function createImportantNotes(notes: { title: string; items: string[] }) {
  // Convert array items to markdown list and join with newlines
  const markdownContent = notes.items.map(item => `- ${item}`).join('\n');
  
  // Format the markdown content
  const formattedContent = formatMarkdown(markdownContent);

  return `
    <div style="
      background: linear-gradient(135deg, rgba(43, 92, 75, 0.03) 0%, rgba(43, 92, 75, 0.05) 100%);
      border: 1px solid rgba(43, 92, 75, 0.1);
      padding: 24px;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: -20px;
        right: -20px;
        width: 100px;
        height: 100px;
        background: rgba(43, 92, 75, 0.05);
        border-radius: 50%;
        filter: blur(20px);
      "></div>
      <div style="
        position: absolute;
        bottom: -20px;
        left: -20px;
        width: 100px;
        height: 100px;
        background: rgba(43, 92, 75, 0.05);
        border-radius: 50%;
        filter: blur(20px);
      "></div>
      <div style="position: relative;">
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(43, 92, 75, 0.05);
          padding: 6px 12px;
          border-radius: 9999px;
          margin-bottom: 16px;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B5C4B" stroke-width="2">
            <path d="M12 2L4 7l8 5 8-5-8-5z"></path>
            <path d="M4 12l8 5 8-5"></path>
            <path d="M4 17l8 5 8-5"></path>
          </svg>
          <span style="color: #2B5C4B; font-size: 12px; font-weight: 500;">${notes.title}</span>
        </div>
        <div style="
          color: #1F2937;
          font-size: 15px;
          line-height: 1.6;
          position: relative;
        ">
          ${formattedContent}
        </div>
      </div>
    </div>
  `;
}