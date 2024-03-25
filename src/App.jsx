import Navbar from "@/components/Navbar";
import Tab from "@/components/Tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

import "@/App.css";
import DragnDrop from "./components/DragnDrop";

export default function App() {
  const [tab, setTab] = useState("Văn bản");
  const [keyword, setKeyword] = useState("");
  const [fileList, setFileList] = useState([]);
  const [documents, setDocuments] = useState([""]);

  const TAB_OPTION = ["Văn bản", "Tệp tin"];

  const handleDocumentChange = (index, value) => {
    let newDocuments = documents;
    newDocuments = newDocuments.map((document, newIndex) => {
      return index !== newIndex ? document : value;
    });
    setDocuments([...newDocuments]);
  };

  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, ""]);
  };

  return (
    <div className="w-full bg-secondary min-h-[100vh] pb-12">
      <Navbar />
      <div className="relative w-full container flex items-center justify-center flex-col gap-y-6 bg-background px-12 py-8 rounded-lg border shadow">
        <Tab
          className="absolute top-4 right-4"
          options={TAB_OPTION}
          value={tab}
          action={setTab}
        />
        <div className="flex flex-col items-center font-extrabold w-full">
          <span className="text-2xl">Hệ thống</span>
          <br />
          <span className="text-4xl uppercase">
            tóm tắt đa văn bản tiếng việt
          </span>
        </div>
        <div className="w-full flex flex-col gap-y-2.5 justify-start">
          <Label className="text-xl font-semibold" htmlFor="keyword">
            Từ khóa
          </Label>
          <Input
            className="text-base font-medium"
            id="keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <div className="border-b border-border w-full"></div>
        {tab === TAB_OPTION[0] ? (
          <div className="w-full flex flex-col gap-y-2.5 justify-start">
            <Label className="text-xl font-semibold" htmlFor="keyword">
              Văn bản
            </Label>
            {documents.map((document, index) => (
              <Textarea
                className="text-base font-medium"
                key={`document-${index}`}
                value={document}
                onChange={(event) =>
                  handleDocumentChange(index, event.target.value)
                }
              />
            ))}
          </div>
        ) : (
          <DragnDrop fileList={fileList} setFileList={setFileList} />
        )}
        <div className="flex items-center w-full justify-between">
          {tab === TAB_OPTION[0] ? (
            <Button onClick={handleAddDocument}>Thêm item</Button>
          ) : null}
          <Button
            className="bg-[#fedc56] hover:bg-[#fbec50]"
            onClick={handleAddDocument}
          >
            Tóm tắt
          </Button>
        </div>
      </div>
    </div>
  );
}
