import good from "@/assets/my/analysis/good.png";

export default function ProfileAnalysisResult() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center relative size-full">
      <div className="flex flex-col gap-2.5 h-[260px] items-center justify-center relative shrink-0 w-[309px]">
        <div
          className="aspect-[1054/900] bg-center bg-cover bg-no-repeat shrink-0 w-full"
          style={{ backgroundImage: `url('${good}')` }}
        />
      </div>
      <div className="flex flex-col gap-[3px] items-center justify-center leading-[0] not-italic relative shrink-0">
        <div className="font-medium relative shrink-0 text-[#7a7a7a] text-[16px] tracking-[-0.32px]">
          <p className="leading-[1.3] text-nowrap whitespace-pre">
            "축제를 뒤집어 버렸다"
          </p>
        </div>
        <div className="font-semibold relative shrink-0 text-[20px] text-neutral-700 tracking-[-0.4px]">
          <p className="leading-[1.3] text-nowrap whitespace-pre">
            압도적인 매력의 소유자
          </p>
        </div>
      </div>
    </div>
  );
}
