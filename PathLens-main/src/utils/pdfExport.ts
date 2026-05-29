import html2pdf from 'html2pdf.js';
import { ReadinessProfile } from '../types/evidence';

export async function exportProfileToPDF(
  profile: ReadinessProfile,
  studentName: string,
  timestamp: string
): Promise<void> {
  // Create HTML content for PDF
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #6d28d9; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #6d28d9; font-size: 32px;">PathLens</h1>
        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Career Readiness Profile</p>
      </div>

      <!-- Student Info -->
      <div style="margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 20px;">${studentName}</h2>
        <p style="margin: 0; color: #666; font-size: 14px;">Generated: ${new Date(timestamp).toLocaleDateString()}</p>
      </div>

      <!-- Overall Score -->
      <div style="margin-bottom: 40px; background: linear-gradient(135deg, #ff6b35 0%, #6d28d9 100%); color: white; padding: 30px; border-radius: 12px; text-align: center;">
        <h2 style="margin: 0; font-size: 28px; font-weight: bold;">Overall Readiness Score</h2>
        <p style="margin: 15px 0; font-size: 48px; font-weight: 900;">${profile.overall}/100</p>
        <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 600;">${profile.level}</p>
        <p style="margin: 15px 0 0 0; font-size: 14px; line-height: 1.6;">${profile.interpretation}</p>
      </div>

      <!-- Readiness Dimensions -->
      <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 22px;">Your Readiness Dimensions</h2>
      <div style="margin-bottom: 40px;">
        ${profile.dimensions
          .map(
            (dimension) => `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h3 style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">${dimension.dimension}</h3>
              <span style="font-size: 24px; font-weight: 900; color: #ff6b35;">${dimension.score}/100</span>
            </div>
            <p style="margin: 8px 0; color: #666; font-size: 13px; line-height: 1.5;">${dimension.explanation}</p>
            ${
              dimension.topSkills.length > 0
                ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 13px;"><strong>Skills:</strong> ${dimension.topSkills.join(', ')}</p>`
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px;">
        <p style="margin: 0;">PathLens • Career Readiness Platform</p>
        <p style="margin: 5px 0 0 0;">This profile represents your readiness based on the evidence you provided.</p>
      </div>
    </div>
  `;

  // PDF options
  const opt = {
    margin: 0,
    filename: `PathLens_Profile_${studentName}_${new Date().getTime()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' },
  };

  // Generate PDF
  html2pdf().set(opt).from(htmlContent).save();
}

export async function exportEvidenceToPDF(
  studentName: string,
  evidence: any[]
): Promise<void> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #6d28d9; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #6d28d9; font-size: 32px;">PathLens</h1>
        <h2 style="margin: 10px 0 0 0; color: #666; font-size: 18px;">Evidence Portfolio</h2>
      </div>

      <h2 style="margin: 30px 0 20px 0; color: #1a1a1a; font-size: 22px;">${studentName}'s Evidence</h2>
      ${evidence
        .map(
          (item) => `
        <div style="margin-bottom: 25px; padding: 15px; border-left: 4px solid #ff6b35; background: #f8f9fa; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">${item.title}</h3>
          <p style="margin: 0 0 8px 0; color: #ff6b35; font-weight: 600; font-size: 13px; text-transform: uppercase;">📁 ${item.type.replace('_', ' ')}</p>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 13px; line-height: 1.6;">${item.description}</p>
          ${item.technologies ? `<p style="margin: 0 0 6px 0; color: #666; font-size: 12px;"><strong>Technologies:</strong> ${item.technologies}</p>` : ''}
          ${item.duration ? `<p style="margin: 0 0 6px 0; color: #666; font-size: 12px;"><strong>Duration:</strong> ${item.duration}</p>` : ''}
          ${item.outcome ? `<p style="margin: 0; color: #666; font-size: 12px;"><strong>Outcome:</strong> ${item.outcome}</p>` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `;

  const opt = {
    margin: 0,
    filename: `PathLens_Evidence_${studentName}_${new Date().getTime()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' },
  };

  html2pdf().set(opt).from(htmlContent).save();
}
