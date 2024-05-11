import PDF from 'pdfkit';

declare global {
  class PDFDocument extends PDF {}
  function blobStream(): any;
}

export {};
