import "@/index.css";
import uetLogo from "@/assets/uet.png";
import vnuLogo from "@/assets/vnu.png";
import dsktLogo from "@/assets/dskt.jpg";

export default function Navbar() {
  return (
    <div className="shadow mb-12 w-full h-24 flex justify-between items-center px-8 py-2.5 bg-background text-foreground border-b relative top-0 left-0">
      <span className="text-2xl font-bold h-full flex items-center justify-center logo font-rubik">
        KLTN
      </span>
      <div className="flex items-center justify-center gap-8 h-full">
        <img className="h-full" src={uetLogo} alt="Trường Đại học Công nghệ" />
        <img className="h-full" src={vnuLogo} alt="Đại học Quốc gia Hà Nội" />
        <img
          className="h-full rounded-full"
          src={dsktLogo}
          alt="Đại học Quốc gia Hà Nội"
        />
      </div>
    </div>
  );
}
