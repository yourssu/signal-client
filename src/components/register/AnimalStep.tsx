import { Button } from "@/components/ui/button";
import { AnimalType } from "@/types/profile";
import React, { useState, useRef, useEffect } from "react"; // Import useState, useRef, useEffect

// Import downloaded animal images
import dogImg from "@/assets/animals/dog.png";
import bearImg from "@/assets/animals/bear.png";
import dinosaurImg from "@/assets/animals/dinosaur.png";
import hamsterImg from "@/assets/animals/hamster.png";
import deerImg from "@/assets/animals/deer.png";
import catImg from "@/assets/animals/cat.png"; // Note: Figma node name was hamster, mapped to CAT

interface AnimalStepProps {
  onSelect: (animal: AnimalType) => void;
}

// Update animal data structure
const animals: { type: AnimalType; name: string; img: string }[] = [
  { type: "DOG", name: "강아지", img: dogImg },
  { type: "BEAR", name: "곰", img: bearImg },
  { type: "DINOSAUR", name: "공룡", img: dinosaurImg },
  { type: "HAMSTER", name: "햄스터", img: hamsterImg },
  { type: "DEER", name: "사슴", img: deerImg },
  { type: "CAT", name: "고양이", img: catImg },
];

const IMAGE_WIDTH = 150; // Based on Figma Rectangles
const GAP = 20; // Approximate gap from Figma

const AnimalStep: React.FC<AnimalStepProps> = ({ onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0); // State for selected animal index
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectAnimal = (index: number) => {
    setSelectedIndex(index);
    // Scroll the selected item to the center
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft =
        (index + 1) * (IMAGE_WIDTH + GAP) -
        container.offsetWidth / 2 +
        IMAGE_WIDTH / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  // Scroll to initial position on mount
  useEffect(() => {
    handleSelectAnimal(0);
  }, []);

  const handleConfirmSelection = () => {
    onSelect(animals[selectedIndex].type);
  };

  return (
    // Main container - Adjusted layout based on Figma Frame 1000011952
    <div className="flex flex-col items-center pt-10 gap-6 h-full w-full overflow-hidden">
      {/* Top section: Progress and Title - Based on Frame 1426 */}
      <div className="flex flex-col items-center gap-[10px] w-full">
        {/* Progress Indicator - Based on 1421:4470 */}
        <p className="text-xs text-muted-foreground">2 / 6</p>{" "}
        {/* Using muted-foreground for #525252 */}
        {/* Title - Based on 1421:4472 */}
        <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line text-center">
          {" "}
          {/* Using stone-700 for #44403B */}
          {`자신을 닮은\n동물을 골라주세요`}
        </h2>
      </div>

      {/* Animal Carousel Section - Based on Frame 1000011950 */}
      <div className="flex flex-col items-center gap-5 w-full">
        {" "}
        {/* Gap approx from design */}
        {/* Horizontal Scroll Container for Animals */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory items-center h-[200px] w-full no-scrollbar" // Added no-scrollbar utility if available, otherwise needs CSS
          style={{
            paddingLeft: `calc(50% - ${IMAGE_WIDTH / 2}px)`,
            paddingRight: `calc(50% - ${IMAGE_WIDTH / 2}px)`,
            gap: `${GAP}px`,
          }} // Padding for centering
        >
          {animals.map((animal, index) => (
            <div
              key={animal.type}
              onClick={() => handleSelectAnimal(index)}
              className={`flex-shrink-0 snap-center transition-transform duration-300 ease-in-out cursor-pointer`}
              style={{ width: `${IMAGE_WIDTH}px`, height: `${IMAGE_WIDTH}px` }} // Fixed size for images
            >
              <img
                src={animal.img}
                alt={animal.name}
                className={`w-full h-full object-cover rounded-full border-2 border-white shadow-md transition-all duration-300 ease-in-out ${
                  selectedIndex === index
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-70" // Adjusted scale effect
                }`}
              />
            </div>
          ))}
        </div>
        {/* Selected Animal Name Display - Based on Frame 1000011906 */}
        <div className="flex justify-center items-center h-[43px] min-w-[146px] px-4 rounded-full bg-white/50 backdrop-blur-md">
          {" "}
          {/* Using bg-white/50 for rgba(255, 255, 255, 0.51) */}
          <p className="text-lg font-medium text-primary">
            {" "}
            {/* Using primary for #EE518A */}
            {animals[selectedIndex].name}상
          </p>
        </div>
        {/* Pagination Dots - Based on Frame 1000011897 */}
        <div className="flex justify-center items-center gap-[9px]">
          {animals.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                selectedIndex === index ? "bg-primary" : "bg-white" // Using primary for #EE518A, white for #FFFFFF
              }`}
            />
          ))}
        </div>
      </div>

      {/* Confirmation Button - Based on 1421:4439 */}
      <div className="mt-auto pb-10 px-4 w-full max-w-[375px]">
        {" "}
        {/* Push button to bottom */}
        <Button
          onClick={handleConfirmSelection}
          className="w-full h-[56px] bg-primary text-primary-foreground rounded-2xl text-lg font-medium hover:bg-primary/90" // Adjusted styles
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
};

// Add CSS for hiding scrollbar if 'no-scrollbar' utility doesn't exist
/*
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
*/

export default AnimalStep;
