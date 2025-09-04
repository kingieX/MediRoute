import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

/**
 * Convert JSON data to CSV and send as response
 */
export const exportCSV = (res: Response, filename: string, data: any[]) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  res.header('Content-Type', 'text/csv');
  res.attachment(`${filename}.csv`);
  res.send(csv);
};

/**
 * Convert JSON data to PDF and send as response
 */
export const exportPDF = (res: Response, filename: string, data: any[]) => {
  const doc = new PDFDocument();
  res.header('Content-Type', 'application/pdf');
  res.attachment(`${filename}.pdf`);

  doc.pipe(res);
  doc.fontSize(14).text(`${filename} Report`, { underline: true });

  data.forEach((row, idx) => {
    doc
      .moveDown()
      .fontSize(10)
      .text(`${idx + 1}. ${JSON.stringify(row)}`);
  });

  doc.end();
};
