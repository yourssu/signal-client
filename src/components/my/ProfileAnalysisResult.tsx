import p1 from "@/assets/my/analysis/p1.png";
import p5 from "@/assets/my/analysis/p5.png";
import p10 from "@/assets/my/analysis/p10.png";
import p30 from "@/assets/my/analysis/p30.png";
import p70 from "@/assets/my/analysis/p70.png";
import p100 from "@/assets/my/analysis/p100.png";

const selectImage = (count: number, percentage: number) => {
  if (count === 0) return p100;
  if (percentage >= 70) return p70;
  if (percentage >= 30) return p30;
  if (percentage >= 10) return p10;
  if (percentage >= 5) return p5;
  return p1;
};

const WRITINGS: Record<number, [string, string][]> = {
  1: [['"축제를 뒤집어 버렸다"', "압도적인 매력의 소유자"]],
  5: [['"시선이 쏠리는 중심"', "모두가 주목할 수 밖에 없는"]],
  10: [['"보는 순간 빠져든다"', "사람 마음을 흔드는 매력의 소유자"]],
  30: [['"호감 가득 매력 넘치는"', "모두가 궁금해하는 당신"]],
  70: [['"숨은 보석 같은 매력"', "아직 발견되지 않은 가능성의 소유자"]],
};

const writing = (_count: number, percentage: number): [string, string] => {
  const rand = Math.floor(Math.random() * 100);
  if (percentage >= 70)
    return WRITINGS[70][rand % WRITINGS[70].length] as [string, string];
  if (percentage >= 30)
    return WRITINGS[30][rand % WRITINGS[30].length] as [string, string];
  if (percentage >= 10)
    return WRITINGS[10][rand % WRITINGS[10].length] as [string, string];
  if (percentage >= 5)
    return WRITINGS[5][rand % WRITINGS[5].length] as [string, string];
  return WRITINGS[1][rand % WRITINGS[1].length] as [string, string];
};

export default function ProfileAnalysisResult({
  count,
  percentage,
}: {
  count: number;
  percentage: number;
}) {
  const image = selectImage(count, percentage);
  const [quote, title] = writing(count, percentage);
  return (
    <div className="flex flex-col gap-4 items-center justify-center relative size-full">
      <div className="flex flex-col gap-2.5 h-[260px] items-center justify-center relative shrink-0 w-[309px]">
        <div
          className="aspect-[1054/900] bg-center bg-cover bg-no-repeat shrink-0 w-full"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>
      <div className="flex flex-col gap-[3px] items-center justify-center leading-[0] not-italic relative shrink-0">
        <div className="font-medium relative shrink-0 text-[#7a7a7a] text-[16px] tracking-[-0.32px]">
          <p className="leading-[1.3] text-nowrap whitespace-pre">{quote}</p>
        </div>
        <div className="font-semibold relative shrink-0 text-[20px] text-neutral-700 tracking-[-0.4px]">
          <p className="leading-[1.3] text-nowrap whitespace-pre">{title}</p>
        </div>
      </div>
    </div>
  );
}
