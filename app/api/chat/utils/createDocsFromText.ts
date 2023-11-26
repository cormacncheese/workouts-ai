import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

interface Props {
  text: string;
  label?: string;
}

export default async function CreateDocsFromText({ text, label }: Props) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 750,
    chunkOverlap: 50
  });

  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: text })
  ]);

  // if label, go through docOutput and add label to each doc.pageContent
  if (label) {
    await docOutput.forEach((doc) => {
      doc.pageContent = `${label}: ${doc.pageContent}`;
    });
  }

  if (docOutput) {
    return docOutput;
  } else {
    return [];
  }
}
