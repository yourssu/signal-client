// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Disable type checking for this file due to satori's complex types
import satori from "satori/wasm";
import { Resvg } from "@resvg/resvg-wasm";
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
    <div
      tw="w-full h-full p-6 flex flex-col gap-10"
      style={{
        backgroundColor: "#fdf6f7",
        fontFamily: "Pretendard",
      }}
    >
      <div tw="w-full mx-auto flex flex-col pt-2 gap-2 grow">
        <div tw="flex flex-col items-center text-2xl font-semibold text-stone-700 self-center text-center mb-2">
          <div tw="flex gap-2 items-center justify-center">
            <span tw="mr-1">지금까지</span>
            <span style={{ color: "#ef558d" }}>{viewers}명</span>
            <span>이</span>
          </div>
          <div>프로필을 열람했어요</div>
        </div>
        <div tw="bg-white rounded-[18px] p-4 w-full flex items-start">
          <div tw="flex items-center justify-center p-2 bg-[#FFC9DE] rounded-xl w-10 h-10 mr-2">
            <img src={heartIcon} alt="하트" tw="w-[18px] h-[15.5px]" />
          </div>
          <div tw="flex flex-col gap-1">
            <div tw="flex text-xs text-neutral-500 font-medium mb-1">
              등록된 {count}개의 프로필 중
            </div>
            <div tw="flex text-sm font-semibold text-neutral-700">
              <span style={{ color: "#ef558d" }}>상위 {percentage}%</span>{" "}
              프로필이에요
            </div>
          </div>
        </div>
        <div tw="grow flex flex-col justify-center items-stretch self-stretch">
          <div tw="flex flex-col gap-4 items-center justify-center relative size-full">
            <div tw="flex flex-col gap-2.5 h-[309px] items-center justify-center relative shrink-0 w-[309px]">
              <img src={image} tw="w-[309px] h-[309px]" />
            </div>
            <div tw="flex flex-col items-center justify-center leading-[0] not-italic relative shrink-0">
              <div tw="flex text-[#7a7a7a] text-base font-medium shrink-0 leading-[1.3] text-nowrap whitespace-pre mb-2">
                "{quote}"
              </div>
              <div tw="flex font-semibold text-xl text-neutral-700 leading-[1.3] text-nowrap whitespace-pre">
                {title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 360,
      height: 640,
      fonts: [
        {
          name: "Pretendard",
          data: await fetch("/fonts/PretendardVariable.subset.woff").then(
            (res) => res.arrayBuffer(),
          ),
          weight: 600,
          style: "normal",
        },
      ],
      embedFont: true,
      pointScaleFactor: 3,
    },
  );
};

export const renderAnalysisPng = async (
  count: number,
  viewers: number,
  percentage: number,
): Promise<Uint8Array> => {
  // 먼저 SVG를 생성
  const svg = await renderAnalysisSvg(count, viewers, percentage);

  // resvg를 사용해서 SVG를 PNG로 변환
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1080,
    },
    background: "#fdf6f7",
  });

  const pngData = resvg.render();
  return pngData.asPng();
};
