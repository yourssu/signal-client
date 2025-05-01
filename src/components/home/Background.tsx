import cloud from "@/assets/cloud.svg";

const Background = () => {
  return (
    <div className="fixed inset-0 overflow-hidden w-full h-dvh min-h-dvh -z-10 from-light-pink to-bg-end bg-linear-to-b">
      <img
        src={cloud}
        role="none"
        className="absolute top-1/5 right-0 translate-x-[100px] w-[420px] h-auto"
      />

      <img
        src={cloud}
        role="none"
        className="absolute top-3/5 left-0 -translate-x-[100px] w-[420px] h-auto"
      />
    </div>
  );
};

export default Background;
