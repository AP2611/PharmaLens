import jsPDF from 'jspdf';
import { PrescriptionAnalysis } from '@/lib/api';

interface PDFOptions {
  analysis: PrescriptionAnalysis;
  rawText: string;
  userName?: string;
  createdAt?: string;
}

/**
 * Loads the PharmaLens logo and converts it to a PNG data URL
 * This is more reliable with jsPDF than using raw SVG.
 */
async function getLogoPngDataUrl(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          // Scale up a bit for sharper rendering
          const targetWidth = 160;
          const aspectRatio = img.width / img.height || 4;
          const targetHeight = targetWidth / aspectRatio;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } catch (e) {
          console.error('Failed to render logo to canvas:', e);
          resolve(null);
        }
      };
      img.onerror = (e) => {
        console.error('Failed to load logo image:', e);
        resolve(null);
      };
      img.src = '/pharmalens-logo.svg';
    } catch (error) {
      console.error('Error preparing logo image:', error);
      resolve(null);
    }
  });
}

/**
 * Generates a PDF report from prescription analysis
 */
export async function generatePrescriptionPDF(options: PDFOptions): Promise<void> {
  const { analysis, rawText, userName, createdAt } = options;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Load logo
  const logoPngDataUrl = await getLogoPngDataUrl();
  
  // Add logo at the top
  if (logoPngDataUrl) {
    try {
      // Top-left, neat size
      const logoWidth = 40;
      const logoHeight = 14;
      doc.addImage(logoPngDataUrl, 'PNG', margin, yPosition, logoWidth, logoHeight);
    } catch (error) {
      console.error('Failed to add logo to PDF, falling back to text logo:', error);
      doc.setFontSize(20);
      doc.setTextColor(30, 64, 175); // Dark blue
      doc.text('PharmaLens', margin, yPosition + 10);
    }
  } else {
    // Fallback text logo
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text('PharmaLens', margin, yPosition + 10);
  }

  // Add tagline aligned under the logo
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont(undefined, 'normal');
  doc.text('MAKING MEDICINES SAFER TO USE', margin, yPosition + 18);

  // Move content a bit lower so header has breathing room
  yPosition += 30;

  // Add report title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Prescription Analysis Report', margin, yPosition);
  yPosition += 10;

  // Add metadata
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  if (userName) {
    doc.text(`Patient: ${userName}`, margin, yPosition);
    yPosition += 6;
  }
  if (createdAt) {
    const date = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Generated: ${date}`, margin, yPosition);
    yPosition += 8;
  }

  // Add original prescription text
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Original Prescription:', margin, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(50, 50, 50);
  const prescriptionLines = doc.splitTextToSize(rawText, pageWidth - 2 * margin);
  doc.text(prescriptionLines, margin, yPosition);
  yPosition += prescriptionLines.length * 5 + 8;

  // Check if we need a new page
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // Medication Schedule
  if (analysis.medication_schedule && analysis.medication_schedule.length > 0) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Medication Schedule', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    analysis.medication_schedule.forEach((med, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${med.medicine}`, margin + 5, yPosition);
      yPosition += 5;

      doc.setFont(undefined, 'normal');
      if (med.dosage) {
        doc.text(`   Dosage: ${med.dosage}`, margin + 5, yPosition);
        yPosition += 5;
      }
      if (med.timing) {
        doc.text(`   Timing: ${med.timing}`, margin + 5, yPosition);
        yPosition += 5;
      }
      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`, margin + 5, yPosition);
        yPosition += 5;
      }
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Safety Warnings
  const hasWarnings = 
    (analysis.harmful_combinations && analysis.harmful_combinations.length > 0) ||
    (analysis.overdose_warnings && analysis.overdose_warnings.length > 0);

  if (hasWarnings) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(220, 38, 38); // Red for warnings
    doc.text('⚠ Safety Warnings', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    // Harmful Combinations
    if (analysis.harmful_combinations && analysis.harmful_combinations.length > 0) {
      analysis.harmful_combinations.forEach((combo) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFont(undefined, 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text(`⚠ Avoid: ${combo.medicines.join(' + ')}`, margin + 5, yPosition);
        yPosition += 5;

        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`   Risk: ${combo.risk}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`   Recommendation: ${combo.recommendation}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }

    // Overdose Warnings
    if (analysis.overdose_warnings && analysis.overdose_warnings.length > 0) {
      analysis.overdose_warnings.forEach((warning) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFont(undefined, 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text(`⚠ Overdose Warning: ${warning.medicine}`, margin + 5, yPosition);
        yPosition += 5;

        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`   ${warning.warning}`, margin + 5, yPosition);
        yPosition += 5;
        if (warning.max_daily_dose) {
          doc.text(`   Max Daily Dose: ${warning.max_daily_dose}`, margin + 5, yPosition);
          yPosition += 5;
        }
        yPosition += 3;
      });
    }
    yPosition += 5;
  }

  // Side Effects
  const hasSideEffects = 
    (analysis.side_effects?.common && analysis.side_effects.common.length > 0) ||
    (analysis.side_effects?.serious && analysis.side_effects.serious.length > 0);

  if (hasSideEffects) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Side Effects', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    // Common Side Effects
    if (analysis.side_effects?.common && analysis.side_effects.common.length > 0) {
      doc.setFont(undefined, 'bold');
      doc.text('Common Side Effects:', margin + 5, yPosition);
      yPosition += 6;

      analysis.side_effects.common.forEach((effect) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFont(undefined, 'normal');
        doc.text(`   ${effect.medicine}:`, margin + 5, yPosition);
        yPosition += 5;
        effect.effects.forEach((e) => {
          doc.text(`     • ${e}`, margin + 8, yPosition);
          yPosition += 4;
        });
        yPosition += 2;
      });
    }

    // Serious Side Effects
    if (analysis.side_effects?.serious && analysis.side_effects.serious.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont(undefined, 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('Serious Side Effects (Seek Medical Attention):', margin + 5, yPosition);
      yPosition += 6;

      analysis.side_effects.serious.forEach((effect) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`   ${effect.medicine}:`, margin + 5, yPosition);
        yPosition += 5;
        effect.effects.forEach((e) => {
          doc.text(`     • ${e}`, margin + 8, yPosition);
          yPosition += 4;
        });
        if (effect.action_required) {
          doc.setFont(undefined, 'bold');
          doc.setTextColor(220, 38, 38);
          doc.text(`     ⚠ Action Required: ${effect.action_required}`, margin + 8, yPosition);
          yPosition += 5;
        }
        yPosition += 2;
      });
    }
    yPosition += 5;
  }

  // Food Interactions
  if (analysis.food_interactions && analysis.food_interactions.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Food Interactions', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    analysis.food_interactions.forEach((interaction) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont(undefined, 'bold');
      doc.text(`${interaction.medicine} + ${interaction.food_item}`, margin + 5, yPosition);
      yPosition += 5;

      doc.setFont(undefined, 'normal');
      doc.text(`   Interaction: ${interaction.interaction}`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`   Recommendation: ${interaction.recommendation}`, margin + 5, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }

  // Lifestyle Advice
  if (analysis.lifestyle_advice && analysis.lifestyle_advice.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Lifestyle Guidance', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    analysis.lifestyle_advice.forEach((advice) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont(undefined, 'bold');
      doc.text(`${advice.medicine}:`, margin + 5, yPosition);
      yPosition += 5;

      doc.setFont(undefined, 'normal');
      doc.text(`   ${advice.advice}`, margin + 5, yPosition);
      yPosition += 5;
      if (advice.restrictions && advice.restrictions.length > 0) {
        doc.text(`   Restrictions: ${advice.restrictions.join(', ')}`, margin + 5, yPosition);
        yPosition += 5;
      }
      yPosition += 3;
    });
    yPosition += 5;
  }

  // General Tips
  if (analysis.general_tips && analysis.general_tips.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('General Tips', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    analysis.general_tips.forEach((tip) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(`• ${tip}`, margin + 5, yPosition);
      yPosition += 6;
    });
  }

  // Add footer with logo on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
    
    // Company logo/text in footer
    doc.setFontSize(7);
    doc.setTextColor(30, 64, 175);
    doc.text('PharmaLens - Making Medicines Safer to Use', margin, pageHeight - 10);
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `PharmaLens_Report_${timestamp}.pdf`;

  // Save PDF
  doc.save(filename);
}
