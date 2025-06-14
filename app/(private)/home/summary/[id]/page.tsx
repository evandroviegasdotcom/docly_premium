import { Button } from "@/components/ui/button";
import { file } from "@/services/file";
import { ArrowLeft, Bookmark, Cpu, Sparkles } from "lucide-react"; // Added icons
import { Simonetta } from "next/font/google";
import Link from "next/link";
import Summary from "./_components/ai";

const simonetta = Simonetta({ subsets: ["latin"], weight: "400" });

export default async function SummaryPage({
  params,
}: {
  params: { id: string };
}) {
  const fileData = await file.getSummary(params.id);

  return (
    <div className="md:p-8 w-full space-y-4">
      <h1 className={`text-3xl font-bold ${simonetta.className}`}>
        {fileData.name}
      </h1>
      <Link
        href="/home/documents"
        className="flex items-center text-sm text-muted-foreground hover:underline mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to My Documents
      </Link>

      <div className="flex md:flex-row flex-col-reverse gap-8  w-full">
        <iframe
          src={fileData.url}
          title={fileData.name}
          className="w-full h-[600px] border rounded-lg"
          frameBorder="0"
          allowFullScreen
        />

        {/* Right: File info */}
        <div className="w-full flex flex-col gap-4">
          <Summary fileData={fileData} />

          <div className="flex items-center gap-2">
            <Link href={fileData.url} target="_blank">
              <Button className="w-fit">View Original PDF</Button>
            </Link>
            <Button className="flex items-center gap-1" variant="outline">
              <span>Add to favorites</span>
              <Bookmark />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
              Uploaded on {new Date(fileData.createdAt!).toLocaleDateString()}
            </p>
        </div>
      </div>
    </div>
  );
}
