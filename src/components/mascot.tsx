import Image, { type StaticImageData } from "next/image";
import promeraGood from "@/icon/prom_good.png";
import promeraHandsUp from "@/icon/prom_hands_up.png";
import promeraHi from "@/icon/prom_hi.png";
import promeraHurray from "@/icon/prom_hurray.png";
import promeraIndicate from "@/icon/prom_indicate.png";
import promeraQuestion from "@/icon/prom_question.png";
import promeraReward from "@/icon/prom_reward.png";
import promeraRunning from "@/icon/prom_running.png";
import promeraSeat from "@/icon/prom_seat.png";
import promeraTeach from "@/icon/prom_teach.png";
import { cn } from "@/lib/utils";

const mascots = {
  good: promeraGood,
  handsUp: promeraHandsUp,
  hi: promeraHi,
  hurray: promeraHurray,
  indicate: promeraIndicate,
  question: promeraQuestion,
  reward: promeraReward,
  running: promeraRunning,
  seat: promeraSeat,
  teach: promeraTeach,
} satisfies Record<string, StaticImageData>;

export type MascotName = keyof typeof mascots;

interface MascotProps {
  name: MascotName;
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export function Mascot({
  name,
  alt = "",
  className,
  imageClassName,
  priority = false,
  sizes,
}: MascotProps) {
  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      <Image
        src={mascots[name]}
        alt={alt}
        priority={priority}
        className={cn("h-full w-full object-contain", imageClassName)}
        sizes={sizes}
      />
    </span>
  );
}
