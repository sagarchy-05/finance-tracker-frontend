// src/utils/exportToPDF.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportToPDF = async (elementId, filename = 'report.pdf') => {
  const input = document.getElementById(elementId);
  if (!input) return alert('Element not found!');

  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
};

export default exportToPDF;
