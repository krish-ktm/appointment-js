import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { createPatientTemplate, createMRTemplate } from './imageDownload/templates';
import { AppointmentDetails } from './imageDownload/types';

const TIMEZONE = 'Asia/Kolkata';

export async function downloadAppointmentImage(
  appointmentDetails: AppointmentDetails,
  type: 'patient' | 'mr',
  translations: any
) {
  try {
    // Format date
    const appointmentDate = utcToZonedTime(new Date(appointmentDetails.appointment_date), TIMEZONE);
    const dayName = translations.form.days[format(appointmentDate, 'EEEE').toLowerCase()];
    const monthName = translations.form.months[format(appointmentDate, 'MMMM').toLowerCase()];
    const day = format(appointmentDate, 'd');
    const year = format(appointmentDate, 'yyyy');
    const formattedDate = `${dayName}, ${monthName} ${day}, ${year}`;

    // Create template based on appointment type
    const container = type === 'patient'
      ? createPatientTemplate(appointmentDetails, formattedDate, translations)
      : createMRTemplate(appointmentDetails, formattedDate, translations);

    // Use html2canvas to convert the div to an image
    const html2canvas = (await import('html2canvas')).default;
    document.body.appendChild(container);
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      windowWidth: 800,
      width: 800,
      height: container.offsetHeight
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
  } catch (error) {
    console.error('Error generating appointment image:', error);
    throw new Error('Failed to generate appointment image');
  }
}