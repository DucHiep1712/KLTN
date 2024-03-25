import React, { useRef } from "react";
import PropTypes from "prop-types";

import { ImageConfig } from "@/config/ImageConfig";
import uploadImg from "@/assets/cloud-upload-regular-240.png";
import { Button } from "@/components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { FileUploader } from "react-drag-drop-files";

export default function DragnDrop(props) {
  console.log(props.fileList);
  const handleFileChange = (file) => {
    if (file) {
      const updatedList = [...props.fileList, file];
      console.log(updatedList);
      props.setFileList(updatedList);
      console.log(file.type.split("/")[1]);
    }
  };

  const handleFileRemove = (file) => {
    const updatedList = [...props.fileList];
    updatedList.splice(props.fileList.indexOf(file), 1);
    props.setFileList(updatedList);
  };

  const fileTypes = ["pdf", "docx", "txt"];

  return (
    <>
      <FileUploader
        classes="rounded-2xl w-full"
        name="files"
        types={fileTypes}
        handleChange={handleFileChange}
      >
        <div className="bg-secondary border-2 border-dashed rounded-2xl cursor-pointer w-full">
          <div className="flex items-center flex-col justify-center gap-y-4 px-12 py-8">
            <img className="w-24" src={uploadImg} alt="" />
            <p className="text-muted-foreground font-medium">
              Kéo thả hoặc bấm vào đây để tải file
            </p>
          </div>
        </div>
      </FileUploader>
      {props.fileList.length > 0 ? (
        <div className="w-full">
          <p className="font-medium mb-4">Uploaded files</p>
          <div className="w-full grid grid-cols-3 gap-8">
            {props.fileList.map((item, index) => (
              <div
                key={index}
                className="flex w-full rounded-xl relative px-2.5 py-2 border bg-secondary gap-4 shadow"
              >
                <img
                  className="w-12"
                  src={ImageConfig[item.type.split("/")[1]]}
                  alt=""
                />
                <div className="flex flex-col justify-between w-full">
                  <p className="text-[.96rem] max-w-[86%] whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.name}
                  </p>
                  <p className="text-sm font-semibold">
                    {Math.round(item.size / 1024)} kB
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute p-1 right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() => handleFileRemove(item)}
                >
                  <Cross1Icon className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

DragnDrop.propTypes = {
  onFileChange: PropTypes.func,
};
