import { selectImage, selectWriting } from "@/lib/profileAnalysis";

export default function ProfileAnalysisResult({
  count,
  percentage,
}: {
  count: number;
  percentage: number;
}) {
  const image = selectImage(count, percentage);
  const [quote, title] = selectWriting(count, percentage);
  return (
    <div className="flex flex-col gap-4 items-center justify-center relative size-full">
      <div className="flex flex-col gap-2.5 h-[260px] items-center justify-center relative shrink-0 w-[309px]">
        <div
          className="aspect-[1054/900] bg-center bg-cover bg-no-repeat shrink-0 w-full"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>
      <div className="flex flex-col gap-[3px] items-center justify-center leading-[0] not-italic relative shrink-0">
        <p className="text-[#7a7a7a] text-base font-medium shrink-0 leading-[1.3] text-nowrap tracking-tight">
          "{quote}"
        </p>
        <p className="font-semibold text-xl text-neutral-700 leading-[1.3] text-nowrap tracking-tight">
          {title}
        </p>
      </div>
    </div>
  );
}
