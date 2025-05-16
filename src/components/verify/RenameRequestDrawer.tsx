import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RenameRequestDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newName: string) => void;
}

export function RenameRequestDrawer({
  open,
  onOpenChange,
  onConfirm,
}: RenameRequestDrawerProps) {
  const [newName, setNewName] = useState("");

  const handleConfirm = () => {
    if (newName.trim()) {
      onConfirm(newName);
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-primary">
            입금자명을 잘못 입력하셨나요?
          </DrawerTitle>
          <DrawerDescription className="text-center">
            기입한 입금자명을 알려주세요!
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="입금자명 입력"
            className="my-6"
          />
          <p className="text-xs text-center text-muted-foreground">
            아직도 해결이 안 되시나요?
            <br />
            문의 - 유어슈 오프라인 부스 / yourssu.noreply@gmail.com
            <br />
            부스 운영으로 인해 답변에 시간이 다소 소요될 수 있습니다.
          </p>
        </div>
        <DrawerFooter>
          <Button onClick={handleConfirm} disabled={!newName.trim()}>
            재확인
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">취소</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
