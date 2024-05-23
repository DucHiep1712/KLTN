import DragnDrop from "@/components/DragnDrop";
import Navbar from "@/components/Navbar";
import Tab from "@/components/Tab";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getTextContent } from "@/shared/helper";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useState } from "react";

import "@/App.css";

export default function App() {
  const { toast } = useToast();

  const [tab, setTab] = useState("Văn bản");
  const [model, setModel] = useState("vit5");
  const [fileList, setFileList] = useState([]);
  const [documents, setDocuments] = useState([""]);
  const [summary, setSummary] = useState("");

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

  const handleSummarize = async () => {
    if (tab === TAB_OPTION[0]) {
      let text = "";
      let wordCount = 0;
      for (let i = 0; i < documents.length; i++) {
        wordCount += documents[i].split(" ").length;
      }
      if (wordCount < 100) {
        toast({
          variant: "destructive",
          title: "Có lỗi xảy ra 🥲",
          description: "Tổng độ dài văn bản phải lớn hơn 100 từ",
        });
      } else {
        for (let i = 0; i < documents.length; i++) {
          text += documents[i];
        }
        axios({
          method: "post",
          url: "http://localhost:3030/api/summarize",
          data: {
            document: text,
            model_name: model,
          },
        })
          .then((response) => {
            setSummary(response.data.summary);
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Có lỗi xảy ra!",
              description: error,
            });
          });
      }
    } else {
      let text = "";
      let wordCount = 0;
      for (let i = 0; i < fileList.length; i++) {
        const fileText = await getTextContent(
          fileList[i],
          fileList[i].type.split("/")[1]
        );
        text += fileText;
      }

      wordCount = text.split(" ").length;
      console.log(text);

      if (wordCount < 100) {
        toast({
          variant: "destructive",
          title: "Có lỗi xảy ra 🥲",
          description: "Tổng độ dài văn bản phải lớn hơn 100 từ",
        });
      } else {
        axios({
          method: "post",
          url: "http://localhost:3030/api/summarize",
          data: {
            document: text,
            model_name: model,
          },
        })
          .then((response) => {
            setSummary(response.data.summary);
            setTab(TAB_OPTION[0]);
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Có lỗi xảy ra!",
              description: error,
            });
          });
      }
    }
  };

  return (
    <div className="w-full bg-secondary min-h-[100vh] pb-12">
      <Navbar />
      <div className="relative w-full container flex items-center justify-center flex-col gap-y-6 bg-background px-12 py-8 rounded-lg border shadow">
        <div className="absolute left-4 top-4">
          <Select
            defaultValue={model}
            onValueChange={(value) => setModel(value)}
          >
            <SelectTrigger className="font-semibold w-32">
              <SelectValue placeholder="Mô hình" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="vit5">
                ViT5
              </SelectItem>
              <SelectItem className="cursor-pointer" value="bartpho">
                BARTpho
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
        {tab === TAB_OPTION[0] ? (
          <div className="w-full flex flex-col gap-y-2.5 justify-start">
            <Label className="text-xl font-semibold">Văn bản</Label>
            {documents.map((document, index) => (
              <Textarea
                className="text-base min-h-[8rem]"
                key={`document-${index}`}
                value={document}
                onChange={(event) =>
                  handleDocumentChange(index, event.target.value)
                }
              />
            ))}
            {summary ? (
              <>
                <div className="border-b border-border w-full"></div>
                <Label className="text-xl font-semibold">Văn bản tóm tắt</Label>
                <Textarea
                  className="text-base min-h-[8rem]"
                  key="summary"
                  value={summary}
                  readOnly={true}
                  onChange={(event) => setSummary(event.target.value)}
                />
              </>
            ) : null}
          </div>
        ) : (
          <DragnDrop fileList={fileList} setFileList={setFileList} />
        )}
        <div className="flex items-center w-full justify-between">
          {tab === TAB_OPTION[0] ? (
            <Button onClick={handleAddDocument}>Thêm văn bản</Button>
          ) : null}
          <Button variant="outline" onClick={handleSummarize}>
            Tóm tắt
          </Button>
        </div>
      </div>
    </div>
  );
}
