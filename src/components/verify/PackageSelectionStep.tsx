import { Package } from "@/types/viewer";
import mainCharacter from "@/assets/home/main.png";
import { TICKET_PACKAGES } from "@/env";
import { Button } from "@/components/ui/button";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import { useAtomValue } from "jotai";

interface PackageSelectionStepProps {
  onSelect: (ticketPackage: Package) => void;
}

const PackageSelectionStep: React.FC<PackageSelectionStepProps> = ({
  onSelect,
}) => {
  const viewer = useAtomValue(viewerSelfAtom);
  const onSale = (viewer?.ticket ?? 0) === 0;
  return (
    <div className="flex flex-col gap-4 items-stretch px-4 py-6 w-full">
      {/* Progress and Title Section */}
      <div className="flex flex-col gap-2">
        {/* Progress indicator */}
        <p className="text-black-600 text-xs font-normal animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          1 / 2
        </p>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-black-700 leading-[1.3em] animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          이용권이 필요해요
          <br />
          <span className="text-primary">몇 장을 충전할까요?</span>
        </h2>
      </div>

      {/* Character and Package Options */}
      <div className="flex flex-col items-center gap-2 w-full animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
        {/* Character Image */}
        <div className="size-[160px] rounded-full overflow-hidden">
          <img
            src={mainCharacter}
            alt="캐릭터"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Package Options */}
        <div className="flex flex-col gap-3 w-full">
          {TICKET_PACKAGES.map((pkg) => (
            <Button
              key={pkg.id}
              variant="secondary"
              size="xl"
              className="text-primary"
              onClick={() => onSelect(pkg)}
            >
              {onSale ? (
                <span>
                  {pkg.name} -{" "}
                  <sup className="text-muted-foreground line-through">
                    {pkg.price[1].toLocaleString()}원
                  </sup>{" "}
                  <span>{pkg.price[0].toLocaleString()}원 </span>
                  <span className="text-xs">
                    ({Math.ceil(100 - (pkg.price[0] / pkg.price[1]) * 100)}%)
                  </span>
                </span>
              ) : (
                <span>
                  {pkg.name} - {pkg.price[1].toLocaleString()}원
                </span>
              )}
            </Button>
          ))}
        </div>
        <p className="text-sm">
          프로필 등록 후 첫 구매 할인이 적용된 가격입니다.
        </p>
      </div>
    </div>
  );
};

export default PackageSelectionStep;
