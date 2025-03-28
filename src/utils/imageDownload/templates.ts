import { createHeaderSection, createBookingDetails, createImportantNotes } from './components';
import { AppointmentDetails, PatientDetails, MRDetails } from './types';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../i18n/LanguageContext';

async function getDownloadRules(type: 'patient' | 'mr', language: 'en' | 'gu') {
  try {
    const { data, error } = await supabase
      .from('image_download_rules')
      .select('title, content')
      .eq('type', type)
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        title: type === 'patient' ? 'Important Notes' : 'Important Notes',
        items: type === 'patient' 
          ? ['Please arrive 10 minutes before your appointment time', 'Bring your previous medical records', 'Wear a mask during your visit']
          : ['Please arrive 10 minutes before your appointment time', 'Bring your company ID card and visiting card', 'Wear a mask during your visit']
      };
    }

    // Get the first active rule
    const rule = data[0];
    const title = rule.title[language] || rule.title.en;
    const content = rule.content[language] || rule.content.en;

    // Convert markdown list to array
    const items = content.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());

    return { title, items };
  } catch (error) {
    console.error('Error fetching download rules:', error);
    // Return default rules if there's an error
    return {
      title: type === 'patient' ? 'Important Notes' : 'Important Notes',
      items: type === 'patient' 
        ? ['Please arrive 10 minutes before your appointment time', 'Bring your previous medical records', 'Wear a mask during your visit']
        : ['Please arrive 10 minutes before your appointment time', 'Bring your company ID card and visiting card', 'Wear a mask during your visit']
    };
  }
}

export async function createPatientTemplate(
  appointmentDetails: AppointmentDetails & PatientDetails,
  formattedDate: string,
  translations: any
) {
  const { language } = useLanguage();
  const rules = await getDownloadRules('patient', language);

  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'fixed';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    ${createHeaderSection(
      translations.confirmation.title,
      translations.confirmation.subtitle
    )}
    <div style="padding: 48px;">
      ${createBookingDetails(appointmentDetails, formattedDate, translations)}
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">${translations.confirmation.patientDetails}</h2>
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
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.age} ${translations.form.age}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${translations.form.city}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.city}</p>
          </div>
        </div>
      </div>
      ${createImportantNotes(rules)}
    </div>
  `;

  return container;
}

export async function createMRTemplate(
  appointmentDetails: AppointmentDetails & MRDetails,
  formattedDate: string,
  translations: any
) {
  const { language } = useLanguage();
  const rules = await getDownloadRules('mr', language);

  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'fixed';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    ${createHeaderSection(
      translations.confirmation.title,
      translations.confirmation.subtitle
    )}
    <div style="padding: 48px;">
      ${createBookingDetails(appointmentDetails, formattedDate, translations)}
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">${translations.confirmation.mrDetails}</h2>
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
      ${createImportantNotes(rules)}
    </div>
  `;

  return container;
}