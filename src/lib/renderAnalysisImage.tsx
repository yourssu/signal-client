import satori from "satori/wasm";
import heartIcon from "@/assets/icons/heart_icon.svg";
import { selectImage, selectWriting } from "@/lib/profileAnalysis";

export const renderAnalysisSvg = async (
  count: number,
  viewers: number,
  percentage: number,
): Promise<string> => {
  const image = selectImage(count, percentage);
  const [quote, title] = selectWriting(count, percentage);

  return await satori(
    <div className="bg-background size-full grow p-6 flex flex-col gap-10">
      <div className="w-full mx-auto flex flex-col pt-2 gap-2 grow">
        <h1 className="text-2xl font-semibold text-stone-700 self-center text-center">
          지금까지 <span className="text-primary">{viewers}명</span>이
          <br />
          프로필을 열람했어요
        </h1>
        <div className="bg-white rounded-[18px] p-4 w-full flex gap-3 items-start">
          <div className="flex items-center justify-center p-2 bg-[#FFC9DE] rounded-xl self-stretch aspect-square">
            <img src={heartIcon} alt="하트" className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 font-medium">
              등록된 {count}개의 프로필 중
            </p>
            <p className="text-sm font-semibold text-neutral-700">
              <span className="text-primary">상위 {percentage}%</span>{" "}
              프로필이에요
            </p>
          </div>
        </div>
        <div className="grow flex flex-col justify-center items-stretch self-stretch">
          <div className="flex flex-col gap-4 items-center justify-center relative size-full">
            <div className="flex flex-col gap-2.5 h-[260px] items-center justify-center relative shrink-0 w-[309px]">
              <div
                className="flex aspect-[1054/900] bg-center bg-cover bg-no-repeat shrink-0 w-full"
                style={{ backgroundImage: `url('${image}')` }}
              />
            </div>
            <div className="flex flex-col gap-[3px] items-center justify-center leading-[0] not-italic relative shrink-0">
              <p className="text-[#7a7a7a] text-base font-medium shrink-0 leading-[1.3] text-nowrap whitespace-pre">
                "{quote}"
              </p>
              <p className="font-semibold text-xl text-neutral-700 leading-[1.3] text-nowrap whitespace-pre">
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1080,
      height: 1920,
      fonts: [
        {
          name: "Pretendard",
          data: await fetch("/fonts/PretendardVariable.subset.woff").then(
            (res) => res.arrayBuffer(),
          ),
          weight: 400,
          style: "normal",
        },
      ],
      pointScaleFactor: 3,
      debug: true,
    },
  );
};
