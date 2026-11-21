import Image from "next/image";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";

export function ContactIntro() {
  return (
    <div className="relative h-full min-h-[30rem] overflow-hidden rounded-2xl lg:min-h-0">
      <Image
        src={cloudinaryAsset("/images/contact/contact-image.jpg")}
        alt="Integrantes de Chicas SC"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
