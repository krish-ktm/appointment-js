import { createHeaderSection, createBookingDetails, createImportantNotes } from './components';
import { AppointmentDetails, PatientDetails, MRDetails } from './types';
import { supabase } from '../../lib/supabase';

async function getDownloadRules(type: 'patient' | 'mr', language: string) {
  try {
    // Query the image_download_rules table, filtering by type and active status
    const { data, error } = await supabase
      .from('image_download_rules')
      .select('title, content')
      .eq('type', type)
      .eq('is_active', true)
      .order('order', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      // If no active rule is found, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (data && data.content && data.content[language]) {
      // Parse content from the content field which might be in markdown format
      const contentText = data.content[language] as string;
      // Split by newlines and remove markdown list indicators
      const contentItems = contentText.split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.startsWith('-'))
        .map((line: string) => line.substring(1).trim());
      
      // Get title from the title field or use default
      const titleText = (data.title && data.title[language] as string) || 'Important Notes';
      
      // Format for important notes if we have custom rules
      return {
        title: titleText,
        items: contentItems.length > 0 ? contentItems : [
          'Please arrive 10 minutes before your appointment time',
          type === 'patient' 
            ? 'Bring your previous medical records'
            : 'Bring your company ID card and visiting card',
          'Wear a mask during your visit'
        ]
      };
    }

    // Fallback to default rules if no custom rules found
    return {
      title: 'Important Notes',
      items: type === 'patient' 
        ? ['Please arrive 10 minutes before your appointment time', 'Bring your previous medical records', 'Wear a mask during your visit']
        : ['Please arrive 10 minutes before your appointment time', 'Bring your company ID card and visiting card', 'Wear a mask during your visit']
    };
  } catch (error) {
    console.error('Error fetching download rules:', error);
    // Return null on error
    return null;
  }
}

export async function createPatientTemplate(
  appointmentDetails: AppointmentDetails & PatientDetails,
  formattedDate: string,
  translations: Record<string, string | Record<string, string>>,
  language: string = 'en' // Default to English if not provided
) {
  // Get rules for patient appointment using provided language
  const rules = await getDownloadRules('patient', language);

  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'fixed';
  container.style.overflow = 'hidden';

  // Type assertion for the nested translations records
  const confirmation = translations.confirmation as Record<string, string>;
  const form = translations.form as Record<string, string>;

  container.innerHTML = `
    ${createHeaderSection(
      confirmation.title,
      confirmation.subtitle
    )}
    <div style="padding: 48px;">
      ${createBookingDetails(appointmentDetails, formattedDate, translations)}
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">${confirmation.patientDetails || 'Patient Details'}</h2>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;">
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.name}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.phone}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.phone}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.age}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.age} ${form.years || 'years'}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.city}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.city}</p>
          </div>
        </div>
      </div>
      ${rules ? createImportantNotes(rules) : ''}
    </div>
  `;

  return container;
}

export async function createMRTemplate(
  appointmentDetails: AppointmentDetails & MRDetails,
  formattedDate: string,
  translations: Record<string, string | Record<string, string>>,
  language: string = 'en' // Default to English if not provided
) {
  // Get rules for MR appointment using provided language
  const rules = await getDownloadRules('mr', language);

  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'fixed';
  container.style.overflow = 'hidden';

  // Type assertion for the nested translations records
  const confirmation = translations.confirmation as Record<string, string>;
  const form = translations.form as Record<string, string>;

  container.innerHTML = `
    ${createHeaderSection(
      confirmation.title,
      confirmation.subtitle
    )}
    <div style="padding: 48px;">
      ${createBookingDetails(appointmentDetails, formattedDate, translations)}
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">${confirmation.mrDetails || 'MR Details'}</h2>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;">
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.mrName || 'MR Name'}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.mr_name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.companyName || 'Company Name'}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.company_name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.divisionName || 'Division Name'}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.division_name}</p>
          </div>
          <div style="min-width: 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">${form.contactNo || 'Contact Number'}</p>
            <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${appointmentDetails.contact_no}</p>
          </div>
        </div>
      </div>
      ${rules ? createImportantNotes(rules) : ''}
    </div>
  `;

  return container;
}