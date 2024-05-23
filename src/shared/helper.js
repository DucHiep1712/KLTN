import { DOMParser } from "@xmldom/xmldom";
import PizZip from "pizzip";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const str2xml = (str) => {
  if (str.charCodeAt(0) === 65279) {
    // BOM sequence
    str = str.substr(1);
  }
  return new DOMParser().parseFromString(str, "text/xml");
};

const getParagraphs = (content) => {
  const zip = new PizZip(content);
  const xml = str2xml(zip.files["word/document.xml"].asText());
  const paragraphsXml = xml.getElementsByTagName("w:p");
  const paragraphs = [];

  for (let i = 0, len = paragraphsXml.length; i < len; i++) {
    let fullText = "";
    const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
    for (let j = 0, len2 = textsXml.length; j < len2; j++) {
      const textXml = textsXml[j];
      if (textXml.childNodes) {
        fullText += textXml.childNodes[0].nodeValue;
      }
    }
    if (fullText) {
      paragraphs.push(fullText);
    }
  }
  return paragraphs;
};

const getTextContent = async (file, type) => {
  if (type.includes("pdf")) {
    const pdf = URL.createObjectURL(file);
    const loadingPdf = pdfjs.getDocument(pdf);

    const pdfDocument = await loadingPdf.promise;
    let totalPageCount = pdfDocument.numPages;
    let countPromises = [];

    for (let currentPage = 1; currentPage <= totalPageCount; currentPage++) {
      let page = await pdfDocument.getPage(currentPage);
      let textContent = await page.getTextContent();

      let text = textContent.items
        .map((s) => (s.str && s.str.trim()) || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      countPromises.push(text);
    }

    const texts = await Promise.all(countPromises);
    return texts.join(" ");
  } else if (type.includes("document")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const paragraphs = getParagraphs(content);
        resolve(paragraphs.join("\n"));
      };

      reader.onerror = (err) => reject(err);

      reader.readAsBinaryString(file);
    });
  } else if (type.includes("plain")) {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = async (event) => {
        const text = event.target.result;
        resolve(text);
      };

      reader.readAsText(file);
    });
  }
};

export { getTextContent };
