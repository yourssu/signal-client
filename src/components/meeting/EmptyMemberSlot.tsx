interface EmptyMemberSlotProps {
  label?: string;
}

const EmptyMemberSlot = ({
  label = "+친구를 추가해주세요",
}: EmptyMemberSlotProps) => {
  return (
    <div className="border border-dashed border-line-normal rounded-lg h-[38px] p-3 w-full flex items-center">
      <p className="caption1 text-label-assistive">{label}</p>
    </div>
  );
};

export default EmptyMemberSlot;
export type { EmptyMemberSlotProps };
