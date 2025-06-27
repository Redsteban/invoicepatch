// This approach captures the exact HTML and converts to PDF
export async function generateHTMLToPDF(simulationData: any): Promise<void> {
  try {
    // Create a hidden div with the exact invoice HTML
    const invoiceHTML = createInvoiceHTML(simulationData);
    
    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = invoiceHTML;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.background = 'white';
    container.style.padding = '20mm';
    document.body.appendChild(container);
    
    // Wait for DOM to update
    await new Promise(requestAnimationFrame);
    
    // Use html2canvas and jsPDF for perfect reproduction
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm  
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Clean up
    document.body.removeChild(container);
    
    // Open in new window
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const win = window.open(pdfUrl, '_blank');
    
    // Revoke URL after window is closed or after 30s
    const revoke = () => URL.revokeObjectURL(pdfUrl);
    if (win) {
      win.addEventListener('unload', revoke);
    }
    setTimeout(revoke, 30000);
    
  } catch (error) {
    console.error('HTML to PDF conversion failed:', error);
  }
}

// Only invoice content: header, table, summary, grand total
export function createInvoiceHTML(simulationData: any): string {
  const completedEntries = simulationData.entries.filter((entry: any) => entry.completed);
  const subtotal = completedEntries.length * 580.00;
  const gst = subtotal * 0.05;
  const subsistence = 700.00;
  const grandTotal = subtotal + gst + subsistence;
  
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #3c4043; line-height: 1.4;">
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 30px; font-size: 11px;">
        <div style="margin-bottom: 4px;">Client: ${simulationData.clientName || 'Acme Energy Ltd.'}</div>
        <div style="margin-bottom: 4px;">Client Address: 123 Main St, Calgary, AB</div>
        <div style="margin-bottom: 4px;">Invoice Date: ${new Date().toLocaleDateString('en-CA')}</div>
        <div style="margin-bottom: 4px;">Contractor: ${simulationData.contractorName || 'John Doe'}</div>
        <div style="margin-bottom: 4px;">Contractor Address: 456 Contractor Rd, Edmonton, AB</div>
        <div style="margin-bottom: 4px;">Pay Period: ${simulationData.startDate} to ${simulationData.endDate}</div>
        <div>Invoice Number: -</div>
      </div>

      <!-- Work Summary -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: bold; font-size: 12px; margin-bottom: 10px; color: black;">Work Summary:</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 9px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Day</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Date</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Description</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Location</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Ticket #</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Truck</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Kms</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Kms Rate</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Other</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${completedEntries.map((entry: any, index: number) => `
              <tr>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${new Date(entry.date).toLocaleDateString('en-CA')}</td>
                <td style="border: 1px solid #ccc; padding: 6px;">Stack Production Testing</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;"></td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;"></td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">$0</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">0</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">$0.5</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">$0</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">$580.00</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Summary Sections -->
      <div style="margin-bottom: 20px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>⊕ Total Truck Charges</span>
          <span>$0.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>⊕ Total Kms Charges</span>
          <span>$0.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>⊕ Total Other Charges</span>
          <span>$0.00</span>
        </div>
      </div>

      <!-- Financial Summary -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: bold; font-size: 12px; margin-bottom: 10px; color: black;">Financial Summary:</h3>
        <div style="font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>⊖ Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>% GST (5%)</span>
            <span>$${gst.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; background-color: #fffacd; padding: 4px; border-radius: 3px;">
            <span>⊕ Subsistence (Tax-Free)</span>
            <span>$${subsistence.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Grand Total -->
      <div style="text-align: center; margin-top: 20px;">
        <div style="font-size: 16px; font-weight: bold; color: #228b22;">
          $ Grand Total: $${grandTotal.toFixed(2)}
        </div>
      </div>
    </div>
  `;
} 