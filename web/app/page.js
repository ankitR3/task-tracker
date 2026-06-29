import LeftIconBar from "@/src/components/layout/LeftIconBar";
import LeftSidebar from "@/src/components/layout/LeftSidebar";
import MiddleContentBar from "@/src/components/layout/MiddleContentBar";

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LeftIconBar />
      <LeftSidebar />
      <MiddleContentBar />
    </div>
  );
}
