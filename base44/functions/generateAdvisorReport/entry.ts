import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1';

const BRAND_CONFIGS = {
  1: { primary: [0, 0.2, 0.4], accent: [0.66, 0.53, 0.17], firm: 'GOLDMAN SACHS PRIVATE WEALTH', title: 'COMPREHENSIVE WEALTH DIAGNOSTIC' },
  2: { primary: [0.55, 0, 0], accent: [0.17, 0.17, 0.17], firm: 'VANGUARD', title: 'RETIREMENT BLUEPRINT' },
  3: { primary: [0, 0.19, 0.53], accent: [0.78, 0.66, 0.32], firm: 'MORGAN STANLEY WEALTH MANAGEMENT', title: 'INVESTMENT POLICY STATEMENT' },
  4: { primary: [0, 0.39, 0], accent: [0.1, 0.1, 0.1], firm: 'DELOITTE TAX ADVISORY', title: 'TAX OPTIMIZATION MEMORANDUM' },
  5: { primary: [0, 0.19, 0.53], accent: [0.72, 0.53, 0.04], firm: 'JPMORGAN PRIVATE BANK', title: 'DEBT ELIMINATION ROADMAP' },
  6: { primary: [0, 0.29, 0.55], accent: [0.42, 0.62, 0.85], firm: 'CHARLES SCHWAB', title: 'CASH MANAGEMENT STRATEGY' },
  7: { primary: [0, 0.17, 0.36], accent: [0.4, 0.6, 0.8], firm: 'NORTHWESTERN MUTUAL', title: 'INSURANCE REVIEW' },
  8: { primary: [0, 0.4, 0.2], accent: [0, 0.27, 0.13], firm: 'FIDELITY INVESTMENTS', title: 'EDUCATION SAVINGS STRATEGY' },
  9: { primary: [0, 0.19, 0.53], accent: [0, 0.34, 0.55], firm: 'EDWARD JONES', title: 'ESTATE PLANNING GUIDE' },
  10: { primary: [0.24, 0.61, 0.91], accent: [0.17, 0.17, 0.17], firm: 'WEALTHFRONT', title: 'REAL ESTATE ANALYSIS' },
  11: { primary: [0, 0.4, 0.8], accent: [1, 0.4, 0], firm: 'RAMSEY SOLUTIONS', title: 'BUDGET PLAN' },
  12: { primary: [0, 0, 0], accent: [0.8, 0, 0], firm: 'BLACKROCK', title: 'LIFETIME FINANCIAL ROADMAP' }
};

const LEGAL_DISCLAIMER_EN = 'This report is for informational purposes only and does not constitute investment, tax, legal, or insurance advice.';
const LEGAL_DISCLAIMER_ES = 'Este informe es solo para fines informativos y no constituye asesoramiento de inversión, fiscal, legal ni de seguros.';

function wrapText(text, maxWidth, font, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}

function cleanText(text) {
  return text.replace(/[^\x00-\x7F]/g, '').replace(/\*\*/g, '');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { advisorId, reportContent, language = 'en' } = await req.json();
    
    const brand = BRAND_CONFIGS[advisorId];
    if (!brand) {
      return Response.json({ error: 'Invalid advisor ID' }, { status: 400 });
    }

    const disclaimer = language === 'es' ? LEGAL_DISCLAIMER_ES : LEGAL_DISCLAIMER_EN;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Cover page
    let page = pdfDoc.addPage([612, 792]);
    
    // Header bar
    page.drawRectangle({ x: 0, y: 742, width: 612, height: 50, color: rgb(...brand.primary) });
    const firmWidth = fontBold.widthOfTextAtSize(brand.firm, 16);
    page.drawText(brand.firm, { x: 306 - (firmWidth / 2), y: 760, size: 16, font: fontBold, color: rgb(1, 1, 1) });
    
    // Title
    let yPos = 600;
    const titleWidth = fontBold.widthOfTextAtSize(brand.title, 24);
    page.drawText(brand.title, { x: 306 - (titleWidth / 2), y: yPos, size: 24, font: fontBold, color: rgb(...brand.accent) });
    
    // Client info
    yPos -= 80;
    const prepFor = `Prepared for: ${user.full_name || user.email}`;
    const prepWidth = font.widthOfTextAtSize(prepFor, 14);
    page.drawText(prepFor, { x: 306 - (prepWidth / 2), y: yPos, size: 14, font: font, color: rgb(0, 0, 0) });
    
    yPos -= 25;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dateWidth = font.widthOfTextAtSize(dateStr, 12);
    page.drawText(dateStr, { x: 306 - (dateWidth / 2), y: yPos, size: 12, font: font, color: rgb(0.4, 0.4, 0.4) });
    
    page.drawRectangle({ x: 150, y: 100, width: 312, height: 3, color: rgb(...brand.accent) });

    // Content pages - enhanced markdown parsing
    const lines = reportContent.split('\n');
    page = pdfDoc.addPage([612, 792]);
    yPos = 720;
    const leftMargin = 50;
    const rightMargin = 562;
    const maxWidth = rightMargin - leftMargin;
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Empty line
      if (!trimmed) {
        yPos -= 8;
        inList = false;
        continue;
      }
      
      // Check if we need a new page
      if (yPos < 100) {
        page = pdfDoc.addPage([612, 792]);
        yPos = 720;
      }

      let useFont = font;
      let size = 11;
      let color = rgb(0, 0, 0);
      let text = cleanText(trimmed);
      let indent = leftMargin;
      let isBold = false;

      // Parse markdown formatting
      if (trimmed.startsWith('###')) {
        useFont = fontBold;
        size = 14;
        color = rgb(...brand.accent);
        text = cleanText(trimmed.replace(/^###\s*/, ''));
        yPos -= 10;
        inList = false;
      } else if (trimmed.startsWith('##')) {
        useFont = fontBold;
        size = 18;
        color = rgb(...brand.primary);
        text = cleanText(trimmed.replace(/^##\s*/, ''));
        yPos -= 15;
        inList = false;
      } else if (trimmed.startsWith('# ')) {
        useFont = fontBold;
        size = 20;
        color = rgb(...brand.primary);
        text = cleanText(trimmed.replace(/^#\s*/, ''));
        yPos -= 18;
        inList = false;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        text = cleanText(trimmed.replace(/^[-*]\s*/, ''));
        indent = leftMargin + 15;
        
        // Draw bullet
        page.drawText('•', {
          x: leftMargin + 5,
          y: yPos,
          size: size,
          font: font,
          color: rgb(...brand.accent)
        });
        
        inList = true;
      } else if (/^\d+\./.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (match) {
          text = cleanText(match[2]);
          indent = leftMargin + 20;
          
          // Draw number
          page.drawText(match[1] + '.', {
            x: leftMargin + 5,
            y: yPos,
            size: size,
            font: fontBold,
            color: rgb(...brand.accent)
          });
        }
        inList = true;
      } else {
        inList = false;
      }

      // Handle bold text within content
      if (text.includes('**')) {
        isBold = true;
        useFont = fontBold;
      }

      // Wrap long text
      const wrappedLines = wrapText(text, maxWidth - (indent - leftMargin), useFont, size);
      
      for (let j = 0; j < wrappedLines.length; j++) {
        if (yPos < 100) {
          page = pdfDoc.addPage([612, 792]);
          yPos = 720;
        }
        
        page.drawText(wrappedLines[j], {
          x: indent,
          y: yPos,
          size: size,
          font: useFont,
          color: color
        });
        
        yPos -= size + 4;
      }
      
      // Extra spacing after headers
      if (trimmed.startsWith('#')) {
        yPos -= 5;
      }
    }

    // Add headers/footers to all pages except cover
    const pages = pdfDoc.getPages();
    for (let i = 1; i < pages.length; i++) {
      const p = pages[i];
      
      // Header bar
      p.drawRectangle({ x: 0, y: 772, width: 612, height: 18, color: rgb(...brand.primary) });
      p.drawText(brand.firm, { x: 50, y: 778, size: 9, font: fontBold, color: rgb(1, 1, 1) });
      
      // Footer
      p.drawRectangle({ x: 0, y: 40, width: 612, height: 1, color: rgb(...brand.accent) });
      p.drawText(`Page ${i}`, { x: 280, y: 26, size: 8, font: font, color: rgb(0.4, 0.4, 0.4) });
      
      // Disclaimer on last page
      if (i === pages.length - 1) {
        const disclaimerLines = wrapText(disclaimer, 512, font, 7);
        let disclaimerY = 50;
        for (const dLine of disclaimerLines) {
          p.drawText(dLine, { x: 50, y: disclaimerY, size: 7, font: font, color: rgb(0.5, 0.5, 0.5) });
          disclaimerY += 9;
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const fileName = `${brand.firm.replace(/\s+/g, '_')}_Report.pdf`;
    
    // Convert to base64 for reliable transfer
    const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    return Response.json({
      pdf: base64,
      fileName: fileName
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});