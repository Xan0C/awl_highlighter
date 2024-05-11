const createHeader = (doc: PDFDocument, task: string, time: string) => {
  const today = new Date();
  const header = `Name: _________________________ ${task} – ${time} minutes`;

  doc
    .fontSize(12)
    .text(header, 75, 50, {
      align: 'left'
    })
    .text(
      today.toLocaleDateString('en-EN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      75,
      50,
      {
        align: 'right'
      }
    );
};

const createTaskDescription = (doc: PDFDocument, headwords, type = 'text') => {
  const taskDescription = `Task 1: Fill the following ${headwords.length} words into the gaps of the ${type} below. Keep the given grammatical form.`;

  doc.font('Times-Bold').fontSize(14).text(taskDescription, 75, 100, {
    align: 'left'
  });

  doc.font('Times-Roman').fontSize(12).text(headwords.join(' '), 75, 140);

  return doc.heightOfString(headwords.join(''));
};

const createTaskText = (doc: PDFDocument, headline, height, taskText) => {
  doc
    .font('Times-Bold')
    .fontSize(16)
    .text(headline, 75, 160 + height, {
      align: 'center'
    });

  doc
    .font('Times-Roman')
    .fontSize(12)
    .text(taskText, 75, 190 + height, {
      lineGap: 11,
      align: 'left'
    });
};

const createSolution = (doc: PDFDocument, solution, task: string, time: string) => {
  doc.addPage();
  createHeader(doc, task, time);
  doc.font('Times-Bold').fontSize(18).text('EWH', 75, 100, {
    align: 'center'
  });
  doc.font('Times-Roman').fontSize(12).text(solution, 75, 140, {
    lineGap: 11
  });
};

export type AWLTask = {
  headline: string;
  headwords: string[];
  gaptext: string;
  solution: string;
  type: string;
  task: string;
  time: string;
};

export const createPdf = (task: AWLTask) => {
  const doc = new PDFDocument({ font: 'Times-Roman' });
  const stream = doc.pipe(blobStream());
  stream.on('finish', function () {
    // get a blob you can do whatever you like with
    // const blob = stream.toBlob("application/pdf");

    // or get a blob URL for display in the browser
    const url = stream.toBlobURL('application/pdf');
    const iframe = document.querySelector('iframe');
    iframe.src = url;
  });
  createHeader(doc, task.task, task.time);
  const height = createTaskDescription(doc, task.headwords, task.type);
  createTaskText(doc, task.headline, height, task.gaptext);
  createSolution(doc, task.solution, task.task, task.time);
  doc.end();
  return doc;
};
